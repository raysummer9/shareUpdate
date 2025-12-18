"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type BuyerRequest = Database["public"]["Tables"]["buyer_requests"]["Row"];

export interface SearchResult {
  type: "listing" | "request" | "seller";
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: number;
  rating?: number;
  href: string;
}

export interface ListingSearchResult extends Listing {
  seller?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url" | "rating" | "is_verified">;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SearchFilters {
  type?: "product" | "service";
  category_id?: string;
  min_price?: number;
  max_price?: number;
  platform?: string;
  sort_by?: "relevance" | "newest" | "price_asc" | "price_desc" | "rating" | "popular";
  limit?: number;
  offset?: number;
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Main search hook for listings
export function useListingSearch(query: string, filters?: SearchFilters) {
  const [results, setResults] = useState<ListingSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  // Debounce the search query
  const debouncedQuery = useDebounce(query, 300);

  // Memoize filter values
  const filterType = filters?.type;
  const filterCategoryId = filters?.category_id;
  const filterMinPrice = filters?.min_price;
  const filterMaxPrice = filters?.max_price;
  const filterPlatform = filters?.platform;
  const filterSortBy = filters?.sort_by;
  const filterLimit = filters?.limit || 20;
  const filterOffset = filters?.offset || 0;

  const search = useCallback(async () => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let dbQuery = supabase
        .from("listings")
        .select(`
          *,
          seller:profiles!listings_seller_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            rating,
            is_verified
          ),
          category:categories!listings_category_id_fkey(
            id,
            name,
            slug
          )
        `, { count: "exact" })
        .eq("status", "active")
        .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`);

      // Apply filters
      if (filterType) {
        dbQuery = dbQuery.eq("type", filterType);
      }

      if (filterCategoryId) {
        dbQuery = dbQuery.eq("category_id", filterCategoryId);
      }

      if (filterMinPrice !== undefined) {
        dbQuery = dbQuery.gte("price", filterMinPrice);
      }

      if (filterMaxPrice !== undefined) {
        dbQuery = dbQuery.lte("price", filterMaxPrice);
      }

      if (filterPlatform) {
        dbQuery = dbQuery.eq("platform", filterPlatform);
      }

      // Apply sorting
      switch (filterSortBy) {
        case "newest":
          dbQuery = dbQuery.order("created_at", { ascending: false });
          break;
        case "price_asc":
          dbQuery = dbQuery.order("price", { ascending: true });
          break;
        case "price_desc":
          dbQuery = dbQuery.order("price", { ascending: false });
          break;
        case "rating":
          dbQuery = dbQuery.order("rating", { ascending: false, nullsFirst: false });
          break;
        case "popular":
          dbQuery = dbQuery.order("sales_count", { ascending: false });
          break;
        case "relevance":
        default:
          // For relevance, we'll order by a combination of factors
          dbQuery = dbQuery.order("sales_count", { ascending: false });
          break;
      }

      // Apply pagination
      dbQuery = dbQuery.range(filterOffset, filterOffset + filterLimit - 1);

      const { data, error: searchError, count } = await dbQuery;

      if (searchError) throw searchError;

      setResults(data || []);
      setTotalCount(count || 0);

    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedQuery,
    supabase,
    filterType,
    filterCategoryId,
    filterMinPrice,
    filterMaxPrice,
    filterPlatform,
    filterSortBy,
    filterLimit,
    filterOffset,
  ]);

  useEffect(() => {
    search();
  }, [search]);

  return {
    results,
    loading,
    error,
    totalCount,
    hasMore: filterOffset + filterLimit < totalCount,
    refetch: search,
  };
}

// Quick search hook (for search bars with instant results)
export function useQuickSearch(query: string, limit: number = 5) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const supabase = useMemo(() => createClient(), []);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);

      try {
        // Search listings
        const { data: listings } = await supabase
          .from("listings")
          .select("id, title, description, images, price, slug")
          .eq("status", "active")
          .or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`)
          .limit(limit);

        const searchResults: SearchResult[] = (listings || []).map((listing) => ({
          type: "listing" as const,
          id: listing.id,
          title: listing.title,
          description: listing.description?.substring(0, 100) || "",
          image: listing.images?.[0] || undefined,
          price: listing.price,
          href: `/product/${listing.slug || listing.id}`,
        }));

        setResults(searchResults);

      } catch (err) {
        console.error("Quick search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery, limit, supabase]);

  return { results, loading };
}

// Seller search hook
export function useSellerSearch(query: string, limit: number = 10) {
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: searchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "seller")
          .or(`username.ilike.%${debouncedQuery}%,full_name.ilike.%${debouncedQuery}%`)
          .order("rating", { ascending: false, nullsFirst: false })
          .limit(limit);

        if (searchError) throw searchError;

        setResults(data || []);

      } catch (err) {
        console.error("Seller search error:", err);
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery, limit, supabase]);

  return { results, loading, error };
}

// Request search hook (for sellers browsing buyer requests)
export function useRequestSearch(query: string, filters?: { category_id?: string; min_budget?: number; max_budget?: number }) {
  const [results, setResults] = useState<BuyerRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);
  const debouncedQuery = useDebounce(query, 300);

  const filterCategoryId = filters?.category_id;
  const filterMinBudget = filters?.min_budget;
  const filterMaxBudget = filters?.max_budget;

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      setError(null);

      try {
        let dbQuery = supabase
          .from("buyer_requests")
          .select(`
            *,
            buyer:profiles!buyer_requests_buyer_id_fkey(
              id,
              username,
              full_name,
              avatar_url
            ),
            category:categories!buyer_requests_category_id_fkey(
              id,
              name,
              slug
            )
          `, { count: "exact" })
          .eq("status", "active");

        // Apply text search if query exists
        if (debouncedQuery && debouncedQuery.trim().length >= 2) {
          dbQuery = dbQuery.or(`title.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%`);
        }

        // Apply filters
        if (filterCategoryId) {
          dbQuery = dbQuery.eq("category_id", filterCategoryId);
        }

        if (filterMinBudget !== undefined) {
          dbQuery = dbQuery.gte("budget_max", filterMinBudget);
        }

        if (filterMaxBudget !== undefined) {
          dbQuery = dbQuery.lte("budget_min", filterMaxBudget);
        }

        dbQuery = dbQuery.order("created_at", { ascending: false });

        const { data, error: searchError, count } = await dbQuery;

        if (searchError) throw searchError;

        setResults(data || []);
        setTotalCount(count || 0);

      } catch (err) {
        console.error("Request search error:", err);
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery, filterCategoryId, filterMinBudget, filterMaxBudget, supabase]);

  return { results, loading, error, totalCount };
}

// Recent searches hook (stored in localStorage)
export function useRecentSearches(maxItems: number = 5) {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        try {
          setSearches(JSON.parse(stored));
        } catch {
          setSearches([]);
        }
      }
    }
  }, []);

  const addSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      setSearches((prev) => {
        const newSearches = [query, ...prev.filter((s) => s !== query)].slice(0, maxItems);
        if (typeof window !== "undefined") {
          localStorage.setItem("recentSearches", JSON.stringify(newSearches));
        }
        return newSearches;
      });
    },
    [maxItems]
  );

  const clearSearches = useCallback(() => {
    setSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recentSearches");
    }
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => {
      const newSearches = prev.filter((s) => s !== query);
      if (typeof window !== "undefined") {
        localStorage.setItem("recentSearches", JSON.stringify(newSearches));
      }
      return newSearches;
    });
  }, []);

  return { searches, addSearch, clearSearches, removeSearch };
}

