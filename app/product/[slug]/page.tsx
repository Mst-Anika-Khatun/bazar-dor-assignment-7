import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getAuth } from "@/lib/auth";
import { getCatalog, getProduct } from "@/lib/catalog";
import { bn, unitName, toNumber, priceSummary } from "@/lib/format";
import { ChangeBadge } from "@/components/product-card";

export const dynamic = "force-dynamic";
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  // Validate the slug before auth so even anonymous invalid links get a 404.
  if (!catalog.products.some(product => product.slug === slug)) notFound();
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/signin?reason=protected");
  const product = await getProduct(slug);
  if (!product) notFound();
  const summary = priceSummary(product);
  const difference = toNumber(product.today) - toNumber(product.yesterday);
  const markets = [...product.markets].sort((a, b) => (a.min + a.max) - (b.min + b.max));
  return <div className="container details-main">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">হোম</Link><ChevronRight size={14} /><Link href={`/category/${product.category}`}>{product.categoryNameBn}</Link><ChevronRight size={14} /><span>{product.nameBn}</span></nav>
    {catalog.snapshot && <div className="data-notice">লাইভ সংযোগ নেই। ৯ অক্টোবর ২০২৬-এ সংরক্ষিত বাজারদর দেখানো হচ্ছে।</div>}
    <section className="detail-overview">
      <div className="detail-title-group"><span className="detail-emoji" aria-hidden="true">{product.image}</span><div>
        <h1>{product.nameBn}</h1><p className="detail-meta">প্রতি {unitName(product.unit)} · <Link href={`/category/${product.category}`} className="detail-category">{product.categoryNameBn}</Link></p>
        <p className="market-summary">গতকালের তুলনায় আজ দাম <strong className={product.change.dir === "up" ? "text-up" : product.change.dir === "down" ? "text-down" : ""}>{difference > 0 ? "বেড়েছে" : difference < 0 ? "কমেছে" : "অপরিবর্তিত"}</strong>{difference !== 0 ? ` · ${bn(Math.abs(difference))} টাকা` : ""}</p>
      </div></div>
      <div className="detail-today"><p>আজকের দাম</p><div><strong>{bn(product.today)}</strong><span>টাকা / {unitName(product.unit)}</span></div><ChangeBadge change={product.change} /></div>
    </section>
    <section className="summary-section"><h2>দামের সারসংক্ষেপ</h2><div className="summary-grid">
      <article className="summary-card"><p>সর্বনিম্ন দাম</p><strong>{bn(summary.min)} <span>টাকা</span></strong><small>সবচেয়ে কম দামের বাজার</small></article>
      <article className="summary-card"><p>সর্বাধিক দাম</p><strong>{bn(summary.max)} <span>টাকা</span></strong><small>সবচেয়ে বেশি দামের বাজার</small></article>
      <article className="summary-card"><p>গড় দাম</p><strong>{bn(summary.average)} <span>টাকা</span></strong><small>বাজারগুলোর গড়ের হিসাবে · প্রতি {unitName(product.unit)}</small></article>
    </div></section>
    <section className="market-section"><h2>বাজারভিত্তিক আজকের দাম</h2><div className="table-scroll" tabIndex={0} aria-label="বাজারভিত্তিক দামের তালিকা">
      <table><caption className="sr-only">{product.nameBn} — বিভিন্ন বাজারের সর্বনিম্ন, সর্বাধিক ও গড় দাম</caption><thead><tr><th scope="col">বাজার</th><th scope="col">বিভাগ</th><th scope="col">সর্বনিম্ন</th><th scope="col">সর্বাধিক</th><th scope="col">গড়</th></tr></thead>
        <tbody>{markets.map(market => <tr key={market.market}><th scope="row">{market.market}</th><td>{market.division}</td><td>{bn(market.min)} টাকা</td><td>{bn(market.max)} টাকা</td><td>{bn((market.min + market.max) / 2)} টাকা</td></tr>)}</tbody>
      </table>{!markets.length && <p className="data-notice">এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।</p>}
    </div></section>
  </div>;
}
