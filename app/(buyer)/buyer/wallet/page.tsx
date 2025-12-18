"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, Building2, Smartphone, Bitcoin, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransactionFilter = "all" | "deposits" | "purchases" | "refunds";

interface Transaction {
  id: string;
  type: "deposit" | "purchase" | "refund" | "escrow";
  title: string;
  description: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const transactions: Transaction[] = [
  { id: "1", type: "deposit", title: "Funds Added", description: "Bank Transfer", amount: "+₦50,000", date: "Jan 15, 2024", status: "completed" },
  { id: "2", type: "purchase", title: "Instagram Account - Fashion", description: "Digital Assets Pro", amount: "-₦45,000", date: "Jan 14, 2024", status: "completed" },
  { id: "3", type: "escrow", title: "Escrow - Web Development", description: "WebDev Solutions", amount: "-₦75,000", date: "Jan 13, 2024", status: "pending" },
  { id: "4", type: "refund", title: "Refund - Cancelled Order", description: "Logo Design Service", amount: "+₦25,000", date: "Jan 12, 2024", status: "completed" },
  { id: "5", type: "deposit", title: "Funds Added", description: "Card Payment", amount: "+₦100,000", date: "Jan 10, 2024", status: "completed" },
  { id: "6", type: "purchase", title: "Twitter Account - Crypto", description: "CryptoAssets", amount: "-₦35,000", date: "Jan 8, 2024", status: "completed" },
];

const transactionIcons: Record<Transaction["type"], { icon: React.ElementType; bg: string; color: string }> = {
  deposit: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  purchase: { icon: ArrowUpRight, bg: "bg-red-100", color: "text-red-600" },
  refund: { icon: ArrowDownLeft, bg: "bg-blue-100", color: "text-blue-600" },
  escrow: { icon: RefreshCw, bg: "bg-yellow-100", color: "text-yellow-600" },
};

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { icon: Icon, bg, color } = transactionIcons[transaction.type];
  const isPositive = transaction.amount.startsWith("+");

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
          <p className="text-xs text-gray-500">{transaction.description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-semibold", isPositive ? "text-green-600" : "text-gray-900")}>
          {transaction.amount}
        </p>
        <p className="text-xs text-gray-500">{transaction.date}</p>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [filter, setFilter] = useState<TransactionFilter>("all");

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "deposits") return t.type === "deposit";
    if (filter === "purchases") return t.type === "purchase";
    if (filter === "refunds") return t.type === "refund";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your funds and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/buyer/wallet/add">
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </Link>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-80">Available Balance</p>
          <p className="text-3xl font-bold mt-1">₦85,250</p>
          <p className="text-xs opacity-80 mt-2">Updated just now</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">In Escrow</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">₦75,000</p>
          <p className="text-xs text-gray-400 mt-2">1 active trade</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">₦280,000</p>
          <p className="text-xs text-gray-400 mt-2">This month</p>
        </div>
      </div>

      {/* Quick Add Methods */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Add Funds</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link href="/buyer/wallet/add?method=card" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors">
            <CreditCard className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Card</span>
          </Link>
          <Link href="/buyer/wallet/add?method=bank" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors">
            <Building2 className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Bank Transfer</span>
          </Link>
          <Link href="/buyer/wallet/add?method=ussd" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors">
            <Smartphone className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">USSD</span>
          </Link>
          <Link href="/buyer/wallet/add?method=crypto" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors">
            <Bitcoin className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Crypto</span>
          </Link>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(["all", "deposits", "purchases", "refunds"] as TransactionFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize whitespace-nowrap",
                    filter === f
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

