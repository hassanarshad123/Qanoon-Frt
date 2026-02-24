import { apiFetch } from "./client";
import type { DashboardData, LawyerDashboardData } from "@/lib/types/shared";

export const dashboardApi = {
  getJudgeDashboard(): Promise<DashboardData> {
    return apiFetch("/dashboard/judge");
  },

  getLawyerDashboard(): Promise<LawyerDashboardData> {
    return apiFetch("/dashboard/lawyer");
  },
};
