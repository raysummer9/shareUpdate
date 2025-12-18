"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Star, ThumbsUp, MessageSquare, TrendingUp, Award, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReviewFilter = "all" | "5" | "4" | "3" | "2" | "1";

interface Review {
  id: string;
  buyer: {
    name: string;
    avatar: string;
  };
  productTitle: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  reply?: string;
  replyDate?: string;
}

const reviews: Review[] = [
  {
    id: "1",
    buyer: { name: "Michael Chen", avatar: "/placeholder-image.png" },
    productTitle: "Instagram Account - Fashion Niche",
    productImage: "/placeholder-image.png",
    rating: 5,
    comment: "Excellent seller! The account was exactly as described with genuine followers. Transfer was smooth and the seller was very helpful throughout the process. Highly recommended!",
    date: "Jan 15, 2024",
    helpful: 12,
    reply: "Thank you so much for your kind words, Michael! It was a pleasure working with you. Feel free to reach out if you need anything else!",
    replyDate: "Jan 15, 2024",
  },
  {
    id: "2",
    buyer: { name: "Sarah Johnson", avatar: "/placeholder-image.png" },
    productTitle: "YouTube Channel - Tech Reviews",
    productImage: "/placeholder-image.png",
    rating: 5,
    comment: "Amazing service! The channel exceeded my expectations. Quick delivery and excellent communication.",
    date: "Jan 14, 2024",
    helpful: 8,
  },
  {
    id: "3",
    buyer: { name: "David Williams", avatar: "/placeholder-image.png" },
    productTitle: "Website Development Service",
    productImage: "/placeholder-image.png",
    rating: 4,
    comment: "Good work overall. The website looks great and functions well. Minor delay in delivery but seller kept me informed. Would work with again.",
    date: "Jan 12, 2024",
    helpful: 5,
    reply: "Thank you for your feedback, David! I apologize for the slight delay - I wanted to make sure everything was perfect. Glad you're happy with the result!",
    replyDate: "Jan 12, 2024",
  },
  {
    id: "4",
    buyer: { name: "Emily Brown", avatar: "/placeholder-image.png" },
    productTitle: "TikTok Account - Comedy",
    productImage: "/placeholder-image.png",
    rating: 5,
    comment: "Perfect transaction! The account has amazing engagement and the seller was professional throughout.",
    date: "Jan 10, 2024",
    helpful: 15,
  },
  {
    id: "5",
    buyer: { name: "James Wilson", avatar: "/placeholder-image.png" },
    productTitle: "Logo Design Package",
    productImage: "/placeholder-image.png",
    rating: 3,
    comment: "Decent work. The logo is okay but took a few revisions to get it right. Communication could be better.",
    date: "Jan 8, 2024",
    helpful: 2,
  },
];

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, onReply }: { review: Review; onReply: (id: string) => void }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

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
              <div className="flex items-center gap-3 mt-1">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={review.buyer.avatar}
              alt={review.buyer.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-600">{review.buyer.name}</span>
          </div>

          {/* Comment */}
          <p className="text-gray-700 text-sm mb-3">{review.comment}</p>

          {/* Helpful */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {review.helpful} found helpful
            </span>
          </div>

          {/* Reply */}
          {review.reply && (
            <div className="mt-4 pl-4 border-l-2 border-gray-200 bg-gray-50 rounded-r-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-900">Your Reply</span>
                <span className="text-xs text-gray-500">{review.replyDate}</span>
              </div>
              <p className="text-sm text-gray-600">{review.reply}</p>
            </div>
          )}

          {/* Reply Input */}
          {!review.reply && (
            <div className="mt-4">
              {showReplyInput ? (
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { onReply(review.id); setShowReplyInput(false); }} className="bg-red-600 hover:bg-red-700 text-white">
                      Post Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowReplyInput(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setShowReplyInput(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply to Review
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellerReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<ReviewFilter>("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === "all" || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const handleReply = (reviewId: string) => {
    console.log("Replying to review:", reviewId);
  };

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => reviews.filter(rev => rev.rating === r).length);
  const needsReply = reviews.filter(r => !r.reply).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">See what buyers are saying about your products and services</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rating Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-gray-900">{avgRating}</span>
              <Star className="h-8 w-8 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-sm text-gray-500">Based on {totalReviews} reviews</p>
          </div>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-3">{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(ratingCounts[index] / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">{ratingCounts[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Response Rate</span>
              </div>
              <span className="font-semibold text-gray-900">92%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">Seller Level</span>
              </div>
              <span className="font-semibold text-purple-600">Top Rated</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">This Month</span>
              </div>
              <span className="font-semibold text-gray-900">+8 reviews</span>
            </div>
          </div>
        </div>

        {/* Action Required */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Action Required</h3>
          {needsReply > 0 ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600 mb-1">{needsReply}</p>
              <p className="text-sm text-gray-500">Reviews awaiting your reply</p>
              <p className="text-xs text-gray-400 mt-2">Responding to reviews improves your seller rating</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">You're all caught up!</p>
              <p className="text-xs text-gray-400 mt-1">All reviews have been replied to</p>
            </div>
          )}
        </div>
      </div>

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
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {(["all", "5", "4", "3", "2", "1"] as ReviewFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setRatingFilter(filter)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1",
                ratingFilter === filter
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {filter === "all" ? "All" : (
                <>
                  {filter} <Star className={cn("h-3 w-3", ratingFilter === filter ? "fill-white" : "fill-yellow-400 text-yellow-400")} />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} onReply={handleReply} />
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

