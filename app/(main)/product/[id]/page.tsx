"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Heart, 
  Star, 
  ShoppingCart, 
  Mail, 
  Zap, 
  Shield, 
  RotateCcw, 
  Headphones,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  Info,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Sample product data - in real app this would come from API
const productData = {
  id: "1",
  title: "Premium Instagram Account - Fashion Niche",
  platform: "Instagram",
  platformColor: "text-pink-700",
  platformBg: "bg-pink-100",
  stats: "12.5K followers",
  rating: 4.8,
  reviews: 124,
  price: 45000,
  buyerFee: 4500,
  instantDelivery: true,
  verified: true,
  images: [
    "/placeholder-image.png",
    "/placeholder-image.png",
    "/placeholder-image.png",
    "/placeholder-image.png",
  ],
  description: `This is a premium Instagram account with 12,500 authentic followers in the fashion niche. The account has been carefully grown over 18 months with organic engagement strategies and features high-quality content that resonates with fashion enthusiasts.

The account has excellent engagement rates (4.2% average) and a highly active audience. Perfect for fashion brands, influencers, or anyone looking to establish a strong presence in the fashion industry immediately.`,
  importantInfo: "Upon purchase, you will receive full login credentials including email access. The account transfer is instant and automated. Please change the password immediately after receiving access.",
  accountStats: {
    followers: "12,500",
    engagement: "4.2%",
    posts: "342",
    age: "18 Months",
  },
  seller: {
    name: "Digital Assets Pro",
    verified: true,
    rating: 4.9,
    reviews: 1234,
    avatar: "/placeholder-avatar.png",
  },
  safetyTips: [
    "Change password immediately after purchase",
    "Enable two-factor authentication",
    "Update recovery email and phone",
    "Report any issues within 24 hours",
  ],
};

const similarProducts = [
  {
    id: "3",
    title: "Verified Twitter Account - Crypto Niche",
    image: "/placeholder-image.png",
    platform: "Twitter",
    platformColor: "text-blue-700",
    platformBg: "bg-blue-100",
    stats: "8.2K followers",
    rating: 4.7,
    reviews: 56,
    price: 35000,
  },
  {
    id: "4",
    title: "Viral TikTok Account - Comedy Content",
    image: "/placeholder-image.png",
    platform: "TikTok",
    platformColor: "text-gray-900",
    platformBg: "bg-gray-100",
    stats: "50K followers",
    rating: 5.0,
    reviews: 203,
    price: 85000,
  },
  {
    id: "2",
    title: "Monetized YouTube Channel - Tech Reviews",
    image: "/placeholder-image.png",
    platform: "YouTube",
    platformColor: "text-red-700",
    platformBg: "bg-red-100",
    stats: "25K subscribers",
    rating: 4.9,
    reviews: 89,
    price: 120000,
  },
  {
    id: "8",
    title: "Professional LinkedIn Account - Tech Industry",
    image: "/placeholder-image.png",
    platform: "LinkedIn",
    platformColor: "text-blue-700",
    platformBg: "bg-blue-100",
    stats: "5K connections",
    rating: 4.9,
    reviews: 145,
    price: 42000,
  },
];

type TabType = "description" | "whatYouGet" | "reviews" | "aboutSeller";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = productData;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tabs = [
    { id: "description" as TabType, label: "Description" },
    { id: "whatYouGet" as TabType, label: "What You'll Get" },
    { id: "reviews" as TabType, label: `Reviews (${product.reviews})` },
    { id: "aboutSeller" as TabType, label: "About Seller" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-t border-b">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link href="/browse" className="hover:text-gray-900">Social Media</Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Link href="/browse?platform=instagram" className="hover:text-gray-900">Instagram</Link>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Column - Images & Details */}
          <div className="flex-1">
            {/* Main Image */}
            <div className="bg-gray-900 rounded-lg overflow-hidden relative mb-4">
              <div className="aspect-[4/3] relative">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.instantDelivery && (
                    <span className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Instant Delivery
                    </span>
                  )}
                  {product.verified && (
                    <span className="bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImage === index
                      ? "border-red-500"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b mb-6">
              <div className="flex gap-4 sm:gap-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "pb-3 text-sm sm:text-base font-medium whitespace-nowrap border-b-2 transition-colors",
                      activeTab === tab.id
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "description" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  About This Account
                </h2>
                <div className="prose prose-gray max-w-none mb-6">
                  {product.description.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Important Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Important Information</h3>
                      <p className="text-blue-800 text-sm">{product.importantInfo}</p>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Followers</p>
                        <p className="text-lg font-bold text-gray-900">{product.accountStats.followers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Avg. Engagement</p>
                        <p className="text-lg font-bold text-gray-900">{product.accountStats.engagement}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Posts</p>
                        <p className="text-lg font-bold text-gray-900">{product.accountStats.posts}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Age</p>
                        <p className="text-lg font-bold text-gray-900">{product.accountStats.age}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "whatYouGet" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  What You'll Get
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Full account login credentials (username & password)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Access to linked email account</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">All existing content and followers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">7-day buyer protection guarantee</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">24/7 customer support</span>
                  </li>
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Customer Reviews
                </h2>
                <p className="text-gray-500">Reviews coming soon...</p>
              </div>
            )}

            {activeTab === "aboutSeller" && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  About the Seller
                </h2>
                <p className="text-gray-500">Seller information coming soon...</p>
              </div>
            )}
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm sticky top-6">
              {/* Platform & Stats */}
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-xs font-medium px-2 py-0.5 rounded", product.platformBg, product.platformColor)}>
                  {product.platform}
                </span>
                <span className="text-sm text-gray-500">{product.stats}</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "h-4 w-4",
                        star <= Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 mb-3">
                  {formatPrice(product.price)}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Price</span>
                    <span className="text-gray-900">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Buyer Fee (10%)</span>
                    <span className="text-gray-900">{formatPrice(product.buyerFee)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">{formatPrice(product.price + product.buyerFee)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 h-auto">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-medium py-3 h-auto">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Seller
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={cn(
                    "w-full font-medium py-3 h-auto",
                    isWishlisted
                      ? "border-red-500 text-red-600 bg-red-50"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Heart className={cn("h-5 w-5 mr-2", isWishlisted && "fill-red-500")} />
                  {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">Instant automated delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Buyer protection included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">7-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-3 pb-6 border-b mb-6">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">{product.seller.name}</span>
                    {product.seller.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{product.seller.rating}</span>
                    <span className="text-gray-500">({product.seller.reviews.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Safety Tips</h4>
                </div>
                <ul className="space-y-2">
                  {product.safetyTips.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Platform & Stats */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded", item.platformBg, item.platformColor)}>
                      {item.platform}
                    </span>
                    <span className="text-xs text-gray-500">{item.stats}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
                    {item.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">{item.rating}</span>
                    <span className="text-xs text-gray-500">({item.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-bold text-red-600">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

