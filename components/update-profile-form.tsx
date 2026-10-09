"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export function UpdateProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (name.trim().length < 2 || name.trim().length > 60) { const message = "নাম ২ থেকে ৬০ অক্ষরের মধ্যে লিখুন।"; setError(message); toast.error(message); return; }
    setBusy(true);
    try {
      const result = await authClient.updateUser({ name: name.trim() });
      if (result.error) { setError("তথ্য আপডেট হয়নি। আবার চেষ্টা করুন।"); toast.error("তথ্য আপডেট হয়নি।"); return; }
      toast.success("আপনার নাম আপডেট হয়েছে।"); router.push("/profile"); router.refresh();
    } catch { setError("সংযোগে সমস্যা হয়েছে।"); toast.error("সংযোগে সমস্যা হয়েছে।"); } finally { setBusy(false); }
  }
  return <div className="auth-page"><section className="auth-card update-card"><h1>তথ্য আপডেট করুন</h1><p className="auth-subtitle">আপনার প্রোফাইলে নতুন নাম সংরক্ষণ করুন।</p>
    <form onSubmit={submit} noValidate><div className="form-field"><label htmlFor="update-name">নাম</label><input id="update-name" autoComplete="name" value={name} onChange={event => setName(event.target.value)} maxLength={60} required /></div>
      {error && <p className="form-error" role="alert">{error}</p>}<button type="submit" className="button button-primary form-submit" disabled={busy}>{busy && <LoaderCircle size={16} className="spin" />}{busy ? "সংরক্ষণ হচ্ছে…" : "Update Information"}</button></form>
    <Link className="back-link" href="/profile">প্রোফাইলে ফিরে যান</Link>
  </section></div>;
}
