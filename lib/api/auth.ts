import { apiFetch } from "./client";

type ActionResult = { success: boolean; error?: string | null };

export const authApi = {
  signup(data: {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
    role?: string;
  }): Promise<ActionResult> {
    return apiFetch("/auth/signup", { method: "POST", body: data });
  },

  forgotPassword(data: { email: string }): Promise<ActionResult> {
    return apiFetch("/auth/forgot-password", { method: "POST", body: data });
  },

  resetPassword(data: {
    token: string;
    password: string;
    confirm_password: string;
  }): Promise<ActionResult> {
    return apiFetch("/auth/reset-password", { method: "POST", body: data });
  },
};
