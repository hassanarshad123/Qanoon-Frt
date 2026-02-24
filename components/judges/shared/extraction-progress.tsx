"use client";

import { CheckCircle2, Loader2, FileSearch, Database, PenTool, FileText } from "lucide-react";
import type { PipelinePhase } from "@/hooks/use-brief-pipeline";

interface ExtractionProgressProps {
  phase: PipelinePhase;
  progress: { step: number; total: number; label: string };
  documentsProcessed: number;
  totalDocuments: number;
}

const PIPELINE_STEPS = [
  { phase: "extracting", label: "Extracting text from documents", icon: FileText },
  { phase: "analyzing", label: "Analyzing document structure", icon: FileSearch },
  { phase: "matching_precedents", label: "Searching precedent database", icon: Database },
  { phase: "generating_sections", label: "Generating brief sections", icon: PenTool },
];

const phaseOrder: Record<string, number> = {
  idle: -1,
  uploading: 0,
  extracting: 1,
  analyzing: 2,
  matching_precedents: 3,
  generating_sections: 4,
  complete: 5,
  error: -1,
};

export function ExtractionProgress({
  phase,
  progress,
  documentsProcessed,
  totalDocuments,
}: ExtractionProgressProps) {
  const currentOrder = phaseOrder[phase] ?? -1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {documentsProcessed} of {totalDocuments} documents processed
        </span>
        <span>
          Step {progress.step} of {progress.total}
        </span>
      </div>

      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, i) => {
          const stepOrder = phaseOrder[step.phase] ?? -1;
          const isActive = phase === step.phase;
          const isComplete = currentOrder > stepOrder;
          const isPending = currentOrder < stepOrder;
          const Icon = step.icon;

          return (
            <div key={step.phase} className="flex items-center gap-3">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isComplete
                    ? "bg-emerald-100"
                    : isActive
                    ? "bg-[#A21CAF]/10"
                    : "bg-gray-100"
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 text-[#A21CAF] animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm ${
                    isComplete
                      ? "text-emerald-700 font-medium"
                      : isActive
                      ? "text-[#A21CAF] font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                {isActive && progress.label && (
                  <p className="text-xs text-gray-500 mt-1">{progress.label}</p>
                )}
              </div>
              {isComplete && (
                <span className="text-xs text-emerald-600 font-medium">Done</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#A21CAF] rounded-full transition-all duration-500"
          style={{
            width: `${phase === "complete" ? 100 : (progress.step / progress.total) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
