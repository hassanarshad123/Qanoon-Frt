/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

"use server";

import { sql } from "@/lib/db";
import { getUserId } from "@/lib/auth/session";
import { logActivity } from "@/lib/actions/activity";
import type { Note, NoteFolder, Tag, Folder } from "@/lib/types/portal";

// ---------------------------------------------------------------------------
// Create a new note
// ---------------------------------------------------------------------------
export async function createNote(data: {
  title?: string;
  content?: string;
  folder?: string;
  tags?: string[];
  sourceId?: string;
  sourceType?: "brief" | "judgment" | "research";
  sourceLabel?: string;
}): Promise<string> {
  const uid = await getUserId();

  const rows = await sql(
    `INSERT INTO notes (title, content, folder, source_id, source_type, source_label, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      data.title || "Untitled Note",
      data.content || "",
      data.folder || "General",
      data.sourceId || null,
      data.sourceType || null,
      data.sourceLabel || null,
      uid,
    ]
  );

  const noteId = rows[0].id;

  // Insert tags if provided
  if (data.tags && data.tags.length > 0) {
    for (const tagId of data.tags) {
      await sql(
        `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)`,
        [noteId, tagId]
      );
    }
  }

  await logActivity(uid, "created", "note", noteId, data.title || "Untitled Note");

  return noteId;
}

// ---------------------------------------------------------------------------
// Get a single note by ID
// ---------------------------------------------------------------------------
export async function getNote(id: string): Promise<Note | null> {
  const uid = await getUserId();

  const rows = await sql(
    `SELECT n.*, array_agg(nt.tag_id) FILTER (WHERE nt.tag_id IS NOT NULL) as tag_ids
     FROM notes n
     LEFT JOIN note_tags nt ON n.id = nt.note_id
     WHERE n.id = $1 AND n.user_id = $2
     GROUP BY n.id`,
    [id, uid]
  );

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    folder: row.folder as NoteFolder,
    tags: row.tag_ids || [],
    sourceId: row.source_id || undefined,
    sourceType: row.source_type || undefined,
    sourceLabel: row.source_label || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// List all notes (user-scoped)
// ---------------------------------------------------------------------------
export async function listNotes(): Promise<Note[]> {
  const uid = await getUserId();

  const rows = await sql(
    `SELECT n.*, array_agg(nt.tag_id) FILTER (WHERE nt.tag_id IS NOT NULL) as tag_ids
     FROM notes n
     LEFT JOIN note_tags nt ON n.id = nt.note_id
     WHERE n.user_id = $1
     GROUP BY n.id
     ORDER BY n.updated_at DESC`,
    [uid]
  );

  return rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    folder: row.folder as NoteFolder,
    tags: row.tag_ids || [],
    sourceId: row.source_id || undefined,
    sourceType: row.source_type || undefined,
    sourceLabel: row.source_label || undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  }));
}

// ---------------------------------------------------------------------------
// Update note content (optimized for auto-save - minimal response)
// ---------------------------------------------------------------------------
export async function updateNoteContent(
  noteId: string,
  content: string
): Promise<{ updatedAt: string }> {
  const uid = await getUserId();

  const rows = await sql(
    `UPDATE notes SET content = $1, updated_at = now()
     WHERE id = $2 AND user_id = $3
     RETURNING updated_at`,
    [content, noteId, uid]
  );

  if (rows.length === 0) {
    throw new Error("Note not found");
  }

  return { updatedAt: rows[0].updated_at.toISOString() };
}

// ---------------------------------------------------------------------------
// Update note title
// ---------------------------------------------------------------------------
export async function updateNoteTitle(
  noteId: string,
  title: string
): Promise<{ updatedAt: string }> {
  const uid = await getUserId();

  const rows = await sql(
    `UPDATE notes SET title = $1, updated_at = now()
     WHERE id = $2 AND user_id = $3
     RETURNING updated_at`,
    [title, noteId, uid]
  );

  if (rows.length === 0) {
    throw new Error("Note not found");
  }

  return { updatedAt: rows[0].updated_at.toISOString() };
}

// ---------------------------------------------------------------------------
// Update note metadata (folder and/or tags)
// ---------------------------------------------------------------------------
export async function updateNoteMetadata(
  noteId: string,
  data: { folder?: string; tags?: string[] }
): Promise<void> {
  const uid = await getUserId();

  // Update folder if provided
  if (data.folder) {
    await sql(
      `UPDATE notes SET folder = $1, updated_at = now() WHERE id = $2 AND user_id = $3`,
      [data.folder, noteId, uid]
    );
  }

  // Update tags if provided
  if (data.tags !== undefined) {
    // Verify ownership first
    const ownerCheck = await sql(`SELECT id FROM notes WHERE id = $1 AND user_id = $2`, [noteId, uid]);
    if (ownerCheck.length === 0) throw new Error("Note not found");

    // Remove existing tags
    await sql(`DELETE FROM note_tags WHERE note_id = $1`, [noteId]);

    // Insert new tags
    for (const tagId of data.tags) {
      await sql(
        `INSERT INTO note_tags (note_id, tag_id) VALUES ($1, $2)`,
        [noteId, tagId]
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Delete a note
// ---------------------------------------------------------------------------
export async function deleteNote(noteId: string): Promise<void> {
  const uid = await getUserId();
  await sql(`DELETE FROM notes WHERE id = $1 AND user_id = $2`, [noteId, uid]);
  await logActivity(uid, "deleted", "note", noteId);
}

// ---------------------------------------------------------------------------
// List all folders with note counts (user-scoped)
// ---------------------------------------------------------------------------
export async function listFolders(): Promise<Folder[]> {
  const uid = await getUserId();

  // Get all folders for this user (or shared default folders)
  const folderRows = await sql(
    `SELECT f.id, f.name, f.sort_order, COUNT(n.id) as count
     FROM folders f
     LEFT JOIN notes n ON n.folder = f.name AND n.user_id = $1
     WHERE f.user_id = $1 OR f.user_id IS NULL
     GROUP BY f.id, f.name, f.sort_order
     ORDER BY f.sort_order, f.created_at`,
    [uid]
  );

  return folderRows.map((row: any) => ({
    id: row.id,
    name: row.name as NoteFolder,
    count: parseInt(row.count, 10) || 0,
  }));
}

// Backwards compatibility alias
export async function getFolderCounts(): Promise<Folder[]> {
  return listFolders();
}

// ---------------------------------------------------------------------------
// Create a new folder
// ---------------------------------------------------------------------------
export async function createFolder(name: string): Promise<string> {
  const uid = await getUserId();
  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error("Folder name cannot be empty");
  }

  // Get max sort order for this user
  const maxOrderRows = await sql(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM folders WHERE user_id = $1 OR user_id IS NULL`,
    [uid]
  );
  const nextOrder = maxOrderRows[0].next_order;

  const rows = await sql(
    `INSERT INTO folders (name, sort_order, user_id) VALUES ($1, $2, $3) RETURNING id`,
    [trimmedName, nextOrder, uid]
  );

  return rows[0].id;
}

// ---------------------------------------------------------------------------
// Delete a folder (moves notes to "General", cannot delete "General")
// ---------------------------------------------------------------------------
export async function deleteFolder(folderName: string): Promise<void> {
  const uid = await getUserId();

  if (folderName === "General") {
    throw new Error("Cannot delete the General folder");
  }

  // Move all notes in this folder to "General"
  await sql(
    `UPDATE notes SET folder = 'General', updated_at = now() WHERE folder = $1 AND user_id = $2`,
    [folderName, uid]
  );

  // Delete the folder
  await sql(`DELETE FROM folders WHERE name = $1 AND (user_id = $2 OR user_id IS NULL)`, [folderName, uid]);
}

// ---------------------------------------------------------------------------
// Get all tags
// ---------------------------------------------------------------------------
export async function getTags(): Promise<Tag[]> {
  const rows = await sql(`SELECT id, name, color FROM tags ORDER BY name`);
  return rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    color: row.color,
  }));
}
