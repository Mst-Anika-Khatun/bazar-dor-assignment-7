import { notFound } from "next/navigation";
import { getCatalog } from "@/lib/catalog";
import { CategoryView } from "@/components/category-view";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getCatalog();
  return { title: categories.find(category => category.slug === slug)?.nameBn || "বিভাগ পাওয়া যায়নি" };
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories } = await getCatalog();
  const category = categories.find(category => category.slug === slug);
  if (!category) notFound();
  return <CategoryView category={category} />;
}
