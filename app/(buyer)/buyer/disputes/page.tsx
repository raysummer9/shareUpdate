"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, AlertTriangle, Clock, CheckCircle, XCircle, MessageSquare, FileText, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DisputeStatus = "open" | "under_review" | "resolved" | "closed";
type StatusFilter = "all" | "open" | "under_review" | "resolved" | "closed";

interface Dispute {
  id: string;
  orderTitle: string;
  orderImage: string;
  sellerName: string;
  sellerAvatar: string;
  amount: string;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  lastUpdate: string;
  resolution?: string;
  messages: number;
}

const disputes: Dispute[] = [
  {
    id: "DSP-001",
    orderTitle: "YouTube Channel - 10K Subs",
    orderImage: "/placeholder-image.png",
    sellerName: "TechChannel Store",
    sellerAvatar: "/placeholder-image.png",
    amount: "₦60,000",
    reason: "Product not as described - Subscriber count lower than advertised",
    status: "open",
    createdAt: "Jan 14, 2024",
    lastUpdate: "2 hours ago",
    messages: 5,
  },
  {
    id: "DSP-002",
    orderTitle: "Instagram Account - Fitness",
    orderImage: "/placeholder-image.png",
    sellerName: "FitAccounts",
    sellerAvatar: "/placeholder-image.png",
    amount: "₦35,000",
    reason: "Account credentials not working after transfer",
    status: "under_review",
    createdAt: "Jan 10, 2024",
    lastUpdate: "1 day ago",
    messages: 12,
  },
  {
    id: "DSP-003",
    orderTitle: "Logo Design Service",
    orderImage: "/placeholder-image.png",
    sellerName: "DesignPro Studio",
    sellerAvatar: "/placeholder-image.png",
    amount: "₦25,000",
    reason: "Delivery delayed beyond agreed timeline",
    status: "resolved",
    createdAt: "Jan 5, 2024",
    lastUpdate: "Jan 8, 2024",
    resolution: "Partial refund of ₦10,000 issued to buyer",
    messages: 8,
  },
  {
    id: "DSP-004",
    orderTitle: "Twitter Account - News",
    orderImage: "/placeholder-image.png",
    sellerName: "SocialMedia Vendor",
    sellerAvatar: "/placeholder-image.png",
    amount: "₦28,000",
    reason: "Account got suspended after purchase",
    status: "closed",
    createdAt: "Dec 28, 2023",
    lastUpdate: "Jan 2, 2024",
    resolution: "Full refund issued to buyer. Seller account suspended.",
    messages: 15,
  },
];

const statusConfig: Record<DisputeStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  open: { label: "Open", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
  under_review: { label: "Under Review", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  closed: { label: "Closed", icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
};

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const status = statusConfig[dispute.status];
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={dispute.orderImage}
            alt={dispute.orderTitle}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-gray-500">{dispute.id}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1", status.bg, status.color)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{dispute.orderTitle}</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">{dispute.amount}</p>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={dispute.sellerAvatar}
              alt={dispute.sellerName}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">Against: {dispute.sellerName}</span>
          </div>

          {/* Reason */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700">{dispute.reason}</p>
          </div>

          {/* Resolution (if any) */}
          {dispute.resolution && (
            <div className={cn(
              "rounded-lg p-3 mb-3",
              dispute.status === "resolved" ? "bg-green-50 border border-green-200" : "bg-gray-50"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Resolution</span>
              </div>
              <p className="text-sm text-green-700">{dispute.resolution}</p>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
            <span>Created: {dispute.createdAt}</span>
            <span>Last update: {dispute.lastUpdate}</span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {dispute.messages} messages
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
        {(dispute.status === "open" || dispute.status === "under_review") && (
          <>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              View Messages
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Add Evidence
            </Button>
          </>
        )}
        {dispute.status === "resolved" && (
          <Button variant="outline" size="sm">
            View Details
          </Button>
        )}
        {dispute.status === "closed" && (
          <Button variant="outline" size="sm" disabled>
            Dispute Closed
          </Button>
        )}
      </div>
    </div>
  );
}

export default function DisputesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch = dispute.orderTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "under_review" && dispute.status === "under_review") ||
      dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: disputes.length,
    open: disputes.filter((d) => d.status === "open").length,
    underReview: disputes.filter((d) => d.status === "under_review").length,
    resolved: disputes.filter((d) => d.status === "resolved" || d.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Disputes</h1>
          <p className="text-gray-600 mt-1">Manage and track your dispute cases</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Open New Dispute
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Disputes</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Under Review</p>
          <p className="text-2xl font-bold text-blue-600">{stats.underReview}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Resolved/Closed</p>
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-blue-800">Buyer Protection</p>
          <p className="text-sm text-blue-700">
            Your funds in escrow are protected until disputes are resolved. Our team reviews all evidence within 48 hours.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search disputes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["all", "open", "under_review", "resolved", "closed"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                statusFilter === status
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {status === "under_review" ? "Under Review" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.length > 0 ? (
          filteredDisputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No disputes found</p>
            <p className="text-sm text-gray-400">You're all clear! No disputes to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}

