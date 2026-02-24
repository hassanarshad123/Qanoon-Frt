"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { AmendmentAlertCard } from "@/components/lawyers/shared/amendment-alert-card";
import type { Amendment, AmendmentImpact } from "@/lib/types/lawyer-portal";

export default function AmendmentsPage() {
  const [amendments] = useState<Amendment[]>([]);
  const [statuteFilter, setStatuteFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  // Derive unique statute names from the data
  const statuteNames = useMemo(() => {
    const names = new Set(amendments.map((a) => a.statuteName));
    return Array.from(names).sort();
  }, [amendments]);

  const impactLevels: AmendmentImpact[] = ["High", "Medium", "Low"];

  const filtered = useMemo(() => {
    return amendments
      .filter((a) => {
        const matchesStatute =
          statuteFilter === "all" || a.statuteName === statuteFilter;
        const matchesImpact =
          impactFilter === "all" || a.impact === impactFilter;
        return matchesStatute && matchesImpact;
      })
      .sort(
        (a, b) =>
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
      );
  }, [amendments, statuteFilter, impactFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        label="Database & Research"
        title="Amendment Alerts"
        description="Stay informed about recent legislative changes affecting your practice"
        actions={
          <Button variant="outline" asChild>
            <Link href="/lawyers/amendments/settings">
              <Settings className="h-4 w-4 mr-2" />
              Alert Settings
            </Link>
          </Button>
        }
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={statuteFilter} onValueChange={setStatuteFilter}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Statute" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statutes</SelectItem>
            {statuteNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={impactFilter} onValueChange={setImpactFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Impact Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Impacts</SelectItem>
            {impactLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No amendments found"
          description="Try adjusting your filter criteria or check back later for new alerts."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((amendment) => (
            <AmendmentAlertCard key={amendment.id} amendment={amendment} />
          ))}
        </div>
      )}
    </div>
  );
}
