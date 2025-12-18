"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, ShoppingCart, Trash2, Star, TrendingDown, Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  seller: string;
  inStock: boolean;
  priceAlert: boolean;
  addedAt: string;
}

const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    title: "TikTok Account - Comedy",
    subtitle: "50K followers • High engagement",
    image: "/placeholder-image.png",
    price: "₦85,000",
    rating: 4.8,
    reviews: 124,
    seller: "SocialMedia Expert",
    inStock: true,
    priceAlert: true,
    addedAt: "2 days ago",
  },
  {
    id: "2",
    title: "Logo Design Service",
    subtitle: "Professional branding package",
    image: "/placeholder-image.png",
    price: "₦25,000",
    originalPrice: "₦30,000",
    discount: "-17%",
    rating: 4.9,
    reviews: 89,
    seller: "DesignPro Studio",
    inStock: true,
    priceAlert: false,
    addedAt: "5 days ago",
  },
  {
    id: "3",
    title: "LinkedIn Account - Tech",
    subtitle: "5K connections • Active profile",
    image: "/placeholder-image.png",
    price: "₦55,000",
    rating: 4.5,
    reviews: 45,
    seller: "TechAssets",
    inStock: true,
    priceAlert: true,
    addedAt: "1 week ago",
  },
  {
    id: "4",
    title: "E-commerce Website Template",
    subtitle: "React + Next.js • Full source code",
    image: "/placeholder-image.png",
    price: "₦45,000",
    originalPrice: "₦60,000",
    discount: "-25%",
    rating: 4.7,
    reviews: 67,
    seller: "WebDev Solutions",
    inStock: false,
    priceAlert: false,
    addedAt: "2 weeks ago",
  },
];

function WishlistCard({ item, onRemove, onToggleAlert }: { 
  item: WishlistItem; 
  onRemove: (id: string) => void;
  onToggleAlert: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <Link href={`/product/${item.id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium px-2 py-1 bg-red-600 rounded">Out of Stock</span>
            </div>
          )}
          {item.discount && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              {item.discount}
            </span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/product/${item.id}`}>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-red-600 transition-colors">{item.title}</h3>
            </Link>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onToggleAlert(item.id)}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  item.priceAlert ? "text-yellow-500 bg-yellow-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )}
                title={item.priceAlert ? "Price alert enabled" : "Enable price alert"}
              >
                {item.priceAlert ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-3 w-3",
                    star <= Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({item.reviews})</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{item.seller}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-red-600">{item.price}</p>
              {item.originalPrice && (
                <p className="text-sm text-gray-400 line-through">{item.originalPrice}</p>
              )}
            </div>
            <Button
              size="sm"
              className={cn(
                "h-8 text-xs",
                item.inStock
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              )}
              disabled={!item.inStock}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {item.inStock ? "Buy Now" : "Sold Out"}
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-2">Added {item.addedAt}</p>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    setItems(items.map((item) => 
      item.id === id ? { ...item, priceAlert: !item.priceAlert } : item
    ));
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const priceDrops = items.filter((item) => item.discount).length;
  const alertsEnabled = items.filter((item) => item.priceAlert).length;

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
          <p className="text-2xl font-bold text-blue-600">{items.filter((i) => i.inStock).length}</p>
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onToggleAlert={handleToggleAlert}
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

