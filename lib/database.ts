import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "@/db/schema";

let database: ReturnType<typeof drizzle> | undefined;
export function getDatabase() {
  if (!database) {
    if (process.env.VERCEL && !process.env.TURSO_DATABASE_URL) throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN before deploying to Vercel.");
    const client = createClient({ url: process.env.TURSO_DATABASE_URL || "file:./local.db", authToken: process.env.TURSO_AUTH_TOKEN });
    database = drizzle(client, { schema });
  }
  return database;
}
export function getEnvironment(key: string): string | undefined { return process.env[key]; }
