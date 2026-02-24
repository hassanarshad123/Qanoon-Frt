/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { getOrCreateProfile } from "@/lib/actions/lawyer-profile";
import { getRecentActivity } from "@/lib/actions/activity";
import type { LawyerDashboardData } from "@/lib/types/shared";

export type { LawyerDashboardData } from "@/lib/types/shared";

export async function getLawyerDashboardData(): Promise<LawyerDashboardData> {
  const userId = await getUserId();

  const [profile, briefCountRows, researchCountRows, noteCountRows, recentActivity] =
    await Promise.all([
      getOrCreateProfile(userId),
      sql(`SELECT COUNT(*) as count FROM briefs WHERE user_id = $1`, [userId]),
      sql(`SELECT COUNT(*) as count FROM research_conversations WHERE user_id = $1`, [userId]),
      sql(`SELECT COUNT(*) as count FROM notes WHERE user_id = $1`, [userId]),
      getRecentActivity(userId, 10),
    ]);

  let documentCount = 0;
  try {
    const dRows = await sql(`SELECT COUNT(*) as count FROM documents WHERE user_id = $1`, [userId]);
    documentCount = parseInt(dRows[0].count, 10) || 0;
  } catch {
    // Table doesn't exist yet
  }

  return {
    profile,
    stats: {
      totalBriefs: parseInt(briefCountRows[0].count, 10) || 0,
      totalResearch: parseInt(researchCountRows[0].count, 10) || 0,
      totalNotes: parseInt(noteCountRows[0].count, 10) || 0,
      totalDocuments: documentCount,
    },
    recentActivity,
  };
}
