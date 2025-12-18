"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Info, CheckCircle, Loader2, ImagePlus, DollarSign, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { id: "web-dev", label: "Web Development", icon: "💻" },
  { id: "design", label: "Design & Graphics", icon: "🎨" },
  { id: "writing", label: "Writing & Content", icon: "✍️" },
  { id: "marketing", label: "Digital Marketing", icon: "📈" },
  { id: "video", label: "Video & Animation", icon: "🎬" },
  { id: "other", label: "Other Services", icon: "🔧" },
];

const subcategories: Record<string, string[]> = {
  "web-dev": ["Website Development", "Landing Pages", "E-commerce Sites", "Web Apps", "WordPress", "Bug Fixes"],
  "design": ["Logo Design", "UI/UX Design", "Brand Identity", "Social Media Graphics", "Illustrations", "Flyers & Posters"],
  "writing": ["Blog Posts", "Copywriting", "Technical Writing", "SEO Content", "Product Descriptions", "Editing"],
  "marketing": ["SEO Services", "Social Media Marketing", "Email Marketing", "PPC Campaigns", "Content Strategy"],
  "video": ["Video Editing", "Motion Graphics", "Animations", "Intros & Outros", "Explainer Videos"],
  "other": ["Virtual Assistant", "Data Entry", "Research", "Consulting", "Custom Services"],
};

const deliveryTimes = [
  { value: "1", label: "1 Day" },
  { value: "3", label: "3 Days" },
  { value: "7", label: "7 Days" },
  { value: "14", label: "14 Days" },
  { value: "30", label: "30 Days" },
];

interface Package {
  name: string;
  description: string;
  price: string;
  deliveryTime: string;
  revisions: string;
  features: string[];
}

export default function OfferServicePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    images: [] as File[],
    packages: {
      basic: { name: "Basic", description: "", price: "", deliveryTime: "3", revisions: "1", features: [""] } as Package,
      standard: { name: "Standard", description: "", price: "", deliveryTime: "5", revisions: "2", features: [""] } as Package,
      premium: { name: "Premium", description: "", price: "", deliveryTime: "7", revisions: "3", features: [""] } as Package,
    },
    requirements: [""],
    faqs: [{ question: "", answer: "" }],
  });
  const [activePackage, setActivePackage] = useState<"basic" | "standard" | "premium">("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (field: keyof Package, value: string) => {
    setFormData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [activePackage]: {
          ...prev.packages[activePackage],
          [field]: value,
        },
      },
    }));
  };

  const handlePackageFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.packages[activePackage].features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [activePackage]: {
          ...prev.packages[activePackage],
          features: newFeatures,
        },
      },
    }));
  };

  const addPackageFeature = () => {
    setFormData((prev) => ({
      ...prev,
      packages: {
        ...prev.packages,
        [activePackage]: {
          ...prev.packages[activePackage],
          features: [...prev.packages[activePackage].features, ""],
        },
      },
    }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId, subcategory: "" }));
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

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your service is now pending review. Our team will review it within 24 hours and notify you once it's live.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/seller/listings">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                View My Listings
              </Button>
            </Link>
            <Button variant="outline" onClick={() => { setIsSubmitted(false); setStep(1); }}>
              Offer Another Service
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Offer a Service</h1>
          <p className="text-gray-600 mt-1">Create a service offering for buyers</p>
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
        {/* Step 1: Category & Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Select Category</h2>
                <p className="text-sm text-gray-500">Choose the category that best describes your service</p>
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

              {formData.category && subcategories[formData.category] && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[formData.category].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, subcategory: sub }))}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          formData.subcategory === sub
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="I will design a professional logo for your business"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Start with "I will..."</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your service in detail. What do you offer? What's your process? What makes you different?"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio / Sample Work (Up to 5)
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
          </div>
        )}

        {/* Step 2: Pricing Packages */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Pricing Packages</h2>
              <p className="text-sm text-gray-500">Create different tiers for your service</p>
            </div>

            {/* Package Tabs */}
            <div className="flex gap-2">
              {(["basic", "standard", "premium"] as const).map((pkg) => (
                <button
                  key={pkg}
                  type="button"
                  onClick={() => setActivePackage(pkg)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all capitalize",
                    activePackage === pkg
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {pkg}
                </button>
              ))}
            </div>

            {/* Package Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  value={formData.packages[activePackage].name}
                  onChange={(e) => handlePackageChange("name", e.target.value)}
                  placeholder={`${activePackage.charAt(0).toUpperCase() + activePackage.slice(1)} Package`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Description</label>
                <textarea
                  value={formData.packages[activePackage].description}
                  onChange={(e) => handlePackageChange("description", e.target.value)}
                  placeholder="Describe what's included in this package"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={formData.packages[activePackage].price}
                    onChange={(e) => handlePackageChange("price", e.target.value)}
                    placeholder="25000"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <select
                    value={formData.packages[activePackage].deliveryTime}
                    onChange={(e) => handlePackageChange("deliveryTime", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {deliveryTimes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revisions</label>
                  <select
                    value={formData.packages[activePackage].revisions}
                    onChange={(e) => handlePackageChange("revisions", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 5, "Unlimited"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                <div className="space-y-2">
                  {formData.packages[activePackage].features.map((feature, index) => (
                    <input
                      key={index}
                      type="text"
                      value={feature}
                      onChange={(e) => handlePackageFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={addPackageFeature}
                    className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <Plus className="h-4 w-4" /> Add Feature
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Requirements & FAQs */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Buyer Requirements</h2>
                <p className="text-sm text-gray-500">What information do you need from buyers to start working?</p>
              </div>

              <div className="space-y-2">
                {formData.requirements.map((req, index) => (
                  <input
                    key={index}
                    type="text"
                    value={req}
                    onChange={(e) => {
                      const newReqs = [...formData.requirements];
                      newReqs[index] = e.target.value;
                      setFormData((prev) => ({ ...prev, requirements: newReqs }));
                    }}
                    placeholder={`Requirement ${index + 1} (e.g., "Please provide your brand colors")`}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, requirements: [...prev.requirements, ""] }))}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <Plus className="h-4 w-4" /> Add Requirement
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">FAQs (Optional)</h2>
                <p className="text-sm text-gray-500">Answer common questions buyers might have</p>
              </div>

              <div className="space-y-4">
                {formData.faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[index].question = e.target.value;
                        setFormData((prev) => ({ ...prev, faqs: newFaqs }));
                      }}
                      placeholder="Question"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => {
                        const newFaqs = [...formData.faqs];
                        newFaqs[index].answer = e.target.value;
                        setFormData((prev) => ({ ...prev, faqs: newFaqs }));
                      }}
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }))}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                >
                  <Plus className="h-4 w-4" /> Add FAQ
                </button>
              </div>
            </div>

            {/* Info Banner */}
            <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-800">Service Review</p>
                <p className="text-sm text-blue-700">Your service will be reviewed by our team before going live. This usually takes 12-24 hours.</p>
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
                "Submit Service"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

