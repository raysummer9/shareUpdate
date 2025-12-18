"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Wallet = Database["public"]["Tables"]["wallets"]["Row"];
type WalletTransaction = Database["public"]["Tables"]["wallet_transactions"]["Row"];
type BankAccount = Database["public"]["Tables"]["bank_accounts"]["Row"];

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "purchase"
  | "sale"
  | "escrow_hold"
  | "escrow_release"
  | "refund"
  | "fee"
  | "bonus";

export interface TransactionFilters {
  type?: TransactionType | TransactionType[];
  status?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

// Hook for fetching user wallet
export function useWallet(userId: string | null) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchWallet = useCallback(async () => {
    if (!userId) {
      setWallet(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (fetchError) throw fetchError;

      setWallet(data);
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch wallet");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { wallet, loading, error, refetch: fetchWallet };
}

// Hook for fetching wallet transactions
export function useWalletTransactions(walletId: string | null, filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  // Memoize filter values to prevent infinite loops
  const filterType = filters?.type;
  const filterStatus = filters?.status;
  const filterLimit = filters?.limit;
  const filterOffset = filters?.offset;

  const fetchTransactions = useCallback(async () => {
    if (!walletId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("wallet_transactions")
        .select("*", { count: "exact" })
        .eq("wallet_id", walletId);

      // Apply filters
      if (filterType) {
        if (Array.isArray(filterType)) {
          query = query.in("type", filterType);
        } else {
          query = query.eq("type", filterType);
        }
      }

      if (filterStatus) {
        query = query.eq("status", filterStatus);
      }

      // Sort by newest first
      query = query.order("created_at", { ascending: false });

      // Apply pagination
      if (filterLimit) {
        query = query.limit(filterLimit);
      }

      if (filterOffset) {
        query = query.range(filterOffset, filterOffset + (filterLimit || 10) - 1);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setTransactions(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, [walletId, supabase, filterType, filterStatus, filterLimit, filterOffset]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, error, totalCount, refetch: fetchTransactions };
}

// Hook for user's bank accounts
export function useBankAccounts(userId: string | null) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchAccounts = useCallback(async () => {
    if (!userId) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false });

      if (fetchError) throw fetchError;

      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch bank accounts");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return { accounts, loading, error, refetch: fetchAccounts };
}

// Hook for wallet mutations
export function useWalletMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Add bank account
  const addBankAccount = async (
    userId: string,
    accountData: {
      bank_name: string;
      bank_code: string;
      account_number: string;
      account_name: string;
      is_default?: boolean;
    }
  ): Promise<BankAccount | null> => {
    setLoading(true);
    setError(null);

    try {
      // If this is the default, unset other defaults
      if (accountData.is_default) {
        await supabase
          .from("bank_accounts")
          .update({ is_default: false })
          .eq("user_id", userId);
      }

      const { data, error: createError } = await supabase
        .from("bank_accounts")
        .insert({
          user_id: userId,
          ...accountData,
        })
        .select()
        .single();

      if (createError) throw createError;

      return data;
    } catch (err) {
      console.error("Error adding bank account:", err);
      setError(err instanceof Error ? err.message : "Failed to add bank account");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete bank account
  const deleteBankAccount = async (accountId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", accountId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error("Error deleting bank account:", err);
      setError(err instanceof Error ? err.message : "Failed to delete bank account");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Set default bank account
  const setDefaultBankAccount = async (
    userId: string,
    accountId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Unset all defaults
      await supabase
        .from("bank_accounts")
        .update({ is_default: false })
        .eq("user_id", userId);

      // Set new default
      const { error: updateError } = await supabase
        .from("bank_accounts")
        .update({ is_default: true })
        .eq("id", accountId);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error("Error setting default bank account:", err);
      setError(err instanceof Error ? err.message : "Failed to set default account");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Request withdrawal (will be processed by admin/payment system)
  const requestWithdrawal = async (
    walletId: string,
    amount: number,
    bankAccountId: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Create pending withdrawal transaction
      const { error: createError } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: walletId,
          type: "withdrawal",
          amount: -amount,
          fee: 0,
          net_amount: -amount,
          status: "pending",
          description: "Withdrawal request",
          metadata: { bank_account_id: bankAccountId },
        });

      if (createError) throw createError;

      return true;
    } catch (err) {
      console.error("Error requesting withdrawal:", err);
      setError(err instanceof Error ? err.message : "Failed to request withdrawal");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    addBankAccount,
    deleteBankAccount,
    setDefaultBankAccount,
    requestWithdrawal,
    loading,
    error,
  };
}

// Hook for wallet summary stats
export function useWalletStats(walletId: string | null) {
  const [stats, setStats] = useState({
    total_deposits: 0,
    total_withdrawals: 0,
    total_spent: 0,
    total_earned: 0,
    pending_transactions: 0,
  });
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!walletId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);

      try {
        // Fetch aggregated stats from transactions
        const { data: transactions, error } = await supabase
          .from("wallet_transactions")
          .select("type, amount, status")
          .eq("wallet_id", walletId)
          .eq("status", "completed");

        if (error) throw error;

        const calculatedStats = {
          total_deposits: 0,
          total_withdrawals: 0,
          total_spent: 0,
          total_earned: 0,
          pending_transactions: 0,
        };

        transactions?.forEach((tx) => {
          switch (tx.type) {
            case "deposit":
            case "bonus":
              calculatedStats.total_deposits += Math.abs(tx.amount || 0);
              break;
            case "withdrawal":
              calculatedStats.total_withdrawals += Math.abs(tx.amount || 0);
              break;
            case "purchase":
            case "escrow_hold":
              calculatedStats.total_spent += Math.abs(tx.amount || 0);
              break;
            case "sale":
            case "escrow_release":
              calculatedStats.total_earned += Math.abs(tx.amount || 0);
              break;
          }
        });

        // Get pending count
        const { count: pendingCount } = await supabase
          .from("wallet_transactions")
          .select("*", { count: "exact", head: true })
          .eq("wallet_id", walletId)
          .eq("status", "pending");

        calculatedStats.pending_transactions = pendingCount || 0;

        setStats(calculatedStats);
      } catch (err) {
        console.error("Error fetching wallet stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [walletId, supabase]);

  return { stats, loading };
}

