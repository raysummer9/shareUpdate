"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Download, MessageSquare, Eye, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useOrders, useOrderStats } from "@/lib/hooks/use-orders";

type StatusFilter = "all" | "delivered" | "processing" | "escrow" | "cancelled";

const statusColors: Record<string, string> = {
  "pending": "bg-yellow-100 text-yellow-700",
  "paid": "bg-blue-100 text-blue-700",
  "processing": "bg-yellow-100 text-yellow-700",
  "delivered": "bg-green-100 text-green-700",
  "completed": "bg-green-100 text-green-700",
  "cancelled": "bg-red-100 text-red-700",
  "disputed": "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  "pending": "Pending",
  "paid": "In Escrow",
  "processing": "Processing",
  "delivered": "Delivered",
  "completed": "Completed",
  "cancelled": "Cancelled",
  "disputed": "Disputed",
};

interface PurchaseCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  status: string;
  date: string;
  seller: string;
  orderId: string;
}

function PurchaseCard({ id, title, subtitle, image, price, status, date, seller, orderId }: PurchaseCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <Link href={`/product/${id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={image}
            alt={title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </Link>
        <div className="flex-1 min-w-0">
          {/* Status badge - shown on top for mobile */}
          <div className="flex items-center justify-between gap-2 mb-1 sm:mb-0">
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium sm:hidden", statusColors[status] || statusColors.pending)}>
              {statusLabels[status] || status}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link href={`/product/${id}`}>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 sm:truncate hover:text-red-600">{title}</h3>
              </Link>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
            </div>
            {/* Status badge - hidden on mobile, shown on desktop */}
            <span className={cn("hidden sm:inline-block text-xs px-2 py-1 rounded-full font-medium flex-shrink-0", statusColors[status] || statusColors.pending)}>
              {statusLabels[status] || status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Seller: <span className="text-gray-700">{seller}</span></span>
            <span>{date}</span>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-lg font-bold text-gray-900">{price}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {status === "delivered" && (
                <Button size="sm" className="h-8 text-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Star className="h-3 w-3 mr-1" /> Rate
                </Button>
              )}
              {status === "completed" && (
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              )}
              {status === "processing" && (
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Eye className="h-3 w-3 mr-1" /> Track
                </Button>
              )}
              {(status === "paid" || status === "pending") && (
                <Link href={`/buyer/trades/${orderId}`}>
                  <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    View Trade
                  </Button>
                </Link>
              )}
              <Link href={`/buyer/messages?order=${orderId}`}>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" /> Contact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  
  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading } = useOrders({ buyer_id: user?.id ?? undefined });
  const { stats } = useOrderStats(user?.id ?? null, "buyer");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.listing?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "delivered") matchesStatus = order.status === "delivered" || order.status === "completed";
    if (statusFilter === "processing") matchesStatus = order.status === "processing";
    if (statusFilter === "escrow") matchesStatus = order.status === "paid" || order.status === "pending";
    if (statusFilter === "cancelled") matchesStatus = order.status === "cancelled" || order.status === "disputed";
    
    return matchesSearch && matchesStatus;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Purchases</h1>
        <p className="text-gray-600 mt-1">Track and manage all your purchases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">In Escrow</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["all", "delivered", "processing", "escrow", "cancelled"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize whitespace-nowrap",
                statusFilter === status
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {status === "escrow" ? "In Escrow" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {ordersLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2">Loading purchases...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <PurchaseCard
              key={order.id}
              id={order.listing?.slug || order.listing_id}
              title={order.listing?.title || "Order"}
              subtitle={order.listing?.type || ""}
              image={order.listing?.images?.[0] || "/placeholder-image.png"}
              price={formatCurrency(order.total_amount)}
              status={order.status || "pending"}
              date={formatDate(order.created_at!)}
              seller={order.seller?.full_name || order.seller?.username || "Seller"}
              orderId={order.id}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No purchases found</p>
            <Link href="/browse">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
