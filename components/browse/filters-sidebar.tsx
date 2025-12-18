"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  count: number;
  checked: boolean;
}

interface FiltersSidebarProps {
  onFiltersChange?: (filters: any) => void;
}

export function FiltersSidebar({ onFiltersChange }: FiltersSidebarProps) {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Social Media", count: 5234, checked: false },
    { name: "SaaS Accounts", count: 2156, checked: false },
    { name: "Web Development", count: 3891, checked: false },
    { name: "Design Services", count: 4567, checked: false },
    { name: "Gaming Accounts", count: 1823, checked: false },
    { name: "Marketing", count: 2945, checked: false },
  ]);

  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const handleCategoryChange = (index: number) => {
    const newCategories = [...categories];
    newCategories[index].checked = !newCategories[index].checked;
    setCategories(newCategories);
  };

  const handleClearAll = () => {
    setCategories(categories.map((cat) => ({ ...cat, checked: false })));
    setPriceRange({ min: "", max: "" });
    setSelectedRating(null);
  };

  const handleApplyPrice = () => {
    // TODO: Apply price filter
    console.log("Applying price range:", priceRange);
  };

  const ratingOptions = [
    { value: 4.5, label: "4.5 & above" },
    { value: 4.0, label: "4.0 & above" },
    { value: 3.5, label: "3.5 & above" },
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-red-600 text-sm font-medium hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <label
              key={category.name}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={category.checked}
                  onChange={() => handleCategoryChange(index)}
                  className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {category.count.toLocaleString()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range (₦)</h4>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <Button
          onClick={handleApplyPrice}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Apply
        </Button>
      </div>

      {/* Seller Rating */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Seller Rating</h4>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedRating === option.value}
                onChange={() =>
                  setSelectedRating(
                    selectedRating === option.value ? null : option.value
                  )
                }
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

