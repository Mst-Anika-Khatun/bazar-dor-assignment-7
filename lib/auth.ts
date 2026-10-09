import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDatabase, getEnvironment } from "@/lib/database";
import * as schema from "@/db/schema";

function createAuth() {
  const secret = getEnvironment("BETTER_AUTH_SECRET");
  if (!secret) throw new Error("BETTER_AUTH_SECRET is required. Check .env.example.");
  const googleId = getEnvironment("GOOGLE_CLIENT_ID"), googleSecret = getEnvironment("GOOGLE_CLIENT_SECRET");
  const githubId = getEnvironment("GITHUB_CLIENT_ID"), githubSecret = getEnvironment("GITHUB_CLIENT_SECRET");
  return betterAuth({
    appName: "BazarDor", secret,
    baseURL: getEnvironment("BETTER_AUTH_URL") || "http://localhost:3000",
    trustedOrigins: process.env.NODE_ENV === "development"
  ? ["http://localhost:3000", "http://192.168.0.102:3000"]
  : [],
    database: drizzleAdapter(getDatabase(), { provider: "sqlite", schema }),
    emailAndPassword: { enabled: true, autoSignIn: false, requireEmailVerification: false, minPasswordLength: 8 },
    socialProviders: {
      ...(googleId && googleSecret ? { google: { clientId: googleId, clientSecret: googleSecret } } : {}),
      ...(githubId && githubSecret ? { github: { clientId: githubId, clientSecret: githubSecret } } : {}),
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  });
}
let auth: ReturnType<typeof createAuth> | undefined;
export function getAuth() { return auth ??= createAuth(); }
