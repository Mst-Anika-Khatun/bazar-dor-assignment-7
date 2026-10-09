import Link from "next/link";
export default function NotFound() {
  return <div className="container empty-state not-found"><p className="error-number">৪০৪</p><h1>পেজটি পাওয়া যায়নি</h1>
    <p>পণ্য, বিভাগ বা ঠিকানাটি সঠিক নয়। হোম পেজে ফিরে অন্য পণ্য দেখুন।</p><Link href="/" className="button button-primary">হোম পেজে ফিরে যান</Link></div>;
}
