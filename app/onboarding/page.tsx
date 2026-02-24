"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const REDIRECT_MAP: Record<string, string> = {
  judge: "/judges",
  lawyer: "/lawyers",
  law_student: "/students",
  common_person: "/citizens",
  admin: "/admin",
};

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const animatingRef = useRef(false);

  const onAnimationStart = useCallback(() => {
    animatingRef.current = true;
  }, []);

  useEffect(() => {
    // Don't redirect while the completion animation is playing
    if (animatingRef.current) return;
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/login");
      return;
    }
    if (session.user.onboardingCompleted) {
      const role = session.user.role;
      const redirect = role ? REDIRECT_MAP[role] : "/";
      router.replace(redirect || "/");
    }
  }, [session, status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (session.user.onboardingCompleted && !animatingRef.current) return null;

  return (
    <OnboardingFlow
      userId={session.user.id}
      userEmail={session.user.email}
      userName={session.user.name}
      onAnimationStart={onAnimationStart}
    />
  );
}
