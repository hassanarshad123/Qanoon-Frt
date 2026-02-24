import { apiFetch, apiStream } from "./client";

export interface JudgmentSummary {
  id: string;
  caseTitle: string;
  caseNumber: string | null;
  court: string | null;
  status: string;
  briefId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JudgmentSection {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  order: number;
  reviewStatus: string | null;
  flagNote: string | null;
  regenerationCount: number;
}

export interface JudgmentChatMessage {
  id: string;
  role: string;
  content: string;
  citations: unknown[];
  createdAt: string;
}

export interface JudgmentDetail extends JudgmentSummary {
  caseData: Record<string, unknown> | null;
  ragResults: Record<string, unknown>[];
  sections: JudgmentSection[];
  chatMessages: JudgmentChatMessage[];
}

export const judgmentsApi = {
  create(data: {
    case_title: string;
    case_number?: string;
    court?: string;
    brief_id?: string;
    case_data?: Record<string, unknown>;
    rag_results?: Record<string, unknown>[];
    sections?: { section_key: string; title: string; content: string }[];
  }): Promise<{ id: string }> {
    return apiFetch("/judgments", { method: "POST", body: data });
  },

  list(): Promise<JudgmentSummary[]> {
    return apiFetch("/judgments");
  },

  get(id: string): Promise<JudgmentDetail> {
    return apiFetch(`/judgments/${id}`);
  },

  updateStatus(id: string, status: string): Promise<{ success: boolean }> {
    return apiFetch(`/judgments/${id}/status`, { method: "PATCH", body: { status } });
  },

  delete(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/judgments/${id}`, { method: "DELETE" });
  },

  updateSectionContent(
    sectionId: string,
    content: string,
    incrementRegeneration = false
  ): Promise<{ success: boolean }> {
    return apiFetch(`/judgments/sections/${sectionId}/content`, {
      method: "PATCH",
      body: { content, increment_regeneration: incrementRegeneration },
    });
  },

  updateSectionReview(
    sectionId: string,
    status: string,
    flagNote?: string
  ): Promise<{ success: boolean }> {
    return apiFetch(`/judgments/sections/${sectionId}/review`, {
      method: "PATCH",
      body: { status, flag_note: flagNote },
    });
  },

  saveChatMessage(
    judgmentId: string,
    role: string,
    content: string,
    citations: unknown[] = []
  ): Promise<{ id: string }> {
    return apiFetch(`/judgments/${judgmentId}/chat`, {
      method: "POST",
      body: { role, content, citations },
    });
  },

  // --- Streaming / AI endpoints ---

  generate(
    data: {
      briefId?: string;
      caseTitle: string;
      caseNumber?: string;
      court?: string;
      caseData?: Record<string, unknown>;
    },
    signal?: AbortSignal
  ) {
    return apiStream("/judgments/generate", {
      brief_id: data.briefId,
      case_title: data.caseTitle,
      case_number: data.caseNumber,
      court: data.court,
      case_data: data.caseData,
    }, signal);
  },

  chatStream(
    judgmentContext: string,
    messages: { role: string; content: string }[],
    userMessage: string,
    signal?: AbortSignal
  ) {
    return apiStream("/judgments/chat-stream", {
      judgment_context: judgmentContext,
      messages,
      user_message: userMessage,
    }, signal);
  },

  regenerate(
    sectionTitle: string,
    currentContent: string,
    judgeNote: string,
    judgmentContext: string,
    signal?: AbortSignal
  ) {
    return apiStream("/judgments/regenerate", {
      section_title: sectionTitle,
      current_content: currentContent,
      judge_note: judgeNote,
      judgment_context: judgmentContext,
    }, signal);
  },
};
