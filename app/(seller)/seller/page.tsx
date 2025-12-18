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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, John!
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
          value="₦125,450"
          subtext="+12.5% from last month"
          isHighlighted={true}
          badge="↑"
          badgeColor="bg-white/20 text-white"
        />
        <StatsCard
          icon={ShoppingBag}
          iconBg="bg-blue-500"
          label="Active Orders"
          value="8"
          subtext="3 pending delivery"
          badge="+3"
          badgeColor="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={TrendingUp}
          iconBg="bg-yellow-500"
          label="Total Sales"
          value="45"
          subtext="This month"
          badge="+8%"
          badgeColor="bg-green-100 text-green-700"
        />
        <StatsCard
          icon={Star}
          iconBg="bg-yellow-500"
          label="Seller Rating"
          value="4.9"
          subtext="Based on 234 reviews"
          badge="Top"
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
              <Button className="bg-green-500 hover:bg-green-600 text-white text-sm h-9">
                <Plus className="h-4 w-4 mr-1" /> Add Funds
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <WalletCard
                type="NGN Balance"
                symbol="₦"
                balance="₦125,450"
                symbolBg="bg-green-500"
              />
              <WalletCard
                type="Crypto Balance"
                symbol="₿"
                balance="$450.00"
                symbolBg="bg-orange-500"
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="divide-y divide-gray-100">
              <TransactionItem
                icon={ArrowDownLeft}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                title="Funds Added"
                date="Jan 15, 2024"
                amount="+₦50,000"
                amountColor="text-green-600"
              />
              <TransactionItem
                icon={ArrowUpRight}
                iconBg="bg-red-100"
                iconColor="text-red-600"
                title="Purchase - Instagram Account"
                date="Jan 14, 2024"
                amount="-₦45,000"
                amountColor="text-red-600"
              />
              <TransactionItem
                icon={RefreshCw}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                title="Escrow - Web Development"
                date="Jan 13, 2024"
                amount="₦75,000"
                amountColor="text-gray-900"
              />
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
                title="Post Request"
                subtitle="Get what you need"
                bgColor="bg-orange-500"
                href="/seller/post-request"
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
            <OrderItem
              image="/placeholder-image.png"
              title="Instagram Account - Fashion"
              subtitle="12.5K followers"
              price="₦45,000"
              status="Delivered"
              statusColor="bg-green-100 text-green-700"
              date="Jan 14, 2024"
              actionLabel="★ Rate"
              actionColor="text-yellow-600"
            />
            <OrderItem
              image="/placeholder-image.png"
              title="YouTube Channel - Tech"
              subtitle="25K subscribers"
              price="₦120,000"
              status="In Progress"
              statusColor="bg-yellow-100 text-yellow-700"
              date="Jan 13, 2024"
              actionLabel="View"
              actionColor="text-red-600"
            />
            <OrderItem
              image="/placeholder-image.png"
              title="Landing Page Development"
              subtitle="Web Development Service"
              price="₦75,000"
              status="Escrow"
              statusColor="bg-blue-100 text-blue-700"
              date="Jan 12, 2024"
              actionLabel="View"
              actionColor="text-red-600"
            />
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
            <ListingItem
              image="/placeholder-image.png"
              title="Twitter Account - Crypto"
              subtitle="8.2K followers"
              price="₦35,000"
              views={24}
            />
            <ListingItem
              image="/placeholder-image.png"
              title="TikTok Account - Comedy"
              subtitle="50K followers"
              price="₦85,000"
              views={156}
            />
            <ListingItem
              image="/placeholder-image.png"
              title="Social Media Growth Service"
              subtitle="Instagram Growth"
              price="₦75,000"
              views={89}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

