import { apiFetch } from "./client";
import type { Note, Folder, Tag } from "@/lib/types/portal";

export type { Note, Folder, Tag } from "@/lib/types/portal";

export const notesApi = {
  create(data: {
    title?: string;
    content?: string;
    folder?: string;
    tags?: string[];
    source_id?: string;
    source_type?: string;
    source_label?: string;
  }): Promise<{ id: string }> {
    return apiFetch("/notes", { method: "POST", body: data });
  },

  list(): Promise<Note[]> {
    return apiFetch("/notes");
  },

  get(id: string): Promise<Note> {
    return apiFetch(`/notes/${id}`);
  },

  updateContent(id: string, content: string): Promise<{ updatedAt: string }> {
    return apiFetch(`/notes/${id}/content`, { method: "PATCH", body: { content } });
  },

  updateTitle(id: string, title: string): Promise<{ updatedAt: string }> {
    return apiFetch(`/notes/${id}/title`, { method: "PATCH", body: { title } });
  },

  updateMetadata(id: string, data: { folder?: string; tags?: string[] }): Promise<{ success: boolean }> {
    return apiFetch(`/notes/${id}/metadata`, { method: "PATCH", body: data });
  },

  delete(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/notes/${id}`, { method: "DELETE" });
  },

  // Folders
  listFolders(): Promise<Folder[]> {
    return apiFetch("/folders");
  },

  createFolder(name: string): Promise<{ id: string }> {
    return apiFetch("/folders", { method: "POST", body: { name } });
  },

  deleteFolder(name: string): Promise<{ success: boolean }> {
    return apiFetch(`/folders/${encodeURIComponent(name)}`, { method: "DELETE" });
  },

  // Tags
  getTags(): Promise<Tag[]> {
    return apiFetch("/tags");
  },
};
