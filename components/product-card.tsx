import Link from "next/link";
import { bn, unitName } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ChangeBadge({ change }: { change: Product["change"] }) {
  return <span className={`change-badge ${change.dir}`}>
    <span aria-hidden="true">{change.dir === "up" ? "▲" : change.dir === "down" ? "▼" : "—"}</span>
    <span>{bn(Math.abs(change.pct), 1)}%</span>
  </span>;
}
export function ProductCard({ product }: { product: Product }) {
  return <Link href={`/product/${product.slug}`} className="product-card" aria-label={`${product.nameBn}, ${bn(product.today)} টাকা, বিস্তারিত দেখুন`}>
    <div className="product-top"><span className="product-emoji" aria-hidden="true">{product.image}</span>
      <div><h3>{product.nameBn}</h3><p>প্রতি {unitName(product.unit)}</p></div>
    </div>
    <div className="product-bottom"><div><p className="price-label">আজকের দাম</p>
      <div className="price-value">{bn(product.today)} <span>টাকা</span></div></div>
      <ChangeBadge change={product.change} />
    </div>
  </Link>;
}
export function ProductSkeletons({ count = 6 }: { count?: number }) {
  return <div className="product-grid" role="status" aria-label="পণ্যের তথ্য আসছে">
    {Array.from({ length: count }, (_, i) => <div className="product-card skeleton-card" key={i} aria-hidden="true">
      <div className="product-top"><div className="skeleton skeleton-icon" /><div className="skeleton-lines"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-subtitle" /></div></div>
      <div className="product-bottom"><div className="skeleton skeleton-price" /><div className="skeleton skeleton-badge" /></div>
    </div>)}
    <span className="sr-only">Loading…</span>
  </div>;
}
