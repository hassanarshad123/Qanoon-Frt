// Canonical shared types for profiles, activity, and dashboard data.
// These are camelCase to match server action conventions.
// Import from here in new code; action files re-export for backward compat.

// ── Profiles ────────────────────────────────────────────────────────

export interface JudgeProfile {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  courtLevel: string | null;
  designation: string | null;
  province: string | null;
  city: string | null;
  courtName: string | null;
  tourCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LawyerProfile {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  barCouncilNumber: string | null;
  yearsOfExperience: string | null;
  practiceAreas: string[];
  province: string | null;
  city: string | null;
  primaryCourt: string | null;
  firmType: string | null;
  firmName: string | null;
  tourCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Activity ────────────────────────────────────────────────────────

export type EntityType = "brief" | "judgment" | "research" | "note" | "document";
export type ActionType = "created" | "updated" | "deleted" | "finalized" | "viewed";

export interface ActivityEntry {
  id: string;
  action: ActionType;
  entityType: EntityType;
  entityId: string | null;
  entityTitle: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ── Dashboard ───────────────────────────────────────────────────────

export interface DashboardData {
  profile: JudgeProfile;
  stats: {
    totalBriefs: number;
    totalResearch: number;
    totalNotes: number;
    totalJudgments: number;
    totalDocuments: number;
  };
  recentActivity: ActivityEntry[];
  recentWork: {
    id: string;
    type: "brief" | "judgment";
    title: string;
    status: string;
    createdAt: string;
  }[];
}

export interface LawyerDashboardData {
  profile: LawyerProfile;
  stats: {
    totalBriefs: number;
    totalResearch: number;
    totalNotes: number;
    totalDocuments: number;
  };
  recentActivity: ActivityEntry[];
}

// ── Tour State ──────────────────────────────────────────────────────

export interface LawyerTourState {
  welcomeShown: boolean;
  completedChapters: string[];
  visitedSections: string[];
}
