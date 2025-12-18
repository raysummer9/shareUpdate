"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ChevronDown, Star, Download, MessageSquare, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "delivered" | "processing" | "escrow" | "cancelled";

interface Purchase {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  status: "Delivered" | "Processing" | "In Escrow" | "Cancelled";
  date: string;
  seller: string;
  hasRated: boolean;
}

const purchases: Purchase[] = [
  {
    id: "1",
    title: "Instagram Account - Fashion Niche",
    subtitle: "12.5K followers • High engagement",
    image: "/placeholder-image.png",
    price: "₦45,000",
    status: "Delivered",
    date: "Jan 15, 2024",
    seller: "Digital Assets Pro",
    hasRated: false,
  },
  {
    id: "2",
    title: "YouTube Channel - Tech Reviews",
    subtitle: "25K subscribers • Monetized",
    image: "/placeholder-image.png",
    price: "₦120,000",
    status: "Processing",
    date: "Jan 14, 2024",
    seller: "TechChannel Store",
    hasRated: false,
  },
  {
    id: "3",
    title: "Website Development Service",
    subtitle: "Landing page with responsive design",
    image: "/placeholder-image.png",
    price: "₦75,000",
    status: "In Escrow",
    date: "Jan 13, 2024",
    seller: "WebDev Solutions",
    hasRated: false,
  },
  {
    id: "4",
    title: "Twitter Account - Crypto News",
    subtitle: "8.2K followers • Active community",
    image: "/placeholder-image.png",
    price: "₦35,000",
    status: "Delivered",
    date: "Jan 12, 2024",
    seller: "CryptoAssets",
    hasRated: true,
  },
  {
    id: "5",
    title: "TikTok Account - Comedy",
    subtitle: "50K followers • Viral content",
    image: "/placeholder-image.png",
    price: "₦85,000",
    status: "Delivered",
    date: "Jan 10, 2024",
    seller: "SocialMedia Expert",
    hasRated: true,
  },
  {
    id: "6",
    title: "Logo Design Service",
    subtitle: "Professional branding package",
    image: "/placeholder-image.png",
    price: "₦25,000",
    status: "Cancelled",
    date: "Jan 8, 2024",
    seller: "DesignPro",
    hasRated: false,
  },
];

const statusColors: Record<Purchase["status"], string> = {
  "Delivered": "bg-green-100 text-green-700",
  "Processing": "bg-yellow-100 text-yellow-700",
  "In Escrow": "bg-blue-100 text-blue-700",
  "Cancelled": "bg-red-100 text-red-700",
};

function PurchaseCard({ purchase }: { purchase: Purchase }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image
            src={purchase.image}
            alt={purchase.title}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          {/* Status badge - shown on top for mobile */}
          <div className="flex items-center justify-between gap-2 mb-1 sm:mb-0">
            <span className={cn("text-xs px-2 py-1 rounded-full font-medium sm:hidden", statusColors[purchase.status])}>
              {purchase.status}
            </span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 sm:truncate">{purchase.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{purchase.subtitle}</p>
            </div>
            {/* Status badge - hidden on mobile, shown on desktop */}
            <span className={cn("hidden sm:inline-block text-xs px-2 py-1 rounded-full font-medium flex-shrink-0", statusColors[purchase.status])}>
              {purchase.status}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>Seller: <span className="text-gray-700">{purchase.seller}</span></span>
            <span>{purchase.date}</span>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-lg font-bold text-gray-900">{purchase.price}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {purchase.status === "Delivered" && !purchase.hasRated && (
                <Button size="sm" className="h-8 text-xs bg-yellow-500 hover:bg-yellow-600 text-white">
                  <Star className="h-3 w-3 mr-1" /> Rate
                </Button>
              )}
              {purchase.status === "Delivered" && purchase.hasRated && (
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              )}
              {purchase.status === "Processing" && (
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Eye className="h-3 w-3 mr-1" /> Track
                </Button>
              )}
              {purchase.status === "In Escrow" && (
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  View Trade
                </Button>
              )}
              <Button size="sm" variant="outline" className="h-8 text-xs">
                <MessageSquare className="h-3 w-3 mr-1" /> Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || purchase.status.toLowerCase().replace(" ", "") === statusFilter.replace(" ", "");
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: purchases.length,
    delivered: purchases.filter((p) => p.status === "Delivered").length,
    processing: purchases.filter((p) => p.status === "Processing").length,
    escrow: purchases.filter((p) => p.status === "In Escrow").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Purchases</h1>
        <p className="text-gray-600 mt-1">Track and manage all your purchases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Purchases</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">In Escrow</p>
          <p className="text-2xl font-bold text-blue-600">{stats.escrow}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "delivered", "processing", "escrow"] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize",
                statusFilter === status
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {status === "escrow" ? "In Escrow" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {filteredPurchases.length > 0 ? (
          filteredPurchases.map((purchase) => (
            <PurchaseCard key={purchase.id} purchase={purchase} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No purchases found</p>
          </div>
        )}
      </div>
    </div>
  );
}

