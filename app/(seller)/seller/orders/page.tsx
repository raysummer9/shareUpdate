"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, Package, MessageSquare, Eye, Truck, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "delivered" | "completed" | "cancelled" | "disputed";
type StatusFilter = "all" | "pending" | "processing" | "completed" | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  productTitle: string;
  productImage: string;
  buyer: {
    name: string;
    avatar: string;
  };
  price: string;
  fee: string;
  netAmount: string;
  status: OrderStatus;
  date: string;
  deadline?: string;
}

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    productTitle: "Instagram Account - Fashion Niche",
    productImage: "/placeholder-image.png",
    buyer: { name: "Michael Chen", avatar: "/placeholder-image.png" },
    price: "₦45,000",
    fee: "₦4,500",
    netAmount: "₦40,500",
    status: "pending",
    date: "Jan 15, 2024",
    deadline: "24 hours",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    productTitle: "YouTube Channel - Tech Reviews",
    productImage: "/placeholder-image.png",
    buyer: { name: "Sarah Johnson", avatar: "/placeholder-image.png" },
    price: "₦120,000",
    fee: "₦12,000",
    netAmount: "₦108,000",
    status: "processing",
    date: "Jan 14, 2024",
    deadline: "48 hours",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    productTitle: "Website Development Service",
    productImage: "/placeholder-image.png",
    buyer: { name: "David Williams", avatar: "/placeholder-image.png" },
    price: "₦75,000",
    fee: "₦7,500",
    netAmount: "₦67,500",
    status: "delivered",
    date: "Jan 13, 2024",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    productTitle: "TikTok Account - Comedy",
    productImage: "/placeholder-image.png",
    buyer: { name: "Emily Brown", avatar: "/placeholder-image.png" },
    price: "₦85,000",
    fee: "₦8,500",
    netAmount: "₦76,500",
    status: "completed",
    date: "Jan 12, 2024",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    productTitle: "Logo Design Package",
    productImage: "/placeholder-image.png",
    buyer: { name: "James Wilson", avatar: "/placeholder-image.png" },
    price: "₦25,000",
    fee: "₦2,500",
    netAmount: "₦22,500",
    status: "cancelled",
    date: "Jan 10, 2024",
  },
  {
    id: "6",
    orderNumber: "ORD-2024-006",
    productTitle: "Twitter Account - Crypto",
    productImage: "/placeholder-image.png",
    buyer: { name: "Lisa Anderson", avatar: "/placeholder-image.png" },
    price: "₦35,000",
    fee: "₦3,500",
    netAmount: "₦31,500",
    status: "disputed",
    date: "Jan 8, 2024",
  },
];

const statusConfig: Record<OrderStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  processing: { label: "Processing", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  delivered: { label: "Delivered", icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
  disputed: { label: "Disputed", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
};

function OrderCard({ order }: { order: Order }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={order.productImage}
            alt={order.productTitle}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Order Number & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-mono text-gray-500">{order.orderNumber}</span>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", status.bg, status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{order.productTitle}</h3>

          {/* Buyer Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={order.buyer.avatar}
              alt={order.buyer.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">Buyer: {order.buyer.name}</span>
            <span className="text-xs text-gray-400">• {order.date}</span>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-3">
            <span className="text-gray-500">Price: <span className="font-semibold text-gray-900">{order.price}</span></span>
            <span className="text-gray-500">Fee: <span className="text-red-600">{order.fee}</span></span>
            <span className="text-gray-500">You receive: <span className="font-bold text-green-600">{order.netAmount}</span></span>
          </div>

          {/* Deadline */}
          {order.deadline && (order.status === "pending" || order.status === "processing") && (
            <div className="flex items-center gap-1 text-sm text-red-600 mb-3">
              <Clock className="h-4 w-4" />
              <span>Deliver within: {order.deadline}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message Buyer
        </Button>
        {order.status === "pending" && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Package className="h-4 w-4 mr-2" />
            Start Delivery
          </Button>
        )}
        {order.status === "processing" && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Truck className="h-4 w-4 mr-2" />
            Mark Delivered
          </Button>
        )}
        {order.status === "delivered" && (
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        {order.status === "disputed" && (
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Respond to Dispute
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter ||
      (statusFilter === "completed" && (order.status === "completed" || order.status === "delivered"));
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed" || o.status === "delivered").length,
    revenue: "₦294,000",
  };

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
          <p className="text-2xl font-bold text-green-600">{stats.revenue}</p>
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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

