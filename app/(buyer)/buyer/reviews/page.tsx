"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Star, ThumbsUp, MessageSquare, Edit, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReviewFilter = "all" | "given" | "pending";

interface Review {
  id: string;
  type: "given" | "received";
  productTitle: string;
  productImage: string;
  sellerName: string;
  sellerAvatar: string;
  rating?: number;
  comment?: string;
  date: string;
  helpful?: number;
  reply?: string;
  isPending: boolean;
}

const reviews: Review[] = [
  {
    id: "1",
    type: "given",
    productTitle: "Instagram Account - Fashion Niche",
    productImage: "/placeholder-image.png",
    sellerName: "Digital Assets Pro",
    sellerAvatar: "/placeholder-image.png",
    rating: 5,
    comment: "Excellent service! The account was exactly as described. Transfer was smooth and the seller was very helpful throughout the process. Highly recommended!",
    date: "Jan 15, 2024",
    helpful: 12,
    reply: "Thank you so much for your kind words! It was a pleasure working with you.",
    isPending: false,
  },
  {
    id: "2",
    type: "given",
    productTitle: "Twitter Account - Crypto News",
    productImage: "/placeholder-image.png",
    sellerName: "CryptoAssets",
    sellerAvatar: "/placeholder-image.png",
    rating: 4,
    comment: "Good account with active followers. Minor delay in transfer but seller resolved it quickly. Would buy again.",
    date: "Jan 12, 2024",
    helpful: 5,
    isPending: false,
  },
  {
    id: "3",
    type: "given",
    productTitle: "TikTok Account - Comedy",
    productImage: "/placeholder-image.png",
    sellerName: "SocialMedia Expert",
    sellerAvatar: "/placeholder-image.png",
    rating: 5,
    comment: "Perfect! Account metrics matched what was advertised. Quick delivery and great communication.",
    date: "Jan 10, 2024",
    helpful: 8,
    isPending: false,
  },
  {
    id: "4",
    type: "given",
    productTitle: "YouTube Channel - Tech Reviews",
    productImage: "/placeholder-image.png",
    sellerName: "TechChannel Store",
    sellerAvatar: "/placeholder-image.png",
    isPending: true,
    date: "Jan 14, 2024",
  },
  {
    id: "5",
    type: "given",
    productTitle: "Website Development Service",
    productImage: "/placeholder-image.png",
    sellerName: "WebDev Solutions",
    sellerAvatar: "/placeholder-image.png",
    isPending: true,
    date: "Jan 13, 2024",
  },
];

function StarRating({ rating, size = "md", interactive = false, onRate }: { 
  rating: number; 
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={cn(interactive && "cursor-pointer")}
          disabled={!interactive}
        >
          <Star
            className={cn(
              sizeClasses[size],
              (interactive ? (hovered || rating) >= star : rating >= star)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  if (review.isPending) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image src={review.productImage} alt={review.productTitle} width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{review.productTitle}</h3>
            <p className="text-sm text-gray-500">Purchased from {review.sellerName}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 font-medium">Review pending</span>
            </div>
          </div>
        </div>
        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
          <Star className="h-4 w-4 mr-2" />
          Leave a Review
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image src={review.productImage} alt={review.productTitle} width={80} height={80} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{review.productTitle}</h3>
              <p className="text-sm text-gray-500">Sold by {review.sellerName}</p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Edit className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <StarRating rating={review.rating || 0} />
            <span className="text-sm text-gray-500">{review.date}</span>
          </div>

          {review.comment && (
            <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-700">
              <ThumbsUp className="h-4 w-4" />
              {review.helpful} found helpful
            </button>
          </div>

          {review.reply && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Image src={review.sellerAvatar} alt={review.sellerName} width={24} height={24} className="rounded-full" />
                <span className="text-sm font-semibold text-gray-900">{review.sellerName}</span>
                <span className="text-xs text-gray-500">replied</span>
              </div>
              <p className="text-sm text-gray-600">{review.reply}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "given" && !review.isPending) ||
      (filter === "pending" && review.isPending);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    given: reviews.filter((r) => !r.isPending).length,
    pending: reviews.filter((r) => r.isPending).length,
    avgRating: (reviews.filter((r) => r.rating).reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.filter((r) => r.rating).length).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-gray-600 mt-1">Manage reviews you've given to sellers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Reviews Given</p>
          <p className="text-2xl font-bold text-green-600">{stats.given}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Pending Reviews</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Avg. Rating Given</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      </div>

      {/* Pending Reviews Alert */}
      {stats.pending > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">You have {stats.pending} pending review{stats.pending > 1 ? 's' : ''}</p>
            <p className="text-sm text-yellow-700">Your feedback helps other buyers make informed decisions!</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "given", "pending"] as ReviewFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize",
                filter === f
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found</p>
          </div>
        )}
      </div>
    </div>
  );
}

