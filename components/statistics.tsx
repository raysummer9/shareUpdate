"use client";

import { motion } from "framer-motion";

const statistics = [
  { value: "50K+", label: "Active Users" },
  { value: "2.5B+", label: "Transactions" },
  { value: "15K+", label: "Products Listed" },
  { value: "99.8%", label: "Success Rate" },
];

export function Statistics() {
  return (
    <section className="relative w-full bg-white">
      {/* Top red line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-red-600" />
      
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

