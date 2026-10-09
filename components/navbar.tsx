"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { banglaDate, bn, unitName } from "@/lib/format";
import { useCatalog } from "@/components/providers";
import categoryFallback from "@/data/categories.json";

export function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { categories, products } = useCatalog();
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => { setDate(banglaDate()); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  async function logout() {
    setSigningOut(true);
    try {
      const result = await authClient.signOut();
      if (result.error) { toast.error("সাইন আউট হয়নি। আবার চেষ্টা করুন।"); return; }
      setOpen(false); toast.success("সফলভাবে সাইন আউট করেছেন।"); router.push("/"); router.refresh();
    } catch { toast.error("সংযোগে সমস্যা হয়েছে।"); }
    finally { setSigningOut(false); }
  }
  const navCategories = categories.length ? categories : categoryFallback;
  const tickerProducts = products.filter(p => p.change.dir !== "flat");
  return <>
    <header className="site-header">
      <div className="container navbar-top">
        <Link href="/" className="brand" aria-label="বাজার দর হোম পেজ">
          <div className="brand-title"><Image src="/logo-icon.png" width={22} height={22} alt="" /><span>বাজার দর</span></div>
          <p className="brand-date" suppressHydrationWarning>{date || "আজকের বাজারদর"}</p>
        </Link>
        <div className="auth-actions">
          {isPending ? <div className="skeleton auth-skeleton" aria-label="অ্যাকাউন্টের তথ্য আসছে" /> : session ?
            <div className="user-menu-wrap">
              <button className="user-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="user-menu">
                <span className="avatar">{session.user.name?.charAt(0).toUpperCase() || "U"}</span>
                <span className="user-name">{session.user.name}</span><ChevronDown size={15} />
              </button>
              {open && <><button className="menu-overlay" aria-label="মেনু বন্ধ করুন" onClick={() => setOpen(false)} />
                <div id="user-menu" className="user-menu"><p className="menu-email">{session.user.email}</p>
                  <Link href="/profile"><UserRound size={16} /> আমার প্রোফাইল</Link>
                  <button onClick={logout} disabled={signingOut}><LogOut size={16} />{signingOut ? "অপেক্ষা করুন…" : "সাইন আউট"}</button>
                </div></>}
            </div> : <><Link href="/signin" className="button button-ghost">সাইন ইন</Link><Link href="/signup" className="button button-primary">সাইন আপ</Link></>}
        </div>
      </div>
      <nav className="container category-nav" aria-label="পণ্যের বিভাগ">
        {navCategories.map(category => <Link key={category.slug} href={`/category/${category.slug}`} className={`category-chip ${path === `/category/${category.slug}` ? "active" : ""}`} aria-current={path === `/category/${category.slug}` ? "page" : undefined}>
          <span aria-hidden="true">{category.icon}</span>{category.nameBn}
        </Link>)}
      </nav>
    </header>
    <div className="ticker" aria-label="পণ্যের দামের পরিবর্তন">
      {tickerProducts.length ? <div className="ticker-track">{[0, 1].map(copy => <div className="ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {tickerProducts.map(product => <span className="ticker-item" key={product.slug}>
          <span>{product.image}</span><span>{product.nameBn}</span><strong>{bn(product.today)} টাকা/{unitName(product.unit)}</strong>
          <span className={product.change.dir === "up" ? "text-up" : "text-down"}>{product.change.dir === "up" ? "▲" : "▼"} {bn(Math.abs(product.change.pct), 1)}%</span>
        </span>)}
      </div>)}</div> : <div className="container ticker-placeholder">নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে</div>}
    </div>
  </>;
}
