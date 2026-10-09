// The hosted preview uses D1; the submitted Next.js app uses libSQL/Turso.
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "@/db/schema";
export function getDatabase() { return drizzle(env.DB, { schema }); }
export function getEnvironment(key: string): string | undefined { return (env as unknown as Record<string, string | undefined>)[key]; }
