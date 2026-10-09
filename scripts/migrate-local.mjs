import { createClient } from "@libsql/client";
import { readdir, readFile } from "node:fs/promises";

// Run with Node's --env-file=.env.local flag when using a remote Turso database.
const client = createClient({ url: process.env.TURSO_DATABASE_URL || "file:./local.db", authToken: process.env.TURSO_AUTH_TOKEN });
await client.execute('CREATE TABLE IF NOT EXISTS "_bazardor_migrations" (name TEXT PRIMARY KEY)');
const applied = new Set((await client.execute('SELECT name FROM "_bazardor_migrations"')).rows.map(row => row.name));
for (const filename of (await readdir("drizzle")).filter(name => name.endsWith(".sql")).sort()) {
  if (applied.has(filename)) continue;
  const sql = await readFile(`drizzle/${filename}`, "utf8");
  const transaction = await client.transaction("write");
  try {
    for (const statement of sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean)) await transaction.execute(statement);
    await transaction.execute({ sql: 'INSERT INTO "_bazardor_migrations" (name) VALUES (?)', args: [filename] });
    await transaction.commit();
    console.log(`Applied ${filename}`);
  } catch (error) { await transaction.rollback(); throw error; }
}
client.close();
console.log("Database is ready.");
