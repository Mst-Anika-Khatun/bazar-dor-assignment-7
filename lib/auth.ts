import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDatabase, getEnvironment } from "@/lib/database";
import * as schema from "@/db/schema";

let auth: ReturnType<typeof betterAuth> | undefined;
export function getAuth() {
  if (auth) return auth;
  const secret = getEnvironment("BETTER_AUTH_SECRET");
  if (!secret) throw new Error("BETTER_AUTH_SECRET is required. Check .env.example.");
  const googleId = getEnvironment("GOOGLE_CLIENT_ID"), googleSecret = getEnvironment("GOOGLE_CLIENT_SECRET");
  const githubId = getEnvironment("GITHUB_CLIENT_ID"), githubSecret = getEnvironment("GITHUB_CLIENT_SECRET");
  auth = betterAuth({
    appName: "BazarDor", secret,
    baseURL: getEnvironment("BETTER_AUTH_URL") || "http://localhost:3000",
    database: drizzleAdapter(getDatabase(), { provider: "sqlite", schema }),
    emailAndPassword: { enabled: true, autoSignIn: false, requireEmailVerification: false, minPasswordLength: 8 },
    socialProviders: {
      ...(googleId && googleSecret ? { google: { clientId: googleId, clientSecret: googleSecret } } : {}),
      ...(githubId && githubSecret ? { github: { clientId: githubId, clientSecret: githubSecret } } : {}),
    },
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  });
  return auth;
}
