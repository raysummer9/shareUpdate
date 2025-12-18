"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type BuyerRequest = Database["public"]["Tables"]["buyer_requests"]["Row"];
type BuyerRequestInsert = Database["public"]["Tables"]["buyer_requests"]["Insert"];
type RequestBid = Database["public"]["Tables"]["request_bids"]["Row"];
type RequestBidInsert = Database["public"]["Tables"]["request_bids"]["Insert"];

export interface RequestWithDetails extends BuyerRequest {
  buyer?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  bids?: BidWithSeller[];
}

export interface BidWithSeller extends RequestBid {
  seller?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    rating: number | null;
    is_verified: boolean;
    total_sales: number;
  };
}

export interface RequestFilters {
  category_id?: string;
  status?: string;
  buyer_id?: string;
  min_budget?: number;
  max_budget?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

// Hook for fetching buyer requests (for sellers to browse)
export function useRequests(filters?: RequestFilters) {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("buyer_requests")
        .select(`
          *,
          buyer:profiles!buyer_requests_buyer_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          category:categories!buyer_requests_category_id_fkey(
            id,
            name,
            slug
          )
        `, { count: "exact" });

      // Apply filters
      if (filters?.status) {
        query = query.eq("status", filters.status);
      } else {
        // Default to active requests
        query = query.eq("status", "active");
      }

      if (filters?.category_id) {
        query = query.eq("category_id", filters.category_id);
      }

      if (filters?.buyer_id) {
        query = query.eq("buyer_id", filters.buyer_id);
      }

      if (filters?.min_budget !== undefined) {
        query = query.gte("budget_max", filters.min_budget);
      }

      if (filters?.max_budget !== undefined) {
        query = query.lte("budget_min", filters.max_budget);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
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

      setRequests(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, totalCount, refetch: fetchRequests };
}

// Hook for fetching a single request with bids
export function useRequest(requestId: string | null) {
  const [request, setRequest] = useState<RequestWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchRequest = useCallback(async () => {
    if (!requestId) {
      setRequest(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch request details
      const { data: requestData, error: requestError } = await supabase
        .from("buyer_requests")
        .select(`
          *,
          buyer:profiles!buyer_requests_buyer_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          category:categories!buyer_requests_category_id_fkey(
            id,
            name,
            slug
          )
        `)
        .eq("id", requestId)
        .single();

      if (requestError) throw requestError;

      // Fetch bids for this request
      const { data: bidsData, error: bidsError } = await supabase
        .from("request_bids")
        .select(`
          *,
          seller:profiles!request_bids_seller_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            rating,
            is_verified,
            total_sales
          )
        `)
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (bidsError) throw bidsError;

      setRequest({
        ...requestData,
        bids: bidsData || [],
      });

      // Increment view count (fire and forget)
      supabase
        .from("buyer_requests")
        .update({ view_count: (requestData.view_count || 0) + 1 })
        .eq("id", requestId)
        .then();
    } catch (err) {
      console.error("Error fetching request:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch request");
    } finally {
      setLoading(false);
    }
  }, [requestId, supabase]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return { request, loading, error, refetch: fetchRequest };
}

// Hook for buyer's own requests
export function useMyRequests(buyerId: string | null) {
  const [requests, setRequests] = useState<RequestWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMyRequests = useCallback(async () => {
    if (!buyerId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("buyer_requests")
        .select(`
          *,
          category:categories!buyer_requests_category_id_fkey(
            id,
            name,
            slug
          )
        `)
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setRequests(data || []);
    } catch (err) {
      console.error("Error fetching my requests:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  }, [buyerId, supabase]);

  useEffect(() => {
    fetchMyRequests();
  }, [fetchMyRequests]);

  return { requests, loading, error, refetch: fetchMyRequests };
}

// Hook for seller's bids
export function useMyBids(sellerId: string | null) {
  const [bids, setBids] = useState<(RequestBid & { request?: RequestWithDetails })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMyBids = useCallback(async () => {
    if (!sellerId) {
      setBids([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("request_bids")
        .select(`
          *,
          request:buyer_requests!request_bids_request_id_fkey(
            id,
            title,
            description,
            budget_min,
            budget_max,
            status,
            deadline,
            buyer:profiles!buyer_requests_buyer_id_fkey(
              id,
              username,
              full_name,
              avatar_url
            ),
            category:categories!buyer_requests_category_id_fkey(
              id,
              name,
              slug
            )
          )
        `)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setBids(data || []);
    } catch (err) {
      console.error("Error fetching my bids:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bids");
    } finally {
      setLoading(false);
    }
  }, [sellerId, supabase]);

  useEffect(() => {
    fetchMyBids();
  }, [fetchMyBids]);

  return { bids, loading, error, refetch: fetchMyBids };
}

// Hook for request mutations
export function useRequestMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Create a new request (buyer)
  const createRequest = async (request: Omit<BuyerRequestInsert, "buyer_id"> & { buyer_id: string }): Promise<BuyerRequest | null> => {
    setLoading(true);
    setError(null);

    try {
      // Set expiration date (default 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { data, error: createError } = await supabase
        .from("buyer_requests")
        .insert({
          ...request,
          expires_at: expiresAt.toISOString(),
          status: "active",
        })
        .select()
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      console.error("Error creating request:", err);
      setError(err instanceof Error ? err.message : "Failed to create request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update request (buyer)
  const updateRequest = async (
    requestId: string,
    updates: Partial<BuyerRequest>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("buyer_requests")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error updating request:", err);
      setError(err instanceof Error ? err.message : "Failed to update request");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancel request (buyer)
  const cancelRequest = async (requestId: string): Promise<boolean> => {
    return updateRequest(requestId, { status: "cancelled" });
  };

  // Delete request (buyer)
  const deleteRequest = async (requestId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("buyer_requests")
        .delete()
        .eq("id", requestId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error("Error deleting request:", err);
      setError(err instanceof Error ? err.message : "Failed to delete request");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createRequest,
    updateRequest,
    cancelRequest,
    deleteRequest,
    loading,
    error,
  };
}

// Hook for bid mutations
export function useBidMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Submit a bid (seller)
  const submitBid = async (bid: Omit<RequestBidInsert, "id">): Promise<RequestBid | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from("request_bids")
        .insert(bid)
        .select()
        .single();

      if (createError) {
        // Check for unique constraint violation
        if (createError.code === "23505") {
          throw new Error("You have already submitted a bid for this request");
        }
        throw createError;
      }

      // Update bid count on the request
      await supabase.rpc("increment_bid_count", { request_id: bid.request_id });

      return data;
    } catch (err) {
      console.error("Error submitting bid:", err);
      setError(err instanceof Error ? err.message : "Failed to submit bid");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update bid (seller)
  const updateBid = async (
    bidId: string,
    updates: Partial<RequestBid>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("request_bids")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", bidId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error updating bid:", err);
      setError(err instanceof Error ? err.message : "Failed to update bid");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Withdraw bid (seller)
  const withdrawBid = async (bidId: string): Promise<boolean> => {
    return updateBid(bidId, { status: "withdrawn" });
  };

  // Accept bid (buyer)
  const acceptBid = async (requestId: string, bidId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Accept the bid
      const { error: acceptError } = await supabase
        .from("request_bids")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", bidId);

      if (acceptError) throw acceptError;

      // Reject other bids
      await supabase
        .from("request_bids")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("request_id", requestId)
        .neq("id", bidId);

      // Mark request as completed
      await supabase
        .from("buyer_requests")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", requestId);

      return true;
    } catch (err) {
      console.error("Error accepting bid:", err);
      setError(err instanceof Error ? err.message : "Failed to accept bid");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reject bid (buyer)
  const rejectBid = async (bidId: string): Promise<boolean> => {
    return updateBid(bidId, { status: "rejected" });
  };

  return {
    submitBid,
    updateBid,
    withdrawBid,
    acceptBid,
    rejectBid,
    loading,
    error,
  };
}

