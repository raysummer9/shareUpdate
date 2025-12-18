"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Clock, DollarSign, MessageSquare, Send, Eye, CheckCircle, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RequestStatus = "open" | "bid_sent" | "won" | "lost";
type StatusFilter = "all" | "open" | "bid_sent" | "won";

interface BuyerRequest {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  platform?: string;
  buyer: {
    name: string;
    avatar: string;
    rating: number;
    purchases: number;
  };
  deadline: string;
  postedAt: string;
  bidsCount: number;
  status: RequestStatus;
  myBid?: string;
}

const requests: BuyerRequest[] = [
  {
    id: "1",
    title: "Looking for 15K+ Instagram Fashion Account",
    description: "Need an Instagram account in the fashion/lifestyle niche with at least 15K engaged followers. Must have 4%+ engagement rate and clean history.",
    budget: "₦50,000 - ₦70,000",
    category: "Social Media",
    platform: "Instagram",
    buyer: { name: "Michael Chen", avatar: "/placeholder-image.png", rating: 4.8, purchases: 12 },
    deadline: "3 days left",
    postedAt: "2 hours ago",
    bidsCount: 5,
    status: "open",
  },
  {
    id: "2",
    title: "Website Development - E-commerce Store",
    description: "Looking for a developer to build a full e-commerce website with payment integration, admin panel, and responsive design.",
    budget: "₦150,000 - ₦200,000",
    category: "Web Development",
    buyer: { name: "Sarah Johnson", avatar: "/placeholder-image.png", rating: 4.9, purchases: 8 },
    deadline: "7 days left",
    postedAt: "1 day ago",
    bidsCount: 12,
    status: "bid_sent",
    myBid: "₦175,000",
  },
  {
    id: "3",
    title: "YouTube Channel with 10K Subscribers",
    description: "Looking for a monetized YouTube channel in the tech/gaming niche. Must have AdSense enabled and good watch time.",
    budget: "₦80,000 - ₦100,000",
    category: "Social Media",
    platform: "YouTube",
    buyer: { name: "David Williams", avatar: "/placeholder-image.png", rating: 4.5, purchases: 5 },
    deadline: "5 days left",
    postedAt: "3 hours ago",
    bidsCount: 8,
    status: "won",
    myBid: "₦90,000",
  },
  {
    id: "4",
    title: "Logo Design for Tech Startup",
    description: "Need a modern, minimalist logo for a SaaS startup. Must include source files and multiple variations.",
    budget: "₦20,000 - ₦35,000",
    category: "Design",
    buyer: { name: "Emily Brown", avatar: "/placeholder-image.png", rating: 4.7, purchases: 3 },
    deadline: "2 days left",
    postedAt: "5 hours ago",
    bidsCount: 20,
    status: "lost",
  },
  {
    id: "5",
    title: "TikTok Account - Comedy/Entertainment",
    description: "Looking for TikTok account with 50K+ followers in comedy or entertainment niche. Must have viral potential.",
    budget: "₦60,000 - ₦80,000",
    category: "Social Media",
    platform: "TikTok",
    buyer: { name: "James Wilson", avatar: "/placeholder-image.png", rating: 4.6, purchases: 7 },
    deadline: "4 days left",
    postedAt: "6 hours ago",
    bidsCount: 3,
    status: "open",
  },
];

const statusConfig: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-green-600", bg: "bg-green-100" },
  bid_sent: { label: "Bid Sent", color: "text-blue-600", bg: "bg-blue-100" },
  won: { label: "Won", color: "text-purple-600", bg: "bg-purple-100" },
  lost: { label: "Lost", color: "text-gray-600", bg: "bg-gray-100" },
};

function RequestCard({ request }: { request: BuyerRequest }) {
  const status = statusConfig[request.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{request.category}</span>
            {request.platform && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">{request.platform}</span>
            )}
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", status.bg, status.color)}>
              {status.label}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{request.title}</h3>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-green-600">{request.budget}</p>
          <p className="text-xs text-gray-500">Budget</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>

      {/* Buyer Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <Image
          src={request.buyer.avatar}
          alt={request.buyer.name}
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{request.buyer.name}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-0.5">
              ⭐ {request.buyer.rating}
            </span>
            <span>•</span>
            <span>{request.buyer.purchases} purchases</span>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1 text-red-600 font-medium">
          <Clock className="h-4 w-4" />
          {request.deadline}
        </span>
        <span>{request.bidsCount} bids</span>
        <span>Posted {request.postedAt}</span>
      </div>

      {/* My Bid (if sent) */}
      {request.myBid && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Your bid:</span> {request.myBid}
            {request.status === "won" && <span className="ml-2 text-green-600 font-medium">✓ Accepted!</span>}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
        {request.status === "open" && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="h-4 w-4 mr-2" />
            Send Bid
          </Button>
        )}
        {request.status === "bid_sent" && (
          <Button size="sm" variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message Buyer
          </Button>
        )}
        {request.status === "won" && (
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Start Order
          </Button>
        )}
      </div>
    </div>
  );
}

export default function SellerRequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || request.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    open: requests.filter((r) => r.status === "open").length,
    bidsSent: requests.filter((r) => r.status === "bid_sent").length,
    won: requests.filter((r) => r.status === "won").length,
    winRate: "35%",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Buyer Requests</h1>
        <p className="text-gray-600 mt-1">Find and bid on buyer requests that match your offerings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Open Requests</p>
          <p className="text-2xl font-bold text-green-600">{stats.open}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Bids Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.bidsSent}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Won</p>
          <p className="text-2xl font-bold text-purple-600">{stats.won}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Win Rate</p>
          <p className="text-2xl font-bold text-gray-900">{stats.winRate}</p>
        </div>
      </div>

      {/* Tip Banner */}
      <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
        <DollarSign className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800">Pro Tip</p>
          <p className="text-sm text-green-700">Respond quickly to buyer requests - sellers who bid within the first hour have a 3x higher chance of winning!</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Social Media">Social Media</option>
            <option value="Web Development">Web Development</option>
            <option value="Design">Design</option>
          </select>
          {(["all", "open", "bid_sent", "won"] as StatusFilter[]).map((status) => (
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
              {status === "bid_sent" ? "Bid Sent" : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No requests found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

