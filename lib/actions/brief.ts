/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { logActivity } from "@/lib/actions/activity";
import type { EnhancedBrief, BriefConversationMessage } from "@/lib/mock/types";
import type {
  EnhancedBriefSection,
  ExtractedCaseData,
  SectionReviewStatus,
} from "@/lib/brief-pipeline/types";
import type { RAGSearchResult } from "@/lib/rag/types";

// ---------------------------------------------------------------------------
// Save a new brief with all sections
// ---------------------------------------------------------------------------
export async function saveBrief(data: {
  caseTitle: string;
  caseNumber?: string;
  court?: string;
  extractedData: ExtractedCaseData | null;
  uploadedDocuments: { id: string; fileName: string; documentType: string; totalPages: number }[];
  ragResults: RAGSearchResult[];
  sections: EnhancedBriefSection[];
}, userId?: string): Promise<string> {
  const uid = userId ?? await getUserId();

  const rows = await sql(
    `INSERT INTO briefs (case_title, case_number, court, status, extracted_data, uploaded_documents, rag_results, review_progress, user_id)
     VALUES ($1, $2, $3, 'in_review', $4, $5, $6, $7, $8)
     RETURNING id`,
    [
      data.caseTitle,
      data.caseNumber || null,
      data.court || null,
      JSON.stringify(data.extractedData || {}),
      JSON.stringify(data.uploadedDocuments),
      JSON.stringify(data.ragResults),
      JSON.stringify({ total: data.sections.length, approved: 0, flagged: 0 }),
      uid,
    ]
  );

  const briefId = rows[0].id;

  // Insert all sections
  for (let i = 0; i < data.sections.length; i++) {
    const s = data.sections[i];
    await sql(
      `INSERT INTO brief_sections (brief_id, section_key, title, content, sources, review_status, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        briefId,
        s.id, // section_key (e.g., "case_header")
        s.title,
        s.content,
        JSON.stringify(s.sources || []),
        s.reviewStatus || "pending_review",
        i,
      ]
    );
  }

  await logActivity(uid, "created", "brief", briefId, data.caseTitle);

  return briefId;
}

// ---------------------------------------------------------------------------
// Get a single brief by ID
// ---------------------------------------------------------------------------
export async function getBrief(
  id: string,
  userId?: string
): Promise<EnhancedBrief | null> {
  const uid = userId ?? await getUserId();

  const briefRows = await sql(
    `SELECT * FROM briefs WHERE id = $1 AND user_id = $2`,
    [id, uid]
  );

  if (briefRows.length === 0) return null;

  const brief = briefRows[0];

  // Get sections
  const sectionRows = await sql(
    `SELECT * FROM brief_sections WHERE brief_id = $1 ORDER BY sort_order`,
    [id]
  );

  // Get conversations
  const conversationRows = await sql(
    `SELECT * FROM brief_conversations WHERE brief_id = $1 ORDER BY created_at`,
    [id]
  );

  const sections: EnhancedBriefSection[] = sectionRows.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    sources: typeof row.sources === "string" ? JSON.parse(row.sources) : (row.sources || []),
    reviewStatus: row.review_status as SectionReviewStatus,
    flagNote: row.flag_note || undefined,
    regenerationCount: row.regeneration_count || 0,
  }));

  const conversation: BriefConversationMessage[] = conversationRows.map(
    (row: any) => ({
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      timestamp: new Date(row.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      citations:
        typeof row.citations === "string"
          ? JSON.parse(row.citations)
          : row.citations || [],
    })
  );

  const extractedData =
    typeof brief.extracted_data === "string"
      ? JSON.parse(brief.extracted_data)
      : brief.extracted_data;

  const uploadedDocuments =
    typeof brief.uploaded_documents === "string"
      ? JSON.parse(brief.uploaded_documents)
      : brief.uploaded_documents;

  const ragResults =
    typeof brief.rag_results === "string"
      ? JSON.parse(brief.rag_results)
      : brief.rag_results;

  const reviewProgress =
    typeof brief.review_progress === "string"
      ? JSON.parse(brief.review_progress)
      : brief.review_progress;

  // Map DB status to UI status
  const statusMap: Record<string, string> = {
    generating: "generating",
    in_review: "in_review",
    finalized: "finalized",
  };

  return {
    id: brief.id,
    caseId: brief.id,
    caseTitle: brief.case_title,
    status: (statusMap[brief.status] || brief.status) as any,
    createdAt: new Date(brief.created_at).toISOString().split("T")[0],
    sections,
    conversation,
    extractedData: extractedData && Object.keys(extractedData).length > 0 ? extractedData : undefined,
    uploadedDocuments: uploadedDocuments?.length > 0 ? uploadedDocuments : undefined,
    ragResults: ragResults?.length > 0 ? ragResults : undefined,
    reviewProgress,
  };
}

// ---------------------------------------------------------------------------
// List all briefs (user-scoped)
// ---------------------------------------------------------------------------
export async function listBriefs(userId?: string): Promise<EnhancedBrief[]> {
  const uid = userId ?? await getUserId();

  const rows = await sql(
    `SELECT b.*,
       (SELECT json_agg(json_build_object('id', s.id, 'title', s.title, 'content', substring(s.content from 1 for 200), 'sources', s.sources, 'reviewStatus', s.review_status, 'flagNote', s.flag_note, 'regenerationCount', s.regeneration_count) ORDER BY s.sort_order)
        FROM brief_sections s WHERE s.brief_id = b.id) as sections
     FROM briefs b
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [uid]
  );

  return rows.map((row: any) => {
    const sections = (row.sections || []).map((s: any) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      sources: typeof s.sources === "string" ? JSON.parse(s.sources) : (s.sources || []),
      reviewStatus: (s.reviewStatus || s.review_status || "pending_review") as SectionReviewStatus,
      flagNote: s.flagNote || s.flag_note || undefined,
      regenerationCount: s.regenerationCount || s.regeneration_count || 0,
    }));

    const reviewProgress =
      typeof row.review_progress === "string"
        ? JSON.parse(row.review_progress)
        : row.review_progress;

    return {
      id: row.id,
      caseId: row.id,
      caseTitle: row.case_title,
      status: row.status as any,
      createdAt: new Date(row.created_at).toISOString().split("T")[0],
      sections,
      conversation: [],
      reviewProgress,
    };
  });
}

