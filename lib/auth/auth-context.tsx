"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Wallet = Database["public"]["Tables"]["wallets"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  wallet: Wallet | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create supabase client once and memoize it
  const supabase = useMemo(() => createClient(), []);

  // Fetch user profile from the database
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile");
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      return null;
    }
  }, [supabase]);

  // Fetch user wallet from the database
  const fetchWallet = useCallback(async (userId: string) => {
    try {
      const { data, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (walletError) {
        console.error("Error fetching wallet:", walletError);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Error in fetchWallet:", err);
      return null;
    }
  }, [supabase]);

  // Refresh profile data
  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user?.id, fetchProfile]);

  // Refresh wallet data
  const refreshWallet = useCallback(async () => {
    if (user?.id) {
      const walletData = await fetchWallet(user.id);
      setWallet(walletData);
    }
  }, [user?.id, fetchWallet]);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
      } else {
        setUser(null);
        setProfile(null);
        setWallet(null);
        setSession(null);
      }
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Fetch profile and wallet in parallel
          const [profileData, walletData] = await Promise.all([
            fetchProfile(currentSession.user.id),
            fetchWallet(currentSession.user.id),
          ]);

          setProfile(profileData);
          setWallet(walletData);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);

        if (event === "SIGNED_IN" && newSession?.user) {
          setSession(newSession);
          setUser(newSession.user);

          // Fetch profile and wallet
          const [profileData, walletData] = await Promise.all([
            fetchProfile(newSession.user.id),
            fetchWallet(newSession.user.id),
          ]);

          setProfile(profileData);
          setWallet(walletData);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setProfile(null);
          setWallet(null);
        } else if (event === "TOKEN_REFRESHED" && newSession) {
          setSession(newSession);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, fetchWallet]);

  const value: AuthContextType = {
    user,
    profile,
    wallet,
    session,
    loading,
    error,
    signOut,
    refreshProfile,
    refreshWallet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hook to check if user is a seller
export function useIsSeller() {
  const { profile } = useAuth();
  return profile?.role === "seller";
}

// Helper hook to check if user is a buyer
export function useIsBuyer() {
  const { profile } = useAuth();
  return profile?.role === "buyer";
}

// Helper hook to check if user is an admin
export function useIsAdmin() {
  const { profile } = useAuth();
  return profile?.role === "admin";
}

// Helper hook to require authentication
export function useRequireAuth(redirectTo: string = "/sign-in") {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectTo;
    }
  }, [user, loading, redirectTo]);

  return { user, loading };
}

