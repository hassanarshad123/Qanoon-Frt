"use client";

import { useState, ReactNode } from "react";
import { Check, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { WizardStep } from "@/lib/calculators/types";

interface CalculatorWizardProps {
  steps: WizardStep[];
  children: (currentStep: number) => ReactNode;
  onCalculate: () => void;
  onReset: () => void;
  isComplete: boolean;
  canProceed?: boolean | ((step: number) => boolean);
}

export function CalculatorWizard({
  steps,
  children,
  onCalculate,
  onReset,
  isComplete,
  canProceed = true,
}: CalculatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onCalculate();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStep(0);
    onReset();
  };

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center">
        {steps.map((step, idx) => {
          const isCompleted = isComplete ? true : idx < currentStep;
          const isCurrent = !isComplete && idx === currentStep;
          const isFuture = !isComplete && idx > currentStep;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                    isCompleted &&
                      "bg-[#059669] border-[#059669] text-white",
                    isCurrent &&
                      "border-[#059669] text-[#059669] bg-white",
                    isFuture && "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-xs font-medium hidden sm:block",
                    isCompleted && "text-[#059669]",
                    isCurrent && "text-[#059669]",
                    isFuture && "text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-20 h-0.5 mx-2",
                    idx < currentStep || isComplete
                      ? "bg-[#059669]"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[300px]">
        {children(isComplete ? -1 : currentStep)}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        {isComplete ? (
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={typeof canProceed === "function" ? !canProceed(currentStep) : !canProceed}
              className="gap-2 bg-[#059669] hover:bg-[#047857] text-white"
            >
              {isLastStep ? "Calculate" : "Next"}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
