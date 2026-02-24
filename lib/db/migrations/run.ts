import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

// Load .env and .env.local files for standalone script execution
const root = resolve(__dirname, "../../..");
for (const envFile of [".env", ".env.local"]) {
  const path = join(root, envFile);
  if (existsSync(path)) {
    for (const line of readFileSync(path, "utf-8").split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  }
}

import { getSQL } from "../index";

async function runMigrations() {
  const sql = getSQL();
  const migrationPath = join(__dirname, "001_auth_tables.sql");
  const migration = readFileSync(migrationPath, "utf-8");

  console.log("Running migration: 001_auth_tables.sql");

  // Split on semicolons but preserve DO $$ blocks
  const statements: string[] = [];
  let current = "";
  let inDollarBlock = false;

  for (const line of migration.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("--") || trimmed === "") {
      current += line + "\n";
      continue;
    }
    if (trimmed.includes("DO $$") || trimmed.includes("DO $")) {
      inDollarBlock = true;
    }
    if (inDollarBlock && trimmed.includes("END $$;")) {
      inDollarBlock = false;
      current += line + "\n";
      statements.push(current.trim());
      current = "";
      continue;
    }
    if (!inDollarBlock && trimmed.endsWith(";")) {
      current += line + "\n";
      statements.push(current.trim());
      current = "";
    } else {
      current += line + "\n";
    }
  }

  for (const stmt of statements) {
    // Strip leading comment lines and blank lines to get actual SQL
    const sqlBody = stmt.replace(/^(--.*\n|\s*\n)*/g, "").trim();
    if (!sqlBody) continue;
    try {
      await sql(stmt);
      console.log("  OK:", sqlBody.slice(0, 60).replace(/\n/g, " ") + "...");
    } catch (err: any) {
      console.error("  FAIL:", sqlBody.slice(0, 60).replace(/\n/g, " "));
      console.error("  Error:", err.message);
    }
  }

  console.log("Migration complete.");
}

runMigrations().catch(console.error);
