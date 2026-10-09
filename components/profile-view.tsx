"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
export function ProfileView({ user }: { user: { name: string; email: string } }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    try {
      const result = await authClient.signOut();
      if (result.error) { toast.error("সাইন আউট হয়নি। আবার চেষ্টা করুন।"); return; }
      toast.success("সফলভাবে সাইন আউট করেছেন।"); router.push("/"); router.refresh();
    } catch { toast.error("সংযোগে সমস্যা হয়েছে।"); } finally { setBusy(false); }
  }
  return <div className="container profile-main"><h1>আমার প্রোফাইল</h1><p className="section-subtitle">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
    <section className="profile-card"><div className="profile-identity"><span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span><div><h2>{user.name}</h2><p>{user.email}</p></div></div>
      <button className="button button-outline" onClick={logout} disabled={busy}><LogOut size={16} />{busy ? "অপেক্ষা করুন…" : "সাইন আউট"}</button></section>
    <section className="profile-information"><div className="section-heading"><h2>তথ্য</h2><Link href="/profile/update" className="button button-primary"><Pencil size={15} />আপডেট</Link></div>
      <dl><div><dt>নাম</dt><dd>{user.name}</dd></div><div><dt>ইমেইল</dt><dd>{user.email}</dd></div></dl>
    </section>
  </div>;
}
