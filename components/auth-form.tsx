"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Github, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const signup = mode === "signup";
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [socialBusy, setSocialBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (params.get("reason") === "protected") toast.error("পণ্যের বিস্তারিত দেখতে আগে সাইন ইন করুন।", { id: "protected-route" });
    if (params.get("error")) toast.error("সোশ্যাল সাইন ইন সফল হয়নি। আবার চেষ্টা করুন।", { id: "oauth-error" });
  }, [params]);
  const fail = (message: string) => { setError(message); toast.error(message); };
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (signup && (name.trim().length < 2 || name.trim().length > 60)) { fail("নাম ২ থেকে ৬০ অক্ষরের মধ্যে লিখুন।"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { fail("একটি সঠিক ইমেইল লিখুন।"); return; }
    if (password.length < 8) { fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।"); return; }
    setBusy(true);
    try {
      const result = signup
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        const code = result.error.code;
        fail(code === "USER_ALREADY_EXISTS" || code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ? "এই ইমেইলে অ্যাকাউন্ট আছে। সাইন ইন করুন।" : signup ? "রেজিস্ট্রেশন হয়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।" : "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
        return;
      }
      toast.success(signup ? "রেজিস্ট্রেশন সফল! এখন সাইন ইন করুন।" : "সফলভাবে সাইন ইন করেছেন।");
      router.push(signup ? "/signin" : "/"); router.refresh();
    } catch { fail("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।"); }
    finally { setBusy(false); }
  }
  async function socialLogin(provider: "google" | "github") {
    setSocialBusy(provider); setError("");
    try {
      const response = await fetch("/api/auth-providers");
      if (!response.ok) throw new Error("Provider check failed");
      const providers = await response.json();
      if (!providers[provider]) { fail(`${provider === "google" ? "Google" : "GitHub"} সাইন ইন এখনো চালু হয়নি। আপাতত ইমেইল দিয়ে সাইন ইন করুন।`); return; }
      const result = await authClient.signIn.social({ provider, callbackURL: "/?auth=success", errorCallbackURL: "/signin?error=social" });
      if (result.error) fail("সোশ্যাল সাইন ইন হয়নি। আবার চেষ্টা করুন।");
    } catch { fail("সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করুন।"); }
    finally { setSocialBusy(null); }
  }
  return <div className="auth-page"><section className="auth-card">
    <h1>{signup ? "সাইন আপ" : "সাইন ইন"}</h1><p className="auth-subtitle">{signup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "আপনার অ্যাকাউন্টে প্রবেশ করুন"}</p>
    <form onSubmit={submit} noValidate>
      {signup && <div className="form-field"><label htmlFor="name">নাম</label><input id="name" name="name" autoComplete="name" placeholder="আপনার নাম" value={name} onChange={event => setName(event.target.value)} maxLength={60} required /></div>}
      <div className="form-field"><label htmlFor="email">ইমেইল</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required /></div>
      <div className="form-field"><label htmlFor="password">পাসওয়ার্ড</label><div className="password-input"><input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={signup ? "new-password" : "current-password"} placeholder="কমপক্ষে ৮ অক্ষর" value={password} onChange={event => setPassword(event.target.value)} minLength={8} required />
        <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={busy || !!socialBusy}>{busy && <LoaderCircle className="spin" size={16} />}{busy ? "অপেক্ষা করুন…" : signup ? "রেজিস্টার করুন" : "লগ ইন করুন"}</button>
    </form>
    <div className="auth-divider"><span>অথবা</span></div>
    <div className="social-buttons"><button className="button button-outline" disabled={busy || !!socialBusy} onClick={() => socialLogin("google")}>{socialBusy === "google" ? <LoaderCircle size={16} className="spin" /> : <span className="google-g" aria-hidden="true">G</span>}Google</button>
      <button className="button button-outline" disabled={busy || !!socialBusy} onClick={() => socialLogin("github")}>{socialBusy === "github" ? <LoaderCircle size={16} className="spin" /> : <Github size={17} />}GitHub</button></div>
    <p className="auth-switch">{signup ? "অ্যাকাউন্ট আছে?" : "অ্যাকাউন্ট নেই?"} <Link href={signup ? "/signin" : "/signup"}>{signup ? "সাইন ইন করুন" : "সাইন আপ করুন"}</Link></p>
  </section></div>;
}
