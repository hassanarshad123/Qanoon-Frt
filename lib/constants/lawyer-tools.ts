import type { LawyerTool } from "@/lib/types/lawyer-portal";

export const lawyerTools: LawyerTool[] = [
  // ── AI Tools (6) ─────────────────────────────────────────
  {
    id: "ltool-001",
    name: "Case Brief",
    description:
      "Generate comprehensive case briefs with AI. Summarise facts, issues, arguments, and applicable precedents for any case.",
    icon: "FileText",
    href: "/lawyers/brief",
    group: "AI Tools",
  },
  {
    id: "ltool-002",
    name: "Petition Drafter",
    description:
      "Draft petitions, plaints, and written statements with AI assistance. Auto-populate court-specific formats and legal citations.",
    icon: "FilePen",
    href: "/lawyers/petition",
    group: "AI Tools",
  },
  {
    id: "ltool-003",
    name: "Legal Research",
    description:
      "Conduct in-depth legal research using AI. Ask questions in plain language and receive cited answers from Pakistani case law and statutes.",
    icon: "Search",
    href: "/lawyers/research",
    group: "AI Tools",
  },
  {
    id: "ltool-004",
    name: "Case Law Finder",
    description:
      "Search and discover relevant case law from Pakistani courts. Filter by court, year, subject, and judge with AI-powered relevance ranking.",
    icon: "BookOpen",
    href: "/lawyers/case-finder",
    group: "AI Tools",
  },
  {
    id: "ltool-005",
    name: "Statute Analyzer",
    description:
      "Analyse statutory provisions with AI. Get plain-language explanations, judicial interpretations, and amendment history for any section.",
    icon: "Scale",
    href: "/lawyers/statute-analyzer",
    group: "AI Tools",
  },
  {
    id: "ltool-006",
    name: "Contract Review",
    description:
      "Upload contracts for AI-powered review. Identify risk clauses, obligations, deadlines, and red flags with suggested improvements.",
    icon: "FileCheck",
    href: "/lawyers/contract-review",
    group: "AI Tools",
  },

  // ── Database & Research (6) ──────────────────────────────
  {
    id: "ltool-007",
    name: "Case Law Repository",
    description:
      "Browse the full case law database of Pakistani superior and subordinate courts. Access full judgments, headnotes, and citations.",
    icon: "Library",
    href: "/lawyers/case-law",
    group: "Database & Research",
  },
  {
    id: "ltool-008",
    name: "Statute Library",
    description:
      "Access the complete library of Pakistani statutes, ordinances, and rules. Full text with chapter and section navigation.",
    icon: "BookMarked",
    href: "/lawyers/statutes",
    group: "Database & Research",
  },
  {
    id: "ltool-009",
    name: "Legal Forms",
    description:
      "Download ready-to-use legal form templates. Court forms, agreements, notices, and affidavits in standard Pakistani formats.",
    icon: "FileStack",
    href: "/lawyers/legal-forms",
    group: "Database & Research",
  },
  {
    id: "ltool-010",
    name: "Court Directory",
    description:
      "Directory of all Pakistani courts and tribunals. Find contact information, jurisdiction details, and presiding judges.",
    icon: "Building2",
    href: "/lawyers/court-directory",
    group: "Database & Research",
  },
  {
    id: "ltool-011",
    name: "Case Tracker",
    description:
      "Track your active cases with timelines, hearing dates, and linked documents. Get automatic reminders for upcoming dates.",
    icon: "ClipboardList",
    href: "/lawyers/case-tracker",
    group: "Database & Research",
  },
  {
    id: "ltool-012",
    name: "Amendment Alerts",
    description:
      "Stay updated on legislative amendments affecting your practice areas. Impact analysis and effective dates for recent changes.",
    icon: "Bell",
    href: "/lawyers/amendments",
    group: "Database & Research",
  },

  // ── Practice Management (5) ──────────────────────────────
  {
    id: "ltool-013",
    name: "Clients",
    description:
      "Manage your client database. Store contact details, case associations, notes, and track client activity history.",
    icon: "Users",
    href: "/lawyers/clients",
    group: "Practice Management",
  },
  {
    id: "ltool-014",
    name: "Calendar",
    description:
      "View and manage your legal calendar. Track hearings, deadlines, meetings, and reminders in one unified view.",
    icon: "CalendarDays",
    href: "/lawyers/calendar",
    group: "Practice Management",
  },
  {
    id: "ltool-015",
    name: "Documents",
    description:
      "Centralized document management. Upload, organize, and search legal documents linked to cases and clients.",
    icon: "FolderOpen",
    href: "/lawyers/documents",
    group: "Practice Management",
  },
  {
    id: "ltool-016",
    name: "Billing",
    description:
      "Create and manage invoices for your legal services. Track time, generate bills, and monitor payment status.",
    icon: "Receipt",
    href: "/lawyers/billing",
    group: "Practice Management",
  },
  {
    id: "ltool-017",
    name: "File Manager",
    description:
      "Organize all your files and folders. Manage case files, client documents, templates, and personal records in a structured hierarchy.",
    icon: "HardDrive",
    href: "/lawyers/files",
    group: "Practice Management",
  },
];
