// Mock portal types — used by mock data files and some judge portal UI
// Production types have been extracted to:
//   - lib/brief-pipeline/types.ts (brief pipeline types)
//   - lib/types/portal.ts (shared portal UI types)
//   - lib/rag/types.ts (RAG types)

// Re-export from canonical locations for backward compatibility
export type {
  Citation,
  Precedent,
  CaseStatus,
  CaseType,
  BriefStatus,
  JudgmentStatus,
  NoteFolder,
  Tag,
  Folder,
  Note,
} from "@/lib/types/portal";

export type {
  FileFormat,
  UploadDocumentType,
  UploadedDocument,
  SourceReference,
  ExtractedParty,
  ExtractedFact,
  ExtractedLegalIssue,
  ExtractedStatuteRef,
  ExtractedArgument,
  ExtractedCourtInfo,
  ExtractedCaseData,
  SectionReviewStatus,
  EnhancedBriefSection,
} from "@/lib/brief-pipeline/types";

export type {
  RAGPrecedent,
  RAGSearchResult,
} from "@/lib/rag/types";

// Import types needed for interfaces below
import type { Citation } from "@/lib/types/portal";
import type { BriefStatus, JudgmentStatus, NoteFolder } from "@/lib/types/portal";
import type {
  SourceReference,
  ExtractedCaseData,
  UploadDocumentType,
  EnhancedBriefSection,
} from "@/lib/brief-pipeline/types";
import type { RAGSearchResult } from "@/lib/rag/types";

// =====================================================================
// Mock-specific types (used only by mock data files)
// =====================================================================

export type DocumentType = "Petition" | "Written Arguments" | "Court Order" | "Evidence" | "Affidavit" | "Judgment" | "Notice" | "Bail Application";

export interface Case {
  id: string;
  title: string;
  number: string;
  court: string;
  citation: string;
  status: import("@/lib/types/portal").CaseStatus;
  type: import("@/lib/types/portal").CaseType;
  judge: string;
  filed: string;
  nextHearing: string;
  petitioner: string;
  respondent: string;
  petitionerCounsel: string;
  respondentCounsel: string;
  description: string;
}

export interface Document {
  id: string;
  caseId: string;
  title: string;
  type: DocumentType;
  pages: number;
  fileSize: string;
  uploadedAt: string;
  content: string;
}

export interface BriefSection {
  id: string;
  title: string;
  content: string;
}

export interface BriefConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface Brief {
  id: string;
  caseId: string;
  caseTitle: string;
  status: BriefStatus;
  createdAt: string;
  sections: BriefSection[];
  conversation: BriefConversationMessage[];
}

export interface JudgmentSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Judgment {
  id: string;
  caseId: string;
  caseTitle: string;
  status: JudgmentStatus;
  createdAt: string;
  sections: JudgmentSection[];
  suggestedPrecedents: import("@/lib/types/portal").Precedent[];
}

export interface ResearchMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface ResearchConversation {
  id: string;
  title: string;
  createdAt: string;
  messages: ResearchMessage[];
}

export interface Hearing {
  id: string;
  caseId: string;
  caseTitle: string;
  caseNumber: string;
  time: string;
  courtRoom: string;
  type: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Adjourned";
}

export interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  timestamp: string;
  linkTo?: string;
}

export interface DashboardStats {
  activeCases: number;
  todayHearings: number;
  pendingJudgments: number;
  documentsThisWeek: number;
}

export type EnhancedBriefStatus =
  | "uploading"
  | "extracting"
  | "generating"
  | "in_review"
  | "finalized"
  | BriefStatus;

export interface EnhancedBrief extends Omit<Brief, "status" | "sections"> {
  status: EnhancedBriefStatus;
  sections: (BriefSection | EnhancedBriefSection)[];
  conversation: BriefConversationMessage[];
  extractedData?: ExtractedCaseData;
  uploadedDocuments?: { id: string; fileName: string; documentType: UploadDocumentType; totalPages: number }[];
  ragResults?: RAGSearchResult[];
  reviewProgress?: { total: number; approved: number; flagged: number };
}
