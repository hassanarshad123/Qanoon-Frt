"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/judges/shared/page-header";
import { DocumentUploadZone } from "@/components/judges/shared/document-upload-zone";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { LawyerBrief, LawyerCase } from "@/lib/types/lawyer-portal";

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
function BriefStatusBadge({ status }: { status: LawyerBrief["status"] }) {
  const styles: Record<LawyerBrief["status"], string> = {
    Generating: "bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/10",
    Complete: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

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
      <option value="">Choose a case to generate brief...</option>
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
export default function LawyerBriefListPage() {
  const [briefs] = useState<LawyerBrief[]>([]);
  const [cases] = useState<LawyerCase[]>([]);
  const [loading] = useState(false);
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
        title="Case Brief Generator"
        description="AI-powered case brief generation from your documents and case files"
      />

      {/* New Brief Card */}
      <Card className="border-dashed border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50/50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-[#2563EB]" />
            </div>
            Create New Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Document Upload */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                Option 1: Upload Documents
              </p>
              <DocumentUploadZone compact />
            </div>

            {/* Divider */}
            <div className="hidden md:flex items-center justify-center">
              <div className="h-full w-px bg-gray-200" />
            </div>
            <div className="md:hidden">
              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <Separator className="flex-1" />
              </div>
            </div>

            {/* Option 2: Select Existing Case */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                Option 2: Select Existing Case
              </p>
              <LawyerCaseSelect
                cases={cases}
                value={selectedCase}
                onChange={setSelectedCase}
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2">
              <Sparkles className="h-4 w-4" />
              Generate Brief
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Briefs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Previous Briefs
          </h2>
          <span className="text-sm text-gray-500">
            {briefs.length} brief{briefs.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : briefs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Briefs Yet"
            description="Generate your first AI-powered case brief by uploading documents or selecting an existing case above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefs.map((brief) => {
              const factsContent =
                brief.sections.find((s) => s.title === "Facts")?.content ||
                brief.sections[0]?.content ||
                "";
              const snippet =
                factsContent.length > 120
                  ? factsContent.slice(0, 120) + "..."
                  : factsContent;

              return (
                <Link key={brief.id} href={`/lawyers/brief/${brief.id}`}>
                  <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group">
                    <CardContent className="pt-5 pb-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                          {brief.caseTitle}
                        </h3>
                        <BriefStatusBadge status={brief.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(brief.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {snippet}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
