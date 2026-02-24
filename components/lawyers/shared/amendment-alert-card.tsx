"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "./risk-badge";
import type { Amendment } from "@/lib/types/lawyer-portal";

interface AmendmentAlertCardProps {
  amendment: Amendment;
}

export function AmendmentAlertCard({ amendment }: AmendmentAlertCardProps) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {amendment.statuteName} - Section {amendment.section}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{amendment.changeSummary}</p>
              <p className="text-xs text-gray-400 mt-2">
                Effective: {amendment.effectiveDate}
              </p>
            </div>
          </div>
          <RiskBadge level={amendment.impact} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="ghost" size="sm" className="text-xs text-[#2563EB] hover:text-[#1D4ED8]" asChild>
            <Link href={`/lawyers/statute-analyzer/${amendment.id}?statuteId=${amendment.statuteId}&section=${amendment.section}`}>
              View Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
