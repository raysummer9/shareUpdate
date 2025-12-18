"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  Mail, 
  AtSign, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  Wallet, 
  Users, 
  Headphones,
  Star,
  UserPlus,
  Check,
  X,
  ShoppingBag,
  Store,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function GetStartedPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  const [accountType, setAccountType] = useState<"buyer" | "seller" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation checks
  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const allPasswordChecksPass = Object.values(passwordChecks).every(Boolean);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!accountType) {
      setError("Please select whether you want to be a Buyer or Seller");
      return;
    }

    if (!allPasswordChecksPass) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            username: formData.username,
            phone: formData.phone,
            role: accountType,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        // Redirect based on account type
        router.push(accountType === "seller" ? "/seller" : "/buyer");
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err instanceof Error) {
        // Handle specific Supabase errors
        if (err.message.includes("already registered")) {
          setError("This email is already registered. Please sign in instead.");
        } else if (err.message.includes("invalid")) {
          setError("Please check your email format and try again.");
        } else {
          setError(err.message);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Get your products delivered automatically within seconds of purchase",
    },
    {
      icon: Shield,
      title: "Secure Escrow",
      description: "Your funds are protected with our secure escrow system",
    },
    {
      icon: Wallet,
      title: "Multi-Currency Support",
      description: "Pay with NGN or cryptocurrency - your choice",
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Join thousands of verified buyers and sellers",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is always here to help you succeed",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/ShareUpdate.png"
              alt="Share Update"
              width={150}
              height={40}
              className="h-auto w-[120px] sm:w-[150px]"
            />
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 hidden sm:inline">Already have an account?</span>
            <Link href="/sign-in" className="text-red-600 font-medium hover:text-red-700">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Trust Banner */}
      <div 
        className="lg:hidden py-4 px-4"
        style={{
          background: 'linear-gradient(to right, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)'
        }}
      >
        <div className="flex items-center justify-center gap-6 text-white text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>Trusted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Headphones className="h-4 w-4" />
            <span>24/7</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="flex-1 bg-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-12 xl:px-16 flex justify-center lg:justify-end">
          <div className="max-w-md w-full lg:mr-24 xl:mr-32">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Join thousands of users buying and selling digital products
            </p>

            {/* Social Login Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-6">
              <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="font-medium text-gray-700 text-xs sm:text-base">Google</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="font-medium text-gray-700 text-xs sm:text-base">Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Choose Your Path */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose your path <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType("buyer")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    accountType === "buyer"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {accountType === "buyer" && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    accountType === "buyer" ? "bg-red-100" : "bg-gray-100"
                  )}>
                    <ShoppingBag className={cn(
                      "h-6 w-6",
                      accountType === "buyer" ? "text-red-600" : "text-gray-500"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "font-semibold text-sm",
                      accountType === "buyer" ? "text-red-600" : "text-gray-900"
                    )}>Buyer</p>
                    <p className="text-xs text-gray-500">Buy products & services</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType("seller")}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    accountType === "seller"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {accountType === "seller" && (
                    <div className="absolute top-2 right-2">
                      <Check className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    accountType === "seller" ? "bg-red-100" : "bg-gray-100"
                  )}>
                    <Store className={cn(
                      "h-6 w-6",
                      accountType === "seller" ? "text-red-600" : "text-gray-500"
                    )} />
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "font-semibold text-sm",
                      accountType === "seller" ? "text-red-600" : "text-gray-900"
                    )}>Seller</p>
                    <p className="text-xs text-gray-500">Sell products & services</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="johndoe"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This will be your unique identifier on the platform
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 800 000 0000"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {/* Password Requirements */}
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-1 gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1">
                    {passwordChecks.minLength ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn("text-[10px] sm:text-xs", passwordChecks.minLength ? "text-green-600" : "text-gray-500")}>
                      8+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordChecks.hasUppercase ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn("text-[10px] sm:text-xs", passwordChecks.hasUppercase ? "text-green-600" : "text-gray-500")}>
                      Uppercase
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordChecks.hasLowercase ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn("text-[10px] sm:text-xs", passwordChecks.hasLowercase ? "text-green-600" : "text-gray-500")}>
                      Lowercase
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordChecks.hasNumber ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn("text-[10px] sm:text-xs", passwordChecks.hasNumber ? "text-green-600" : "text-gray-500")}>
                      Number
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {passwordChecks.hasSpecial ? (
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="h-3 w-3 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={cn("text-[10px] sm:text-xs", passwordChecks.hasSpecial ? "text-green-600" : "text-gray-500")}>
                      Special (!@#$)
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{" "}
                    <Link href="/terms" className="text-red-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-red-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receiveUpdates}
                    onChange={(e) => setReceiveUpdates(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">
                    I want to receive updates, promotions, and tips via email
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!agreeTerms || !accountType || isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-red-600 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Features */}
        <div
          className="hidden lg:block lg:w-[45%] xl:w-[40%] py-12 px-6 lg:px-12 xl:px-16"
          style={{
            background: 'linear-gradient(to bottom right, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)'
          }}
        >
          <div className="max-w-md mx-auto lg:mx-0">
            {/* Shield Icon */}
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Join Share Update Today
            </h2>
            <p className="text-white/90 mb-8">
              Create your free account and unlock access to thousands of digital products and services.
            </p>

            {/* Features List */}
            <div className="space-y-5 mb-10">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-sm text-white/80">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder-avatar.png"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="font-medium text-white">Sarah Johnson</p>
                </div>
              </div>
              <p className="text-white/90 text-sm italic">
                "Share Update made it so easy to buy and sell digital products. The instant delivery and secure payment system give me peace of mind!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-3 sm:py-4 px-4 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © 2024 Share Update. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/terms" className="text-gray-400 text-xs sm:text-sm hover:text-white">Terms</Link>
            <Link href="/privacy" className="text-gray-400 text-xs sm:text-sm hover:text-white">Privacy</Link>
            <Link href="/help" className="text-gray-400 text-xs sm:text-sm hover:text-white">Help</Link>
            <Link href="/contact" className="text-gray-400 text-xs sm:text-sm hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

