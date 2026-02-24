"use server";

import { signupSchema, forgotPasswordSchema, resetPasswordSchema } from "./schemas";
import { createUser, getUserByEmail, updateUserPassword } from "./user";
import { createPasswordResetToken, validatePasswordResetToken, consumePasswordResetToken } from "./password-reset";
import { sendPasswordResetEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

type ActionResult = { success: boolean; error?: string };

export async function signupAction(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const { name, email, password } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    return { success: false, error: "An account with this email already exists" };
  }

  try {
    await createUser(email, password, name, data.role);
    return { success: true };
  } catch (err: any) {
    console.error("Signup error:", err);
    return { success: false, error: "Failed to create account. Please try again." };
  }
}

export async function forgotPasswordAction(data: {
  email: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const user = await getUserByEmail(parsed.data.email);
  // Always return success to prevent email enumeration
  if (!user) return { success: true };

  try {
    const token = await createPasswordResetToken(user.id);
    await sendPasswordResetEmail(user.email, token);
  } catch (err) {
    console.error("Password reset error:", err);
  }

  return { success: true };
}

export async function resetPasswordAction(data: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const tokenData = await validatePasswordResetToken(parsed.data.token);
  if (!tokenData) {
    return { success: false, error: "Invalid or expired reset link. Please request a new one." };
  }

  try {
    const hash = await bcrypt.hash(parsed.data.password, 12);
    await updateUserPassword(tokenData.userId, hash);
    await consumePasswordResetToken(parsed.data.token);
    return { success: true };
  } catch (err) {
    console.error("Reset password error:", err);
    return { success: false, error: "Failed to reset password. Please try again." };
  }
}
