// Production brief pipeline types
// Extracted from lib/mock/types.ts — these are used by 15+ production files

export type FileFormat =
  | "pdf"
  | "docx"
  | "doc"
  | "xlsx"
  | "xls"
  | "csv"
  | "txt"
  | "rtf"
  | "image"
  | "unsupported";

export type UploadDocumentType =
  | "Petition"
  | "Written Arguments"
  | "Evidence"
  | "Affidavit"
  | "Court Order"
  | "Previous Judgment"
  | "FIR"
  | "Statutory Extract"
  | "Contract"
  | "Spreadsheet"
  | "Other";

export interface UploadedDocument {
  id: string;
  file: File;
  fileName: string;
  fileSize: number;
  documentType: UploadDocumentType;
  fileFormat: FileFormat;
  status: "pending" | "extracting" | "extracted" | "skipped" | "error";
  progress: number;
  totalPages: number;
  extractedText: string;
  pages: { pageNumber: number; text: string }[];
  error?: string;
}

export interface SourceReference {
  documentId: string;
  documentName: string;
  documentType: UploadDocumentType;
  pageNumber: number;
  snippet?: string;
}

export interface ExtractedParty {
  name: string;
  role: "petitioner" | "respondent" | "appellant" | "other";
  counsel?: string;
  sources: SourceReference[];
}

export interface ExtractedFact {
  content: string;
  date?: string;
  order: number;
  sources: SourceReference[];
}

export interface ExtractedLegalIssue {
  content: string;
  relatedStatutes: string[];
  sources: SourceReference[];
}

export interface ExtractedStatuteRef {
  name: string;
  provisions: string[];
  context?: string;
  sources: SourceReference[];
}

export interface ExtractedArgument {
  content: string;
  side: "petitioner" | "respondent";
  supportingCitations: string[];
  sources: SourceReference[];
}

export interface ExtractedCourtInfo {
  courtName: string;
  caseNumber: string;
  caseType: string;
  filingDate?: string;
  judge?: string;
  sources: SourceReference[];
}

export interface ExtractedCaseData {
  courtInfo: ExtractedCourtInfo | null;
  parties: ExtractedParty[];
  facts: ExtractedFact[];
  legalIssues: ExtractedLegalIssue[];
  statutes: ExtractedStatuteRef[];
  arguments: ExtractedArgument[];
  rawDocuments: { id: string; fileName: string; documentType: UploadDocumentType; totalPages: number }[];
}

// Enhanced brief types

export type SectionReviewStatus = "pending_review" | "approved" | "flagged";

export interface EnhancedBriefSection {
  id: string;
  title: string;
  content: string;
  sources: SourceReference[];
  reviewStatus: SectionReviewStatus;
  flagNote?: string;
  regenerationCount: number;
}
