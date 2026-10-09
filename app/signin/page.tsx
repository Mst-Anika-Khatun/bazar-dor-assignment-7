import { Suspense } from "react";
import { AuthForm } from "@/components/auth-form";
export const metadata = { title: "সাইন ইন" };
export default function SignInPage() { return <Suspense fallback={<div className="auth-page"><div className="skeleton auth-card-loading" /></div>}><AuthForm mode="signin" /></Suspense>; }
