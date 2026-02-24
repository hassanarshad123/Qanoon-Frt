"use client";

import { Badge } from "@/components/ui/badge";
import type { CaseStatus, BriefStatus, JudgmentStatus } from "@/lib/types/portal";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Closed: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  Urgent: "bg-red-100 text-red-700 hover:bg-red-100",
  Reserved: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Adjourned: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Dismissed: "bg-rose-100 text-rose-700 hover:bg-rose-100",
  Decreed: "bg-teal-100 text-teal-700 hover:bg-teal-100",
  // Brief statuses
  Generating: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Complete: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Draft: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  // Judgment statuses
  "Under Review": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Finalized: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  // Hearing statuses
  Scheduled: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "In Progress": "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  // Enhanced brief statuses
  uploading: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  extracting: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  generating: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  in_review: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  finalized: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
};

interface LegalStatusBadgeProps {
  status: CaseStatus | BriefStatus | JudgmentStatus | string;
}

export function LegalStatusBadge({ status }: LegalStatusBadgeProps) {
  return (
    <Badge className={statusStyles[status] || "bg-gray-100 text-gray-700 hover:bg-gray-100"}>
      {status}
    </Badge>
  );
}
