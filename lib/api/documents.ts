import { apiFetch, apiFetchFormData } from "./client";

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

export const documentsApi = {
  upload(file: File, title?: string, documentType?: string): Promise<{ id: string; blobUrl: string; fileName: string }> {
    const formData = new FormData();
    formData.append("file", file);
    if (title) formData.append("title", title);
    if (documentType) formData.append("document_type", documentType);

    return apiFetchFormData("/documents/upload", formData);
  },

  list(filters?: { documentType?: string; search?: string }): Promise<DocumentRecord[]> {
    const params = new URLSearchParams();
    if (filters?.documentType) params.set("document_type", filters.documentType);
    if (filters?.search) params.set("search", filters.search);
    const qs = params.toString();
    return apiFetch(`/documents${qs ? `?${qs}` : ""}`);
  },

  get(id: string): Promise<DocumentRecord> {
    return apiFetch(`/documents/${id}`);
  },

  delete(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/documents/${id}`, { method: "DELETE" });
  },

  link(id: string, links: { briefId?: string; judgmentId?: string }): Promise<{ success: boolean }> {
    return apiFetch(`/documents/${id}/link`, {
      method: "PATCH",
      body: { brief_id: links.briefId, judgment_id: links.judgmentId },
    });
  },
};
