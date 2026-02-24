"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AIProgressStepsProps {
  steps: { label: string }[];
  currentStepIndex: number;
  completedSteps: number[];
  isRunning: boolean;
}

export function AIProgressSteps({
  steps,
  currentStepIndex,
  completedSteps,
  isRunning,
}: AIProgressStepsProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.includes(index);
        const isCurrent = index === currentStepIndex && isRunning;
        const isPending = !isCompleted && !isCurrent;

        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 py-1.5 px-3 rounded-lg transition-all duration-300",
              isCurrent && "bg-[#A21CAF]/5",
              isCompleted && "opacity-70"
            )}
          >
            <div className="shrink-0">
              {isCompleted ? (
                <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-emerald-600" />
                </div>
              ) : isCurrent ? (
                <Loader2 className="h-5 w-5 text-[#A21CAF] animate-spin" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
              )}
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                isCurrent && "text-[#A21CAF] font-medium",
                isCompleted && "text-gray-500",
                isPending && "text-gray-400"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
