// Shared portal UI types used by judge/lawyer portal components
// Extracted from lib/mock/types.ts

export interface Citation {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: string;
  relevance: string;
  snippet: string;
}

export interface Precedent {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: string;
  relevance: string;
  summary: string;
  relevanceScore: number;
}

export type CaseStatus = "Active" | "Pending" | "Closed" | "Urgent" | "Reserved" | "Adjourned" | "Dismissed" | "Decreed";
export type CaseType = "Constitutional" | "Civil" | "Criminal" | "Family" | "Tax" | "Corporate" | "Writ" | "Appeal";
export type BriefStatus = "Generating" | "Complete" | "Draft";
export type JudgmentStatus = "Draft" | "Under Review" | "Finalized";
export type NoteFolder = "General" | "Case Research" | "Brief Notes" | "Judgment Drafts" | "Hearing Prep";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Folder {
  id: string;
  name: NoteFolder;
  count: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: NoteFolder;
  tags: string[];
  sourceId?: string;
  sourceType?: "brief" | "judgment" | "research";
  sourceLabel?: string;
  createdAt: string;
  updatedAt: string;
}
