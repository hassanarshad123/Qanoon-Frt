"use client";

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  color: string;
}

export function OnboardingProgressBar({ currentStep, totalSteps, color }: OnboardingProgressBarProps) {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
