/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import type { LawyerTourState } from "@/components/lawyers/tour/types";

function parseJsonField(val: unknown): LawyerTourState {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return {};
    }
  }
  if (val && typeof val === "object") return val as LawyerTourState;
  return {};
}

export async function getLawyerTourState(
  userId: string
): Promise<LawyerTourState> {
  const rows = await sql(
    `SELECT tour_state FROM lawyer_profiles WHERE user_id = $1`,
    [userId]
  );
  if (rows.length === 0) return {};
  return parseJsonField(rows[0].tour_state);
}

export async function updateLawyerTourState(
  userId: string,
  patch: Partial<LawyerTourState>
): Promise<LawyerTourState> {
  // Read-merge-write pattern for JSONB
  const current = await getLawyerTourState(userId);
  const merged = { ...current, ...patch };

  await sql(
    `UPDATE lawyer_profiles SET tour_state = $2, updated_at = now() WHERE user_id = $1`,
    [userId, JSON.stringify(merged)]
  );

  return merged;
}

export async function markChapterComplete(
  userId: string,
  chapterId: string
): Promise<LawyerTourState> {
  return updateLawyerTourState(userId, {
    [chapterId]: true,
  } as Partial<LawyerTourState>);
}

export async function recordSectionVisit(
  userId: string,
  route: string
): Promise<LawyerTourState> {
  const current = await getLawyerTourState(userId);
  const visited = current.visitedSections || {};
  if (visited[route]) return current; // already recorded

  return updateLawyerTourState(userId, {
    visitedSections: { ...visited, [route]: new Date().toISOString() },
  });
}

export async function markWelcomeShown(
  userId: string
): Promise<LawyerTourState> {
  return updateLawyerTourState(userId, { welcomeShown: true });
}

export async function resetTourProgress(
  userId: string
): Promise<LawyerTourState> {
  await sql(
    `UPDATE lawyer_profiles SET tour_state = '{}', updated_at = now() WHERE user_id = $1`,
    [userId]
  );
  return {};
}
