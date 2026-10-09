"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCatalog } from "@/components/providers";
import { ProductCard, ProductSkeletons } from "@/components/product-card";
import { CatalogNotice } from "@/components/home-view";
import { bn, sortProducts, type SortOrder } from "@/lib/format";
import type { Category } from "@/lib/types";

export function CategoryView({ category }: { category: Category }) {
  const { products, loading, error } = useCatalog();
  const [order, setOrder] = useState<SortOrder>("default");
  const categoryProducts = sortProducts(products.filter(product => product.category === category.slug), order);
  return <div className="container category-main">
    <div className="category-header"><div><h1><span aria-hidden="true">{category.icon}</span>{category.nameBn}</h1>
      <p className="section-subtitle">{loading ? "পণ্যের তথ্য আসছে…" : `${bn(categoryProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}</p></div>
      <div className="sort-control"><label htmlFor="sort">সাজান:</label><div className="select-wrap"><select id="sort" value={order} onChange={event => setOrder(event.target.value as SortOrder)}>
        <option value="default">ডিফল্ট</option><option value="low">দাম: কম থেকে বেশি</option><option value="high">দাম: বেশি থেকে কম</option>
      </select><ChevronDown size={14} aria-hidden="true" /></div></div>
    </div>
    <CatalogNotice />
    {loading ? <ProductSkeletons /> : error ? null : categoryProducts.length ? <>
      <p className="product-count" aria-live="polite">মোট {bn(categoryProducts.length)}টি পণ্য দেখানো হচ্ছে</p>
      <div className="product-grid">{categoryProducts.map(product => <ProductCard product={product} key={product.id} />)}</div>
    </> : <div className="empty-state"><p className="empty-icon">🧺</p><h2>এই বিভাগে কোনো পণ্য নেই</h2><p>অন্য একটি বিভাগ দেখুন অথবা হোম পেজে ফিরে যান।</p><Link href="/" className="button button-primary">হোম পেজে ফিরে যান</Link></div>}
  </div>;
}
