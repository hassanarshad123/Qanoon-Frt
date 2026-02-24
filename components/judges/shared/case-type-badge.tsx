"use client";

import { Badge } from "@/components/ui/badge";
import type { CaseType } from "@/lib/types/portal";

const typeStyles: Record<CaseType, string> = {
  Constitutional: "border-purple-300 text-purple-700",
  Civil: "border-blue-300 text-blue-700",
  Criminal: "border-red-300 text-red-700",
  Family: "border-pink-300 text-pink-700",
  Tax: "border-amber-300 text-amber-700",
  Corporate: "border-teal-300 text-teal-700",
  Writ: "border-indigo-300 text-indigo-700",
  Appeal: "border-orange-300 text-orange-700",
};

interface CaseTypeBadgeProps {
  type: CaseType;
}

export function CaseTypeBadge({ type }: CaseTypeBadgeProps) {
  return (
    <Badge variant="outline" className={typeStyles[type] || "border-gray-300 text-gray-700"}>
      {type}
    </Badge>
  );
}
