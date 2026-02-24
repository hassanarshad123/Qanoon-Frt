"use client";

import type { UserRole } from "@/lib/onboarding/types";
import { ROLE_COLORS } from "@/lib/onboarding/constants";
import { OnboardingProgressBar } from "./OnboardingProgressBar";
import { ValueSlidePanel } from "./ValueSlidePanel";

interface OnboardingLayoutProps {
  role: UserRole | null;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export function OnboardingLayout({ role, currentStep, totalSteps, children }: OnboardingLayoutProps) {
  const colors = role ? ROLE_COLORS[role] : ROLE_COLORS.lawyer;
  const showProgress = !!role;

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand + value slides (hidden on mobile) */}
      <div className="hidden lg:block lg:w-[40%] lg:min-h-screen">
        <ValueSlidePanel role={role} currentStep={currentStep} />
      </div>

      {/* Right panel — form area */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        {/* Mobile accent bar — gradient stripe (hidden on desktop where left panel shows) */}
        {showProgress && (
          <div
            className="lg:hidden h-1.5"
            style={{
              background: `linear-gradient(to right, ${colors.primary}, ${colors.hover})`,
            }}
          />
        )}

        {/* Mobile header — brand + step counter + inline progress (hidden on desktop) */}
        {showProgress && (
          <div className="lg:hidden px-6 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-serif text-lg font-semibold text-gray-900">QanoonAI</span>
              <span className="text-xs font-medium text-gray-400">
                Step {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </div>
          </div>
        )}

        {/* Desktop progress bar (hidden on mobile) */}
        {showProgress && (
          <div className="hidden lg:block px-6 sm:px-10 pt-6">
            <OnboardingProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
              color={colors.primary}
            />
          </div>
        )}

        {/* Mobile brand bar (visible only on mobile when no progress / role selection step) */}
        {!showProgress && (
          <div className="lg:hidden px-6 pt-6">
            <span className="font-serif text-lg font-semibold text-gray-900">QanoonAI</span>
          </div>
        )}

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
