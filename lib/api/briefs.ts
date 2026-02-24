import { apiFetch, apiStream } from "./client";

export interface BriefSummary {
  id: string;
  caseTitle: string;
  caseNumber: string | null;
  court: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface BriefSection {
  id: string;
  title: string;
  content: string;
  reviewStatus: string | null;
  flagNote: string | null;
  regenerationCount: number;
}

export interface BriefChatMessage {
  id: string;
  role: string;
  content: string;
  citations: unknown[];
  createdAt: string;
}

export interface BriefDetail extends BriefSummary {
  extractedData: Record<string, unknown> | null;
  uploadedDocuments: Record<string, unknown>[];
  ragResults: Record<string, unknown>[];
  sections: BriefSection[];
  chatMessages: BriefChatMessage[];
}

export interface ExtractedCaseData {
  parties: Record<string, unknown>[];
  facts: Record<string, unknown>[];
  legalIssues: Record<string, unknown>[];
  statuteRefs: Record<string, unknown>[];
  arguments: Record<string, unknown>[];
  courtInfo: Record<string, unknown> | null;
}

export interface RAGResult {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  relevanceScore: number;
  summary: string;
}

export const briefsApi = {
  create(data: {
    case_title: string;
    case_number?: string;
    court?: string;
    extracted_data?: Record<string, unknown> | null;
    uploaded_documents?: Record<string, unknown>[];
    rag_results?: Record<string, unknown>[];
    sections?: Record<string, unknown>[];
  }): Promise<{ id: string }> {
    return apiFetch("/briefs", { method: "POST", body: data });
  },

  list(): Promise<BriefSummary[]> {
    return apiFetch("/briefs");
  },

  get(id: string): Promise<BriefDetail> {
    return apiFetch(`/briefs/${id}`);
  },

  updateStatus(id: string, status: string): Promise<{ success: boolean }> {
    return apiFetch(`/briefs/${id}/status`, { method: "PATCH", body: { status } });
  },

  delete(id: string): Promise<{ success: boolean }> {
    return apiFetch(`/briefs/${id}`, { method: "DELETE" });
  },

  updateSectionReview(
    sectionId: string,
    status: string,
    flagNote?: string
  ): Promise<{ success: boolean }> {
    return apiFetch(`/briefs/sections/${sectionId}/review`, {
      method: "PATCH",
      body: { status, flag_note: flagNote },
    });
  },

  updateSectionContent(
    sectionId: string,
    content: string,
    incrementRegeneration = false
  ): Promise<{ success: boolean }> {
    return apiFetch(`/briefs/sections/${sectionId}/content`, {
      method: "PATCH",
      body: { content, increment_regeneration: incrementRegeneration },
    });
  },

  saveChatMessage(
    briefId: string,
    role: string,
    content: string,
    citations: unknown[] = []
  ): Promise<{ id: string }> {
    return apiFetch(`/briefs/${briefId}/chat`, {
      method: "POST",
      body: { role, content, citations },
    });
  },

  // --- Streaming / AI endpoints ---

  generate(
    extractedData: Record<string, unknown>,
    ragResults: Record<string, unknown>[] = [],
    signal?: AbortSignal
  ) {
    return apiStream("/briefs/generate", {
      extracted_data: extractedData,
      rag_results: ragResults,
    }, signal);
  },

  chatStream(
    briefContext: string,
    messages: { role: string; content: string }[],
    userMessage: string,
    signal?: AbortSignal
  ) {
    return apiStream("/briefs/chat-stream", {
      brief_context: briefContext,
      messages,
      user_message: userMessage,
    }, signal);
  },

  regenerate(
    sectionTitle: string,
    currentContent: string,
    judgeNote: string,
    briefContext: string,
    signal?: AbortSignal
  ) {
    return apiStream("/briefs/regenerate", {
      section_title: sectionTitle,
      current_content: currentContent,
      judge_note: judgeNote,
      brief_context: briefContext,
    }, signal);
  },

  analyze(documents: { fileName: string; text: string }[]): Promise<ExtractedCaseData> {
    return apiFetch("/briefs/analyze", { method: "POST", body: { documents } });
  },

  analyzeChunk(
    documents: { fileName: string; text: string }[],
    chunkIndex?: number,
    totalChunks?: number
  ): Promise<ExtractedCaseData> {
    return apiFetch("/briefs/analyze-chunk", {
      method: "POST",
      body: { documents, chunk_index: chunkIndex, total_chunks: totalChunks },
    });
  },

  findPrecedents(extractedData: Record<string, unknown>): Promise<RAGResult[]> {
    return apiFetch("/briefs/precedents", {
      method: "POST",
      body: { extracted_data: extractedData },
    });
  },
};
