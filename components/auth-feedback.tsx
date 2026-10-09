"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
export function AuthFeedback() {
  const params = useSearchParams(); const router = useRouter();
  useEffect(() => {
    if (params.get("auth") === "success") { toast.success("সফলভাবে সাইন ইন করেছেন।", { id: "social-success" }); router.replace("/"); }
  }, [params, router]);
  return null;
}
