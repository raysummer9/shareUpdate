"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Clock, FileText, CheckCircle, XCircle, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "completed" | "cancelled";

interface Request {
  id: string;
  title: string;
  description: string;
  budget: string;
  status: "Active" | "Completed" | "Cancelled";
  bids: number;
  createdAt: string;
  deadline?: string;
  category: string;
}

const requests: Request[] = [
  {
    id: "1",
    title: "Need 12K Instagram Account",
    description: "Fashion or lifestyle niche preferred. Looking for high engagement and active followers.",
    budget: "₦40,000 - ₦60,000",
    status: "Active",
    bids: 5,
    createdAt: "2 days ago",
    deadline: "5 days left",
    category: "Social Media",
  },
  {
    id: "2",
    title: "Website Development Needed",
    description: "E-commerce site with payment integration. Need responsive design and admin panel.",
    budget: "₦100,000 - ₦150,000",
    status: "Active",
    bids: 3,
    createdAt: "1 day ago",
    deadline: "7 days left",
    category: "Web Development",
  },
  {
    id: "3",
    title: "YouTube Channel - Gaming",
    description: "Minimum 20K subscribers required. Monetization enabled preferred.",
    budget: "₦80,000 - ₦120,000",
    status: "Completed",
    bids: 8,
    createdAt: "5 days ago",
    category: "Social Media",
  },
  {
    id: "4",
    title: "Logo Design for Startup",
    description: "Modern, minimalist logo for tech startup. Need source files.",
    budget: "₦15,000 - ₦25,000",
    status: "Cancelled",
    bids: 12,
    createdAt: "1 week ago",
    category: "Design",
  },
];

const statusColors: Record<Request["status"], string> = {
  "Active": "bg-green-100 text-green-700",
  "Completed": "bg-blue-100 text-blue-700",
  "Cancelled": "bg-red-100 text-red-700",
};

const statusIcons: Record<Request["status"], React.ElementType> = {
  "Active": Clock,
  "Completed": CheckCircle,
  "Cancelled": XCircle,
};

function RequestCard({ request }: { request: Request }) {
  const StatusIcon = statusIcons[request.status];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{request.category}</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1", statusColors[request.status])}>
              <StatusIcon className="h-3 w-3" />
              {request.status}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {request.status === "Active" && (
            <>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{request.description}</p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-900">Budget: {request.budget}</span>
        <span className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          {request.bids} Bids
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {request.createdAt}
        </span>
        {request.deadline && (
          <span className="text-red-600 font-medium">{request.deadline}</span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
        {request.status === "Active" ? (
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Eye className="h-4 w-4 mr-2" />
            View Bids ({request.bids})
          </Button>
        ) : request.status === "Completed" ? (
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Cancelled
          </Button>
        )}
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: requests.length,
    active: requests.filter((r) => r.status === "Active").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    totalBids: requests.reduce((acc, r) => acc + r.bids, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-1">Manage your product and service requests</p>
        </div>
        <Link href="/buyer/post-request">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Post New Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Requests</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Bids Received</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
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
          {(["all", "active", "completed", "cancelled"] as StatusFilter[]).map((status) => (
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 mb-4">No requests found</p>
            <Link href="/buyer/post-request">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Request
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

