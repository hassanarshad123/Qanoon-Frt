/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { getOrCreateProfile } from "@/lib/actions/judge-profile";
import { getRecentActivity } from "@/lib/actions/activity";
import type { DashboardData } from "@/lib/types/shared";

export type { DashboardData } from "@/lib/types/shared";

export async function getDashboardData(): Promise<DashboardData> {
  const userId = await getUserId();

  // Run all queries in parallel
  const [profile, briefCountRows, researchCountRows, noteCountRows, recentActivity, recentBriefs] =
    await Promise.all([
      getOrCreateProfile(userId),
      sql(`SELECT COUNT(*) as count FROM briefs WHERE user_id = $1`, [userId]),
      sql(`SELECT COUNT(*) as count FROM research_conversations WHERE user_id = $1`, [userId]),
      sql(`SELECT COUNT(*) as count FROM notes WHERE user_id = $1`, [userId]),
      getRecentActivity(userId, 10),
      sql(
        `SELECT id, case_title, status, created_at FROM briefs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [userId]
      ),
    ]);

  // Judgment + document counts — return 0 until those tables exist
  let judgmentCount = 0;
  let documentCount = 0;
  try {
    const jRows = await sql(`SELECT COUNT(*) as count FROM judgments WHERE user_id = $1`, [userId]);
    judgmentCount = parseInt(jRows[0].count, 10) || 0;
  } catch {
    // Table doesn't exist yet
  }
  try {
    const dRows = await sql(`SELECT COUNT(*) as count FROM documents WHERE user_id = $1`, [userId]);
    documentCount = parseInt(dRows[0].count, 10) || 0;
  } catch {
    // Table doesn't exist yet
  }

  const recentWork = recentBriefs.map((row: any) => ({
    id: row.id,
    type: "brief" as const,
    title: row.case_title,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  }));

  return {
    profile,
    stats: {
      totalBriefs: parseInt(briefCountRows[0].count, 10) || 0,
      totalResearch: parseInt(researchCountRows[0].count, 10) || 0,
      totalNotes: parseInt(noteCountRows[0].count, 10) || 0,
      totalJudgments: judgmentCount,
      totalDocuments: documentCount,
    },
    recentActivity,
    recentWork,
  };
}
