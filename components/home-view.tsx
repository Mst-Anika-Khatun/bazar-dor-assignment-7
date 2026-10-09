"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useCatalog } from "@/components/providers";
import { ProductCard, ProductSkeletons } from "@/components/product-card";
import { banglaDate, bn, topMovers } from "@/lib/format";

export function CatalogNotice() {
  const { snapshot, error, reload } = useCatalog();
  if (error) return <div className="data-notice error-notice" role="alert">{error}<button className="button button-outline" onClick={reload}>আবার চেষ্টা করুন</button></div>;
  if (snapshot) return <div className="data-notice" role="status">লাইভ সংযোগ পাওয়া যায়নি। ৯ অক্টোবর ২০২৬-এ সংরক্ষিত তথ্য দেখানো হচ্ছে।<button onClick={reload}>আবার চেষ্টা করুন</button></div>;
  return null;
}
export function HomeView() {
  const { products, loading, error } = useCatalog();
  const [date, setDate] = useState("আজকের বাজারদর");
  useEffect(() => { setDate(banglaDate()); }, []);
  return <div className="container home-main">
    <section className="hero">
      <div className="hero-copy"><p className="eyebrow"><span className="live-dot" />{date}</p>
        <h1>আজকের বাজারের দাম<br />এক নজরে</h1>
        <p className="hero-subtitle">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
        <a href="#সব-পণ্য" className="button button-primary hero-button">সব পণ্য দেখুন <ArrowDown size={16} /></a>
      </div>
      <div className="hero-art"><Image src="/bazar-hero.png" alt="তাজা ফলভর্তি বাজারের ঝুড়ি" width={315} height={263} priority /></div>
    </section>
    <CatalogNotice />
    {["up", "down"].map(direction => <section className="product-section" key={direction}>
      <div className="section-heading"><h2><span className={`heading-symbol ${direction}`}>{direction === "up" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}</span>আজ দাম {direction === "up" ? "বেড়েছে" : "কমেছে"}</h2></div>
      {loading ? <ProductSkeletons /> : !error && <div className="product-grid">{topMovers(products, direction as "up" | "down").map(product => <ProductCard product={product} key={product.id} />)}</div>}
    </section>)}
    <section className="product-section all-products" id="সব-পণ্য">
      <div className="section-heading"><div><h2>সব পণ্য</h2><p className="section-subtitle">নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম ও পরিবর্তন</p></div></div>
      {!loading && !error && <p className="product-count">মোট {bn(products.length)}টি পণ্য দেখানো হচ্ছে</p>}
      {loading ? <ProductSkeletons count={9} /> : !error && <div className="product-grid">{products.map(product => <ProductCard product={product} key={product.id} />)}</div>}
    </section>
  </div>;
}
