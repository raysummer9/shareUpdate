"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Wallet, TrendingUp, Clock, Building2, CreditCard, Download, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { useWalletTransactions, useBankAccounts, useWalletStats } from "@/lib/hooks/use-wallet";

type TransactionFilter = "all" | "sales" | "withdrawals" | "pending";

const transactionIcons: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  sale: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  deposit: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  withdrawal: { icon: ArrowUpRight, bg: "bg-blue-100", color: "text-blue-600" },
  refund: { icon: RefreshCw, bg: "bg-red-100", color: "text-red-600" },
  escrow_hold: { icon: Clock, bg: "bg-yellow-100", color: "text-yellow-600" },
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
  const config = transactionIcons[type] || transactionIcons.sale;
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

export default function SellerWalletPage() {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const { user, wallet, loading: authLoading } = useAuth();
  const { transactions, loading: txLoading } = useWalletTransactions(wallet?.id ?? null);
  const { accounts: bankAccounts, loading: accountsLoading } = useBankAccounts(user?.id ?? null);
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
    if (filter === "sales") return t.type === "sale" || t.type === "escrow_release";
    if (filter === "withdrawals") return t.type === "withdrawal";
    if (filter === "pending") return t.status === "pending";
    return true;
  });

  // Check for pending withdrawals
  const pendingWithdrawals = transactions.filter(t => t.type === "withdrawal" && t.status === "pending");
  const pendingWithdrawalAmount = pendingWithdrawals.reduce((acc, t) => acc + Math.abs(t.amount), 0);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  const availableBalance = wallet?.available_balance || 0;
  const pendingBalance = wallet?.pending_balance || 0;
  const totalEarned = wallet?.total_earned || 0;
  const totalWithdrawn = wallet?.total_withdrawn || 0;

  const primaryAccount = bankAccounts.find(a => a.is_primary) || bankAccounts[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your earnings and withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white" 
            onClick={() => setShowWithdrawModal(true)}
            disabled={availableBalance <= 0}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-5 w-5 opacity-80" />
            <p className="text-sm opacity-80">Available Balance</p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(availableBalance)}</p>
          <p className="text-xs opacity-80 mt-2">Ready to withdraw</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(pendingBalance)}</p>
          <p className="text-xs text-gray-400 mt-2">In escrow</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-500">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalEarned)}</p>
          <p className="text-xs text-green-600 mt-2">Lifetime earnings</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight className="h-5 w-5 text-purple-500" />
            <p className="text-sm text-gray-500">Total Withdrawn</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalWithdrawn)}</p>
          <p className="text-xs text-gray-400 mt-2">Lifetime withdrawals</p>
        </div>
      </div>

      {/* Pending Withdrawal Alert */}
      {pendingWithdrawals.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Pending Withdrawal</p>
            <p className="text-sm text-yellow-700">
              You have a withdrawal of {formatCurrency(pendingWithdrawalAmount)} pending approval. This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      )}

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Withdrawal Methods</h2>
          <Button variant="outline" size="sm">+ Add New</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accountsLoading ? (
            <div className="col-span-2 text-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
            </div>
          ) : bankAccounts.length > 0 ? (
            <>
              {bankAccounts.map((account) => (
                <div 
                  key={account.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl",
                    account.is_primary 
                      ? "border-2 border-green-500 bg-green-50" 
                      : "border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    account.is_primary ? "bg-green-100" : "bg-gray-100"
                  )}>
                    <Building2 className={cn("h-6 w-6", account.is_primary ? "text-green-600" : "text-gray-600")} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{account.bank_name}</p>
                    <p className="text-sm text-gray-500">****{account.account_number.slice(-4)} • {account.account_name}</p>
                  </div>
                  {account.is_primary && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
              ))}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Add Bank Account</p>
                  <p className="text-sm text-gray-500">Link another bank</p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Add Bank Account</p>
                <p className="text-sm text-gray-500">Link a bank to withdraw funds</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {(["all", "sales", "withdrawals", "pending"] as TransactionFilter[]).map((f) => (
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
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="text"
                  placeholder="₦0"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full text-2xl font-bold text-gray-900 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Available: {formatCurrency(availableBalance)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw to</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  {bankAccounts.length > 0 ? (
                    bankAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bank_name} ****{account.account_number.slice(-4)}
                      </option>
                    ))
                  ) : (
                    <option disabled>No bank accounts linked</option>
                  )}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  disabled={!withdrawAmount || bankAccounts.length === 0}
                >
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
