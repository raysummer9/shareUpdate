"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export type OrderStatus = 
  | "pending"
  | "paid"
  | "processing"
  | "delivered"
  | "completed"
  | "cancelled"
  | "disputed"
  | "refunded";

export interface OrderWithDetails extends Order {
  listing?: {
    id: string;
    title: string;
    slug: string;
    images: string[] | null;
    type: string;
    price: number;
  };
  buyer?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
  seller?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export interface OrderFilters {
  status?: OrderStatus | OrderStatus[];
  buyer_id?: string;
  seller_id?: string;
  listing_id?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

// Hook for fetching orders (buyer or seller)
export function useOrders(filters?: OrderFilters) {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = createClient();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("orders")
        .select(`
          *,
          listing:listings!orders_listing_id_fkey(
            id,
            title,
            slug,
            images,
            type,
            price
          ),
          buyer:profiles!orders_buyer_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          ),
          seller:profiles!orders_seller_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `, { count: "exact" });

      // Apply filters
      if (filters?.buyer_id) {
        query = query.eq("buyer_id", filters.buyer_id);
      }

      if (filters?.seller_id) {
        query = query.eq("seller_id", filters.seller_id);
      }

      if (filters?.listing_id) {
        query = query.eq("listing_id", filters.listing_id);
      }

      if (filters?.status) {
        if (Array.isArray(filters.status)) {
          query = query.in("status", filters.status);
        } else {
          query = query.eq("status", filters.status);
        }
      }

      if (filters?.from_date) {
        query = query.gte("created_at", filters.from_date);
      }

      if (filters?.to_date) {
        query = query.lte("created_at", filters.to_date);
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

      setOrders(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, totalCount, refetch: fetchOrders };
}

// Hook for fetching a single order
export function useOrder(orderId: string | null) {
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select(`
            *,
            listing:listings!orders_listing_id_fkey(
              id,
              title,
              slug,
              images,
              type,
              price,
              description,
              instant_delivery,
              delivery_time_days
            ),
            buyer:profiles!orders_buyer_id_fkey(
              id,
              username,
              full_name,
              avatar_url,
              email
            ),
            seller:profiles!orders_seller_id_fkey(
              id,
              username,
              full_name,
              avatar_url,
              email
            )
          `)
          .eq("id", orderId)
          .single();

        if (fetchError) throw fetchError;

        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, supabase]);

  return { order, loading, error };
}

// Hook for order mutations
export function useOrderMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Create a new order
  const createOrder = async (orderData: {
    buyer_id: string;
    seller_id: string;
    listing_id: string;
    price: number;
    selected_tier?: string;
    requirements?: string;
  }): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      // Calculate fees (10% each for buyer and seller)
      const buyerFee = orderData.price * 0.10;
      const sellerFee = orderData.price * 0.10;
      const totalAmount = orderData.price + buyerFee;
      const sellerReceives = orderData.price - sellerFee;

      const orderInsert: OrderInsert = {
        order_number: generateOrderNumber(),
        buyer_id: orderData.buyer_id,
        seller_id: orderData.seller_id,
        listing_id: orderData.listing_id,
        price: orderData.price,
        buyer_fee: buyerFee,
        seller_fee: sellerFee,
        total_amount: totalAmount,
        seller_receives: sellerReceives,
        selected_tier: orderData.selected_tier,
        requirements: orderData.requirements,
        status: "pending",
      };

      const { data, error: createError } = await supabase
        .from("orders")
        .insert(orderInsert)
        .select()
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err instanceof Error ? err.message : "Failed to create order");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    additionalData?: Partial<Order>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const updates: Partial<Order> = {
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      };

      // Add timestamp for specific status changes
      if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      } else if (status === "completed") {
        updates.completed_at = new Date().toISOString();
        updates.buyer_confirmed = true;
      } else if (status === "cancelled") {
        updates.cancelled_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", orderId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err instanceof Error ? err.message : "Failed to update order");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Mark order as delivered (seller)
  const markAsDelivered = async (
    orderId: string,
    deliveryData?: Record<string, unknown>
  ): Promise<boolean> => {
    return updateOrderStatus(orderId, "delivered", {
      delivery_data: deliveryData as any,
    });
  };

  // Confirm receipt (buyer)
  const confirmReceipt = async (orderId: string): Promise<boolean> => {
    return updateOrderStatus(orderId, "completed");
  };

  // Cancel order
  const cancelOrder = async (
    orderId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<boolean> => {
    return updateOrderStatus(orderId, "cancelled", {
      cancelled_by: cancelledBy,
      cancellation_reason: reason,
    });
  };

  // Open dispute
  const openDispute = async (orderId: string): Promise<boolean> => {
    return updateOrderStatus(orderId, "disputed");
  };

  return {
    createOrder,
    updateOrderStatus,
    markAsDelivered,
    confirmReceipt,
    cancelOrder,
    openDispute,
    loading,
    error,
  };
}

// Hook for order stats
export function useOrderStats(userId: string | null, role: "buyer" | "seller") {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    disputed: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);

      try {
        const column = role === "buyer" ? "buyer_id" : "seller_id";

        // Fetch counts for each status
        const [total, pending, processing, completed, disputed] = await Promise.all([
          supabase.from("orders").select("*", { count: "exact", head: true }).eq(column, userId),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq(column, userId).eq("status", "pending"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq(column, userId).eq("status", "processing"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq(column, userId).eq("status", "completed"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq(column, userId).eq("status", "disputed"),
        ]);

        setStats({
          total: total.count || 0,
          pending: pending.count || 0,
          processing: processing.count || 0,
          completed: completed.count || 0,
          disputed: disputed.count || 0,
        });
      } catch (err) {
        console.error("Error fetching order stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId, role, supabase]);

  return { stats, loading };
}

