import { apiFetch } from "./client";

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newThisWeek: number;
  byRole: { role: string; count: number }[];
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminUserDetail extends AdminUser {
  profileData: Record<string, unknown> | null;
  activityCount: number;
  lastActivity: string | null;
}

export interface RAGHealthStatus {
  status: string;
  totalPrecedents: number;
  totalChunks: number;
  embeddingDim: number;
  indexHealth: string;
}

export interface RAGInfo {
  totalPrecedents: number;
  totalChunks: number;
  courts: string[];
  jurisdictions: string[];
}

export interface RAGIngestResult {
  success: boolean;
  jobId: string;
  message: string;
}

export interface RAGQueryResult {
  results: Record<string, unknown>[];
  total: number;
  query: string;
}

export const adminApi = {
  getStats(): Promise<AdminStats> {
    return apiFetch("/admin/stats");
  },

  getUsers(params?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.role) qs.set("role", params.role);
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.pageSize) qs.set("page_size", String(params.pageSize));
    return apiFetch(`/admin/users?${qs}`);
  },

  getUserDetail(userId: string): Promise<AdminUserDetail> {
    return apiFetch(`/admin/users/${userId}`);
  },

  toggleUserStatus(userId: string, isActive: boolean): Promise<{ success: boolean }> {
    return apiFetch(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: { is_active: isActive },
    });
  },

  changeUserRole(userId: string, role: string): Promise<{ success: boolean }> {
    return apiFetch(`/admin/users/${userId}/role`, {
      method: "PATCH",
      body: { role },
    });
  },

  // --- RAG management ---

  ragIngest(records: Record<string, unknown>[]): Promise<RAGIngestResult> {
    return apiFetch("/admin/rag/ingest", { method: "POST", body: { records } });
  },

  ragIngestStatus(jobId: string): Promise<{ status: string; progress: number; message: string }> {
    return apiFetch(`/admin/rag/ingest?jobId=${jobId}`);
  },

  ragIngestBulk(
    records: Record<string, unknown>[],
    jurisdiction?: string
  ): Promise<RAGIngestResult> {
    return apiFetch("/admin/rag/ingest/bulk", {
      method: "POST",
      body: { records, jurisdiction },
    });
  },

  ragQuery(data: {
    query: string;
    filters?: Record<string, unknown>;
    limit?: number;
    includeChunks?: boolean;
  }): Promise<RAGQueryResult> {
    return apiFetch("/admin/rag/query", {
      method: "POST",
      body: {
        query: data.query,
        filters: data.filters,
        limit: data.limit,
        include_chunks: data.includeChunks,
      },
    });
  },

  ragHealth(): Promise<RAGHealthStatus> {
    return apiFetch("/admin/rag/health");
  },

  ragInfo(): Promise<RAGInfo> {
    return apiFetch("/admin/rag/info");
  },
};
