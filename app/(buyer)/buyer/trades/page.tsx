"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, Shield, MessageSquare, CheckCircle, AlertTriangle, XCircle, Eye, Timer, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TradeStatus = "awaiting_delivery" | "in_review" | "completed" | "disputed";
type StatusFilter = "all" | "active" | "completed" | "disputed";

interface Trade {
  id: string;
  title: string;
  image: string;
  price: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
  };
  status: TradeStatus;
  escrowAmount: string;
  startedAt: string;
  deadline?: string;
  progress: number;
}

const trades: Trade[] = [
  {
    id: "1",
    title: "Website Development - E-commerce",
    image: "/placeholder-image.png",
    price: "₦75,000",
    seller: {
      name: "WebDev Solutions",
      avatar: "/placeholder-image.png",
      rating: 4.9,
    },
    status: "awaiting_delivery",
    escrowAmount: "₦82,500",
    startedAt: "Jan 13, 2024",
    deadline: "3 days left",
    progress: 60,
  },
  {
    id: "2",
    title: "Instagram Account Transfer - 25K",
    image: "/placeholder-image.png",
    price: "₦45,000",
    seller: {
      name: "Digital Assets Pro",
      avatar: "/placeholder-image.png",
      rating: 4.8,
    },
    status: "in_review",
    escrowAmount: "₦49,500",
    startedAt: "Jan 14, 2024",
    progress: 90,
  },
  {
    id: "3",
    title: "Logo Design Package",
    image: "/placeholder-image.png",
    price: "₦25,000",
    seller: {
      name: "DesignPro Studio",
      avatar: "/placeholder-image.png",
      rating: 4.7,
    },
    status: "completed",
    escrowAmount: "₦27,500",
    startedAt: "Jan 10, 2024",
    progress: 100,
  },
  {
    id: "4",
    title: "YouTube Channel - 10K Subs",
    image: "/placeholder-image.png",
    price: "₦60,000",
    seller: {
      name: "TechChannel Store",
      avatar: "/placeholder-image.png",
      rating: 4.5,
    },
    status: "disputed",
    escrowAmount: "₦66,000",
    startedAt: "Jan 8, 2024",
    progress: 45,
  },
];

const statusConfig: Record<TradeStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  awaiting_delivery: { label: "Awaiting Delivery", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  in_review: { label: "In Review", icon: Eye, color: "text-blue-600", bg: "bg-blue-100" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  disputed: { label: "Disputed", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
};

function TradeCard({ trade }: { trade: Trade }) {
  const status = statusConfig[trade.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
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

          {/* Seller Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={trade.seller.avatar}
              alt={trade.seller.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">{trade.seller.name}</span>
            <span className="text-xs text-gray-400">• ⭐ {trade.seller.rating}</span>
          </div>

          {/* Progress Bar */}
          {trade.status !== "completed" && trade.status !== "disputed" && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{trade.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    trade.progress < 50 ? "bg-yellow-500" : trade.progress < 80 ? "bg-blue-500" : "bg-green-500"
                  )}
                  style={{ width: `${trade.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Trade Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Escrow: <span className="font-semibold text-gray-900">{trade.escrowAmount}</span>
            </span>
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
          Message Seller
        </Button>
        {trade.status === "awaiting_delivery" && (
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        )}
        {trade.status === "in_review" && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirm Delivery
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
            View Dispute
          </Button>
        )}
      </div>
    </div>
  );
}

export default function TradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch = trade.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && (trade.status === "awaiting_delivery" || trade.status === "in_review")) ||
      (statusFilter === "completed" && trade.status === "completed") ||
      (statusFilter === "disputed" && trade.status === "disputed");
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: trades.length,
    active: trades.filter((t) => t.status === "awaiting_delivery" || t.status === "in_review").length,
    completed: trades.filter((t) => t.status === "completed").length,
    disputed: trades.filter((t) => t.status === "disputed").length,
    totalEscrow: "₦131,000",
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
            <Shield className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-500">Total in Escrow</p>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalEscrow}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Active</p>
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
          <p className="font-semibold text-blue-800">Your funds are protected</p>
          <p className="text-sm text-blue-700">Escrow holds your payment until you confirm delivery. Only release payment when you're satisfied.</p>
        </div>
      </div>

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
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No trades found</p>
            <Link href="/browse">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

