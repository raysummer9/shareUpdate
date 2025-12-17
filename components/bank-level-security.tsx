"use client";

import { motion } from "framer-motion";
import { Lock, Shield, UserCheck } from "lucide-react";

const securityFeatures = [
  {
    icon: Lock,
    iconBg: "bg-red-600",
    title: "2FA Authentication",
    description: "Google Authenticator and email verification for admin access",
  },
  {
    icon: Shield,
    iconBg: "bg-green-600",
    title: "Encrypted Storage",
    description: "All login credentials and sensitive data encrypted at rest",
  },
  {
    icon: UserCheck,
    iconBg: "bg-purple-600",
    title: "Manual Withdrawals",
    description: "Admin-reviewed withdrawals prevent unauthorized access",
  },
];

export function BankLevelSecurity() {
  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#1A1D29' }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight px-2">
            Bank-Level Security
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto px-2">
            Your safety is our top priority
          </p>
        </motion.div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center px-4 sm:px-6 md:px-8"
              >
                {/* Icon */}
                <div className={`${feature.iconBg} w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto`}>
                  <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm sm:text-base md:text-lg px-2">
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

