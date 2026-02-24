"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { OnboardingState, UserRole } from "@/lib/onboarding/types";
import {
  getOnboardingState,
  saveOnboardingState,
  clearOnboardingState,
  getDefaultState,
} from "@/lib/onboarding/storage";
import { LAWYER_STEPS, JUDGE_STEPS, LAW_STUDENT_STEPS, COMMON_PERSON_STEPS } from "@/lib/onboarding/constants";
import { submitOnboarding } from "@/lib/onboarding/submit";

interface UseOnboardingOptions {
  userId?: string;
}

const REDIRECT_MAP: Record<string, string> = {
  lawyer: "/lawyers",
  judge: "/judges",
  law_student: "/students",
  common_person: "/citizens",
};

function getStepsForRole(role: UserRole | null) {
  switch (role) {
    case "lawyer":
      return LAWYER_STEPS;
    case "judge":
      return JUDGE_STEPS;
    case "law_student":
      return LAW_STUDENT_STEPS;
    case "common_person":
      return COMMON_PERSON_STEPS;
    default:
      return LAWYER_STEPS;
  }
}

export function useOnboarding(options: UseOnboardingOptions = {}) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [state, setState] = useState<OnboardingState>(getDefaultState());
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setState(getOnboardingState());
    setHydrated(true);
  }, []);

  const persist = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...updates };
      saveOnboardingState(next);
      return next;
    });
  }, []);

  const setRole = useCallback(
    (role: UserRole) => {
      persist({ role, currentStep: 0 });
    },
    [persist]
  );

  const steps = getStepsForRole(state.role);
  const totalSteps = steps.length;
  const isLastStep = state.currentStep >= totalSteps - 1;

  const completeOnboarding = useCallback(async () => {
    const role = state.role!;
    if (options.userId) {
      await updateSession({ role, onboardingCompleted: true });
    }
    clearOnboardingState();
    const redirectTo = REDIRECT_MAP[role] || "/onboarding";
    router.push(redirectTo);
  }, [state.role, options.userId, updateSession, router]);

  const nextStep = useCallback(async () => {
    if (isSubmitting || isComplete) return;

    if (isLastStep) {
      setIsSubmitting(true);
      setSubmitError(null);
      const role = state.role!;

      let formData: Record<string, unknown>;
      let email: string;

      switch (role) {
        case "lawyer":
          formData = state.lawyerData as unknown as Record<string, unknown>;
          email = state.lawyerData.personalInfo.email;
          break;
        case "judge":
          formData = state.judgeData as unknown as Record<string, unknown>;
          email = state.judgeData.personalInfo.email;
          break;
        case "law_student":
          formData = state.lawStudentData as unknown as Record<string, unknown>;
          email = state.lawStudentData.personalInfo.email;
          break;
        case "common_person":
          formData = state.commonPersonData as unknown as Record<string, unknown>;
          email = state.commonPersonData.personalInfo.email;
          break;
        default:
          setIsSubmitting(false);
          return;
      }

      try {
        const result = await submitOnboarding(role, email, formData, options.userId);

        if (!result.success) {
          setSubmitError(result.error ?? "Submission failed. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setSubmitError(message);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsComplete(true);
      return;
    }
    persist({ currentStep: state.currentStep + 1 });
  }, [isSubmitting, isComplete, isLastStep, state, persist, options.userId]);

  const prevStep = useCallback(() => {
    if (state.currentStep <= 0 && state.role) {
      router.push("/signup");
      return;
    }
    if (state.currentStep <= 0) return;
    persist({ currentStep: state.currentStep - 1 });
  }, [state.currentStep, state.role, persist, router]);

  const updateLawyerData = useCallback(
    (section: keyof OnboardingState["lawyerData"], data: Record<string, unknown>) => {
      setState((prev) => {
        const next = {
          ...prev,
          lawyerData: {
            ...prev.lawyerData,
            [section]: { ...prev.lawyerData[section], ...data },
          },
        };
        saveOnboardingState(next);
        return next;
      });
    },
    []
  );

  const updateJudgeData = useCallback(
    (section: keyof OnboardingState["judgeData"], data: Record<string, unknown>) => {
      setState((prev) => {
        const next = {
          ...prev,
          judgeData: {
            ...prev.judgeData,
            [section]: { ...prev.judgeData[section], ...data },
          },
        };
        saveOnboardingState(next);
        return next;
      });
    },
    []
  );

  const updateLawStudentData = useCallback(
    (section: keyof OnboardingState["lawStudentData"], data: Record<string, unknown>) => {
      setState((prev) => {
        const next = {
          ...prev,
          lawStudentData: {
            ...prev.lawStudentData,
            [section]: { ...prev.lawStudentData[section], ...data },
          },
        };
        saveOnboardingState(next);
        return next;
      });
    },
    []
  );

  const updateCommonPersonData = useCallback(
    (section: keyof OnboardingState["commonPersonData"], data: Record<string, unknown>) => {
      setState((prev) => {
        const next = {
          ...prev,
          commonPersonData: {
            ...prev.commonPersonData,
            [section]: { ...prev.commonPersonData[section], ...data },
          },
        };
        saveOnboardingState(next);
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => {
    clearOnboardingState();
    setState(getDefaultState());
  }, []);

  return {
    state,
    hydrated,
    isSubmitting,
    isComplete,
    submitError,
    steps,
    totalSteps,
    isLastStep,
    setRole,
    nextStep,
    prevStep,
    completeOnboarding,
    updateLawyerData,
    updateJudgeData,
    updateLawStudentData,
    updateCommonPersonData,
    persist,
    reset,
  };
}
