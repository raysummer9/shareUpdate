"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, ShoppingCart, Trash2, Star, TrendingDown, Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useWishlist, useWishlistMutations, usePriceAlerts } from "@/lib/hooks/use-wishlist";
import { WishlistItemWithListing } from "@/lib/hooks/use-wishlist";

interface WishlistCardProps {
  item: WishlistItemWithListing;
  onRemove: (id: string) => void;
  onToggleAlert: (id: string, currentState: boolean) => void;
  formatCurrency: (amount: number) => string;
}

function WishlistCard({ item, onRemove, onToggleAlert, formatCurrency }: WishlistCardProps) {
  const listing = item.listing;
  if (!listing) return null;

  const inStock = listing.status === "active" && (listing.stock === null || listing.stock > 0);
  const timeAgo = new Date(item.created_at!).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <Link 
          href={`/product/${listing.slug || listing.id}`} 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative"
        >
          <Image
            src={listing.images?.[0] || "/placeholder-image.png"}
            alt={listing.title}
            fill
            className="object-cover"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium px-2 py-1 bg-red-600 rounded">Out of Stock</span>
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${listing.slug || listing.id}`}>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-red-600 transition-colors">
                {listing.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onToggleAlert(item.id, item.price_alert || false)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  item.price_alert ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )}
                title={item.price_alert ? "Price alert enabled" : "Enable price alert"}
              >
                {item.price_alert ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {listing.platform || listing.type}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3 w-3",
                    star <= Math.floor(listing.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({listing.review_count || 0})</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {listing.seller?.full_name || listing.seller?.username || "Seller"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-red-600">{formatCurrency(listing.price)}</p>
            </div>
            <Link href={`/product/${listing.slug || listing.id}`}>
              <Button
                size="sm"
                className={cn(
                  "h-8 text-xs",
                  inStock
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                )}
                disabled={!inStock}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {inStock ? "Buy Now" : "Sold Out"}
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-2">Added {timeAgo}</p>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { user, loading: authLoading } = useAuth();
  const { items, loading: wishlistLoading, refetch } = useWishlist(user?.id ?? null);
  const { alerts } = usePriceAlerts(user?.id ?? null);
  const { removeFromWishlist, updatePriceAlert, loading: mutationLoading } = useWishlistMutations();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemove = async (id: string) => {
    const success = await removeFromWishlist(id);
    if (success) {
      refetch();
    }
  };

  const handleToggleAlert = async (id: string, currentState: boolean) => {
    const success = await updatePriceAlert(id, !currentState);
    if (success) {
      refetch();
    }
  };

  const filteredItems = items.filter((item) =>
    (item.listing?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priceDrops = alerts.length;
  const alertsEnabled = items.filter((item) => item.price_alert).length;
  const inStockCount = items.filter((item) => 
    item.listing?.status === "active" && (item.listing?.stock === null || (item.listing?.stock || 0) > 0)
  ).length;

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-1">Save items you love and get notified of price drops</p>
        </div>
        <Link href="/browse">
          <Button variant="outline">
            Browse More Products
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-5 w-5 text-red-500" />
            <p className="text-sm text-gray-500">Saved Items</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-5 w-5 text-green-500" />
            <p className="text-sm text-gray-500">Price Drops</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{priceDrops}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-gray-500">Alerts Enabled</p>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{alertsEnabled}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-500">In Stock</p>
          </div>
          <p className="text-2xl font-bold text-blue-600">{inStockCount}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search wishlist..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {wishlistLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2">Loading wishlist...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onToggleAlert={handleToggleAlert}
              formatCurrency={formatCurrency}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <Link href="/browse">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Start Browsing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
