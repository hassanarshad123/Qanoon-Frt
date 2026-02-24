import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

// Load .env and .env.local files for standalone script execution
const root = resolve(__dirname, "../..");
for (const envFile of [".env", ".env.local"]) {
  const path = join(root, envFile);
  if (existsSync(path)) {
    for (const line of readFileSync(path, "utf-8").split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  }
}

import bcrypt from "bcryptjs";
import { getSQL } from "./index";

async function seedAdmin() {
  const sql = getSQL();

  const email = process.env.ADMIN_EMAIL || "admin@qanoonai.com";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const name = "QanoonAI Admin";

  const hash = await bcrypt.hash(password, 12);

  try {
    await sql`
      INSERT INTO users (email, password_hash, name, role, onboarding_completed, is_active)
      VALUES (${email}, ${hash}, ${name}, 'admin', true, true)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = 'admin',
        onboarding_completed = true,
        updated_at = now()
    `;
    console.log(`Admin user seeded: ${email}`);
  } catch (err: any) {
    console.error("Failed to seed admin:", err.message);
  }
}

seedAdmin().catch(console.error);
