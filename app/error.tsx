"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="container empty-state"><p className="empty-icon">🧺</p><h1>তথ্য দেখাতে সমস্যা হয়েছে</h1><p>কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
    <div className="error-actions"><button className="button button-primary" onClick={reset}>আবার চেষ্টা করুন</button><Link href="/" className="button button-outline">হোম পেজে ফিরে যান</Link></div>
  </div>;
}
