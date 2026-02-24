import { apiFetch } from "./client";
import type { ActivityEntry } from "@/lib/types/shared";

export type { ActivityEntry } from "@/lib/types/shared";

export const activityApi = {
  getRecent(limit = 20): Promise<ActivityEntry[]> {
    return apiFetch(`/activity/recent?limit=${limit}`);
  },
};
