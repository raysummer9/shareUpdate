"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, Package, MessageSquare, Eye, Truck, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useOrders, useOrderStats, useOrderMutations } from "@/lib/hooks/use-orders";

type StatusFilter = "all" | "pending" | "processing" | "completed" | "cancelled";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  paid: { label: "Paid", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-100" },
  processing: { label: "Processing", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  delivered: { label: "Delivered", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
  disputed: { label: "Disputed", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
};

interface OrderCardProps {
  id: string;
  orderNumber: string;
  productTitle: string;
  productImage: string;
  buyerName: string;
  buyerAvatar: string;
  price: number;
  fee: number;
  netAmount: number;
  status: string;
  date: string;
  deadline?: string;
  onStartDelivery: () => void;
  onMarkDelivered: () => void;
  formatCurrency: (amount: number) => string;
}

function OrderCard({
  id,
  orderNumber,
  productTitle,
  productImage,
  buyerName,
  buyerAvatar,
  price,
  fee,
  netAmount,
  status,
  date,
  deadline,
  onStartDelivery,
  onMarkDelivered,
  formatCurrency,
}: OrderCardProps) {
  const config = statusConfig[status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={productImage}
            alt={productTitle}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Order Number & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500">{orderNumber}</span>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", config.bg, config.color)}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{productTitle}</h3>

          {/* Buyer Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={buyerAvatar}
              alt={buyerName}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">Buyer: {buyerName}</span>
            <span className="text-xs text-gray-400">• {date}</span>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3">
            <span className="text-gray-500">Price: <span className="font-semibold text-gray-900">{formatCurrency(price)}</span></span>
            <span className="text-gray-500">Fee: <span className="text-red-600">{formatCurrency(fee)}</span></span>
            <span className="text-gray-500">You receive: <span className="font-bold text-green-600">{formatCurrency(netAmount)}</span></span>
          </div>

          {/* Deadline */}
          {deadline && (status === "pending" || status === "processing" || status === "paid") && (
            <div className="flex items-center gap-1 text-sm text-red-600 mb-3">
              <Clock className="h-4 w-4" />
              <span>Deliver within: {deadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <Link href={`/seller/messages?order=${id}`}>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Buyer
          </Button>
        </Link>
        {(status === "pending" || status === "paid") && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onStartDelivery}>
            <Package className="h-4 w-4 mr-2" />
            Start Delivery
          </Button>
        )}
        {status === "processing" && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onMarkDelivered}>
            <Truck className="h-4 w-4 mr-2" />
            Mark Delivered
          </Button>
        )}
        {status === "delivered" && (
          <Link href={`/seller/orders/${id}`}>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
        )}
        {status === "disputed" && (
          <Link href={`/seller/disputes/${id}`}>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Respond to Dispute
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { user, loading: authLoading } = useAuth();
  const { orders, loading: ordersLoading, refetch } = useOrders({ seller_id: user?.id ?? undefined });
  const { stats } = useOrderStats(user?.id ?? null, "seller");
  const { updateOrderStatus, loading: mutationLoading } = useOrderMutations();

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

  // Calculate deadline
  const getDeadline = (createdAt: string, deliveryDays: number = 3) => {
    const created = new Date(createdAt);
    const deadline = new Date(created.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
    if (hoursLeft > 24) {
      return `${Math.floor(hoursLeft / 24)} days`;
    }
    return `${hoursLeft} hours`;
  };

  const handleStartDelivery = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, "processing");
    if (success) refetch();
  };

  const handleMarkDelivered = async (orderId: string) => {
    const success = await updateOrderStatus(orderId, "delivered");
    if (success) refetch();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = (order.listing?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = statusFilter === "all";
    if (statusFilter === "pending") matchesStatus = order.status === "pending" || order.status === "paid";
    if (statusFilter === "processing") matchesStatus = order.status === "processing";
    if (statusFilter === "completed") matchesStatus = order.status === "completed" || order.status === "delivered";
    if (statusFilter === "cancelled") matchesStatus = order.status === "cancelled" || order.status === "disputed";
    
    return matchesSearch && matchesStatus;
  });

  // Calculate revenue
  const totalRevenue = orders
    .filter(o => o.status === "completed" || o.status === "delivered")
    .reduce((acc, o) => acc + o.seller_receives, 0);

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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">Manage incoming orders and deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-1 mb-1">
            <DollarSign className="h-4 w-4 text-green-500" />
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Urgent Orders Alert */}
      {stats.pending > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Action Required</p>
            <p className="text-sm text-yellow-700">You have {stats.pending} pending order{stats.pending > 1 ? 's' : ''} waiting for delivery. Complete them to maintain your seller rating!</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["all", "pending", "processing", "completed", "cancelled"] as StatusFilter[]).map((status) => (
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
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              orderNumber={order.order_number}
              productTitle={order.listing?.title || "Order"}
              productImage={order.listing?.images?.[0] || "/placeholder-image.png"}
              buyerName={order.buyer?.full_name || order.buyer?.username || "Buyer"}
              buyerAvatar={order.buyer?.avatar_url || "/placeholder-image.png"}
              price={order.total_amount}
              fee={order.platform_fee}
              netAmount={order.seller_receives}
              status={order.status || "pending"}
              date={formatDate(order.created_at!)}
              deadline={getDeadline(order.created_at!, order.listing?.delivery_time || 3)}
              onStartDelivery={() => handleStartDelivery(order.id)}
              onMarkDelivered={() => handleMarkDelivered(order.id)}
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link href="/seller/list-product">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Create a Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
