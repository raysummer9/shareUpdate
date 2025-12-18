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
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, Michael!
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
          value="₦85,250"
          subtext="Available for purchases"
          isHighlighted={true}
          badge="↑"
          badgeColor="bg-white/20 text-white"
        />
        <StatsCard
          icon={ShoppingBag}
          iconBg="bg-green-500"
          label="Total Purchases"
          value="12"
          subtext="5 pending delivery"
          badge="+2"
          badgeColor="bg-blue-100 text-blue-700"
        />
        <StatsCard
          icon={FileText}
          iconBg="bg-blue-500"
          label="Active Requests"
          value="2"
          subtext="8 bids received"
          badge="Active"
          badgeColor="bg-green-100 text-green-700"
        />
        <StatsCard
          icon={Heart}
          iconBg="bg-pink-500"
          label="Wishlist Items"
          value="3"
          subtext="1 price drop"
          badge="New"
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
              <PurchaseItem
                image="/placeholder-image.png"
                title="Instagram Account - Fashion Niche"
                subtitle="12.5K followers • High engagement"
                price="₦45,000"
                status="Delivered"
                statusColor="bg-green-100 text-green-700"
                date="Jan 15, 2024"
                action={{ label: "★ Rate", color: "bg-yellow-500 hover:bg-yellow-600 text-white", variant: "button" }}
              />
              <PurchaseItem
                image="/placeholder-image.png"
                title="YouTube Channel - Tech Reviews"
                subtitle="25K subscribers • Monetized"
                price="₦120,000"
                status="Processing"
                statusColor="bg-yellow-100 text-yellow-700"
                date="Jan 14, 2024"
                action={{ label: "Track", color: "bg-gray-100 hover:bg-gray-200 text-gray-700", variant: "button" }}
              />
              <PurchaseItem
                image="/placeholder-image.png"
                title="Website Development Service"
                subtitle="Landing page with responsive design"
                price="₦75,000"
                status="In Escrow"
                statusColor="bg-blue-100 text-blue-700"
                date="Jan 13, 2024"
                action={{ label: "View Trade", color: "bg-blue-600 hover:bg-blue-700 text-white", variant: "button" }}
              />
              <PurchaseItem
                image="/placeholder-image.png"
                title="Twitter Account - Crypto News"
                subtitle="8.2K followers • Active community"
                price="₦35,000"
                status="Delivered"
                statusColor="bg-green-100 text-green-700"
                date="Jan 12, 2024"
                action={{ label: "", color: "", variant: "stars" }}
              />
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
              <WishlistItem
                image="/placeholder-image.png"
                title="TikTok Account"
                subtitle="50K followers"
                price="₦85,000"
              />
              <WishlistItem
                image="/placeholder-image.png"
                title="Logo Design"
                subtitle="Professional service"
                price="₦25,000"
                discount="-20%"
              />
              <WishlistItem
                image="/placeholder-image.png"
                title="LinkedIn Account"
                subtitle="5K connections"
                price="₦55,000"
              />
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
            <RequestItem
              title="Need 12K Instagram Account"
              subtitle="Fashion or lifestyle niche preferred"
              status="Active"
              statusColor="bg-green-100 text-green-700"
              bids={5}
              time="2 days ago"
            />
            <RequestItem
              title="Website Development Needed"
              subtitle="E-commerce site with payment integration"
              status="Active"
              statusColor="bg-green-100 text-green-700"
              bids={3}
              time="1 day ago"
            />
            <RequestItem
              title="YouTube Channel - Gaming"
              subtitle="Minimum 20K subscribers required"
              status="Completed"
              statusColor="bg-gray-100 text-gray-600"
              time="5 days ago"
              isCompleted={true}
              isPurchased={true}
            />
          </div>
        </div>

        {/* Recommended for You */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recommended for You</h2>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <div>
            <RecommendedItem
              image="/placeholder-image.png"
              title="Instagram - Beauty Niche"
              subtitle="15K followers • High engagement"
              price="₦52,000"
              rating={5}
              reviews={45}
            />
            <RecommendedItem
              image="/placeholder-image.png"
              title="Facebook Page - Business"
              subtitle="30K likes • Verified page"
              price="₦95,000"
              rating={4}
              reviews={28}
            />
            <RecommendedItem
              image="/placeholder-image.png"
              title="Social Media Management"
              subtitle="Monthly service package"
              price="₦45,000"
              rating={5}
              reviews={67}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

