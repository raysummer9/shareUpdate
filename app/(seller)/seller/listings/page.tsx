"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Eye, Edit, Trash2, MoreVertical, Star, Package, CheckCircle, Clock, XCircle, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ListingStatus = "active" | "pending" | "draft" | "sold" | "paused";
type StatusFilter = "all" | "active" | "pending" | "draft" | "sold";
type ListingType = "product" | "service";

interface Listing {
  id: string;
  title: string;
  image: string;
  type: ListingType;
  category: string;
  price: string;
  status: ListingStatus;
  views: number;
  inquiries: number;
  sales: number;
  rating?: number;
  reviews?: number;
  createdAt: string;
}

const listings: Listing[] = [
  {
    id: "1",
    title: "Instagram Account - Fashion Niche",
    image: "/placeholder-image.png",
    type: "product",
    category: "Social Media",
    price: "₦45,000",
    status: "active",
    views: 1234,
    inquiries: 15,
    sales: 3,
    rating: 4.8,
    reviews: 12,
    createdAt: "Jan 10, 2024",
  },
  {
    id: "2",
    title: "YouTube Channel - Tech Reviews",
    image: "/placeholder-image.png",
    type: "product",
    category: "Social Media",
    price: "₦120,000",
    status: "active",
    views: 856,
    inquiries: 8,
    sales: 1,
    rating: 5.0,
    reviews: 5,
    createdAt: "Jan 8, 2024",
  },
  {
    id: "3",
    title: "Website Development Service",
    image: "/placeholder-image.png",
    type: "service",
    category: "Web Development",
    price: "₦75,000",
    status: "pending",
    views: 0,
    inquiries: 0,
    sales: 0,
    createdAt: "Jan 15, 2024",
  },
  {
    id: "4",
    title: "TikTok Account - Comedy Content",
    image: "/placeholder-image.png",
    type: "product",
    category: "Social Media",
    price: "₦85,000",
    status: "sold",
    views: 2156,
    inquiries: 25,
    sales: 1,
    rating: 4.5,
    reviews: 1,
    createdAt: "Jan 5, 2024",
  },
  {
    id: "5",
    title: "Logo Design Package",
    image: "/placeholder-image.png",
    type: "service",
    category: "Design",
    price: "₦25,000",
    status: "draft",
    views: 0,
    inquiries: 0,
    sales: 0,
    createdAt: "Jan 14, 2024",
  },
  {
    id: "6",
    title: "Twitter Account - Crypto News",
    image: "/placeholder-image.png",
    type: "product",
    category: "Social Media",
    price: "₦35,000",
    status: "paused",
    views: 567,
    inquiries: 4,
    sales: 2,
    rating: 4.2,
    reviews: 8,
    createdAt: "Dec 28, 2023",
  },
];

const statusConfig: Record<ListingStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  active: { label: "Active", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  pending: { label: "Pending Review", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  draft: { label: "Draft", icon: Edit, color: "text-gray-600", bg: "bg-gray-100" },
  sold: { label: "Sold", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  paused: { label: "Paused", icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
};

function ListingCard({ listing }: { listing: Listing }) {
  const status = statusConfig[listing.status];
  const StatusIcon = status.icon;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <div className="w-full h-40 sm:h-48 bg-gray-100">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <span className={cn("absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", status.bg, status.color)}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </span>
        <span className={cn(
          "absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium",
          listing.type === "product" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        )}>
          {listing.type === "product" ? "Product" : "Service"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{listing.title}</h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View
                </button>
                <button className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">{listing.category}</p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-red-600">{listing.price}</p>
          {listing.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{listing.rating}</span>
              <span className="text-xs text-gray-500">({listing.reviews})</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {listing.views.toLocaleString()} views
          </span>
          <span>{listing.inquiries} inquiries</span>
          <span>{listing.sales} sales</span>
        </div>
      </div>
    </div>
  );
}

export default function SellerListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ListingType>("all");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesType = typeFilter === "all" || listing.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    totalViews: listings.reduce((acc, l) => acc + l.views, 0),
    totalSales: listings.reduce((acc, l) => acc + l.sales, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600 mt-1">Manage your products and services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/list-product">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-500">Total Listings</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-sm text-gray-500">Active</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-500">Total Views</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.totalSales}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | ListingType)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="product">Products</option>
            <option value="service">Services</option>
          </select>
          {(["all", "active", "pending", "draft", "sold"] as StatusFilter[]).map((status) => (
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

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No listings found</p>
            <Link href="/seller/list-product">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