// ---------------------------------------------------------------------------
// Update a section's review status
// ---------------------------------------------------------------------------
export async function updateSectionReview(
  sectionId: string,
  status: SectionReviewStatus,
  flagNote?: string
): Promise<void> {
  const uid = await getUserId();

  // Verify ownership via brief
  const ownerCheck = await sql(
    `SELECT b.id FROM brief_sections bs JOIN briefs b ON b.id = bs.brief_id WHERE bs.id = $1 AND b.user_id = $2`,
    [sectionId, uid]
  );
  if (ownerCheck.length === 0) throw new Error("Not found");

  await sql(
    `UPDATE brief_sections SET review_status = $1, flag_note = $2, updated_at = now() WHERE id = $3`,
    [status, flagNote || null, sectionId]
  );

  // Update the parent brief's review progress
  const rows = await sql(
    `SELECT brief_id FROM brief_sections WHERE id = $1`,
    [sectionId]
  );
  if (rows.length > 0) {
    const briefId = rows[0].brief_id;
    await sql(
      `UPDATE briefs SET review_progress = (
        SELECT json_build_object(
          'total', count(*),
          'approved', count(*) FILTER (WHERE review_status = 'approved'),
          'flagged', count(*) FILTER (WHERE review_status = 'flagged')
        ) FROM brief_sections WHERE brief_id = $1
      ), updated_at = now() WHERE id = $1`,
      [briefId]
    );
  }
}

// ---------------------------------------------------------------------------
// Update section content (after edit or regeneration)
// ---------------------------------------------------------------------------
export async function updateSectionContent(
  sectionId: string,
  content: string,
  incrementRegeneration?: boolean
): Promise<void> {
  const uid = await getUserId();

  // Verify ownership
  const ownerCheck = await sql(
    `SELECT b.id FROM brief_sections bs JOIN briefs b ON b.id = bs.brief_id WHERE bs.id = $1 AND b.user_id = $2`,
    [sectionId, uid]
  );
  if (ownerCheck.length === 0) throw new Error("Not found");

  if (incrementRegeneration) {
    await sql(
      `UPDATE brief_sections SET content = $1, regeneration_count = regeneration_count + 1, review_status = 'pending_review', updated_at = now() WHERE id = $2`,
      [content, sectionId]
    );
  } else {
    await sql(
      `UPDATE brief_sections SET content = $1, updated_at = now() WHERE id = $2`,
      [content, sectionId]
    );
  }
}

// ---------------------------------------------------------------------------
// Save a chat message
// ---------------------------------------------------------------------------
export async function saveChatMessage(
  briefId: string,
  role: "user" | "assistant",
  content: string,
  citations?: any[]
): Promise<string> {
  const uid = await getUserId();

  // Verify ownership
  const ownerCheck = await sql(
    `SELECT id FROM briefs WHERE id = $1 AND user_id = $2`,
    [briefId, uid]
  );
  if (ownerCheck.length === 0) throw new Error("Not found");

  const rows = await sql(
    `INSERT INTO brief_conversations (brief_id, role, content, citations)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [briefId, role, content, JSON.stringify(citations || [])]
  );
  return rows[0].id;
}

// ---------------------------------------------------------------------------
// Update brief status
// ---------------------------------------------------------------------------
export async function updateBriefStatus(
  briefId: string,
  status: string
): Promise<void> {
  const uid = await getUserId();

  await sql(
    `UPDATE briefs SET status = $1, updated_at = now() WHERE id = $2 AND user_id = $3`,
    [status, briefId, uid]
  );

  if (status === "finalized") {
    await logActivity(uid, "finalized", "brief", briefId);
  }
}

// ---------------------------------------------------------------------------
// Delete a brief
// ---------------------------------------------------------------------------
export async function deleteBrief(briefId: string): Promise<void> {
  const uid = await getUserId();

  await sql(`DELETE FROM briefs WHERE id = $1 AND user_id = $2`, [briefId, uid]);
  await logActivity(uid, "deleted", "brief", briefId);
}
