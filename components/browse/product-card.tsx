"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  title: string;
  image: string;
  platform: string;
  platformColor: string;
  platformBg: string;
  stats: string;
  rating: number;
  reviews: number;
  price: number;
  instantDelivery: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover"
        />
        {product.instantDelivery && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
            Instant Delivery
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Platform & Stats */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              product.platformBg,
              product.platformColor
            )}
          >
            {product.platform}
          </span>
          <span className="text-xs text-gray-500">{product.stats}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
        </div>

        {/* Price & Buy Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg sm:text-xl font-bold text-gray-900">{formattedPrice}</p>
            <p className="text-xs text-gray-500">+ 10% buyer fee</p>
          </div>
          <Button
            asChild
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 h-auto text-sm rounded-md"
          >
            <Link href={`/product/${product.id}`}>Buy Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

