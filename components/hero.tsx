"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Rocket, CreditCard, ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section 
      className="flex flex-col lg:flex-row min-h-[600px]"
      style={{
        background: 'linear-gradient(to right, #DC2626 0%, #B91C1C 50%, #7F1D1D 100%)'
      }}
    >
      {/* Left Section - Hero Content (50% width) */}
      <div className="w-full lg:w-1/2 py-16 lg:py-20 flex flex-col justify-center relative">
        {/* Wrapper that breaks out of 50% constraint to align with navbar */}
        <div className="relative">
          <div className="px-4" style={{ 
            marginLeft: 'max(1rem, calc((100vw - min(100vw, 1280px)) / 2))',
            maxWidth: '1280px'
          }}>
            <div className="max-w-2xl">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
              >
                Buy & Sell Digital Products with Confidence
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                The secure marketplace for social media accounts, digital services, and any product with login credentials. Automatic delivery, escrow protection, and 24/7 support.
              </motion.p>

              {/* Call-to-Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Button
                  asChild
                  className="bg-white text-red-600 hover:bg-red-50 font-bold px-8 py-6 text-lg rounded-md"
                >
                  <Link href="/browse" className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Start Buying
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-red-600 text-white hover:bg-red-700 font-bold px-8 py-6 text-lg rounded-md"
                >
                  <Link href="/sell" className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Start Selling
                  </Link>
                </Button>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-6 md:gap-8"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-green-500 fill-green-500" />
                  <span className="text-white font-medium">Escrow Protection</span>
                </div>
                <div className="flex items-center gap-3">
                  <Rocket className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white font-medium">Instant Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-pink-500 fill-pink-500" />
                  <span className="text-white font-medium">Secure Payments</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Visual Element (50% width) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full lg:w-1/2 relative overflow-hidden flex items-center justify-center p-8"
      >
        <div className="relative w-full h-full max-w-2xl">
          <Image
            src="/hero-img.png"
            alt="Hero illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
