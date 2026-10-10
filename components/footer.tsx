import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div>
          <p>
            <strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <Link
            href="/privacy"
            className="mt-2 inline-block text-sm text-green-700 underline"
          >
            গোপনীয়তা নীতি · Privacy Policy
          </Link>
        </div>
        <p>
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}