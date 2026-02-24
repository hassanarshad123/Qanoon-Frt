import { apiFetch, apiStream } from "./client";

export interface ResearchConversationSummary {
  id: string;
  title: string;
  caseId: string | null;
  mode: string | null;
  pinned: boolean;
  legalAreas: string[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchConversationDetail extends ResearchConversationSummary {
  messages: ResearchMessageDB[];
}

export interface ResearchMessageDB {
  id: string;
  role: string;
  content: string;
  citations: unknown[];
  metadata: Record<string, unknown>;
  createdAt: string;
}

export const researchApi = {
  listConversations(search?: string, limit = 50): Promise<ResearchConversationSummary[]> {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("limit", String(limit));
    return apiFetch(`/research/conversations?${params}`);
  },

  createConversation(data: {
    title?: string;
    case_id?: string;
    mode?: string;
  }): Promise<{ id: string }> {
    return apiFetch("/research/conversations", { method: "POST", body: data });
  },

  getConversation(id: string): Promise<ResearchConversationDetail> {
    return apiFetch(`/research/conversations/${id}`);
  },

  deleteConversation(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/research/conversations/${id}`, { method: "DELETE" });
  },

  togglePin(id: string): Promise<{ pinned: boolean }> {
    return apiFetch(`/research/conversations/${id}/pin`, { method: "POST" });
  },

  updateMeta(id: string, meta: { legal_areas?: string[]; case_id?: string }): Promise<{ success: boolean }> {
    return apiFetch(`/research/conversations/${id}/meta`, { method: "PATCH", body: meta });
  },

  getMessages(conversationId: string): Promise<ResearchMessageDB[]> {
    return apiFetch(`/research/conversations/${conversationId}/messages`);
  },

  // --- Streaming / AI endpoints ---

  query(
    data: {
      question: string;
      conversationId?: string;
      caseId?: string;
      caseContext?: Record<string, unknown>;
    },
    signal?: AbortSignal
  ) {
    return apiStream("/research/query", {
      question: data.question,
      conversation_id: data.conversationId,
      case_id: data.caseId,
      case_context: data.caseContext,
    }, signal);
  },

  followUp(
    data: {
      conversationId: string;
      question: string;
      caseContext?: Record<string, unknown>;
    },
    signal?: AbortSignal
  ) {
    return apiStream("/research/follow-up", {
      conversation_id: data.conversationId,
      question: data.question,
      case_context: data.caseContext,
    }, signal);
  },
};
