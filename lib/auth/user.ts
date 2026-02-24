import bcrypt from "bcryptjs";
import { getSQL } from "@/lib/db";

export async function createUser(email: string, password: string, name: string, role?: string) {
  const sql = getSQL();
  const hash = await bcrypt.hash(password, 12);

  if (role) {
    const rows = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email}, ${hash}, ${name}, ${role})
      RETURNING id, email, name, role, onboarding_completed, is_active, created_at
    `;
    return rows[0];
  }

  const rows = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${hash}, ${name})
    RETURNING id, email, name, role, onboarding_completed, is_active, created_at
  `;
  return rows[0];
}

export async function getUserByEmail(email: string) {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, email, password_hash, name, role, onboarding_completed, is_active, created_at, updated_at
    FROM users WHERE email = ${email}
  `;
  return rows[0] || null;
}

export async function getUserById(id: string) {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, email, name, role, onboarding_completed, is_active, created_at, updated_at
    FROM users WHERE id = ${id}
  `;
  return rows[0] || null;
}

export async function completeOnboarding(userId: string, role: string) {
  const sql = getSQL();
  await sql`
    UPDATE users
    SET role = ${role}, onboarding_completed = true, updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const sql = getSQL();
  await sql`
    UPDATE users SET is_active = ${isActive}, updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function updateUserPassword(userId: string, newPasswordHash: string) {
  const sql = getSQL();
  await sql`
    UPDATE users SET password_hash = ${newPasswordHash}, updated_at = now()
    WHERE id = ${userId}
  `;
}
