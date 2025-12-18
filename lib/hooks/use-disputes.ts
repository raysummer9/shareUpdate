"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Dispute = Database["public"]["Tables"]["disputes"]["Row"];
type DisputeMessage = Database["public"]["Tables"]["dispute_messages"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface DisputeWithDetails extends Dispute {
  filed_by_user?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url">;
  against_user?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url">;
  order?: {
    id: string;
    order_number: string;
    listing: {
      id: string;
      title: string;
      images: string[] | null;
    } | null;
  } | null;
  messages?: DisputeMessageWithSender[];
}

export interface DisputeMessageWithSender extends DisputeMessage {
  sender?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url">;
}

export interface DisputeFilters {
  status?: string | string[];
  filed_by?: string;
  against_id?: string;
  limit?: number;
  offset?: number;
}

export type DisputeReason = 
  | "not_as_described"
  | "not_delivered"
  | "delayed_delivery"
  | "quality_issues"
  | "access_issues"
  | "fraud"
  | "other";

// Hook for fetching user's disputes
export function useDisputes(userId: string | null, filters?: DisputeFilters) {
  const [disputes, setDisputes] = useState<DisputeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  // Memoize filter values
  const filterStatus = filters?.status;
  const filterFiledBy = filters?.filed_by;
  const filterAgainstId = filters?.against_id;
  const filterLimit = filters?.limit;
  const filterOffset = filters?.offset;

  const fetchDisputes = useCallback(async () => {
    if (!userId) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("disputes")
        .select(`
          *,
          filed_by_user:profiles!disputes_filed_by_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          against_user:profiles!disputes_against_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          order:orders!disputes_order_id_fkey(
            id,
            order_number,
            listing:listings!orders_listing_id_fkey(
              id,
              title,
              images
            )
          )
        `, { count: "exact" })
        .or(`filed_by.eq.${userId},against_id.eq.${userId}`);

      if (filterStatus) {
        if (Array.isArray(filterStatus)) {
          query = query.in("status", filterStatus);
        } else {
          query = query.eq("status", filterStatus);
        }
      }

      if (filterFiledBy) {
        query = query.eq("filed_by", filterFiledBy);
      }

      if (filterAgainstId) {
        query = query.eq("against_id", filterAgainstId);
      }

      query = query.order("created_at", { ascending: false });

      if (filterLimit) {
        query = query.limit(filterLimit);
      }

      if (filterOffset) {
        query = query.range(filterOffset, filterOffset + (filterLimit || 10) - 1);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setDisputes(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error("Error fetching disputes:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch disputes");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase, filterStatus, filterFiledBy, filterAgainstId, filterLimit, filterOffset]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  return { disputes, loading, error, totalCount, refetch: fetchDisputes };
}

// Hook for fetching a single dispute with messages
export function useDispute(disputeId: string | null) {
  const [dispute, setDispute] = useState<DisputeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchDispute = useCallback(async () => {
    if (!disputeId) {
      setDispute(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch dispute details
      const { data: disputeData, error: disputeError } = await supabase
        .from("disputes")
        .select(`
          *,
          filed_by_user:profiles!disputes_filed_by_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          against_user:profiles!disputes_against_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          order:orders!disputes_order_id_fkey(
            id,
            order_number,
            listing:listings!orders_listing_id_fkey(
              id,
              title,
              images
            )
          )
        `)
        .eq("id", disputeId)
        .single();

      if (disputeError) throw disputeError;

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("dispute_messages")
        .select(`
          *,
          sender:profiles!dispute_messages_sender_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("dispute_id", disputeId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      setDispute({
        ...disputeData,
        messages: messagesData || [],
      });

    } catch (err) {
      console.error("Error fetching dispute:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dispute");
    } finally {
      setLoading(false);
    }
  }, [disputeId, supabase]);

  useEffect(() => {
    fetchDispute();
  }, [fetchDispute]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!disputeId) return;

    const channel = supabase
      .channel(`dispute:${disputeId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "dispute_messages",
          filter: `dispute_id=eq.${disputeId}`,
        },
        () => {
          fetchDispute();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "disputes",
          filter: `id=eq.${disputeId}`,
        },
        () => {
          fetchDispute();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [disputeId, supabase, fetchDispute]);

  return { dispute, loading, error, refetch: fetchDispute };
}

// Hook for dispute mutations
export function useDisputeMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Generate dispute number
  const generateDisputeNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `DSP-${timestamp}-${random}`;
  };

  // File a new dispute
  const fileDispute = async (disputeData: {
    order_id: string;
    filed_by: string;
    against_id: string;
    reason: DisputeReason;
    description: string;
    buyer_claim?: string;
    evidence?: { type: string; url: string; uploaded_by: string }[];
  }): Promise<Dispute | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if dispute already exists for this order
      const { data: existing } = await supabase
        .from("disputes")
        .select("id")
        .eq("order_id", disputeData.order_id)
        .maybeSingle();

      if (existing) {
        throw new Error("A dispute has already been filed for this order");
      }

      const { data, error: createError } = await supabase
        .from("disputes")
        .insert({
          ...disputeData,
          dispute_number: generateDisputeNumber(),
          evidence: disputeData.evidence || null,
          deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
        })
        .select()
        .single();

      if (createError) throw createError;

      // Update order status to disputed
      await supabase
        .from("orders")
        .update({ status: "disputed" })
        .eq("id", disputeData.order_id);

      return data;

    } catch (err) {
      console.error("Error filing dispute:", err);
      setError(err instanceof Error ? err.message : "Failed to file dispute");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Respond to dispute (seller)
  const respondToDispute = async (
    disputeId: string,
    response: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("disputes")
        .update({
          seller_response: response,
          status: "under_review",
          updated_at: new Date().toISOString(),
        })
        .eq("id", disputeId);

      if (updateError) throw updateError;

      return true;

    } catch (err) {
      console.error("Error responding to dispute:", err);
      setError(err instanceof Error ? err.message : "Failed to respond to dispute");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add message to dispute
  const addDisputeMessage = async (
    disputeId: string,
    senderId: string,
    message: string,
    attachments?: string[],
    isAdmin: boolean = false
  ): Promise<DisputeMessage | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from("dispute_messages")
        .insert({
          dispute_id: disputeId,
          sender_id: senderId,
          message,
          attachments: attachments || null,
          is_admin: isAdmin,
        })
        .select()
        .single();

      if (createError) throw createError;

      return data;

    } catch (err) {
      console.error("Error adding dispute message:", err);
      setError(err instanceof Error ? err.message : "Failed to add message");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add evidence to dispute
  const addEvidence = async (
    disputeId: string,
    evidence: { type: string; url: string; uploaded_by: string }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Get current evidence
      const { data: dispute } = await supabase
        .from("disputes")
        .select("evidence")
        .eq("id", disputeId)
        .single();

      const currentEvidence = (dispute?.evidence as any[]) || [];

      const { error: updateError } = await supabase
        .from("disputes")
        .update({
          evidence: [...currentEvidence, evidence],
          updated_at: new Date().toISOString(),
        })
        .eq("id", disputeId);

      if (updateError) throw updateError;

      return true;

    } catch (err) {
      console.error("Error adding evidence:", err);
      setError(err instanceof Error ? err.message : "Failed to add evidence");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resolve dispute (admin only)
  const resolveDispute = async (
    disputeId: string,
    resolution: {
      resolution: string;
      resolution_type: "buyer_favor" | "seller_favor" | "partial_refund" | "mutual_agreement";
      refund_amount?: number;
      release_amount?: number;
      resolved_by: string;
    }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("disputes")
        .update({
          status: "resolved",
          resolution: resolution.resolution,
          resolution_type: resolution.resolution_type,
          refund_amount: resolution.refund_amount || null,
          release_amount: resolution.release_amount || null,
          resolved_by: resolution.resolved_by,
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", disputeId);

      if (updateError) throw updateError;

      // TODO: Process escrow based on resolution type
      // This would involve updating escrow_transactions and wallets

      return true;

    } catch (err) {
      console.error("Error resolving dispute:", err);
      setError(err instanceof Error ? err.message : "Failed to resolve dispute");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Close dispute without resolution
  const closeDispute = async (disputeId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("disputes")
        .update({
          status: "closed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", disputeId);

      if (updateError) throw updateError;

      return true;

    } catch (err) {
      console.error("Error closing dispute:", err);
      setError(err instanceof Error ? err.message : "Failed to close dispute");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fileDispute,
    respondToDispute,
    addDisputeMessage,
    addEvidence,
    resolveDispute,
    closeDispute,
    loading,
    error,
  };
}

// Hook for dispute stats
export function useDisputeStats(userId: string | null) {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    underReview: 0,
    resolved: 0,
    asFiledBy: 0,
    asAgainst: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);

      try {
        const [total, open, underReview, resolved, asFiledBy, asAgainst] = await Promise.all([
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .or(`filed_by.eq.${userId},against_id.eq.${userId}`),
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .or(`filed_by.eq.${userId},against_id.eq.${userId}`)
            .eq("status", "open"),
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .or(`filed_by.eq.${userId},against_id.eq.${userId}`)
            .eq("status", "under_review"),
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .or(`filed_by.eq.${userId},against_id.eq.${userId}`)
            .eq("status", "resolved"),
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .eq("filed_by", userId),
          supabase
            .from("disputes")
            .select("*", { count: "exact", head: true })
            .eq("against_id", userId),
        ]);

        setStats({
          total: total.count || 0,
          open: open.count || 0,
          underReview: underReview.count || 0,
          resolved: resolved.count || 0,
          asFiledBy: asFiledBy.count || 0,
          asAgainst: asAgainst.count || 0,
        });
      } catch (err) {
        console.error("Error fetching dispute stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, supabase]);

  return { stats, loading };
}

