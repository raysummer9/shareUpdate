"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Eye, Edit, Trash2, MoreVertical, Star, Package, CheckCircle, Clock, XCircle, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useMyListings, useListingMutations } from "@/lib/hooks/use-listings";

type StatusFilter = "all" | "active" | "pending" | "draft" | "sold";
type ListingType = "product" | "service";

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  active: { label: "Active", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
  pending: { label: "Pending Review", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
  draft: { label: "Draft", icon: Edit, color: "text-gray-600", bg: "bg-gray-100" },
  sold: { label: "Sold", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  paused: { label: "Paused", icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
  inactive: { label: "Inactive", icon: XCircle, color: "text-gray-600", bg: "bg-gray-100" },
};

interface ListingCardProps {
  id: string;
  slug: string | null;
  title: string;
  image: string;
  type: string;
  category: string;
  price: number;
  status: string;
  views: number;
  sales: number;
  rating: number | null;
  reviews: number;
  createdAt: string;
  onDelete: (id: string) => void;
  formatCurrency: (amount: number) => string;
}

function ListingCard({
  id,
  slug,
  title,
  image,
  type,
  category,
  price,
  status,
  views,
  sales,
  rating,
  reviews,
  createdAt,
  onDelete,
  formatCurrency,
}: ListingCardProps) {
  const config = statusConfig[status] || statusConfig.active;
  const StatusIcon = config.icon;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Link href={`/product/${slug || id}`} className="block w-full h-40 sm:h-48 bg-gray-100 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </Link>
        <span className={cn("absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1", config.bg, config.color)}>
          <StatusIcon className="h-3 w-3" />
          {config.label}
        </span>
        <span className={cn(
          "absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium",
          type === "product" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
        )}>
          {type === "product" ? "Product" : "Service"}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/product/${slug || id}`}>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 hover:text-red-600">{title}</h3>
          </Link>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <Link href={`/product/${slug || id}`} className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View
                </Link>
                <Link href={`/seller/listings/${id}/edit`} className="w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </Link>
                <button 
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(id);
                  }}
                  className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">{category}</p>

        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-bold text-red-600">{formatCurrency(price)}</p>
          {rating !== null && rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {views.toLocaleString()} views
          </span>
          <span>{sales} sales</span>
        </div>
      </div>
    </div>
  );
}

export default function SellerListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ListingType>("all");

  const { user, loading: authLoading } = useAuth();
  const { listings, loading: listingsLoading, refetch } = useMyListings(user?.id ?? null);
  const { deleteListing, loading: mutationLoading } = useListingMutations();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      const success = await deleteListing(id);
      if (success) refetch();
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesType = typeFilter === "all" || listing.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: listings.length,
    active: listings.filter((l) => l.status === "active").length,
    totalViews: listings.reduce((acc, l) => acc + (l.views || 0), 0),
    totalSales: listings.reduce((acc, l) => acc + (l.sales_count || 0), 0),
  };

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
        {listingsLoading ? (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2">Loading listings...</p>
          </div>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              slug={listing.slug}
              title={listing.title}
              image={listing.images?.[0] || "/placeholder-image.png"}
              type={listing.type}
              category={listing.platform || listing.type}
              price={listing.price}
              status={listing.status || "active"}
              views={listing.views || 0}
              sales={listing.sales_count || 0}
              rating={listing.rating}
              reviews={listing.review_count || 0}
              createdAt={listing.created_at!}
              onDelete={handleDelete}
              formatCurrency={formatCurrency}
            />
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
