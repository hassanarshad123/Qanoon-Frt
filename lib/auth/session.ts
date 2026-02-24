"use server";

import { auth } from "@/auth";

export async function getUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized: No active session");
  }
  return session.user.id;
}
