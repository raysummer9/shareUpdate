"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import { RealtimeChannel } from "@supabase/supabase-js";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export interface NotificationFilters {
  type?: string;
  is_read?: boolean;
  limit?: number;
  offset?: number;
}

// Hook for fetching user's notifications
export function useNotifications(userId: string | null, filters?: NotificationFilters) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  // Memoize filter values
  const filterType = filters?.type;
  const filterIsRead = filters?.is_read;
  const filterLimit = filters?.limit;
  const filterOffset = filters?.offset;

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId);

      if (filterType) {
        query = query.eq("type", filterType);
      }

      if (filterIsRead !== undefined) {
        query = query.eq("is_read", filterIsRead);
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

      setNotifications(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase, filterType, filterIsRead, filterLimit, filterOffset]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Set up real-time subscription for new notifications
  useEffect(() => {
    if (!userId) return;

    const channel: RealtimeChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          // Add new notification to the top of the list
          setNotifications((prev) => [payload.new as Notification, ...prev]);
          setTotalCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return { notifications, loading, error, totalCount, refetch: fetchNotifications };
}

// Hook for unread notification count (for badges)
export function useUnreadNotificationCount(userId: string | null) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchCount = useCallback(async () => {
    if (!userId) {
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      const { count: unreadCount, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      setCount(unreadCount || 0);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notification-count:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchCount]);

  return { count, loading, refetch: fetchCount };
}

// Hook for notification mutations
export function useNotificationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Create a notification
  const createNotification = async (notification: {
    user_id: string;
    type: string;
    title: string;
    body?: string;
    reference_type?: string;
    reference_id?: string;
  }): Promise<Notification | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: createError } = await supabase
        .from("notifications")
        .insert(notification)
        .select()
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      console.error("Error creating notification:", err);
      setError(err instanceof Error ? err.message : "Failed to create notification");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("id", notificationId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError(err instanceof Error ? err.message : "Failed to mark as read");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("notifications")
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error marking all as read:", err);
      setError(err instanceof Error ? err.message : "Failed to mark all as read");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error("Error deleting notification:", err);
      setError(err instanceof Error ? err.message : "Failed to delete notification");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete all read notifications
  const deleteAllRead = async (userId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId)
        .eq("is_read", true);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error("Error deleting read notifications:", err);
      setError(err instanceof Error ? err.message : "Failed to delete notifications");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
    loading,
    error,
  };
}

// Helper function to create order-related notifications
export async function createOrderNotification(
  supabase: ReturnType<typeof createClient>,
  orderId: string,
  recipientId: string,
  type: "order_created" | "order_paid" | "order_delivered" | "order_completed" | "order_cancelled" | "order_disputed",
  orderNumber: string
) {
  const titles: Record<string, string> = {
    order_created: "New Order Received",
    order_paid: "Payment Received",
    order_delivered: "Order Delivered",
    order_completed: "Order Completed",
    order_cancelled: "Order Cancelled",
    order_disputed: "Dispute Filed",
  };

  const bodies: Record<string, string> = {
    order_created: `You have a new order #${orderNumber}`,
    order_paid: `Payment received for order #${orderNumber}`,
    order_delivered: `Order #${orderNumber} has been marked as delivered`,
    order_completed: `Order #${orderNumber} has been completed`,
    order_cancelled: `Order #${orderNumber} has been cancelled`,
    order_disputed: `A dispute has been filed for order #${orderNumber}`,
  };

  await supabase.from("notifications").insert({
    user_id: recipientId,
    type: "order",
    title: titles[type],
    body: bodies[type],
    reference_type: "order",
    reference_id: orderId,
  });
}

// Helper function to create message notification
export async function createMessageNotification(
  supabase: ReturnType<typeof createClient>,
  recipientId: string,
  senderName: string,
  conversationId: string,
  preview: string
) {
  await supabase.from("notifications").insert({
    user_id: recipientId,
    type: "message",
    title: `New message from ${senderName}`,
    body: preview.substring(0, 100),
    reference_type: "conversation",
    reference_id: conversationId,
  });
}

// Helper function to create review notification
export async function createReviewNotification(
  supabase: ReturnType<typeof createClient>,
  sellerId: string,
  buyerName: string,
  rating: number,
  listingId: string
) {
  await supabase.from("notifications").insert({
    user_id: sellerId,
    type: "review",
    title: `New ${rating}-star Review`,
    body: `${buyerName} left you a ${rating}-star review`,
    reference_type: "listing",
    reference_id: listingId,
  });
}

