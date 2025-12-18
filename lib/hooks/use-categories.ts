"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export interface CategoryWithChildren extends Category {
  children?: Category[];
}

// Hook for fetching all categories
export function useCategories(type?: "product" | "service" | "both") {
  const [categories, setCategories] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (type && type !== "both") {
          query = query.or(`type.eq.${type},type.eq.both`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Organize into parent-child structure
        const parentCategories: CategoryWithChildren[] = [];
        const childMap = new Map<string, Category[]>();

        data?.forEach((category) => {
          if (category.parent_id) {
            const children = childMap.get(category.parent_id) || [];
            children.push(category);
            childMap.set(category.parent_id, children);
          } else {
            parentCategories.push(category);
          }
        });

        // Attach children to parents
        parentCategories.forEach((parent) => {
          parent.children = childMap.get(parent.id) || [];
        });

        setCategories(parentCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [type, supabase]);

  return { categories, loading, error };
}

// Hook for flat list of categories (for select dropdowns)
export function useFlatCategories(type?: "product" | "service" | "both") {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("name", { ascending: true });

        if (type && type !== "both") {
          query = query.or(`type.eq.${type},type.eq.both`);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [type, supabase]);

  return { categories, loading, error };
}

// Hook for fetching a single category by slug
export function useCategoryBySlug(slug: string | null) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!slug) {
      setCategory(null);
      setLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("categories")
          .select("*")
          .eq("slug", slug)
          .single();

        if (fetchError) throw fetchError;

        setCategory(data);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug, supabase]);

  return { category, loading, error };
}

