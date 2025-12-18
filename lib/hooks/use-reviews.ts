"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];

export interface ReviewWithDetails extends Review {
  reviewer?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  listing?: {
    id: string;
    title: string;
    slug: string;
    images: string[] | null;
  };
  order?: {
    id: string;
    order_number: string;
  };
}

export interface ReviewFilters {
  listing_id?: string;
  reviewee_id?: string; // Seller being reviewed
  reviewer_id?: string; // Buyer who wrote review
  min_rating?: number;
  limit?: number;
  offset?: number;
}

// Hook for fetching reviews
export function useReviews(filters?: ReviewFilters) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          reviewer:profiles!reviews_reviewer_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          listing:listings!reviews_listing_id_fkey(
            id,
            title,
            slug,
            images
          )
        `, { count: "exact" })
        .eq("is_public", true);

      // Apply filters
      if (filters?.listing_id) {
        query = query.eq("listing_id", filters.listing_id);
      }

      if (filters?.reviewee_id) {
        query = query.eq("reviewee_id", filters.reviewee_id);
      }

      if (filters?.reviewer_id) {
        query = query.eq("reviewer_id", filters.reviewer_id);
      }

      if (filters?.min_rating !== undefined) {
        query = query.gte("rating", filters.min_rating);
      }

      // Sort by newest first
      query = query.order("created_at", { ascending: false });

      // Apply pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setReviews(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, totalCount, refetch: fetchReviews };
}

// Hook for fetching reviews given by a buyer
export function useMyGivenReviews(reviewerId: string | null) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!reviewerId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("reviews")
          .select(`
            *,
            listing:listings!reviews_listing_id_fkey(
              id,
              title,
              slug,
              images
            ),
            reviewee:profiles!reviews_reviewee_id_fkey(
              id,
              username,
              full_name,
              avatar_url
            )
          `)
          .eq("reviewer_id", reviewerId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setReviews(data || []);
      } catch (err) {
        console.error("Error fetching my reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [reviewerId, supabase]);

  return { reviews, loading, error };
}

// Hook for fetching reviews received by a seller
export function useMyReceivedReviews(revieweeId: string | null) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const supabase = createClient();

  useEffect(() => {
    if (!revieweeId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("reviews")
          .select(`
            *,
            reviewer:profiles!reviews_reviewer_id_fkey(
              id,
              username,
              full_name,
              avatar_url
            ),
            listing:listings!reviews_listing_id_fkey(
              id,
              title,
              slug,
              images
            )
          `)
          .eq("reviewee_id", revieweeId)
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        setReviews(data || []);

        // Calculate stats
        if (data && data.length > 0) {
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          let totalRating = 0;

          data.forEach((review) => {
            totalRating += review.rating;
            const rating = review.rating as 1 | 2 | 3 | 4 | 5;
            distribution[rating]++;
          });

          setStats({
            average: totalRating / data.length,
            total: data.length,
            distribution,
          });
        }
      } catch (err) {
        console.error("Error fetching received reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [revieweeId, supabase]);

  return { reviews, stats, loading, error };
}

// Hook for pending reviews (orders without reviews)
export function usePendingReviews(buyerId: string | null) {
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!buyerId) {
      setPendingOrders([]);
      setLoading(false);
      return;
    }

    const fetchPendingReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get completed orders that don't have reviews
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            completed_at,
            listing:listings!orders_listing_id_fkey(
              id,
              title,
              slug,
              images
            ),
            seller:profiles!orders_seller_id_fkey(
              id,
              username,
              full_name,
              avatar_url
            )
          `)
          .eq("buyer_id", buyerId)
          .eq("status", "completed")
          .order("completed_at", { ascending: false });

        if (ordersError) throw ordersError;

        // Get existing reviews
        const { data: reviews, error: reviewsError } = await supabase
          .from("reviews")
          .select("order_id")
          .eq("reviewer_id", buyerId);

        if (reviewsError) throw reviewsError;

        const reviewedOrderIds = new Set(reviews?.map((r) => r.order_id) || []);

        // Filter orders without reviews
        const pending = orders?.filter((order) => !reviewedOrderIds.has(order.id)) || [];

        setPendingOrders(pending);
      } catch (err) {
        console.error("Error fetching pending reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch pending reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingReviews();
  }, [buyerId, supabase]);

  return { pendingOrders, loading, error };
}

// Hook for review mutations
export function useReviewMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Create a review (buyer)
  const createReview = async (reviewData: {
    order_id: string;
    reviewer_id: string;
    reviewee_id: string;
    listing_id: string;
    rating: number;
    comment?: string;
  }): Promise<Review | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from("reviews")
        .insert(reviewData)
        .select()
        .single();

      if (createError) {
        // Check for unique constraint violation
        if (createError.code === "23505") {
          throw new Error("You have already reviewed this order");
        }
        throw createError;
      }

      return data;
    } catch (err) {
      console.error("Error creating review:", err);
      setError(err instanceof Error ? err.message : "Failed to create review");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Reply to a review (seller)
  const replyToReview = async (reviewId: string, reply: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          reply,
          replied_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", reviewId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error replying to review:", err);
      setError(err instanceof Error ? err.message : "Failed to reply to review");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mark review as helpful
  const markHelpful = async (reviewId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Increment helpful count
      const { data: review } = await supabase
        .from("reviews")
        .select("helpful_count")
        .eq("id", reviewId)
        .single();

      const { error: updateError } = await supabase
        .from("reviews")
        .update({
          helpful_count: (review?.helpful_count || 0) + 1,
        })
        .eq("id", reviewId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error marking review helpful:", err);
      setError(err instanceof Error ? err.message : "Failed to mark as helpful");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    replyToReview,
    markHelpful,
    loading,
    error,
  };
}

