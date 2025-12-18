"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowDownLeft, ArrowUpRight, RefreshCw, CreditCard, Building2, Smartphone, Bitcoin, Download, Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useWalletTransactions, useWalletStats } from "@/lib/hooks/use-wallet";

type TransactionFilter = "all" | "deposits" | "purchases" | "refunds";

const transactionIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  deposit: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  purchase: { icon: ArrowUpRight, bg: "bg-red-100", color: "text-red-600" },
  withdrawal: { icon: ArrowUpRight, bg: "bg-blue-100", color: "text-blue-600" },
  refund: { icon: ArrowDownLeft, bg: "bg-blue-100", color: "text-blue-600" },
  escrow_hold: { icon: RefreshCw, bg: "bg-yellow-100", color: "text-yellow-600" },
  escrow_release: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  fee: { icon: ArrowUpRight, bg: "bg-gray-100", color: "text-gray-600" },
  bonus: { icon: ArrowDownLeft, bg: "bg-purple-100", color: "text-purple-600" },
};

interface TransactionItemProps {
  type: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  status: string;
}

function TransactionItem({ type, title, description, amount, date, status }: TransactionItemProps) {
  const config = transactionIcons[type] || transactionIcons.deposit;
  const Icon = config.icon;
  const isPositive = amount > 0;

  // Format currency
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(Math.abs(amt));
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bg)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{title}</p>
            {status === "pending" && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
            )}
          </div>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-semibold", isPositive ? "text-green-600" : "text-gray-900")}>
          {isPositive ? "+" : "-"}{formatCurrency(amount)}
        </p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [filter, setFilter] = useState<TransactionFilter>("all");

  const { user, wallet, loading: authLoading } = useAuth();
  const { transactions, loading: txLoading } = useWalletTransactions(wallet?.id ?? null);
  const { stats, loading: statsLoading } = useWalletStats(wallet?.id ?? null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "deposits") return t.type === "deposit" || t.type === "bonus";
    if (filter === "purchases") return t.type === "purchase" || t.type === "escrow_hold";
    if (filter === "refunds") return t.type === "refund" || t.type === "escrow_release";
    return true;
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const availableBalance = wallet?.available_balance || 0;
  const pendingBalance = wallet?.pending_balance || 0;
  const totalSpent = stats.totalSpent || 0;

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
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-5 w-5 opacity-80" />
            <p className="text-sm opacity-80">Available Balance</p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
          <p className="text-xs opacity-80 mt-2">Ready to spend</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">In Escrow</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{formatCurrency(pendingBalance)}</p>
          <p className="text-xs text-gray-400 mt-2">Pending trades</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpent)}</p>
          <p className="text-xs text-gray-400 mt-2">Lifetime purchases</p>
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
          {txLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
              <p className="text-gray-500 mt-2">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                type={transaction.type}
                title={transaction.description || transaction.type.replace(/_/g, " ")}
                description={transaction.reference || ""}
                amount={transaction.amount}
                date={formatDate(transaction.created_at!)}
                status={transaction.status || "completed"}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No transactions yet</p>
              <Link href="/buyer/wallet/add">
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Add Funds
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
