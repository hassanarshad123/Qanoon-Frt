import { randomUUID } from "crypto";
import { getSQL } from "@/lib/db";

export async function createPasswordResetToken(userId: string) {
  const sql = getSQL();
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;
  return token;
}

export async function validatePasswordResetToken(token: string) {
  const sql = getSQL();
  const rows = await sql`
    SELECT prt.id, prt.user_id, prt.expires_at, prt.used, u.email
    FROM password_reset_tokens prt
    JOIN users u ON u.id = prt.user_id
    WHERE prt.token = ${token}
  `;

  const row = rows[0];
  if (!row) return null;
  if (row.used) return null;
  if (new Date(row.expires_at) < new Date()) return null;

  return { id: row.id, userId: row.user_id, email: row.email };
}

export async function consumePasswordResetToken(token: string) {
  const sql = getSQL();
  await sql`
    UPDATE password_reset_tokens SET used = true WHERE token = ${token}
  `;
}
