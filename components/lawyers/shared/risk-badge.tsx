"use client";

import { Badge } from "@/components/ui/badge";
import type { ContractRiskLevel, AmendmentImpact } from "@/lib/types/lawyer-portal";

const styles: Record<string, string> = {
  High: "bg-red-100 text-red-700 hover:bg-red-100",
  Medium: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Low: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
};

interface RiskBadgeProps {
  level: ContractRiskLevel | AmendmentImpact;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  return <Badge className={styles[level] || styles.Medium}>{level} Risk</Badge>;
}
