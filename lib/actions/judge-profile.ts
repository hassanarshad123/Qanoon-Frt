/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import type { JudgeProfile } from "@/lib/types/shared";

export type { JudgeProfile } from "@/lib/types/shared";

function mapRow(row: any): JudgeProfile {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    courtLevel: row.court_level,
    designation: row.designation,
    province: row.province,
    city: row.city,
    courtName: row.court_name,
    tourCompleted: row.tour_completed ?? false,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function getJudgeProfile(userId: string): Promise<JudgeProfile | null> {
  const rows = await sql(
    `SELECT * FROM judge_profiles WHERE user_id = $1`,
    [userId]
  );
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function updateJudgeProfile(
  userId: string,
  data: Partial<Omit<JudgeProfile, "id" | "userId" | "createdAt" | "updatedAt" | "tourCompleted">>
): Promise<JudgeProfile> {
  const rows = await sql(
    `UPDATE judge_profiles SET
      full_name = COALESCE($2, full_name),
      email = COALESCE($3, email),
      phone = COALESCE($4, phone),
      court_level = COALESCE($5, court_level),
      designation = COALESCE($6, designation),
      province = COALESCE($7, province),
      city = COALESCE($8, city),
      court_name = COALESCE($9, court_name),
      updated_at = now()
    WHERE user_id = $1
    RETURNING *`,
    [
      userId,
      data.fullName ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.courtLevel ?? null,
      data.designation ?? null,
      data.province ?? null,
      data.city ?? null,
      data.courtName ?? null,
    ]
  );
  return mapRow(rows[0]);
}

export async function getOrCreateProfile(userId: string): Promise<JudgeProfile> {
  const existing = await getJudgeProfile(userId);
  if (existing) return existing;

  // Try to parse from onboarding submissions
  const onboardingRows = await sql(
    `SELECT data, full_name, email, phone FROM onboarding_submissions WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  let fullName: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;
  let courtLevel: string | null = null;
  let designation: string | null = null;
  let province: string | null = null;
  let city: string | null = null;
  let courtName: string | null = null;

  if (onboardingRows.length > 0) {
    const row = onboardingRows[0];
    fullName = row.full_name;
    email = row.email;
    phone = row.phone;

    const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
    if (data) {
      const pi = data.personalInfo;
      const ci = data.courtInfo || data.professionalInfo;
      if (pi) {
        fullName = fullName || pi.fullName || null;
        phone = phone || pi.phone || null;
      }
      if (ci) {
        courtLevel = ci.courtLevel || ci.court_level || null;
        designation = ci.designation || null;
        province = ci.province || null;
        city = ci.city || null;
        courtName = ci.courtName || ci.court_name || null;
      }
    }
  }

  // Also try users table for email/name
  if (!email || !fullName) {
    const userRows = await sql(
      `SELECT email, name FROM users WHERE id = $1`,
      [userId]
    );
    if (userRows.length > 0) {
      email = email || userRows[0].email;
      fullName = fullName || userRows[0].name;
    }
  }

  const rows = await sql(
    `INSERT INTO judge_profiles (user_id, full_name, email, phone, court_level, designation, province, city, court_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
     RETURNING *`,
    [userId, fullName, email, phone, courtLevel, designation, province, city, courtName]
  );

  return mapRow(rows[0]);
}

export async function isTourCompleted(userId: string): Promise<boolean> {
  const rows = await sql(
    `SELECT tour_completed FROM judge_profiles WHERE user_id = $1`,
    [userId]
  );
  return rows.length > 0 && rows[0].tour_completed === true;
}

export async function markTourComplete(userId: string): Promise<void> {
  await sql(
    `UPDATE judge_profiles SET tour_completed = true, updated_at = now() WHERE user_id = $1`,
    [userId]
  );
}
