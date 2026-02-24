/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { logActivity } from "@/lib/actions/activity";

export interface DocumentRecord {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount: number;
  documentType: string;
  blobUrl: string;
  blobPathname: string;
  briefId: string | null;
  judgmentId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: any): DocumentRecord {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: parseInt(row.file_size, 10) || 0,
    pageCount: row.page_count || 0,
    documentType: row.document_type || "Other",
    blobUrl: row.blob_url,
    blobPathname: row.blob_pathname,
    briefId: row.brief_id,
    judgmentId: row.judgment_id,
    metadata: typeof row.metadata === "string" ? JSON.parse(row.metadata) : (row.metadata || {}),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function listDocuments(filters?: {
  documentType?: string;
  search?: string;
}): Promise<DocumentRecord[]> {
  const uid = await getUserId();

  let query = `SELECT * FROM documents WHERE user_id = $1`;
  const params: any[] = [uid];
  let paramIdx = 2;

  if (filters?.documentType && filters.documentType !== "all") {
    query += ` AND document_type = $${paramIdx}`;
    params.push(filters.documentType);
    paramIdx++;
  }
  if (filters?.search?.trim()) {
    query += ` AND (title ILIKE $${paramIdx} OR file_name ILIKE $${paramIdx})`;
    params.push(`%${filters.search.trim()}%`);
    paramIdx++;
  }

  query += ` ORDER BY created_at DESC`;

  const rows = await sql(query, params);
  return rows.map(mapRow);
}

export async function getDocument(id: string): Promise<DocumentRecord | null> {
  const uid = await getUserId();
  const rows = await sql(
    `SELECT * FROM documents WHERE id = $1 AND user_id = $2`,
    [id, uid]
  );
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export async function createDocumentRecord(data: {
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  pageCount?: number;
  documentType?: string;
  blobUrl: string;
  blobPathname: string;
  briefId?: string;
  judgmentId?: string;
}, userId?: string): Promise<string> {
  const uid = userId ?? await getUserId();

  const rows = await sql(
    `INSERT INTO documents (user_id, title, file_name, file_type, file_size, page_count, document_type, blob_url, blob_pathname, brief_id, judgment_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     RETURNING id`,
    [
      uid,
      data.title,
      data.fileName,
      data.fileType,
      data.fileSize,
      data.pageCount || 0,
      data.documentType || "Other",
      data.blobUrl,
      data.blobPathname,
      data.briefId || null,
      data.judgmentId || null,
    ]
  );

  const docId = rows[0].id;
  await logActivity(uid, "created", "document", docId, data.title);
  return docId;
}

export async function deleteDocument(id: string): Promise<{ blobUrl: string } | null> {
  const uid = await getUserId();

  const rows = await sql(
    `DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING blob_url`,
    [id, uid]
  );

  if (rows.length === 0) return null;

  await logActivity(uid, "deleted", "document", id);
  return { blobUrl: rows[0].blob_url };
}

export async function linkDocument(
  docId: string,
  links: { briefId?: string; judgmentId?: string }
): Promise<void> {
  const uid = await getUserId();

  if (links.briefId !== undefined) {
    await sql(
      `UPDATE documents SET brief_id = $1, updated_at = now() WHERE id = $2 AND user_id = $3`,
      [links.briefId || null, docId, uid]
    );
  }
  if (links.judgmentId !== undefined) {
    await sql(
      `UPDATE documents SET judgment_id = $1, updated_at = now() WHERE id = $2 AND user_id = $3`,
      [links.judgmentId || null, docId, uid]
    );
  }
}
