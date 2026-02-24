// Domain types for the lawyer portal

import type { Citation } from "./portal";
export type { Citation } from "./portal";

export type LawyerCaseStatus = "Active" | "Pending" | "Closed" | "Urgent" | "Adjourned" | "Disposed" | "Reserved";
export type PetitionType = "Writ" | "Civil Suit" | "Criminal Complaint" | "Appeal" | "Review" | "Family" | "Bail" | "Miscellaneous";
export type BriefStatus = "Generating" | "Complete" | "Draft";
export type PetitionStatus = "Draft" | "Complete" | "Under Review";
export type ContractRiskLevel = "High" | "Medium" | "Low";
export type AmendmentImpact = "High" | "Medium" | "Low";
export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";
export type CalendarEventType = "Hearing" | "Deadline" | "Meeting" | "Reminder";
export type TrackedCaseEventType = "Filed" | "Hearing" | "Order" | "Adjourned" | "Evidence" | "Arguments" | "Reserved" | "Decided";
export type FormCategory = "Court Forms" | "Agreements" | "Notices" | "Affidavits";
export type CourtLevel = "Supreme Court" | "High Court" | "District Court" | "Tribunal" | "Special Court";
export type Province = "Federal" | "Punjab" | "Sindh" | "KPK" | "Balochistan" | "Islamabad";

export interface LawyerCase {
  id: string;
  title: string;
  number: string;
  court: string;
  citation: string;
  status: LawyerCaseStatus;
  type: PetitionType;
  judge: string;
  filed: string;
  nextHearing: string;
  clientId: string;
  clientName: string;
  opposingParty: string;
  opposingCounsel: string;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  caseIds: string[];
  lastActivity: string;
  notes: string;
}

export interface LawyerDocument {
  id: string;
  caseId?: string;
  clientId?: string;
  title: string;
  type: string;
  pages: number;
  fileSize: string;
  uploadedAt: string;
  category: string;
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

export interface LawyerBrief {
  id: string;
  caseId: string;
  caseTitle: string;
  status: BriefStatus;
  createdAt: string;
  sections: BriefSection[];
  conversation: BriefConversationMessage[];
}

export interface PetitionSection {
  id: string;
  title: string;
  content: string;
}

export interface Petition {
  id: string;
  caseId: string;
  caseTitle: string;
  type: PetitionType;
  status: PetitionStatus;
  court: string;
  createdAt: string;
  sections: PetitionSection[];
  suggestions: string[];
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

export interface CaseFinderResult {
  id: string;
  title: string;
  citation: string;
  court: string;
  date: string;
  judge: string;
  parties: string;
  summary: string;
  keyHoldings: string[];
  relatedCaseIds: string[];
  statutes: string[];
}

export interface StatuteSection {
  id: string;
  number: string;
  title: string;
  content: string;
}

export interface Statute {
  id: string;
  name: string;
  shortName: string;
  year: number;
  totalSections: number;
  chapters: number;
  description: string;
  sections: StatuteSection[];
}

export interface StatuteAnalysis {
  id: string;
  statuteId: string;
  statuteName: string;
  sectionNumber: string;
  query: string;
  plainLanguage: string;
  judicialInterpretations: string;
  amendmentsHistory: string;
  relatedSections: string[];
  createdAt: string;
  conversation: ResearchMessage[];
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  risk: ContractRiskLevel;
  analysis: string;
}

export interface ContractReview {
  id: string;
  title: string;
  fileName: string;
  status: "Analyzing" | "Complete";
  createdAt: string;
  overallRisk: ContractRiskLevel;
  summary: string;
  keyTerms: string[];
  obligations: string[];
  deadlines: string[];
  redFlags: string[];
  clauses: ContractClause[];
}

export interface LegalForm {
  id: string;
  title: string;
  category: FormCategory;
  description: string;
  fields: string[];
  downloadCount: number;
}

export interface CourtEntry {
  id: string;
  name: string;
  level: CourtLevel;
  province: Province;
  location: string;
  chiefJustice: string;
  contact: string;
  jurisdictionNotes: string;
}

export interface TrackedCaseEvent {
  id: string;
  date: string;
  type: TrackedCaseEventType;
  description: string;
}

export interface TrackedCase {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  nextDate: string;
  status: LawyerCaseStatus;
  clientId: string;
  clientName: string;
  events: TrackedCaseEvent[];
  linkedBriefIds: string[];
  linkedPetitionIds: string[];
  linkedDocumentIds: string[];
}

export interface Amendment {
  id: string;
  statuteId: string;
  statuteName: string;
  section: string;
  changeSummary: string;
  effectiveDate: string;
  impact: AmendmentImpact;
  fullAnalysis: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  caseId?: string;
  caseTitle?: string;
  location?: string;
  description: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
  fileType?: string;
  size?: string;
  date: string;
  source?: string;
  children?: string[];
}

export interface ActivityItem {
  id: string;
  icon: string;
  text: string;
  timestamp: string;
  linkTo?: string;
}

export interface LawyerTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  group: "AI Tools" | "Database & Research" | "Practice Management";
}

export interface DashboardStats {
  activeCases: number;
  upcomingHearings: number;
  pendingDrafts: number;
  totalClients: number;
}
