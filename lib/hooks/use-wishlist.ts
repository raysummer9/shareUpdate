"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Wishlist = Database["public"]["Tables"]["wishlists"]["Row"];
type Listing = Database["public"]["Tables"]["listings"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface WishlistItemWithListing extends Wishlist {
  listing?: Listing & {
    seller?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url" | "rating" | "is_verified">;
  };
}

// Hook for fetching user's wishlist
export function useWishlist(userId: string | null) {
  const [items, setItems] = useState<WishlistItemWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("wishlists")
        .select(`
          *,
          listing:listings!wishlists_listing_id_fkey(
            *,
            seller:profiles!listings_seller_id_fkey(
              id,
              username,
              full_name,
              avatar_url,
              rating,
              is_verified
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Filter out items where listing is no longer available
      const validItems = (data || []).filter(
        item => item.listing && item.listing.status === "active"
      );

      setItems(validItems);

    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return { items, loading, error, refetch: fetchWishlist };
}

// Hook for checking if a listing is in wishlist
export function useIsInWishlist(userId: string | null, listingId: string | null) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId || !listingId) {
      setIsInWishlist(false);
      setWishlistItemId(null);
      setLoading(false);
      return;
    }

    const checkWishlist = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("wishlists")
          .select("id")
          .eq("user_id", userId)
          .eq("listing_id", listingId)
          .maybeSingle();

        if (error) throw error;

        setIsInWishlist(!!data);
        setWishlistItemId(data?.id || null);
      } catch (err) {
        console.error("Error checking wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    checkWishlist();
  }, [userId, listingId, supabase]);

  return { isInWishlist, wishlistItemId, loading };
}

// Hook for wishlist mutations
export function useWishlistMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Add item to wishlist
  const addToWishlist = async (
    userId: string,
    listingId: string,
    priceAlert?: boolean,
    alertPrice?: number
  ): Promise<Wishlist | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if already in wishlist
      const { data: existing } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", userId)
        .eq("listing_id", listingId)
        .maybeSingle();

      if (existing) {
        // Already exists, just return it
        const { data } = await supabase
          .from("wishlists")
          .select("*")
          .eq("id", existing.id)
          .single();
        return data;
      }

      const { data, error: createError } = await supabase
        .from("wishlists")
        .insert({
          user_id: userId,
          listing_id: listingId,
          price_alert: priceAlert || false,
          alert_price: alertPrice || null,
        })
        .select()
        .single();

      if (createError) throw createError;

      return data;

    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to add to wishlist");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", wishlistItemId);

      if (deleteError) throw deleteError;

      return true;

    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to remove from wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove by listing ID
  const removeFromWishlistByListing = async (
    userId: string,
    listingId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("listing_id", listingId);

      if (deleteError) throw deleteError;

      return true;

    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to remove from wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist (add if not exists, remove if exists)
  const toggleWishlist = async (
    userId: string,
    listingId: string
  ): Promise<{ added: boolean; item: Wishlist | null }> => {
    setLoading(true);
    setError(null);

    try {
      // Check if exists
      const { data: existing } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", userId)
        .eq("listing_id", listingId)
        .maybeSingle();

      if (existing) {
        // Remove
        await supabase
          .from("wishlists")
          .delete()
          .eq("id", existing.id);
        return { added: false, item: null };
      } else {
        // Add
        const { data, error: createError } = await supabase
          .from("wishlists")
          .insert({
            user_id: userId,
            listing_id: listingId,
          })
          .select()
          .single();

        if (createError) throw createError;

        return { added: true, item: data };
      }

    } catch (err) {
      console.error("Error toggling wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to update wishlist");
      return { added: false, item: null };
    } finally {
      setLoading(false);
    }
  };

  // Update price alert settings
  const updatePriceAlert = async (
    wishlistItemId: string,
    priceAlert: boolean,
    alertPrice?: number
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("wishlists")
        .update({
          price_alert: priceAlert,
          alert_price: priceAlert ? alertPrice : null,
        })
        .eq("id", wishlistItemId);

      if (updateError) throw updateError;

      return true;

    } catch (err) {
      console.error("Error updating price alert:", err);
      setError(err instanceof Error ? err.message : "Failed to update price alert");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire wishlist
  const clearWishlist = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      return true;

    } catch (err) {
      console.error("Error clearing wishlist:", err);
      setError(err instanceof Error ? err.message : "Failed to clear wishlist");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToWishlist,
    removeFromWishlist,
    removeFromWishlistByListing,
    toggleWishlist,
    updatePriceAlert,
    clearWishlist,
    loading,
    error,
  };
}

// Hook for wishlist count
export function useWishlistCount(userId: string | null) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) {
      setCount(0);
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        const { count: wishlistCount, error } = await supabase
          .from("wishlists")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);

        if (error) throw error;

        setCount(wishlistCount || 0);
      } catch (err) {
        console.error("Error fetching wishlist count:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [userId, supabase]);

  return { count, loading };
}

// Hook for listings with price alerts triggered
export function usePriceAlerts(userId: string | null) {
  const [alerts, setAlerts] = useState<WishlistItemWithListing[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      setLoading(true);

      try {
        // Get wishlist items with price alerts
        const { data, error } = await supabase
          .from("wishlists")
          .select(`
            *,
            listing:listings!wishlists_listing_id_fkey(
              *,
              seller:profiles!listings_seller_id_fkey(
                id,
                username,
                full_name,
                avatar_url,
                rating,
                is_verified
              )
            )
          `)
          .eq("user_id", userId)
          .eq("price_alert", true);

        if (error) throw error;

        // Filter items where current price is at or below alert price
        const triggeredAlerts = (data || []).filter(
          item =>
            item.listing &&
            item.listing.status === "active" &&
            item.alert_price &&
            item.listing.price <= item.alert_price
        );

        setAlerts(triggeredAlerts);

      } catch (err) {
        console.error("Error fetching price alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userId, supabase]);

  return { alerts, loading };
}

