import { cases } from "./cases";
import { documents } from "./documents";
import { briefs } from "./briefs";
import { judgments } from "./judgments";
import { researchConversations } from "./research-conversations";
import { notes as notesData } from "./notes";
import { folders, tags } from "./folders";
import { hearings } from "./hearings";
import { activityItems } from "./activity";
import type { Case, Document, Brief, Judgment, ResearchConversation, Note, Folder, Tag, Hearing, ActivityItem, DashboardStats, EnhancedBrief, EnhancedBriefSection, EnhancedBriefStatus } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 200);

// Cases
export async function getCases(): Promise<Case[]> { await randomDelay(); return cases; }
export async function getCaseById(id: string): Promise<Case | undefined> { await randomDelay(); return cases.find(c => c.id === id); }

// Documents
export async function getDocuments(): Promise<Document[]> { await randomDelay(); return documents; }
export async function getDocumentById(id: string): Promise<Document | undefined> { await randomDelay(); return documents.find(d => d.id === id); }
export async function getDocumentsByCaseId(caseId: string): Promise<Document[]> { await randomDelay(); return documents.filter(d => d.caseId === caseId); }

// Briefs
export async function getBriefs(): Promise<(Brief | EnhancedBrief)[]> { await randomDelay(); return briefs; }
export async function getBriefById(id: string): Promise<Brief | EnhancedBrief | undefined> { await randomDelay(); return briefs.find(b => b.id === id); }

// Enhanced Brief operations
const dynamicBriefs: EnhancedBrief[] = [];

export async function createBrief(brief: EnhancedBrief): Promise<EnhancedBrief> {
  await randomDelay();
  dynamicBriefs.push(brief);
  (briefs as any[]).push(brief);
  return brief;
}

export async function updateBriefSection(
  briefId: string,
  sectionId: string,
  updates: Partial<EnhancedBriefSection>
): Promise<EnhancedBriefSection | undefined> {
  await randomDelay();
  const brief = briefs.find(b => b.id === briefId) as EnhancedBrief | undefined;
  if (!brief) return undefined;
  const section = brief.sections.find(s => s.id === sectionId) as EnhancedBriefSection | undefined;
  if (!section) return undefined;
  Object.assign(section, updates);
  return section;
}

export async function updateBriefStatus(
  briefId: string,
  status: EnhancedBriefStatus
): Promise<boolean> {
  await randomDelay();
  const brief = briefs.find(b => b.id === briefId);
  if (!brief) return false;
  (brief as any).status = status;
  return true;
}

// Judgments
export async function getJudgments(): Promise<Judgment[]> { await randomDelay(); return judgments; }
export async function getJudgmentById(id: string): Promise<Judgment | undefined> { await randomDelay(); return judgments.find(j => j.id === id); }

// Research
export async function getResearchConversations(): Promise<ResearchConversation[]> { await randomDelay(); return researchConversations; }
export async function getResearchConversationById(id: string): Promise<ResearchConversation | undefined> { await randomDelay(); return researchConversations.find(c => c.id === id); }

// Notes
export async function getNotes(): Promise<Note[]> { await randomDelay(); return notesData; }
export async function getNoteById(id: string): Promise<Note | undefined> { await randomDelay(); return notesData.find(n => n.id === id); }
export async function getNotesByFolder(folder: string): Promise<Note[]> { await randomDelay(); return notesData.filter(n => n.folder === folder); }

// Folders & Tags
export async function getFolders(): Promise<Folder[]> { await randomDelay(); return folders; }
export async function getTags(): Promise<Tag[]> { await randomDelay(); return tags; }

// Hearings
export async function getHearings(): Promise<Hearing[]> { await randomDelay(); return hearings; }

// Activity
export async function getActivityItems(): Promise<ActivityItem[]> { await randomDelay(); return activityItems; }

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  await randomDelay();
  return { activeCases: 47, todayHearings: 4, pendingJudgments: 5, documentsThisWeek: 12 };
}
