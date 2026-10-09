import type { Product } from "./types.ts";

// Convert Bengali digits before doing arithmetic or sorting.
export function toNumber(value: number | string): number {
  if (typeof value === "number") return value;
  const digits = "০১২৩৪৫৬৭৮৯";
  return Number(value.replace(/[০-৯]/g, digit => String(digits.indexOf(digit))).replace(/,/g, "").replace(/[^0-9.\-]/g, ""));
}
export function bn(value: number | string, decimals?: number) {
  return new Intl.NumberFormat("bn-BD", { maximumFractionDigits: decimals ?? 2, ...(decimals === undefined ? {} : { minimumFractionDigits: decimals }) }).format(toNumber(value));
}
export function banglaDate(date = new Date()) {
  return new Intl.DateTimeFormat("bn-BD", { timeZone: "Asia/Dhaka", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
export function unitName(unit: string) {
  return ({ kg: "কেজি", liter: "লিটার", litre: "লিটার", l: "লিটার", dozen: "ডজন", piece: "পিস", pcs: "পিস" } as Record<string, string>)[unit] || unit;
}
export type SortOrder = "default" | "low" | "high";
export function sortProducts(products: Product[], order: SortOrder) {
  if (order === "default") return [...products];
  return [...products].sort((a, b) => order === "low" ? toNumber(a.today) - toNumber(b.today) : toNumber(b.today) - toNumber(a.today));
}
export function topMovers(products: Product[], direction: "up" | "down") {
  return products.filter(p => p.change.dir === direction).sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct)).slice(0, 6);
}
export function priceSummary(product: Product) {
  const markets = product.markets;
  if (!markets.length) return { min: toNumber(product.today), max: toNumber(product.today), average: toNumber(product.today) };
  return { min: Math.min(...markets.map(m => toNumber(m.min))), max: Math.max(...markets.map(m => toNumber(m.max))),
    average: markets.reduce((sum, m) => sum + (toNumber(m.min) + toNumber(m.max)) / 2, 0) / markets.length };
}
