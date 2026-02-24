"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface Step {
  id: string;
  label: string;
}

interface OnboardingStepIndicatorProps {
  steps: readonly Step[];
  currentStep: number;
}

export function OnboardingStepIndicator({
  steps,
  currentStep,
}: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                  isCompleted && "bg-[#A21CAF] border-[#A21CAF] text-white",
                  isCurrent && "border-[#A21CAF] text-[#A21CAF] bg-white",
                  !isCompleted && !isCurrent && "border-gray-300 text-gray-400 bg-white"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium hidden sm:block",
                  isCompleted && "text-[#A21CAF]",
                  isCurrent && "text-[#A21CAF]",
                  !isCompleted && !isCurrent && "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2",
                  idx < currentStep ? "bg-[#A21CAF]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
