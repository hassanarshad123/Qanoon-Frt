"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { BreakdownStep } from "@/lib/calculators/types";

interface CalculatorBreakdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: BreakdownStep[];
  legalBasis?: string;
}

export function CalculatorBreakdown({
  open,
  onOpenChange,
  steps,
  legalBasis,
}: CalculatorBreakdownProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors w-full justify-center py-2">
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180"
          )}
        />
        Computation Breakdown
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 space-y-0">
          {steps.map((step, idx) => (
            <div key={step.step} className="flex gap-4">
              {/* Vertical connector */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-medium shrink-0">
                  {step.step}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-px flex-1 border-l-2 border-dotted border-[#059669]/30" />
                )}
              </div>

              {/* Step content */}
              <div className="pb-6 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {step.label}
                </p>
                <p className="text-sm font-mono text-gray-600 mt-1">
                  {step.calculation}
                </p>
                <p className="text-sm font-semibold text-[#059669] mt-0.5">
                  = {step.result}
                </p>
              </div>
            </div>
          ))}
        </div>

        {legalBasis && (
          <div className="mt-2 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Legal Basis
            </p>
            <p className="text-sm text-gray-600">{legalBasis}</p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
