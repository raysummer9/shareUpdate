"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, X, Info, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "social-media", label: "Social Media Accounts" },
  { id: "web-dev", label: "Web Development" },
  { id: "design", label: "Design Services" },
  { id: "saas", label: "SaaS Accounts" },
  { id: "gaming", label: "Gaming Accounts" },
  { id: "streaming", label: "Streaming Accounts" },
  { id: "other", label: "Other" },
];

const platforms = [
  "Instagram",
  "Twitter/X",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Facebook",
  "Snapchat",
  "Other",
];

const deliveryTimelines = [
  { value: "1-3", label: "1-3 days" },
  { value: "3-7", label: "3-7 days" },
  { value: "1-2w", label: "1-2 weeks" },
  { value: "flexible", label: "Flexible" },
];

export default function PostRequestPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    platform: "",
    description: "",
    minBudget: "",
    maxBudget: "",
    deliveryTimeline: "",
    requirements: [] as string[],
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Posted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your request is now live. Sellers will start sending their bids soon. You'll receive notifications when bids come in.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/buyer/requests">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                View My Requests
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Post Another Request
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
        <Link href="/buyer/requests" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Post a Request</h1>
          <p className="text-gray-600 mt-1">Describe what you're looking for and let sellers come to you</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Looking for Instagram Account with 10K+ Followers"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform (if applicable)
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select platform</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what you're looking for in detail. Include any specific features, requirements, or preferences..."
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Budget & Timeline</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Budget (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minBudget"
                value={formData.minBudget}
                onChange={handleInputChange}
                placeholder="10000"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Budget (₦) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxBudget"
                value={formData.maxBudget}
                onChange={handleInputChange}
                placeholder="50000"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Timeline <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {deliveryTimelines.map((timeline) => (
                <button
                  key={timeline.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, deliveryTimeline: timeline.value }))}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all",
                    formData.deliveryTimeline === timeline.value
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  )}
                >
                  {timeline.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Specific Requirements (Optional)</h2>
          <p className="text-sm text-gray-500">Add specific requirements or must-haves for sellers to know</p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRequirement())}
              placeholder="e.g., Must have 5%+ engagement rate"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Button type="button" onClick={handleAddRequirement} variant="outline">
              Add
            </Button>
          </div>

          {formData.requirements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(index)}
                    className="p-0.5 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Attachments (Optional)</h2>
          <p className="text-sm text-gray-500">Upload reference images or documents to help sellers understand your needs</p>

          <label className="block">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-500 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf"
              className="hidden"
            />
          </label>

          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                >
                  {file.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="p-0.5 hover:bg-gray-200 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800">Tips for getting more bids</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Be specific about what you're looking for</li>
              <li>• Set a realistic budget range</li>
              <li>• Include all important requirements upfront</li>
              <li>• Respond to seller questions promptly</li>
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link href="/buyer/requests">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Request"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

