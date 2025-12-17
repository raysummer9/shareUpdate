"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 bg-red-600">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Ready to Get Started?
          </h2>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 md:mb-12 px-2">
            Join thousands of buyers and sellers trading digital products securely
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto">
            <Button
              asChild
              className="bg-white text-red-600 hover:bg-red-50 font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-md w-full sm:w-auto"
            >
              <Link href="/sign-up">Create Free Account</Link>
            </Button>
            <Button
              asChild
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-md w-full sm:w-auto"
            >
              <Link href="/browse">Browse Marketplace</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

