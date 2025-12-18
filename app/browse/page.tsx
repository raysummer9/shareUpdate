"use client";

import { useState } from "react";
import { Search, Package, Briefcase, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiltersSidebar } from "@/components/browse/filters-sidebar";
import { ProductCard, Product } from "@/components/browse/product-card";

type ListingType = "products" | "services";

// Sample product data
const sampleProducts: Product[] = [
  {
    id: "1",
    title: "Premium Instagram Account - Fashion Niche",
    image: "/placeholder-product.jpg",
    platform: "Instagram",
    platformColor: "text-pink-700",
    platformBg: "bg-pink-100",
    stats: "12.5K followers",
    rating: 4.8,
    reviews: 124,
    price: 45000,
    instantDelivery: true,
  },
  {
    id: "2",
    title: "Monetized YouTube Channel - Tech Reviews",
    image: "/placeholder-product.jpg",
    platform: "YouTube",
    platformColor: "text-red-700",
    platformBg: "bg-red-100",
    stats: "25K subscribers",
    rating: 4.9,
    reviews: 89,
    price: 120000,
    instantDelivery: true,
  },
  {
    id: "3",
    title: "Verified Twitter Account - Crypto Niche",
    image: "/placeholder-product.jpg",
    platform: "Twitter",
    platformColor: "text-blue-700",
    platformBg: "bg-blue-100",
    stats: "8.2K followers",
    rating: 4.7,
    reviews: 56,
    price: 35000,
    instantDelivery: true,
  },
  {
    id: "4",
    title: "Viral TikTok Account - Comedy Content",
    image: "/placeholder-product.jpg",
    platform: "TikTok",
    platformColor: "text-gray-900",
    platformBg: "bg-gray-100",
    stats: "50K followers",
    rating: 5.0,
    reviews: 203,
    price: 85000,
    instantDelivery: true,
  },
  {
    id: "5",
    title: "Canva Pro Account - 1 Year Subscription",
    image: "/placeholder-product.jpg",
    platform: "SaaS",
    platformColor: "text-purple-700",
    platformBg: "bg-purple-100",
    stats: "Premium Plan",
    rating: 4.6,
    reviews: 312,
    price: 15000,
    instantDelivery: true,
  },
  {
    id: "6",
    title: "Epic Games Account - Fortnite Skins",
    image: "/placeholder-product.jpg",
    platform: "Gaming",
    platformColor: "text-green-700",
    platformBg: "bg-green-100",
    stats: "Level 85",
    rating: 4.8,
    reviews: 178,
    price: 28000,
    instantDelivery: true,
  },
  {
    id: "7",
    title: "Spotify Premium Account - 6 Months",
    image: "/placeholder-product.jpg",
    platform: "Music",
    platformColor: "text-green-700",
    platformBg: "bg-green-100",
    stats: "Premium",
    rating: 4.7,
    reviews: 267,
    price: 8500,
    instantDelivery: true,
  },
  {
    id: "8",
    title: "Professional LinkedIn Account - Tech Industry",
    image: "/placeholder-product.jpg",
    platform: "LinkedIn",
    platformColor: "text-blue-700",
    platformBg: "bg-blue-100",
    stats: "5K connections",
    rating: 4.9,
    reviews: 145,
    price: 42000,
    instantDelivery: true,
  },
  {
    id: "9",
    title: "Netflix Premium Account - 3 Months",
    image: "/placeholder-product.jpg",
    platform: "Streaming",
    platformColor: "text-red-700",
    platformBg: "bg-red-100",
    stats: "Premium 4K",
    rating: 4.6,
    reviews: 389,
    price: 12000,
    instantDelivery: true,
  },
];

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ListingType>("products");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const totalResults = 1234;
  const totalPages = 5;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery, "in", activeTab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section
        className="w-full py-6 sm:py-8 md:py-10 lg:py-12"
        style={{
          background: 'linear-gradient(to right, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)'
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            Browse Marketplace
          </h1>
          <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8">
            Discover thousands of digital products and services
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-4 sm:mb-6 w-full md:w-[70%] lg:w-[60%]">
            <div className="flex items-center bg-white rounded-lg p-1 sm:p-1.5 md:p-2">
              <Search className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for products, services, or accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 px-2 sm:px-3 py-1.5 sm:py-2 md:py-2.5 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent text-sm sm:text-base"
              />
              <Button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 h-auto rounded-md flex-shrink-0 text-xs sm:text-sm md:text-base"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Type Toggle */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab("products")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base",
                activeTab === "products"
                  ? "bg-white text-red-600"
                  : "bg-red-700/50 text-white hover:bg-red-700/70"
              )}
            >
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base",
                activeTab === "services"
                  ? "bg-white text-red-600"
                  : "bg-red-700/50 text-white hover:bg-red-700/70"
              )}
            >
              <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              Services
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-700"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <span className="text-sm text-gray-600">
              Showing {totalResults.toLocaleString()} results
            </span>
          </div>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-gray-50 overflow-y-auto">
                <div className="sticky top-0 bg-gray-50 p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-4">
                  <FiltersSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">
                Showing {totalResults.toLocaleString()} results
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Mobile Sort */}
            <div className="lg:hidden mb-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {sampleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-10 h-10 rounded-lg font-medium text-sm transition-colors",
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

