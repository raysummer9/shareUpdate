"use client";

import { useState, useCallback } from "react";
import {
  uploadFile,
  uploadFiles,
  uploadAvatar,
  uploadListingImages,
  uploadMessageAttachment,
  uploadDisputeEvidence,
  deleteFile,
  validateFile,
  BUCKETS,
  type BucketName,
  type UploadResult,
  type UploadOptions,
} from "@/lib/supabase/storage";

interface UseFileUploadOptions {
  onSuccess?: (results: UploadResult[]) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options?: UseFileUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
    setResults([]);
  }, []);

  const upload = useCallback(
    async (
      files: File | File[],
      uploadOptions: UploadOptions
    ): Promise<UploadResult[]> => {
      reset();
      setUploading(true);

      try {
        const fileArray = Array.isArray(files) ? files : [files];
        const uploadResults: UploadResult[] = [];

        for (let i = 0; i < fileArray.length; i++) {
          const file = fileArray[i];
          const result = await uploadFile(file, uploadOptions);
          uploadResults.push(result);
          setProgress(((i + 1) / fileArray.length) * 100);
        }

        setResults(uploadResults);

        const failedUploads = uploadResults.filter((r) => !r.success);
        if (failedUploads.length > 0) {
          const errorMsg = failedUploads[0].error || "Some uploads failed";
          setError(errorMsg);
          options?.onError?.(errorMsg);
        } else {
          options?.onSuccess?.(uploadResults);
        }

        return uploadResults;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return [{ success: false, error: errorMsg }];
      } finally {
        setUploading(false);
      }
    },
    [options, reset]
  );

  return {
    upload,
    uploading,
    progress,
    error,
    results,
    reset,
  };
}

// Specialized hook for avatar uploads
export function useAvatarUpload(
  userId: string | null,
  options?: UseFileUploadOptions
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!userId) {
        const errorMsg = "User ID is required";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Validate file
      const validation = validateFile(file, "image");
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        options?.onError?.(validation.error || "Invalid file");
        return { success: false, error: validation.error };
      }

      setUploading(true);
      setError(null);

      try {
        const result = await uploadAvatar(file, userId);

        if (result.success && result.url) {
          setUrl(result.url);
          options?.onSuccess?.([result]);
        } else {
          setError(result.error || "Upload failed");
          options?.onError?.(result.error || "Upload failed");
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setUploading(false);
      }
    },
    [userId, options]
  );

  return { upload, uploading, error, url };
}

// Specialized hook for listing image uploads
export function useListingImageUpload(
  listingId: string | null,
  options?: UseFileUploadOptions
) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState<string[]>([]);

  const upload = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      if (!listingId) {
        const errorMsg = "Listing ID is required";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return [{ success: false, error: errorMsg }];
      }

      // Validate all files
      for (const file of files) {
        const validation = validateFile(file, "image");
        if (!validation.valid) {
          setError(validation.error || "Invalid file");
          options?.onError?.(validation.error || "Invalid file");
          return [{ success: false, error: validation.error }];
        }
      }

      setUploading(true);
      setError(null);
      setProgress(0);

      try {
        const results = await uploadListingImages(files, listingId);

        const successfulUrls = results
          .filter((r) => r.success && r.url)
          .map((r) => r.url!);

        setUrls(successfulUrls);
        setProgress(100);

        const failedUploads = results.filter((r) => !r.success);
        if (failedUploads.length > 0) {
          const errorMsg = failedUploads[0].error || "Some uploads failed";
          setError(errorMsg);
          options?.onError?.(errorMsg);
        } else {
          options?.onSuccess?.(results);
        }

        return results;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return [{ success: false, error: errorMsg }];
      } finally {
        setUploading(false);
      }
    },
    [listingId, options]
  );

  const removeUrl = useCallback((urlToRemove: string) => {
    setUrls((prev) => prev.filter((url) => url !== urlToRemove));
  }, []);

  return { upload, uploading, progress, error, urls, setUrls, removeUrl };
}

// Specialized hook for message attachments
export function useMessageAttachmentUpload(
  conversationId: string | null,
  options?: UseFileUploadOptions
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!conversationId) {
        const errorMsg = "Conversation ID is required";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      setUploading(true);
      setError(null);

      try {
        const result = await uploadMessageAttachment(file, conversationId);

        if (!result.success) {
          setError(result.error || "Upload failed");
          options?.onError?.(result.error || "Upload failed");
        } else {
          options?.onSuccess?.([result]);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setUploading(false);
      }
    },
    [conversationId, options]
  );

  return { upload, uploading, error };
}

// Specialized hook for dispute evidence uploads
export function useDisputeEvidenceUpload(
  disputeId: string | null,
  options?: UseFileUploadOptions
) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      if (!disputeId) {
        const errorMsg = "Dispute ID is required";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      }

      setUploading(true);
      setError(null);

      try {
        const result = await uploadDisputeEvidence(file, disputeId);

        if (!result.success) {
          setError(result.error || "Upload failed");
          options?.onError?.(result.error || "Upload failed");
        } else {
          options?.onSuccess?.([result]);
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setUploading(false);
      }
    },
    [disputeId, options]
  );

  return { upload, uploading, error };
}

// Hook for deleting files
export function useFileDelete() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(
    async (bucket: BucketName, path: string): Promise<boolean> => {
      setDeleting(true);
      setError(null);

      try {
        const result = await deleteFile(bucket, path);

        if (!result.success) {
          setError(result.error || "Delete failed");
          return false;
        }

        return true;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Delete failed";
        setError(errorMsg);
        return false;
      } finally {
        setDeleting(false);
      }
    },
    []
  );

  return { remove, deleting, error };
}

// Re-export types and constants
export { BUCKETS, validateFile };
export type { BucketName, UploadResult, UploadOptions };

