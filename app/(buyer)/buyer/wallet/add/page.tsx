"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CreditCard, Building2, Smartphone, Bitcoin, Shield, CheckCircle, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "bank" | "ussd" | "crypto";

const paymentMethods = [
  { id: "card" as PaymentMethod, name: "Card Payment", icon: CreditCard, description: "Visa, Mastercard, Verve" },
  { id: "bank" as PaymentMethod, name: "Bank Transfer", icon: Building2, description: "Direct bank transfer" },
  { id: "ussd" as PaymentMethod, name: "USSD", icon: Smartphone, description: "Pay with USSD code" },
  { id: "crypto" as PaymentMethod, name: "Cryptocurrency", icon: Bitcoin, description: "BTC, ETH, USDT" },
];

const quickAmounts = ["₦5,000", "₦10,000", "₦25,000", "₦50,000", "₦100,000"];

function AddFundsContent() {
  const searchParams = useSearchParams();
  const methodParam = searchParams.get("method") as PaymentMethod | null;
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(methodParam || "card");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except for the Naira symbol
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue) {
      setAmount(`₦${parseInt(numericValue).toLocaleString()}`);
    } else {
      setAmount("");
    }
  };

  const handleQuickAmount = (quickAmount: string) => {
    setAmount(quickAmount);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment initiated!");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/buyer/wallet" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add Funds</h1>
          <p className="text-gray-600 mt-1">Top up your wallet balance</p>
        </div>
      </div>

      {/* Amount Input */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Amount
        </label>
        <input
          type="text"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder="₦0"
          className="w-full text-3xl font-bold text-gray-900 border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 pb-2 bg-transparent"
        />
        <div className="flex flex-wrap gap-2 mt-4">
          {quickAmounts.map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => handleQuickAmount(quickAmount)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg border transition-colors",
                amount === quickAmount
                  ? "bg-red-50 border-red-500 text-red-600"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              )}
            >
              {quickAmount}
            </button>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                  selectedMethod === method.id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  selectedMethod === method.id ? "bg-red-100" : "bg-gray-100"
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    selectedMethod === method.id ? "text-red-600" : "text-gray-600"
                  )} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-red-600 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Details Based on Method */}
      {selectedMethod === "card" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Card Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {selectedMethod === "bank" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Bank Transfer Details</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Bank Name</span>
              <span className="font-semibold text-gray-900">ShareUpdate Bank</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">0123456789</span>
                <button className="p-1 hover:bg-gray-200 rounded">
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Account Name</span>
              <span className="font-semibold text-gray-900">ShareUpdate Escrow</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Transfer the exact amount to the account above. Your wallet will be credited automatically within 5 minutes.
          </p>
        </div>
      )}

      {selectedMethod === "ussd" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">USSD Payment</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>Select your bank</option>
              <option>GTBank (*737#)</option>
              <option>First Bank (*894#)</option>
              <option>UBA (*919#)</option>
              <option>Zenith Bank (*966#)</option>
              <option>Access Bank (*901#)</option>
            </select>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Dial the code below on your phone</p>
            <p className="text-2xl font-mono font-bold text-gray-900">*737*50*{amount ? amount.replace(/[^0-9]/g, "") : "0"}#</p>
          </div>
        </div>
      )}

      {selectedMethod === "crypto" && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Cryptocurrency</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Cryptocurrency</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
              <option>Bitcoin (BTC)</option>
              <option>Ethereum (ETH)</option>
              <option>USDT (TRC20)</option>
              <option>USDT (ERC20)</option>
            </select>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-2">Send to this address</p>
            <p className="text-sm font-mono bg-white p-2 rounded border break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-green-800">Secure Payment</p>
          <p className="text-sm text-green-700">Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!amount || isProcessing}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 h-auto text-lg font-bold disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Add ${amount || "₦0"} to Wallet`
        )}
      </Button>
    </div>
  );
}

export default function AddFundsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>}>
      <AddFundsContent />
    </Suspense>
  );
}

