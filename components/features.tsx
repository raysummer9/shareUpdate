"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Handshake, Wallet, Gavel, Star } from "lucide-react";

const features = [
  {
    icon: Zap,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    title: "Automatic Delivery",
    description: "Buy products with login credentials and receive them instantly. No waiting for sellers to be online.",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Escrow Protection",
    description: "All service transactions are protected by escrow. Funds released only when you're satisfied.",
  },
  {
    icon: Handshake,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    title: "Request & Bid System",
    description: "Post what you need and receive competitive bids from verified sellers. Choose the best offer.",
  },
  {
    icon: Wallet,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-50",
    title: "Multi-Currency Support",
    description: "Pay with NGN or Crypto (USDT, BTC). Auto-swap gateways for seamless transactions.",
  },
  {
    icon: Gavel,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    title: "Dispute Resolution",
    description: "Report issues anytime. Our admin team reviews evidence and ensures fair outcomes for all parties.",
  },
  {
    icon: Star,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    title: "Ratings & Reviews",
    description: "Build trust with verified ratings and reviews. See seller reputation before making a purchase.",
  },
];

export function Features() {
  return (
    <section className="w-full py-16 md:py-24" style={{ backgroundColor: '#F9FAFB' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Share Update?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Built for security, speed, and trust. Everything you need to buy and sell digital products safely.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className={`${feature.iconBg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className={`h-6 w-6 ${feature.iconColor} fill-current`} />
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

