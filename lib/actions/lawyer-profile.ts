/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import type { LawyerProfile } from "@/lib/types/shared";

export type { LawyerProfile } from "@/lib/types/shared";

function parsePracticeAreas(val: unknown): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    // Neon may return TEXT[] as "{a,b,c}" string
    const trimmed = val.replace(/^\{|\}$/g, "");
    return trimmed ? trimmed.split(",").map((s) => s.trim()) : [];
  }
  return [];
}

function mapRow(row: any): LawyerProfile {
  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    barCouncilNumber: row.bar_council_number,
    yearsOfExperience: row.years_of_experience,
    practiceAreas: parsePracticeAreas(row.practice_areas),
    province: row.province,
    city: row.city,
    primaryCourt: row.primary_court,
    firmType: row.firm_type,
    firmName: row.firm_name,
    tourCompleted: row.tour_completed ?? false,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function getLawyerProfile(userId: string): Promise<LawyerProfile | null> {
  const rows = await sql(
    `SELECT * FROM lawyer_profiles WHERE user_id = $1`,
    [userId]
  );
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function updateLawyerProfile(
  userId: string,
  data: Partial<Omit<LawyerProfile, "id" | "userId" | "createdAt" | "updatedAt" | "tourCompleted">>
): Promise<LawyerProfile> {
  const rows = await sql(
    `UPDATE lawyer_profiles SET
      full_name = COALESCE($2, full_name),
      email = COALESCE($3, email),
      phone = COALESCE($4, phone),
      bar_council_number = COALESCE($5, bar_council_number),
      years_of_experience = COALESCE($6, years_of_experience),
      practice_areas = COALESCE($7, practice_areas),
      province = COALESCE($8, province),
      city = COALESCE($9, city),
      primary_court = COALESCE($10, primary_court),
      firm_type = COALESCE($11, firm_type),
      firm_name = COALESCE($12, firm_name),
      updated_at = now()
    WHERE user_id = $1
    RETURNING *`,
    [
      userId,
      data.fullName ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.barCouncilNumber ?? null,
      data.yearsOfExperience ?? null,
      data.practiceAreas ?? null,
      data.province ?? null,
      data.city ?? null,
      data.primaryCourt ?? null,
      data.firmType ?? null,
      data.firmName ?? null,
    ]
  );
  return mapRow(rows[0]);
}

export async function getOrCreateProfile(userId: string): Promise<LawyerProfile> {
  const existing = await getLawyerProfile(userId);
  if (existing) return existing;

  // Try to parse from onboarding submissions
  const onboardingRows = await sql(
    `SELECT data, full_name, email, phone FROM onboarding_submissions WHERE user_id = $1 LIMIT 1`,
    [userId]
  );

  let fullName: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;
  let barCouncilNumber: string | null = null;
  let yearsOfExperience: string | null = null;
  let practiceAreas: string[] = [];
  let province: string | null = null;
  let city: string | null = null;
  let primaryCourt: string | null = null;
  let firmType: string | null = null;
  let firmName: string | null = null;

  if (onboardingRows.length > 0) {
    const row = onboardingRows[0];
    fullName = row.full_name;
    email = row.email;
    phone = row.phone;

    const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
    if (data) {
      const pi = data.personalInfo;
      const pd = data.practiceDetails;
      const loc = data.location;
      const fi = data.firmInfo;
      if (pi) {
        fullName = fullName || pi.fullName || null;
        phone = phone || pi.phone || null;
      }
      if (pd) {
        barCouncilNumber = pd.barCouncilNumber || pd.bar_council_number || null;
        yearsOfExperience = pd.yearsOfExperience || pd.years_of_experience || null;
        practiceAreas = Array.isArray(pd.practiceAreas) ? pd.practiceAreas : [];
      }
      if (loc) {
        province = loc.province || null;
        city = loc.city || null;
        primaryCourt = loc.primaryCourt || loc.primary_court || null;
      }
      if (fi) {
        firmType = fi.firmType || fi.firm_type || null;
        firmName = fi.firmName || fi.firm_name || null;
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
    `INSERT INTO lawyer_profiles (user_id, full_name, email, phone, bar_council_number, years_of_experience, practice_areas, province, city, primary_court, firm_type, firm_name)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
     RETURNING *`,
    [userId, fullName, email, phone, barCouncilNumber, yearsOfExperience, practiceAreas, province, city, primaryCourt, firmType, firmName]
  );

  return mapRow(rows[0]);
}

export async function isTourCompleted(userId: string): Promise<boolean> {
  const rows = await sql(
    `SELECT tour_completed FROM lawyer_profiles WHERE user_id = $1`,
    [userId]
  );
  return rows.length > 0 && rows[0].tour_completed === true;
}

export async function markTourComplete(userId: string): Promise<void> {
  await sql(
    `UPDATE lawyer_profiles SET tour_completed = true, updated_at = now() WHERE user_id = $1`,
    [userId]
  );
}
