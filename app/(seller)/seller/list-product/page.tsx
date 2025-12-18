"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Info, CheckCircle, Loader2, ImagePlus, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "social-media", label: "Social Media Accounts", icon: "📱" },
  { id: "saas", label: "SaaS Accounts", icon: "☁️" },
  { id: "gaming", label: "Gaming Accounts", icon: "🎮" },
  { id: "streaming", label: "Streaming Accounts", icon: "📺" },
  { id: "domains", label: "Domains & Websites", icon: "🌐" },
  { id: "other", label: "Other Digital Products", icon: "📦" },
];

const platforms: Record<string, string[]> = {
  "social-media": ["Instagram", "Twitter/X", "TikTok", "YouTube", "LinkedIn", "Facebook", "Snapchat", "Pinterest"],
  "saas": ["Adobe CC", "Canva Pro", "Netflix", "Spotify", "ChatGPT Plus", "Office 365", "Grammarly"],
  "gaming": ["Steam", "PlayStation", "Xbox", "Epic Games", "Fortnite", "Roblox", "Minecraft"],
  "streaming": ["Netflix", "Disney+", "HBO Max", "Spotify", "Apple Music", "YouTube Premium"],
  "domains": ["Domain Name", "WordPress Site", "Shopify Store", "Landing Page"],
  "other": ["API Keys", "Software Licenses", "Digital Assets"],
};

const deliveryMethods = [
  { id: "instant", label: "Instant Delivery", description: "Automated delivery upon purchase" },
  { id: "manual", label: "Manual Delivery", description: "You'll deliver manually within 24 hours" },
];

export default function ListProductPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    platform: "",
    title: "",
    description: "",
    price: "",
    deliveryMethod: "instant",
    accountDetails: "",
    images: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId, platform: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages].slice(0, 5) }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  const canProceed = () => {
    if (step === 1) return formData.category !== "";
    if (step === 2) return formData.title !== "" && formData.description !== "" && formData.price !== "";
    return true;
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your listing is now pending review. Our team will review it within 24 hours and notify you once it's live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/seller/listings">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                View My Listings
              </Button>
            </Link>
            <Button variant="outline" onClick={() => { setIsSubmitted(false); setStep(1); setFormData({ category: "", platform: "", title: "", description: "", price: "", deliveryMethod: "instant", accountDetails: "", images: [] }); }}>
              List Another Product
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/listings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">List a Product</h1>
          <p className="text-gray-600 mt-1">Sell digital accounts, products, or assets</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step >= s ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
            )}>
              {s}
            </div>
            {s < 3 && (
              <div className={cn("w-12 sm:w-24 h-1 mx-2", step > s ? "bg-red-600" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Category Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Select Category</h2>
              <p className="text-sm text-gray-500">Choose the category that best describes your product</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    formData.category === cat.id
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{cat.label}</span>
                </button>
              ))}
            </div>

            {formData.category && platforms[formData.category] && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Platform
                </label>
                <div className="flex flex-wrap gap-2">
                  {platforms[formData.category].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, platform }))}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        formData.platform === platform
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Product Details */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Product Details</h2>
              <p className="text-sm text-gray-500">Provide detailed information about your product</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Instagram Fashion Account - 15K Followers"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail. Include engagement rates, niche, history, etc."
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="45000"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">You'll receive {formData.price ? `₦${(parseInt(formData.price) * 0.9).toLocaleString()}` : "₦0"} after 10% platform fee</p>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images (Up to 5)
              </label>
              <div className="flex flex-wrap gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 5 && (
                  <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors">
                    <ImagePlus className="h-6 w-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Delivery & Verification */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delivery Settings</h2>
              <p className="text-sm text-gray-500">Configure how your product will be delivered</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Method <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      formData.deliveryMethod === method.id
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.id}
                      checked={formData.deliveryMethod === method.id}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {formData.deliveryMethod === "instant" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Credentials / Delivery Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="accountDetails"
                  value={formData.accountDetails}
                  onChange={handleInputChange}
                  placeholder="Enter the account credentials or content that will be delivered to the buyer..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">This will only be shown to buyers after successful payment</p>
              </div>
            )}

            {/* Info Banner */}
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800">Listing Review</p>
                <p className="text-sm text-blue-700">Your listing will be reviewed by our team before going live. This usually takes 12-24 hours.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Listing"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

