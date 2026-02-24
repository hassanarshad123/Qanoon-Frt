import { apiFetch } from "./client";
import type {
  JudgeProfile,
  LawyerProfile,
} from "@/lib/types/shared";

/** Tour state shape — intentionally generic so the consumer can use its own type */
type TourState = Record<string, unknown>;

export const profilesApi = {
  // --- Judge ---
  getJudgeProfile(): Promise<JudgeProfile> {
    return apiFetch("/profiles/judge");
  },

  updateJudgeProfile(data: Partial<JudgeProfile>): Promise<JudgeProfile> {
    return apiFetch("/profiles/judge", { method: "PUT", body: data });
  },

  getJudgeTourStatus(): Promise<{ tourCompleted: boolean }> {
    return apiFetch("/profiles/judge/tour-status");
  },

  completeJudgeTour(): Promise<{ success: boolean }> {
    return apiFetch("/profiles/judge/tour-complete", { method: "POST" });
  },

  // --- Lawyer ---
  getLawyerProfile(): Promise<LawyerProfile> {
    return apiFetch("/profiles/lawyer");
  },

  updateLawyerProfile(data: Partial<LawyerProfile>): Promise<LawyerProfile> {
    return apiFetch("/profiles/lawyer", { method: "PUT", body: data });
  },

  getLawyerTourState(): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-state");
  },

  patchLawyerTourState(patch: Partial<TourState>): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-state", { method: "PATCH", body: patch });
  },

  completeLawyerTourChapter(chapterId: string): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-chapter-complete", {
      method: "POST",
      body: { chapter_id: chapterId },
    });
  },

  recordLawyerSectionVisit(route: string): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-section-visit", {
      method: "POST",
      body: { route },
    });
  },

  markLawyerWelcomeShown(): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-welcome-shown", { method: "POST" });
  },

  resetLawyerTour(): Promise<TourState> {
    return apiFetch("/profiles/lawyer/tour-reset", { method: "POST" });
  },
};
