/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { logActivity } from "@/lib/actions/activity";

export interface JudgmentSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  sortOrder: number;
  reviewStatus: string;
  flagNote?: string;
  regenerationCount: number;
}

export interface JudgmentConversation {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: any[];
  createdAt: string;
}

export interface Judgment {
  id: string;
  userId: string;
  briefId: string | null;
  caseTitle: string;
  caseNumber: string | null;
  court: string | null;
  status: string;
  caseData: any;
  ragResults: any[];
  sections: JudgmentSection[];
  conversation: JudgmentConversation[];
  createdAt: string;
  updatedAt: string;
}

export interface JudgmentListItem {
  id: string;
  caseTitle: string;
  caseNumber: string | null;
  court: string | null;
  status: string;
  sectionCount: number;
  createdAt: string;
}

function parseJson(val: unknown): any {
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return val ?? [];
}

// ---------------------------------------------------------------------------
// Create a judgment with 7 sections
// ---------------------------------------------------------------------------
export async function createJudgment(data: {
  caseTitle: string;
  caseNumber?: string;
  court?: string;
  briefId?: string;
  caseData?: any;
  ragResults?: any[];
  sections: { sectionKey: string; title: string; content: string }[];
}, userId?: string): Promise<string> {
  const uid = userId ?? await getUserId();

  const rows = await sql(
    `INSERT INTO judgments (user_id, brief_id, case_title, case_number, court, status, case_data, rag_results)
     VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7)
     RETURNING id`,
    [
      uid,
      data.briefId || null,
      data.caseTitle,
      data.caseNumber || null,
      data.court || null,
      JSON.stringify(data.caseData || {}),
      JSON.stringify(data.ragResults || []),
    ]
  );

  const judgmentId = rows[0].id;

  for (let i = 0; i < data.sections.length; i++) {
    const s = data.sections[i];
    await sql(
      `INSERT INTO judgment_sections (judgment_id, section_key, title, content, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [judgmentId, s.sectionKey, s.title, s.content, i]
    );
  }

  await logActivity(uid, "created", "judgment", judgmentId, data.caseTitle);

  return judgmentId;
}

// ---------------------------------------------------------------------------
// Get a judgment by ID
// ---------------------------------------------------------------------------
export async function getJudgment(id: string, userId?: string): Promise<Judgment | null> {
  const uid = userId ?? await getUserId();

  const jRows = await sql(
    `SELECT * FROM judgments WHERE id = $1 AND user_id = $2`,
    [id, uid]
  );
  if (jRows.length === 0) return null;

  const j = jRows[0];

  const sectionRows = await sql(
    `SELECT * FROM judgment_sections WHERE judgment_id = $1 ORDER BY sort_order`,
    [id]
  );

  const convRows = await sql(
    `SELECT * FROM judgment_conversations WHERE judgment_id = $1 ORDER BY created_at`,
    [id]
  );

  return {
    id: j.id,
    userId: j.user_id,
    briefId: j.brief_id,
    caseTitle: j.case_title,
    caseNumber: j.case_number,
    court: j.court,
    status: j.status,
    caseData: parseJson(j.case_data),
    ragResults: parseJson(j.rag_results),
    sections: sectionRows.map((r: any) => ({
      id: r.id,
      sectionKey: r.section_key,
      title: r.title,
      content: r.content,
      sortOrder: r.sort_order,
      reviewStatus: r.review_status,
      flagNote: r.flag_note || undefined,
      regenerationCount: r.regeneration_count || 0,
    })),
    conversation: convRows.map((r: any) => ({
      id: r.id,
      role: r.role as "user" | "assistant",
      content: r.content,
      citations: parseJson(r.citations),
      createdAt: new Date(r.created_at).toISOString(),
    })),
    createdAt: new Date(j.created_at).toISOString(),
    updatedAt: new Date(j.updated_at).toISOString(),
  };
}

// ---------------------------------------------------------------------------
// List judgments
// ---------------------------------------------------------------------------
export async function listJudgments(userId?: string): Promise<JudgmentListItem[]> {
  const uid = userId ?? await getUserId();

  const rows = await sql(
    `SELECT j.id, j.case_title, j.case_number, j.court, j.status, j.created_at,
       (SELECT count(*) FROM judgment_sections WHERE judgment_id = j.id) as section_count
     FROM judgments j
     WHERE j.user_id = $1
     ORDER BY j.created_at DESC`,
    [uid]
  );

  return rows.map((r: any) => ({
    id: r.id,
    caseTitle: r.case_title,
    caseNumber: r.case_number,
    court: r.court,
    status: r.status,
    sectionCount: parseInt(r.section_count, 10) || 0,
    createdAt: new Date(r.created_at).toISOString(),
  }));
}

// ---------------------------------------------------------------------------
// Update section content
// ---------------------------------------------------------------------------
export async function updateJudgmentSection(
  sectionId: string,
  content: string,
  incrementRegeneration?: boolean
): Promise<void> {
  const uid = await getUserId();

  // Verify ownership
  const check = await sql(
    `SELECT j.id FROM judgment_sections js JOIN judgments j ON j.id = js.judgment_id WHERE js.id = $1 AND j.user_id = $2`,
    [sectionId, uid]
  );
  if (check.length === 0) throw new Error("Not found");

  if (incrementRegeneration) {
    await sql(
      `UPDATE judgment_sections SET content = $1, regeneration_count = regeneration_count + 1, review_status = 'pending_review', updated_at = now() WHERE id = $2`,
      [content, sectionId]
    );
  } else {
    await sql(
      `UPDATE judgment_sections SET content = $1, updated_at = now() WHERE id = $2`,
      [content, sectionId]
    );
  }
}

// ---------------------------------------------------------------------------
// Update section review status
// ---------------------------------------------------------------------------
export async function updateJudgmentReview(
  sectionId: string,
  status: string,
  flagNote?: string
): Promise<void> {
  const uid = await getUserId();

  const check = await sql(
    `SELECT j.id FROM judgment_sections js JOIN judgments j ON j.id = js.judgment_id WHERE js.id = $1 AND j.user_id = $2`,
    [sectionId, uid]
  );
  if (check.length === 0) throw new Error("Not found");

  await sql(
    `UPDATE judgment_sections SET review_status = $1, flag_note = $2, updated_at = now() WHERE id = $3`,
    [status, flagNote || null, sectionId]
  );
}

// ---------------------------------------------------------------------------
// Save chat message
// ---------------------------------------------------------------------------
export async function saveJudgmentChat(
  judgmentId: string,
  role: "user" | "assistant",
  content: string,
  citations?: any[]
): Promise<string> {
  const uid = await getUserId();

  const check = await sql(
    `SELECT id FROM judgments WHERE id = $1 AND user_id = $2`,
    [judgmentId, uid]
  );
  if (check.length === 0) throw new Error("Not found");

  const rows = await sql(
    `INSERT INTO judgment_conversations (judgment_id, role, content, citations)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [judgmentId, role, content, JSON.stringify(citations || [])]
  );
  return rows[0].id;
}

// ---------------------------------------------------------------------------
// Update judgment status
// ---------------------------------------------------------------------------
export async function updateJudgmentStatus(
  judgmentId: string,
  status: string
): Promise<void> {
  const uid = await getUserId();

  await sql(
    `UPDATE judgments SET status = $1, updated_at = now() WHERE id = $2 AND user_id = $3`,
    [status, judgmentId, uid]
  );

  if (status === "finalized") {
    await logActivity(uid, "finalized", "judgment", judgmentId);
  }
}

// ---------------------------------------------------------------------------
// Delete a judgment
// ---------------------------------------------------------------------------
export async function deleteJudgment(judgmentId: string): Promise<void> {
  const uid = await getUserId();
  await sql(`DELETE FROM judgments WHERE id = $1 AND user_id = $2`, [judgmentId, uid]);
  await logActivity(uid, "deleted", "judgment", judgmentId);
}
