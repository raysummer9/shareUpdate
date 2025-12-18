"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];
type ListingInsert = Database["public"]["Tables"]["listings"]["Insert"];
type ListingUpdate = Database["public"]["Tables"]["listings"]["Update"];

export interface ListingFilters {
  category_id?: string;
  type?: "product" | "service";
  status?: string;
  seller_id?: string;
  min_price?: number;
  max_price?: number;
  platform?: string;
  search?: string;
  sort_by?: "price_asc" | "price_desc" | "newest" | "rating" | "popular";
  limit?: number;
  offset?: number;
}

export interface ListingWithSeller extends Listing {
  seller?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    rating: number | null;
    is_verified: boolean | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

// Hook for fetching multiple listings
export function useListings(filters?: ListingFilters) {
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          seller:profiles!listings_seller_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            rating,
            is_verified
          ),
          category:categories!listings_category_id_fkey(
            id,
            name,
            slug
          )
        `, { count: "exact" });

      // Apply filters
      if (filters?.status) {
        query = query.eq("status", filters.status);
      } else {
        // Default to active listings for public views
        query = query.eq("status", "active");
      }

      if (filters?.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }

      if (filters?.seller_id) {
        query = query.eq("seller_id", filters.seller_id);
      }

      if (filters?.platform) {
        query = query.eq("platform", filters.platform);
      }

      if (filters?.min_price !== undefined) {
        query = query.gte("price", filters.min_price);
      }

      if (filters?.max_price !== undefined) {
        query = query.lte("price", filters.max_price);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      switch (filters?.sort_by) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        case "popular":
          query = query.order("sales_count", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
      }

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setListings(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return { listings, loading, error, totalCount, refetch: fetchListings };
}

// Hook for fetching a single listing
export function useListing(listingId: string | null) {
  const [listing, setListing] = useState<ListingWithSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!listingId) {
      setListing(null);
      setLoading(false);
      return;
    }

    const fetchListing = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("listings")
          .select(`
            *,
            seller:profiles!listings_seller_id_fkey(
              id,
              username,
              full_name,
              avatar_url,
              rating,
              is_verified,
              bio,
              total_sales,
              seller_level
            ),
            category:categories!listings_category_id_fkey(
              id,
              name,
              slug
            )
          `)
          .eq("id", listingId)
          .single();

        if (fetchError) throw fetchError;

        setListing(data);

        // Increment view count (fire and forget)
        supabase
          .from("listings")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", listingId)
          .then();
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, supabase]);

  return { listing, loading, error };
}

// Hook for seller's own listings
export function useMyListings(sellerId: string | null) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMyListings = useCallback(async () => {
    if (!sellerId) {
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("listings")
        .select(`
          *,
          category:categories!listings_category_id_fkey(
            id,
            name,
            slug
          )
        `)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setListings(data || []);
    } catch (err) {
      console.error("Error fetching my listings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  }, [sellerId, supabase]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  return { listings, loading, error, refetch: fetchMyListings };
}

// Hook for listing mutations (create, update, delete)
export function useListingMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Create a new listing
  const createListing = async (listing: ListingInsert): Promise<Listing | null> => {
    setLoading(true);
    setError(null);

    try {
      // Generate slug from title
      const slug = listing.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now();

      const { data, error: createError } = await supabase
        .from("listings")
        .insert({ ...listing, slug })
        .select()
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : "Failed to create listing");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a listing
  const updateListing = async (
    listingId: string,
    updates: ListingUpdate
  ): Promise<Listing | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from("listings")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", listingId)
        .select()
        .single();

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      console.error("Error updating listing:", err);
      setError(err instanceof Error ? err.message : "Failed to update listing");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a listing
  const deleteListing = async (listingId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError(err instanceof Error ? err.message : "Failed to delete listing");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change listing status
  const changeStatus = async (
    listingId: string,
    status: "draft" | "pending" | "active" | "paused" | "sold"
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("listings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", listingId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error changing listing status:", err);
      setError(err instanceof Error ? err.message : "Failed to update status");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createListing,
    updateListing,
    deleteListing,
    changeStatus,
    loading,
    error,
  };
}

