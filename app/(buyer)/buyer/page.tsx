"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Wallet,
  ShoppingBag,
  FileText,
  Heart,
  ArrowRight,
  Search,
  PlusCircle,
  CreditCard,
  Star,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { useOrders, useOrderStats } from "@/lib/hooks/use-orders";
import { useMyRequests } from "@/lib/hooks/use-requests";
import { useListings } from "@/lib/hooks/use-listings";
import { useWishlist, useWishlistCount } from "@/lib/hooks/use-wishlist";

// Stats Card Component
function StatsCard({
  icon: Icon,
  iconBg,
  label,
  value,
  subtext,
  badge,
  badgeColor,
  isHighlighted,
}: {
  icon: React.ElementType;
  iconBg: string;
  label: string;
  value: string;
  subtext?: string;
  badge?: string;
  badgeColor?: string;
  isHighlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${
        isHighlighted
          ? "bg-gradient-to-br from-red-500 to-red-600 text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${isHighlighted ? "bg-white/20" : iconBg}`}>
          <Icon className={`h-5 w-5 ${isHighlighted ? "text-white" : "text-white"}`} />
        </div>
        {badge && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className={`text-xs sm:text-sm ${isHighlighted ? "text-white/80" : "text-gray-500"}`}>
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-bold ${isHighlighted ? "text-white" : "text-gray-900"}`}>
        {value}
      </p>
      {subtext && (
        <p className={`text-xs mt-1 ${isHighlighted ? "text-white/80" : "text-gray-500"}`}>
          {subtext}
        </p>
      )}
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon: Icon,
  title,
  subtitle,
  bgColor,
  href,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  bgColor: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`${bgColor} rounded-xl p-4 flex items-center gap-3 hover:opacity-90 transition-opacity`}
    >
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-white/80">{subtitle}</p>
      </div>
    </Link>
  );
}

// Purchase Item Component
function PurchaseItem({
  image,
  title,
  subtitle,
  price,
  status,
  statusColor,
  date,
  action,
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  status: string;
  statusColor: string;
  date: string;
  action?: { label: string; color: string; variant?: "button" | "stars" };
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
            {status}
          </span>
          <span className="text-xs text-gray-500">{date}</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{price}</p>
        {action && action.variant === "stars" ? (
          <div className="flex gap-0.5 mt-1 justify-end">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        ) : action && action.variant === "button" ? (
          <Button size="sm" className={`mt-1 h-7 text-xs ${action.color}`}>
            {action.label}
          </Button>
        ) : action ? (
          <button className={`text-xs font-medium ${action.color} mt-1`}>
            {action.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}

// Wishlist Item Component
function WishlistItem({
  image,
  title,
  subtitle,
  price,
  discount,
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  discount?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-red-600">{price}</p>
          {discount && (
            <span className="text-xs text-green-600">{discount}</span>
          )}
        </div>
        <Heart className="h-4 w-4 text-red-500 fill-red-500 ml-auto mt-1" />
      </div>
    </div>
  );
}

// Request Item Component
function RequestItem({
  title,
  subtitle,
  status,
  statusColor,
  bids,
  time,
  isCompleted,
  isPurchased,
}: {
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  bids?: number;
  time: string;
  isCompleted?: boolean;
  isPurchased?: boolean;
}) {
  return (
    <div className="py-4 border border-gray-100 rounded-lg px-4 mb-3 last:mb-0">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {isPurchased ? (
            <span className="flex items-center gap-1 text-green-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Purchased
            </span>
          ) : bids !== undefined ? (
            <span className="flex items-center gap-1 text-red-500">
              <FileText className="h-3.5 w-3.5" />
              {bids} Bids
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {time}
          </span>
        </div>
        {isCompleted ? (
          <Button size="sm" className="h-8 text-xs bg-gray-700 hover:bg-gray-800 text-white px-4">
            View Details
          </Button>
        ) : (
          <Button size="sm" className="h-8 text-xs bg-red-600 hover:bg-red-700 text-white px-4">
            View Bids
          </Button>
        )}
      </div>
    </div>
  );
}

// Recommended Item Component
function RecommendedItem({
  image,
  title,
  subtitle,
  price,
  rating,
  reviews,
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  rating: number;
  reviews: number;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={title}
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{price}</p>
        <Button size="sm" className="mt-1 h-7 text-xs bg-green-500 hover:bg-green-600 text-white">
          View
        </Button>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  const { user, profile, wallet, loading: authLoading } = useAuth();
  const { stats: orderStats } = useOrderStats(user?.id ?? null, "buyer");
  const { orders, loading: ordersLoading } = useOrders({ buyer_id: user?.id ?? undefined, limit: 4 });
  const { requests, loading: requestsLoading } = useMyRequests(user?.id ?? null);
  const { listings: recommended, loading: recommendedLoading } = useListings({ status: "active", limit: 3 });
  const { items: wishlistItems, loading: wishlistLoading } = useWishlist(user?.id ?? null);
  const { count: wishlistCount } = useWishlistCount(user?.id ?? null);

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

  // Show loading state only for initial auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || profile?.username || "Buyer";
  const availableBalance = wallet?.available_balance || 0;
  const activeRequests = requests?.filter(r => r.status === "active") || [];
  const totalBids = activeRequests.reduce((sum, r) => sum + (r.bid_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your recent activity and purchases.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Wallet}
          iconBg="bg-red-500"
          label="Wallet Balance"
          value={formatCurrency(availableBalance)}
          subtext="Available for purchases"
          isHighlighted={true}
          badge="↑"
          badgeColor="bg-white/20 text-white"
        />
        <StatsCard
          icon={ShoppingBag}
          iconBg="bg-green-500"
          label="Total Purchases"
          value={String(profile?.total_purchases || 0)}
          subtext={`${orderStats.pending + orderStats.processing} pending`}
          badge={orderStats.pending > 0 ? `+${orderStats.pending}` : undefined}
          badgeColor="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={FileText}
          iconBg="bg-blue-500"
          label="Active Requests"
          value={String(activeRequests.length)}
          subtext={`${totalBids} bids received`}
          badge={activeRequests.length > 0 ? "Active" : undefined}
          badgeColor="bg-green-100 text-green-700"
        />
        <StatsCard
          icon={Heart}
          iconBg="bg-pink-500"
          label="Wishlist Items"
          value={String(wishlistCount)}
          subtext="Save items for later"
          badge={wishlistCount > 0 ? "View" : undefined}
          badgeColor="bg-red-100 text-red-700"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Purchases */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Purchases</h2>
              <Link
                href="/buyer/purchases"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div>
              {ordersLoading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                </div>
              ) : orders.length > 0 ? (
                orders.map((order) => {
                  const statusConfig: Record<string, { color: string; label: string }> = {
                    pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
                    paid: { color: "bg-blue-100 text-blue-700", label: "In Escrow" },
                    processing: { color: "bg-yellow-100 text-yellow-700", label: "Processing" },
                    delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
                    completed: { color: "bg-green-100 text-green-700", label: "Completed" },
                    cancelled: { color: "bg-gray-100 text-gray-700", label: "Cancelled" },
                    disputed: { color: "bg-red-100 text-red-700", label: "Disputed" },
                  };
                  const status = statusConfig[order.status || "pending"] || statusConfig.pending;
                  const action = order.status === "delivered" 
                    ? { label: "★ Rate", color: "bg-yellow-500 hover:bg-yellow-600 text-white", variant: "button" as const }
                    : order.status === "paid" || order.status === "processing"
                    ? { label: "Track", color: "bg-gray-100 hover:bg-gray-200 text-gray-700", variant: "button" as const }
                    : undefined;
                  
                  return (
                    <PurchaseItem
                      key={order.id}
                      image={order.listing?.images?.[0] || "/placeholder-image.png"}
                      title={order.listing?.title || "Order"}
                      subtitle={`Order ${order.order_number}`}
                      price={formatCurrency(order.total_amount)}
                      status={status.label}
                      statusColor={status.color}
                      date={formatDate(order.created_at!)}
                      action={action}
                    />
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 text-sm mb-3">No purchases yet</p>
                  <Link href="/browse">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Search className="h-4 w-4 mr-1" /> Browse Products
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Wishlist */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickActionButton
                icon={Search}
                title="Browse Products"
                subtitle="Find what you need"
                bgColor="bg-red-500"
                href="/browse"
              />
              <QuickActionButton
                icon={PlusCircle}
                title="Post Request"
                subtitle="Get custom offers"
                bgColor="bg-gray-800"
                href="/buyer/post-request"
              />
              <QuickActionButton
                icon={CreditCard}
                title="Add Funds"
                subtitle="Top up your wallet"
                bgColor="bg-green-500"
                href="/buyer/wallet/add"
              />
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Wishlist</h2>
              <Link
                href="/buyer/wishlist"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View All
              </Link>
            </div>
            <div>
              {wishlistLoading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                </div>
              ) : wishlistItems.length > 0 ? (
                wishlistItems.slice(0, 3).map((item) => (
                  <WishlistItem
                    key={item.id}
                    image={item.listing?.images?.[0] || "/placeholder-image.png"}
                    title={item.listing?.title || "Item"}
                    subtitle={item.listing?.platform || item.listing?.type || ""}
                    price={formatCurrency(item.listing?.price || 0)}
                  />
                ))
              ) : (
                <div className="py-6 text-center">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-3">No saved items</p>
                  <Link href="/browse">
                    <Button size="sm" variant="outline">
                      Browse Products
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Requests & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Requests */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Requests</h2>
            <Link
              href="/buyer/requests"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              View All
            </Link>
          </div>
          <div>
            {requestsLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
              </div>
            ) : requests.length > 0 ? (
              requests.slice(0, 3).map((request) => {
                const statusConfig: Record<string, { color: string }> = {
                  active: { color: "bg-green-100 text-green-700" },
                  completed: { color: "bg-gray-100 text-gray-600" },
                  cancelled: { color: "bg-red-100 text-red-600" },
                  expired: { color: "bg-gray-100 text-gray-500" },
                };
                const requestStatus = request.status || "active";
                const statusStyle = statusConfig[requestStatus] || statusConfig.active;
                const timeAgo = new Date(request.created_at!).toLocaleDateString();
                
                return (
                  <RequestItem
                    key={request.id}
                    title={request.title}
                    subtitle={`Budget: ${formatCurrency(request.budget_min)} - ${formatCurrency(request.budget_max)}`}
                    status={requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1)}
                    statusColor={statusStyle.color}
                    bids={request.bid_count || 0}
                    time={timeAgo}
                    isCompleted={requestStatus === "completed"}
                    isPurchased={requestStatus === "completed"}
                  />
                );
              })
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No requests yet</p>
                <Link href="/buyer/post-request">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <PlusCircle className="h-4 w-4 mr-1" /> Post Request
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recommended for You */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            <Link href="/browse" className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              <RefreshCcw className="h-4 w-4" />
              View All
            </Link>
          </div>
          <div>
            {recommendedLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
              </div>
            ) : recommended.length > 0 ? (
              recommended.map((listing) => (
                <RecommendedItem
                  key={listing.id}
                  image={listing.images?.[0] || "/placeholder-image.png"}
                  title={listing.title}
                  subtitle={listing.platform || listing.type}
                  price={formatCurrency(listing.price)}
                  rating={listing.rating || 0}
                  reviews={listing.review_count || 0}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No listings available</p>
                <Link href="/browse">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Search className="h-4 w-4 mr-1" /> Browse All
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

