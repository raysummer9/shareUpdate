"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Store } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const buyerSteps = [
  {
    number: 1,
    title: "Browse or Request",
    description: "Search products or post a request for what you need. Sellers will bid on your request.",
  },
  {
    number: 2,
    title: "Add Funds & Purchase",
    description: "Top up your wallet with NGN or Crypto. Buy instantly or choose a seller's bid.",
  },
  {
    number: 3,
    title: "Receive & Confirm",
    description: "Get instant delivery for products or wait for service completion. Confirm satisfaction to release escrow.",
  },
  {
    number: 4,
    title: "Rate & Review",
    description: "Leave feedback to help other buyers. Report any issues for admin review.",
  },
];

const sellerSteps = [
  {
    number: 1,
    title: "List Your Products",
    description: "Upload products with login credentials or list your services. Add images and descriptions.",
  },
  {
    number: 2,
    title: "Bid on Requests",
    description: "Get notified of buyer requests. Submit competitive bids with pricing and delivery time.",
  },
  {
    number: 3,
    title: "Deliver & Earn",
    description: "Products deliver automatically. For services, deliver as agreed and wait for buyer confirmation.",
  },
  {
    number: 4,
    title: "Withdraw Earnings",
    description: "Request manual withdrawals to your bank or crypto wallet. Build your reputation with ratings.",
  },
];

interface StepsListProps {
  steps: typeof buyerSteps;
  color: "red" | "green";
}

function StepsList({ steps, color }: StepsListProps) {
  const bgColor = color === "red" ? "bg-red-600" : "bg-green-600";
  
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex gap-4"
        >
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{step.number}</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
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
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, secure, and straightforward process for buyers and sellers.
          </p>
        </motion.div>

        {/* Mobile Tabs */}
        <div className="lg:hidden">
          <Tabs defaultValue="buyers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="buyers" className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                For Buyers
              </TabsTrigger>
              <TabsTrigger value="sellers" className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                For Sellers
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="buyers">
              <StepsList steps={buyerSteps} color="red" />
            </TabsContent>
            
            <TabsContent value="sellers">
              <StepsList steps={sellerSteps} color="green" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Two Columns */}
        <div className="hidden lg:grid grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* For Buyers */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <ShoppingBag className="h-6 w-6 text-red-600" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">For Buyers</h3>
            </div>
            <StepsList steps={buyerSteps} color="red" />
          </motion.div>

          {/* For Sellers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Store className="h-6 w-6 text-green-600" />
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">For Sellers</h3>
            </div>
            <StepsList steps={sellerSteps} color="green" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
