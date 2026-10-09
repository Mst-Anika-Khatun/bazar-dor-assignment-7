import { getCatalog } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export async function GET() {
  const catalog = await getCatalog();
  return Response.json(catalog, { headers: { "Cache-Control": "no-store" } });
}
