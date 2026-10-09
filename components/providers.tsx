"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import type { Product, Category } from "@/lib/types";

type CatalogState = { products: Product[]; categories: Category[]; loading: boolean; error: string; snapshot: boolean; reload: () => void };
const CatalogContext = createContext<CatalogState | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt(value => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    fetch("/api/catalog", { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("পণ্যের তথ্য আনা সম্ভব হয়নি। আবার চেষ্টা করুন।");
      const data = await response.json();
      setProducts(data.products); setCategories(data.categories); setSnapshot(data.snapshot);
    }).catch(error => {
      if (!controller.signal.aborted) setError(error.message || "সংযোগে সমস্যা হয়েছে।");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [attempt]);
  return <CatalogContext.Provider value={{ products, categories, loading, error, snapshot, reload }}>
    {children}
    <Toaster position="top-right" toastOptions={{ duration: 4000, style: { fontFamily: "inherit", fontSize: "14px" } }} />
  </CatalogContext.Provider>;
}
export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside Providers");
  return context;
}
