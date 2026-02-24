/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import type { EntityType, ActionType, ActivityEntry } from "@/lib/types/shared";

export type { EntityType, ActionType, ActivityEntry } from "@/lib/types/shared";

export async function logActivity(
  userId: string,
  action: ActionType,
  entityType: EntityType,
  entityId?: string,
  entityTitle?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    await sql(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, entity_title, metadata)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        action,
        entityType,
        entityId || null,
        entityTitle || null,
        JSON.stringify(metadata || {}),
      ]
    );
  } catch (err) {
    // Non-critical — don't break the main operation
    console.error("Failed to log activity:", err);
  }
}

export async function getRecentActivity(
  userId: string,
  limit: number = 20
): Promise<ActivityEntry[]> {
  const rows = await sql(
    `SELECT * FROM activity_log WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );

  return rows.map((row: any) => ({
    id: row.id,
    action: row.action as ActionType,
    entityType: row.entity_type as EntityType,
    entityId: row.entity_id,
    entityTitle: row.entity_title,
    metadata: typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {}),
    createdAt: new Date(row.created_at).toISOString(),
  }));
}
