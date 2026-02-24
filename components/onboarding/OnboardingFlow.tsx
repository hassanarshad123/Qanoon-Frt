"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/hooks/use-onboarding";
import { toast } from "sonner";
import { ROLE_COLORS } from "@/lib/onboarding/constants";
import { OnboardingLayout } from "./OnboardingLayout";
import { PersonalInfo } from "./steps/PersonalInfo";
import { LawyerPracticeDetails } from "./steps/LawyerPracticeDetails";
import { LawyerLocation } from "./steps/LawyerLocation";
import { LawyerFirmInfo } from "./steps/LawyerFirmInfo";
import { ReferralSource } from "./steps/ReferralSource";
import { JudgeJudicialInfo } from "./steps/JudgeJudicialInfo";
import { JudgeLocation } from "./steps/JudgeLocation";
import { StudentEducation } from "./steps/StudentEducation";
import { StudentInterests } from "./steps/StudentInterests";
import { CitizenConcern } from "./steps/CitizenConcern";
import { CitizenLocation } from "./steps/CitizenLocation";
import { OnboardingComplete } from "./OnboardingComplete";

interface OnboardingFlowProps {
  userId: string;
  userEmail: string;
  userName: string;
  onAnimationStart?: () => void;
}

export function OnboardingFlow({ userId, userEmail, userName, onAnimationStart }: OnboardingFlowProps) {
  const router = useRouter();
  const {
    state,
    hydrated,
    isSubmitting,
    isComplete,
    submitError,
    steps,
    totalSteps,
    nextStep,
    prevStep,
    completeOnboarding,
    updateLawyerData,
    updateJudgeData,
    updateLawStudentData,
    updateCommonPersonData,
  } = useOnboarding({ userId });

  // Step transition animation
  const [stepVisible, setStepVisible] = useState(false);

  useEffect(() => {
    setStepVisible(false);
    const t = setTimeout(() => setStepVisible(true), 50);
    return () => clearTimeout(t);
  }, [state.currentStep]);

  useEffect(() => {
    if (submitError) {
      toast.error("Submission failed", {
        description: submitError,
        action: {
          label: "Retry",
          onClick: () => nextStep(),
        },
      });
    }
  }, [submitError, nextStep]);

  // Signal the parent page to suppress session-based redirects during animation
  useEffect(() => {
    if (isComplete) {
      onAnimationStart?.();
    }
  }, [isComplete, onAnimationStart]);

  // Prevent hydration mismatch
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // No role = redirect to signup
  if (!state.role) {
    router.push("/signup");
    return null;
  }

  const colors = ROLE_COLORS[state.role];

  // Extract display name for the animation
  const displayName =
    state.judgeData.personalInfo.fullName ||
    state.lawyerData.personalInfo.fullName ||
    state.lawStudentData.personalInfo.fullName ||
    state.commonPersonData.personalInfo.fullName ||
    userName;

  return (
    <div
      style={{
        ["--accent" as string]: colors.primary,
        ["--accent-hover" as string]: colors.hover,
        ["--accent-light" as string]: colors.light,
      }}
    >
      <OnboardingLayout
        role={state.role}
        currentStep={state.currentStep}
        totalSteps={totalSteps}
      >
        <div
          key={state.currentStep}
          className={`transition-all duration-500 ease-out ${
            stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {renderCurrentStep()}
        </div>
      </OnboardingLayout>

      {isComplete && (
        <OnboardingComplete
          role={state.role}
          displayName={displayName}
          onComplete={completeOnboarding}
        />
      )}
    </div>
  );

  function renderCurrentStep() {
    switch (state.role) {
      case "lawyer":
        return renderLawyerStep();
      case "judge":
        return renderJudgeStep();
      case "law_student":
        return renderLawStudentStep();
      case "common_person":
        return renderCommonPersonStep();
      default:
        return null;
    }
  }

  function renderLawyerStep() {
    switch (state.currentStep) {
      case 0:
        return (
          <PersonalInfo
            data={{ ...state.lawyerData.personalInfo, email: userEmail, fullName: userName || state.lawyerData.personalInfo.fullName }}
            onSubmit={(data) => {
              updateLawyerData("personalInfo", data);
              nextStep();
            }}
            onBack={prevStep}
            emailReadOnly
          />
        );
      case 1:
        return (
          <LawyerPracticeDetails
            data={state.lawyerData.practiceDetails}
            onSubmit={(data) => {
              updateLawyerData("practiceDetails", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <LawyerLocation
            data={state.lawyerData.location}
            onSubmit={(data) => {
              updateLawyerData("location", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <LawyerFirmInfo
            data={state.lawyerData.firmInfo}
            onSubmit={(data) => {
              updateLawyerData("firmInfo", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <ReferralSource
            data={state.lawyerData.referral}
            onSubmit={(data) => {
              updateLawyerData("referral", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  }

  function renderJudgeStep() {
    switch (state.currentStep) {
      case 0:
        return (
          <PersonalInfo
            data={{ ...state.judgeData.personalInfo, email: userEmail, fullName: userName || state.judgeData.personalInfo.fullName }}
            onSubmit={(data) => {
              updateJudgeData("personalInfo", data);
              nextStep();
            }}
            onBack={prevStep}
            emailReadOnly
          />
        );
      case 1:
        return (
          <JudgeJudicialInfo
            data={state.judgeData.judicialInfo}
            onSubmit={(data) => {
              updateJudgeData("judicialInfo", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <JudgeLocation
            data={state.judgeData.location}
            onSubmit={(data) => {
              updateJudgeData("location", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  }

  function renderLawStudentStep() {
    switch (state.currentStep) {
      case 0:
        return (
          <PersonalInfo
            data={{ ...state.lawStudentData.personalInfo, email: userEmail, fullName: userName || state.lawStudentData.personalInfo.fullName }}
            onSubmit={(data) => {
              updateLawStudentData("personalInfo", data);
              nextStep();
            }}
            onBack={prevStep}
            emailReadOnly
          />
        );
      case 1:
        return (
          <StudentEducation
            data={state.lawStudentData.education}
            onSubmit={(data) => {
              updateLawStudentData("education", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <StudentInterests
            data={state.lawStudentData.interests}
            onSubmit={(data) => {
              updateLawStudentData("interests", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  }

  function renderCommonPersonStep() {
    switch (state.currentStep) {
      case 0:
        return (
          <PersonalInfo
            data={{ ...state.commonPersonData.personalInfo, email: userEmail, fullName: userName || state.commonPersonData.personalInfo.fullName }}
            onSubmit={(data) => {
              updateCommonPersonData("personalInfo", data);
              nextStep();
            }}
            onBack={prevStep}
            emailReadOnly
          />
        );
      case 1:
        return (
          <CitizenConcern
            data={state.commonPersonData.legalConcern}
            onSubmit={(data) => {
              updateCommonPersonData("legalConcern", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      case 2:
        return (
          <CitizenLocation
            data={state.commonPersonData.location}
            onSubmit={(data) => {
              updateCommonPersonData("location", data);
              nextStep();
            }}
            onBack={prevStep}
          />
        );
      default:
        return null;
    }
  }
}
