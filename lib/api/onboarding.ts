import { apiFetch } from "./client";

type ActionResult = { success: boolean; error?: string | null };

export const onboardingApi = {
  submit(data: {
    role: string;
    email: string;
    data: Record<string, unknown>;
    user_id?: string;
  }): Promise<ActionResult> {
    return apiFetch("/onboarding/submit", { method: "POST", body: data });
  },

  comingSoon(data: { role: string; email: string }): Promise<ActionResult> {
    return apiFetch("/onboarding/coming-soon", { method: "POST", body: data });
  },
};
