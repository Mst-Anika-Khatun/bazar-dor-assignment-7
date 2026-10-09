import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: { default: "বাজার দর | BazarDor", template: "%s | বাজার দর" },
  description: "চাল, ডাল, তেল, সবজি, মাছ ও মাংসের আজকের দাম এবং বাজারভিত্তিক তুলনা।",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased"><Providers><a className="skip-link" href="#main-content">মূল অংশে যান</a><Navbar /><main id="main-content">{children}</main><Footer /></Providers></body>
    </html>
  );
}
