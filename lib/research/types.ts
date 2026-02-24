import type { Citation } from "@/lib/types/portal";
import type { RAGSearchResult } from "@/lib/rag/types";

export type ResearchMode = "general" | "case_linked";

export interface StructuredResearchResponse {
  summary: string;
  applicable_law: string;
  precedents: string;
  analysis: string;
  contrary_views: string;
}

export interface ResearchConversationDB {
  id: string;
  title: string;
  caseId: string | null;
  legalAreas: string[];
  status: string;
  pinned: boolean;
  mode: ResearchMode;
  messageCount: number;
  lastMessagePreview: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchMessageDB {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  structuredResponse: StructuredResearchResponse | null;
  citations: Citation[];
  ragContext: RAGSearchResult[] | null;
  createdAt: string;
}
