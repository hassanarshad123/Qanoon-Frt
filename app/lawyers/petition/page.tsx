"use client";

import { useState } from "react";
import Link from "next/link";
import { FilePen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { PetitionTypeSelector } from "@/components/lawyers/shared/petition-type-selector";
import type { Petition, PetitionType, LawyerCase } from "@/lib/types/lawyer-portal";

// ---------------------------------------------------------------------------
// Status badge styles
// ---------------------------------------------------------------------------
const statusStyles: Record<string, string> = {
  Complete: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  "Under Review": "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

// ---------------------------------------------------------------------------
// Inline case selector using lawyer cases
// ---------------------------------------------------------------------------
function LawyerCaseSelect({
  cases,
  value,
  onChange,
}: {
  cases: LawyerCase[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
    >
      <option value="">Choose a case for the petition...</option>
      {cases.map((c) => (
        <option key={c.id} value={c.id}>
          {c.title} ({c.number})
        </option>
      ))}
    </select>
  );
}

// ===========================================================================
// PAGE COMPONENT
// ===========================================================================
export default function PetitionListPage() {
  const [petitions] = useState<Petition[]>([]);
  const [cases] = useState<LawyerCase[]>([]);
  const [loading] = useState(false);
  const [selectedType, setSelectedType] = useState<PetitionType | undefined>();
  const [selectedCase, setSelectedCase] = useState<string>("");

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        label="AI Tools"
        title="Petition Drafter"
        description="Draft petitions, applications, and court filings with AI-assisted legal writing"
      />

      {/* New Petition Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Petition Type Selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-3">
              Select Petition Type
            </p>
            <PetitionTypeSelector
              value={selectedType}
              onSelect={setSelectedType}
            />
          </div>

          <Separator />

          {/* Case Selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-3">
              Select Case
            </p>
            <LawyerCaseSelect
              cases={cases}
              value={selectedCase}
              onChange={setSelectedCase}
            />
          </div>

          <Separator />

          {/* CTA Button */}
          <div className="flex justify-end">
            <Button
              className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
              disabled={!selectedType}
            >
              <FilePen className="h-4 w-4" />
              Draft Petition
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Drafts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
            Previous Drafts
          </h2>
          <span className="text-sm text-gray-500">
            {petitions.length} draft{petitions.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : petitions.length === 0 ? (
          <EmptyState
            icon={FilePen}
            title="No Petitions Yet"
            description="Draft your first AI-powered petition by selecting a petition type and case above."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petitions.map((p) => (
              <Link key={p.id} href={`/lawyers/petition/${p.id}`}>
                <Card className="hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full group">
                  <CardContent className="pt-6 pb-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[#2563EB] border-[#2563EB]/30"
                      >
                        {p.type}
                      </Badge>
                      <Badge
                        className={
                          statusStyles[p.status] || statusStyles.Draft
                        }
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mt-3 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {p.caseTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{p.court}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xs text-gray-400">
                        {formatDate(p.createdAt)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#2563EB] transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
