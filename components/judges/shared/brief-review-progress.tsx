"use client";

import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BriefReviewProgressProps {
  totalSections: number;
  approvedSections: number;
  flaggedSections: number;
  onFinalize?: () => void;
}

export function BriefReviewProgress({
  totalSections,
  approvedSections,
  flaggedSections,
  onFinalize,
}: BriefReviewProgressProps) {
  const pendingSections = totalSections - approvedSections - flaggedSections;
  const approvedPercent = totalSections > 0 ? (approvedSections / totalSections) * 100 : 0;
  const flaggedPercent = totalSections > 0 ? (flaggedSections / totalSections) * 100 : 0;
  const allApproved = approvedSections === totalSections && totalSections > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Review Progress</h3>
        {allApproved && onFinalize && (
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-xs h-7 gap-1.5"
            onClick={onFinalize}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Finalize Brief
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
        {approvedPercent > 0 && (
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${approvedPercent}%` }}
          />
        )}
        {flaggedPercent > 0 && (
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${flaggedPercent}%` }}
          />
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          {approvedSections} approved
        </span>
        {flaggedSections > 0 && (
          <span className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            {flaggedSections} flagged
          </span>
        )}
        {pendingSections > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-gray-400" />
            {pendingSections} pending
          </span>
        )}
        <span className="ml-auto font-medium text-gray-900">
          {approvedSections} of {totalSections} sections
        </span>
      </div>
    </div>
  );
}
