"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Star,
  Plus,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  PlusCircle,
  Briefcase,
  FileText,
  Search,
  Crown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";
import { useWallet, useWalletTransactions } from "@/lib/hooks/use-wallet";
import { useOrders, useOrderStats } from "@/lib/hooks/use-orders";
import { useMyListings } from "@/lib/hooks/use-listings";

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

// Wallet Card Component
function WalletCard({
  type,
  symbol,
  balance,
  symbolBg,
}: {
  type: string;
  symbol: string;
  balance: string;
  symbolBg: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 sm:p-5 flex-1">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">{type}</span>
        <span className={`w-8 h-8 rounded-lg ${symbolBg} flex items-center justify-center text-white font-bold text-sm`}>
          {symbol}
        </span>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900">{balance}</p>
      <Link
        href="/seller/wallet"
        className="inline-flex items-center text-sm text-green-600 hover:text-green-700 mt-2 font-medium"
      >
        Withdraw <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  );
}

// Transaction Item Component
function TransactionItem({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  date,
  amount,
  amountColor,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  date: string;
  amount: string;
  amountColor: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <span className={`text-sm font-semibold ${amountColor}`}>{amount}</span>
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

// Order Item Component
function OrderItem({
  image,
  title,
  subtitle,
  price,
  status,
  statusColor,
  date,
  actionLabel,
  actionColor,
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  status: string;
  statusColor: string;
  date: string;
  actionLabel?: string;
  actionColor?: string;
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
        {actionLabel && (
          <button className={`text-xs font-medium ${actionColor} mt-1`}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// Listing Item Component
function ListingItem({
  image,
  title,
  subtitle,
  price,
  views,
}: {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  views: number;
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
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            Active
          </span>
          <span className="text-xs text-gray-500">{views} views</span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-gray-900">{price}</p>
        <button className="text-xs font-medium text-red-600 mt-1">Edit</button>
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { wallet, loading: walletLoading } = useWallet(user?.id ?? null);
  const { transactions, loading: txLoading } = useWalletTransactions(wallet?.id ?? null, { limit: 3 });
  const { stats: orderStats, loading: statsLoading } = useOrderStats(user?.id ?? null, "seller");
  const { orders, loading: ordersLoading } = useOrders({ seller_id: user?.id ?? undefined, limit: 3 });
  const { listings, loading: listingsLoading } = useMyListings(user?.id ?? null);

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

  // Show loading state
  if (authLoading || walletLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const firstName = profile?.full_name?.split(" ")[0] || profile?.username || "Seller";
  const availableBalance = wallet?.available_balance || 0;
  const pendingBalance = wallet?.pending_balance || 0;
  const totalEarned = wallet?.total_earned || 0;
  const activeListings = listings?.filter(l => l.status === "active") || [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Wallet}
          iconBg="bg-red-500"
          label="Total Balance"
          value={formatCurrency(availableBalance)}
          subtext={pendingBalance > 0 ? `${formatCurrency(pendingBalance)} pending` : "Available to withdraw"}
          isHighlighted={true}
          badge="↑"
          badgeColor="bg-white/20 text-white"
        />
        <StatsCard
          icon={ShoppingBag}
          iconBg="bg-blue-500"
          label="Active Orders"
          value={String(orderStats.pending + orderStats.processing)}
          subtext={`${orderStats.pending} awaiting delivery`}
          badge={orderStats.pending > 0 ? `+${orderStats.pending}` : undefined}
          badgeColor="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={TrendingUp}
          iconBg="bg-yellow-500"
          label="Total Sales"
          value={String(profile?.total_sales || 0)}
          subtext={`${formatCurrency(totalEarned)} earned`}
          badge="+8%"
          badgeColor="bg-green-100 text-green-700"
        />
        <StatsCard
          icon={Star}
          iconBg="bg-yellow-500"
          label="Seller Rating"
          value={profile?.rating ? profile.rating.toFixed(1) : "N/A"}
          subtext={`Based on ${profile?.total_reviews || 0} reviews`}
          badge={profile?.seller_level || undefined}
          badgeColor="bg-yellow-100 text-yellow-700"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Wallet & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Overview */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Wallet Overview</h2>
              <Link href="/seller/wallet">
                <Button className="bg-green-500 hover:bg-green-600 text-white text-sm h-9">
                  <Plus className="h-4 w-4 mr-1" /> Withdraw
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <WalletCard
                type="Available Balance"
                symbol="₦"
                balance={formatCurrency(availableBalance)}
                symbolBg="bg-green-500"
              />
              <WalletCard
                type="Pending Balance"
                symbol="₦"
                balance={formatCurrency(pendingBalance)}
                symbolBg="bg-orange-500"
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
              <Link href="/seller/wallet" className="text-sm text-red-600 hover:text-red-700 font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {txLoading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
                </div>
              ) : transactions.length > 0 ? (
                transactions.map((tx) => {
                  const isCredit = tx.amount > 0;
                  const isEscrow = tx.type === "escrow_hold" || tx.type === "escrow_release";
                  return (
                    <TransactionItem
                      key={tx.id}
                      icon={isEscrow ? RefreshCw : isCredit ? ArrowDownLeft : ArrowUpRight}
                      iconBg={isEscrow ? "bg-blue-100" : isCredit ? "bg-green-100" : "bg-red-100"}
                      iconColor={isEscrow ? "text-blue-600" : isCredit ? "text-green-600" : "text-red-600"}
                      title={tx.description || tx.type.replace(/_/g, " ")}
                      date={formatDate(tx.created_at!)}
                      amount={`${isCredit ? "+" : ""}${formatCurrency(tx.amount)}`}
                      amountColor={isEscrow ? "text-gray-900" : isCredit ? "text-green-600" : "text-red-600"}
                    />
                  );
                })
              ) : (
                <p className="py-8 text-center text-gray-500 text-sm">No transactions yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickActionButton
                icon={PlusCircle}
                title="List New Product"
                subtitle="Sell digital products"
                bgColor="bg-red-500"
                href="/seller/list-product"
              />
              <QuickActionButton
                icon={Briefcase}
                title="Offer Service"
                subtitle="Provide your services"
                bgColor="bg-purple-500"
                href="/seller/offer-service"
              />
              <QuickActionButton
                icon={FileText}
                title="View Requests"
                subtitle="Bid on buyer requests"
                bgColor="bg-orange-500"
                href="/seller/requests"
              />
              <QuickActionButton
                icon={Search}
                title="Browse Marketplace"
                subtitle="Find products & services"
                bgColor="bg-green-500"
                href="/browse"
              />
            </div>

            {/* Upgrade Banner */}
            <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upgrade to Premium</p>
                  <p className="text-xs text-gray-500 mt-0.5">Get lower fees and priority support</p>
                  <Link
                    href="/seller/upgrade"
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-700 mt-2 font-medium"
                  >
                    Learn More <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid - Orders & Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link
              href="/seller/orders"
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
                  paid: { color: "bg-blue-100 text-blue-700", label: "Paid" },
                  processing: { color: "bg-yellow-100 text-yellow-700", label: "In Progress" },
                  delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
                  completed: { color: "bg-green-100 text-green-700", label: "Completed" },
                  cancelled: { color: "bg-gray-100 text-gray-700", label: "Cancelled" },
                  disputed: { color: "bg-red-100 text-red-700", label: "Disputed" },
                };
                const status = statusConfig[order.status] || statusConfig.pending;
                return (
                  <OrderItem
                    key={order.id}
                    image={order.listing?.images?.[0] || "/placeholder-image.png"}
                    title={order.listing?.title || "Order"}
                    subtitle={`Order ${order.order_number}`}
                    price={formatCurrency(order.seller_receives)}
                    status={status.label}
                    statusColor={status.color}
                    date={formatDate(order.created_at!)}
                    actionLabel="View"
                    actionColor="text-red-600"
                  />
                );
              })
            ) : (
              <p className="py-8 text-center text-gray-500 text-sm">No orders yet</p>
            )}
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Active Listings</h2>
            <Link
              href="/seller/listings"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Manage All
            </Link>
          </div>
          <div>
            {listingsLoading ? (
              <div className="py-8 text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
              </div>
            ) : activeListings.length > 0 ? (
              activeListings.slice(0, 3).map((listing) => (
                <ListingItem
                  key={listing.id}
                  image={listing.images?.[0] || "/placeholder-image.png"}
                  title={listing.title}
                  subtitle={listing.platform || listing.type}
                  price={formatCurrency(listing.price)}
                  views={listing.views || 0}
                />
              ))
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500 text-sm mb-3">No active listings yet</p>
                <Link href="/seller/list-product">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-1" /> Create Listing
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

