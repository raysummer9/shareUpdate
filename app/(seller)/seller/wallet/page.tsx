"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Wallet, TrendingUp, Clock, Building2, CreditCard, Download, Filter, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TransactionFilter = "all" | "sales" | "withdrawals" | "pending";

interface Transaction {
  id: string;
  type: "sale" | "withdrawal" | "refund" | "pending_withdrawal";
  title: string;
  description: string;
  amount: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const transactions: Transaction[] = [
  { id: "1", type: "sale", title: "Sale - Instagram Account", description: "Buyer: Michael Chen", amount: "+₦40,500", date: "Jan 15, 2024", status: "completed" },
  { id: "2", type: "pending_withdrawal", title: "Withdrawal Request", description: "Bank: GTBank ****1234", amount: "-₦100,000", date: "Jan 14, 2024", status: "pending" },
  { id: "3", type: "sale", title: "Sale - YouTube Channel", description: "Buyer: Sarah Johnson", amount: "+₦108,000", date: "Jan 13, 2024", status: "completed" },
  { id: "4", type: "withdrawal", title: "Withdrawal Completed", description: "Bank: GTBank ****1234", amount: "-₦75,000", date: "Jan 12, 2024", status: "completed" },
  { id: "5", type: "sale", title: "Sale - Website Design", description: "Buyer: David Williams", amount: "+₦67,500", date: "Jan 10, 2024", status: "completed" },
  { id: "6", type: "refund", title: "Refund Issued", description: "Order #12345 cancelled", amount: "-₦25,000", date: "Jan 8, 2024", status: "completed" },
];

const transactionIcons: Record<Transaction["type"], { icon: React.ElementType; bg: string; color: string }> = {
  sale: { icon: ArrowDownLeft, bg: "bg-green-100", color: "text-green-600" },
  withdrawal: { icon: ArrowUpRight, bg: "bg-blue-100", color: "text-blue-600" },
  refund: { icon: RefreshCw, bg: "bg-red-100", color: "text-red-600" },
  pending_withdrawal: { icon: Clock, bg: "bg-yellow-100", color: "text-yellow-600" },
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
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
            {transaction.status === "pending" && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
            )}
          </div>
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

export default function SellerWalletPage() {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    if (filter === "sales") return t.type === "sale";
    if (filter === "withdrawals") return t.type === "withdrawal" || t.type === "pending_withdrawal";
    if (filter === "pending") return t.status === "pending";
    return true;
  });

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
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setShowWithdrawModal(true)}>
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
          <p className="text-3xl font-bold">₦285,750</p>
          <p className="text-xs opacity-80 mt-2">Ready to withdraw</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">₦156,000</p>
          <p className="text-xs text-gray-400 mt-2">In escrow (3 orders)</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-500">This Month</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦425,000</p>
          <p className="text-xs text-green-600 mt-2">↑ 23% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight className="h-5 w-5 text-purple-500" />
            <p className="text-sm text-gray-500">Total Withdrawn</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">₦1.2M</p>
          <p className="text-xs text-gray-400 mt-2">Lifetime withdrawals</p>
        </div>
      </div>

      {/* Pending Withdrawal Alert */}
      <div className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
        <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-yellow-800">Pending Withdrawal</p>
          <p className="text-sm text-yellow-700">You have a withdrawal of ₦100,000 pending approval. This usually takes 24-48 hours.</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Withdrawal Methods</h2>
          <Button variant="outline" size="sm">+ Add New</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-green-500 bg-green-50">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">GTBank</p>
              <p className="text-sm text-gray-500">****1234 • John Doe</p>
            </div>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Add Bank Account</p>
              <p className="text-sm text-gray-500">Link another bank</p>
            </div>
          </div>
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
                  className="w-full text-2xl font-bold text-gray-900 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Available: ₦285,750</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw to</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option>GTBank ****1234</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
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

