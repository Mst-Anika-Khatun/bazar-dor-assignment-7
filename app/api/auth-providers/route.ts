import { getEnvironment } from "@/lib/database";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({
    google: !!(getEnvironment("GOOGLE_CLIENT_ID") && getEnvironment("GOOGLE_CLIENT_SECRET")),
    github: !!(getEnvironment("GITHUB_CLIENT_ID") && getEnvironment("GITHUB_CLIENT_SECRET")),
  });
}
