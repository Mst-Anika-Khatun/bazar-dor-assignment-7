import productSnapshot from "@/data/products.json";
import categorySnapshot from "@/data/categories.json";
import type { Product, Category } from "@/lib/types";

const bases = ["https://api.api-store.workers.dev/api/bazardor", "https://api.abcz.workers.dev/api/bazardor"];
type Catalog = { products: Product[]; categories: Category[]; snapshot: boolean };
let cached: { data: Catalog; expires: number } | undefined;
let pending: Promise<Catalog> | undefined;

async function fetchApi<T>(path: string, validate: (data: unknown) => boolean): Promise<T> {
  for (const base of bases) {
    try {
      const response = await fetch(base + path, { cache: "no-store", signal: AbortSignal.timeout(12000) });
      if (!response.ok) continue;
      const data: unknown = await response.json();
      if (validate(data)) return data as T;
    } catch { /* Try the alternative API before using the saved JSON. */ }
  }
  throw new Error("Both BazarDor APIs are unavailable.");
}

const validProduct = (data: unknown) => {
  const p = data as Product;
  return !!p && typeof p.slug === "string" && typeof p.nameBn === "string" &&
    (typeof p.today === "number" || typeof p.today === "string") && !!p.change && Array.isArray(p.markets);
};

export async function getCatalog(): Promise<Catalog> {
  if (cached && cached.expires > Date.now()) return cached.data;
  if (pending) return pending;
  pending = (async () => {
    const [products, categories] = await Promise.allSettled([
      fetchApi<Product[]>("/products", data => Array.isArray(data) && data.length > 0 && data.every(validProduct)),
      fetchApi<Category[]>("/categories", data => Array.isArray(data) && data.length > 0 && data.every(c => c && typeof c.slug === "string")),
    ]);
    const data: Catalog = {
      products: products.status === "fulfilled" ? products.value : productSnapshot as Product[],
      categories: categories.status === "fulfilled" ? categories.value : categorySnapshot,
      snapshot: products.status === "rejected" || categories.status === "rejected",
    };
    cached = { data, expires: Date.now() + (data.snapshot ? 15000 : 60000) };
    return data;
  })();
  try { return await pending; } finally { pending = undefined; }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const catalog = await getCatalog();
  const matched = catalog.products.find(product => product.slug === slug);
  if (!matched) return undefined;
  try { return await fetchApi<Product>(`/products/${matched.id}`, data => validProduct(data) && (data as Product).slug === slug); }
  catch { return matched; }
}
