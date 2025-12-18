"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Shield, MessageSquare, CheckCircle, AlertTriangle, XCircle, Truck, Timer, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TradeStatus = "awaiting_action" | "buyer_reviewing" | "completed" | "disputed";
type StatusFilter = "all" | "active" | "completed" | "disputed";

interface Trade {
  id: string;
  title: string;
  image: string;
  price: string;
  fee: string;
  netAmount: string;
  buyer: {
    name: string;
    avatar: string;
  };
  status: TradeStatus;
  startedAt: string;
  deadline?: string;
  progress: number;
  actionRequired?: string;
}

const trades: Trade[] = [
  {
    id: "1",
    title: "Instagram Account - Fashion Niche",
    image: "/placeholder-image.png",
    price: "₦45,000",
    fee: "₦4,500",
    netAmount: "₦40,500",
    buyer: { name: "Michael Chen", avatar: "/placeholder-image.png" },
    status: "awaiting_action",
    startedAt: "Jan 15, 2024",
    deadline: "18 hours left",
    progress: 20,
    actionRequired: "Deliver the account credentials",
  },
  {
    id: "2",
    title: "YouTube Channel - Tech Reviews",
    image: "/placeholder-image.png",
    price: "₦120,000",
    fee: "₦12,000",
    netAmount: "₦108,000",
    buyer: { name: "Sarah Johnson", avatar: "/placeholder-image.png" },
    status: "buyer_reviewing",
    startedAt: "Jan 14, 2024",
    progress: 80,
  },
  {
    id: "3",
    title: "Website Development Service",
    image: "/placeholder-image.png",
    price: "₦75,000",
    fee: "₦7,500",
    netAmount: "₦67,500",
    buyer: { name: "David Williams", avatar: "/placeholder-image.png" },
    status: "completed",
    startedAt: "Jan 10, 2024",
    progress: 100,
  },
  {
    id: "4",
    title: "TikTok Account - Comedy",
    image: "/placeholder-image.png",
    price: "₦85,000",
    fee: "₦8,500",
    netAmount: "₦76,500",
    buyer: { name: "Emily Brown", avatar: "/placeholder-image.png" },
    status: "disputed",
    startedAt: "Jan 8, 2024",
    progress: 50,
    actionRequired: "Respond to buyer's dispute claim",
  },
];

const statusConfig: Record<TradeStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  awaiting_action: { label: "Action Required", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  buyer_reviewing: { label: "Buyer Reviewing", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  disputed: { label: "Disputed", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
};

function TradeCard({ trade }: { trade: Trade }) {
  const status = statusConfig[trade.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      {/* Action Required Banner */}
      {trade.actionRequired && (trade.status === "awaiting_action" || trade.status === "disputed") && (
        <div className={cn(
          "mb-4 px-4 py-2 rounded-lg flex items-center gap-2 text-sm",
          trade.status === "disputed" ? "bg-red-50 text-red-700" : "bg-yellow-50 text-yellow-700"
        )}>
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">{trade.actionRequired}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={trade.image}
            alt={trade.title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{trade.title}</h3>
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0", status.bg, status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>

          {/* Buyer Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={trade.buyer.avatar}
              alt={trade.buyer.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">Buyer: {trade.buyer.name}</span>
          </div>

          {/* Progress Bar */}
          {trade.status !== "completed" && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{trade.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    trade.status === "disputed" ? "bg-red-500" :
                    trade.progress < 50 ? "bg-yellow-500" : trade.progress < 80 ? "bg-blue-500" : "bg-green-500"
                  )}
                  style={{ width: `${trade.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-gray-500">Sale: <span className="font-semibold text-gray-900">{trade.price}</span></span>
            <span className="text-gray-500">Fee: <span className="text-red-600">{trade.fee}</span></span>
            <span className="text-gray-500">You'll receive: <span className="font-bold text-green-600">{trade.netAmount}</span></span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              Started: {trade.startedAt}
            </span>
            {trade.deadline && (
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <Clock className="h-4 w-4" />
                {trade.deadline}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Message Buyer
        </Button>
        {trade.status === "awaiting_action" && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Truck className="h-4 w-4 mr-2" />
            Deliver Now
          </Button>
        )}
        {trade.status === "buyer_reviewing" && (
          <Button size="sm" variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Waiting for Buyer
          </Button>
        )}
        {trade.status === "completed" && (
          <Button size="sm" variant="outline">
            View Receipt
          </Button>
        )}
        {trade.status === "disputed" && (
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Respond to Dispute
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SellerTradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (trade.status === "awaiting_action" || trade.status === "buyer_reviewing")) ||
      (statusFilter === "completed" && trade.status === "completed") ||
      (statusFilter === "disputed" && trade.status === "disputed");
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: trades.filter((t) => t.status === "awaiting_action" || t.status === "buyer_reviewing").length,
    completed: trades.filter((t) => t.status === "completed").length,
    disputed: trades.filter((t) => t.status === "disputed").length,
    pendingEarnings: "₦148,500",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Active Trades</h1>
        <p className="text-gray-600 mt-1">Monitor and manage your ongoing transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-5 w-5 text-green-500" />
            <p className="text-sm text-gray-500">Pending Earnings</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.pendingEarnings}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Active Trades</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Disputed</p>
          <p className="text-2xl font-bold text-red-600">{stats.disputed}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800">Escrow Protection</p>
          <p className="text-sm text-blue-700">Buyer's payment is held in escrow until they confirm delivery. Complete deliveries on time to maintain your seller rating!</p>
        </div>
      </div>

      {/* Urgent Action Alert */}
      {stats.active > 0 && trades.some(t => t.status === "awaiting_action" && t.deadline) && (
        <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Delivery Required</p>
            <p className="text-sm text-yellow-700">You have trades awaiting delivery. Complete them before the deadline to avoid penalties.</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search trades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["all", "active", "completed", "disputed"] as StatusFilter[]).map((status) => (
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

      {/* Trades List */}
      <div className="space-y-4">
        {filteredTrades.length > 0 ? (
          filteredTrades.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No trades found</p>
          </div>
        )}
      </div>
    </div>
  );
}

