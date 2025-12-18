"use client";

import { createClient } from "./client";

// Storage bucket names
export const BUCKETS = {
  AVATARS: "avatars",
  LISTINGS: "listings",
  MESSAGES: "messages",
  DISPUTES: "disputes",
  DOCUMENTS: "documents",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// File type validation
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface UploadOptions {
  bucket: BucketName;
  folder?: string;
  fileName?: string;
  upsert?: boolean;
}

/**
 * Generate a unique file name with timestamp and random string
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop()?.toLowerCase() || "file";
  return `${timestamp}-${random}.${extension}`;
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  type: "image" | "document" | "any"
): { valid: boolean; error?: string } {
  // Check file size
  const maxSize = type === "document" ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    const sizeMB = maxSize / (1024 * 1024);
    return { valid: false, error: `File size must be less than ${sizeMB}MB` };
  }

  // Check file type
  if (type === "image" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, GIF, and WebP images are allowed" };
  }

  if (type === "document" && !ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF, DOC, DOCX, and TXT files are allowed" };
  }

  return { valid: true };
}

/**
 * Upload a single file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const supabase = createClient();

  try {
    const fileName = options.fileName || generateFileName(file.name);
    const filePath = options.folder ? `${options.folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: options.upsert || false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Upload failed",
    };
  }
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  files: File[],
  options: UploadOptions
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadFile(file, options))
  );
  return results;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
}

/**
 * Delete multiple files
 */
export async function deleteFiles(
  bucket: BucketName,
  paths: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      console.error("Delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Delete error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
}

/**
 * Get signed URL for private files (with expiration)
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Signed URL error:", error);
      return { error: error.message };
    }

    return { url: data.signedUrl };
  } catch (err) {
    console.error("Signed URL error:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to get signed URL",
    };
  }
}

/**
 * Upload avatar image
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<UploadResult> {
  // Validate file
  const validation = validateFile(file, "image");
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return uploadFile(file, {
    bucket: BUCKETS.AVATARS,
    folder: userId,
    upsert: true,
  });
}

/**
 * Upload listing images
 */
export async function uploadListingImages(
  files: File[],
  listingId: string
): Promise<UploadResult[]> {
  // Validate all files
  for (const file of files) {
    const validation = validateFile(file, "image");
    if (!validation.valid) {
      return [{ success: false, error: validation.error }];
    }
  }

  return uploadFiles(files, {
    bucket: BUCKETS.LISTINGS,
    folder: listingId,
  });
}

/**
 * Upload message attachment
 */
export async function uploadMessageAttachment(
  file: File,
  conversationId: string
): Promise<UploadResult> {
  // Allow both images and documents in messages
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type);

  if (!isImage && !isDocument) {
    return { success: false, error: "Invalid file type" };
  }

  const validation = validateFile(file, isImage ? "image" : "document");
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return uploadFile(file, {
    bucket: BUCKETS.MESSAGES,
    folder: conversationId,
  });
}

/**
 * Upload dispute evidence
 */
export async function uploadDisputeEvidence(
  file: File,
  disputeId: string
): Promise<UploadResult> {
  // Allow both images and documents as evidence
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type);

  if (!isImage && !isDocument) {
    return { success: false, error: "Invalid file type. Use images or documents." };
  }

  const validation = validateFile(file, isImage ? "image" : "document");
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  return uploadFile(file, {
    bucket: BUCKETS.DISPUTES,
    folder: disputeId,
  });
}

/**
 * Get file type from URL
 */
export function getFileTypeFromUrl(url: string): "image" | "document" | "unknown" {
  const extension = url.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
    return "image";
  }

  if (["pdf", "doc", "docx", "txt"].includes(extension || "")) {
    return "document";
  }

  return "unknown";
}

/**
 * Extract path from Supabase storage URL
 */
export function extractPathFromUrl(url: string, bucket: BucketName): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(new RegExp(`/storage/v1/object/public/${bucket}/(.+)`));
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

