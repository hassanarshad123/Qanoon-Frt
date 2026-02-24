import type { TourChapter } from "./types";

export const TOUR_CHAPTERS: TourChapter[] = [
  {
    id: "ch-1",
    title: "Welcome to Your Legal Workspace",
    description: "Get familiar with your dashboard and key metrics.",
    steps: [
      {
        id: "1-1",
        target: "lawyer-greeting",
        title: "Your Dashboard",
        description:
          "This is your home base. You'll see a personalized greeting and today's date at a glance.",
        placement: "bottom",
      },
      {
        id: "1-2",
        target: "lawyer-stats",
        title: "Key Metrics",
        description:
          "Track your active cases, upcoming hearings, pending drafts, and client count — all updated in real-time.",
        placement: "bottom",
      },
      {
        id: "1-3",
        target: "lawyer-schedule",
        title: "Today's Schedule",
        description:
          "See your hearings, meetings, and deadlines for today. Syncs with your calendar.",
        placement: "top",
      },
      {
        id: "1-4",
        target: "lawyer-quick-actions",
        title: "Quick Actions",
        description:
          "Jump straight into common tasks — generate a brief, draft a petition, or start legal research with one click.",
        placement: "left",
      },
      {
        id: "1-5",
        target: "lawyer-activity",
        title: "Recent Activity",
        description:
          "Your activity feed shows recent briefs, research sessions, and document edits across all tools.",
        placement: "top",
      },
    ],
  },
  {
    id: "ch-2",
    title: "Your AI Assistant",
    description: "Discover powerful AI tools in the sidebar.",
    steps: [
      {
        id: "2-1",
        target: "nav-brief",
        title: "Case Brief Generator",
        description:
          "Upload case details and get a comprehensive AI-generated brief with relevant precedents and legal arguments.",
        expandGroup: "ai-tools",
        placement: "right",
      },
      {
        id: "2-2",
        target: "nav-petition",
        title: "Petition Drafter",
        description:
          "Draft petitions, applications, and legal documents using AI that understands Pakistani law and court formats.",
        expandGroup: "ai-tools",
        placement: "right",
      },
      {
        id: "2-3",
        target: "nav-research",
        title: "Legal Research",
        description:
          "Ask legal questions in plain language and get answers backed by relevant statutes and case law.",
        expandGroup: "ai-tools",
        placement: "right",
      },
      {
        id: "2-4",
        target: "nav-all-tools",
        title: "All Tools",
        description:
          "Access every tool from this single page. Browse all 17 tools organized by category.",
        placement: "right",
      },
    ],
  },
  {
    id: "ch-3",
    title: "Deep Legal Research",
    description: "Advanced AI-powered research and analysis tools.",
    triggerRoutes: [
      "/lawyers/case-finder",
      "/lawyers/statute-analyzer",
      "/lawyers/contract-review",
    ],
    steps: [
      {
        id: "3-1",
        target: "nav-case-finder",
        title: "Case Law Finder",
        description:
          "Search through thousands of Pakistani case law records. AI ranks results by relevance to your query.",
        expandGroup: "ai-tools",
        placement: "right",
      },
      {
        id: "3-2",
        target: "nav-statute-analyzer",
        title: "Statute Analyzer",
        description:
          "Paste any statute section and get a plain-language breakdown with related amendments and case interpretations.",
        expandGroup: "ai-tools",
        placement: "right",
      },
      {
        id: "3-3",
        target: "nav-contract-review",
        title: "Contract Review",
        description:
          "Upload contracts for AI analysis — identify risks, missing clauses, and get improvement suggestions.",
        expandGroup: "ai-tools",
        placement: "right",
      },
    ],
  },
  {
    id: "ch-4",
    title: "Legal Database",
    description: "Access comprehensive legal reference materials.",
    triggerRoutes: [
      "/lawyers/case-law",
      "/lawyers/statutes",
      "/lawyers/legal-forms",
      "/lawyers/court-directory",
    ],
    steps: [
      {
        id: "4-1",
        target: "nav-case-law",
        title: "Case Law Repository",
        description:
          "Browse the full case law database. Filter by court, year, judge, or legal topic.",
        expandGroup: "database",
        placement: "right",
      },
      {
        id: "4-2",
        target: "nav-statutes",
        title: "Statute Library",
        description:
          "Complete collection of Pakistani statutes with full text, amendment history, and cross-references.",
        expandGroup: "database",
        placement: "right",
      },
      {
        id: "4-3",
        target: "nav-legal-forms",
        title: "Legal Forms",
        description:
          "Ready-to-use templates for common legal documents — affidavits, power of attorney, notices, and more.",
        expandGroup: "database",
        placement: "right",
      },
      {
        id: "4-4",
        target: "nav-court-directory",
        title: "Court Directory",
        description:
          "Find court addresses, contact information, bench assignments, and filing procedures across Pakistan.",
        expandGroup: "database",
        placement: "right",
      },
    ],
  },
  {
    id: "ch-5",
    title: "Track Your Cases",
    description: "Monitor case progress and stay updated on amendments.",
    triggerRoutes: ["/lawyers/case-tracker", "/lawyers/amendments"],
    steps: [
      {
        id: "5-1",
        target: "nav-case-tracker",
        title: "Case Tracker",
        description:
          "Track all your active cases in one place. See next hearing dates, case status, and important deadlines.",
        expandGroup: "database",
        placement: "right",
      },
      {
        id: "5-2",
        target: "nav-amendments",
        title: "Amendment Alerts",
        description:
          "Get notified when statutes relevant to your cases are amended. Never miss a legal update.",
        expandGroup: "database",
        placement: "right",
      },
    ],
  },
  {
    id: "ch-6",
    title: "Manage Your Practice",
    description: "Client management, billing, documents, and more.",
    triggerRoutes: [
      "/lawyers/clients",
      "/lawyers/calendar",
      "/lawyers/documents",
      "/lawyers/billing",
      "/lawyers/files",
    ],
    steps: [
      {
        id: "6-1",
        target: "nav-clients",
        title: "Clients",
        description:
          "Manage your client roster — add new clients, track case associations, and store contact details.",
        expandGroup: "practice",
        placement: "right",
      },
      {
        id: "6-2",
        target: "nav-calendar",
        title: "Calendar",
        description:
          "Schedule hearings, meetings, and deadlines. Set reminders so you never miss a court date.",
        expandGroup: "practice",
        placement: "right",
      },
      {
        id: "6-3",
        target: "nav-documents",
        title: "Documents",
        description:
          "Store, organize, and share legal documents. All your briefs and petitions are saved here automatically.",
        expandGroup: "practice",
        placement: "right",
      },
      {
        id: "6-4",
        target: "nav-billing",
        title: "Billing",
        description:
          "Track billable hours, generate invoices, and manage payments for your legal services.",
        expandGroup: "practice",
        placement: "right",
      },
      {
        id: "6-5",
        target: "nav-files",
        title: "File Manager",
        description:
          "Upload and organize case files, evidence, and supporting documents in a secure cloud storage.",
        expandGroup: "practice",
        placement: "right",
      },
    ],
  },
];
