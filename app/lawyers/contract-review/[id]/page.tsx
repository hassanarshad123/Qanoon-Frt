"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Shield,
  Clock,
  FileText,
  Flag,
  CalendarClock,
  ListChecks,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AIProgressSteps } from "@/components/judges/shared/ai-progress-steps";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { RiskBadge } from "@/components/lawyers/shared/risk-badge";
import { useAISimulation } from "@/hooks/use-ai-simulation";
import type { ContractReview, ContractClause } from "@/lib/types/lawyer-portal";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

const aiSteps = [
  { label: "Reading contract...", duration: 900 },
  { label: "Identifying clauses...", duration: 1100 },
  { label: "Analyzing obligations...", duration: 1300 },
  { label: "Assessing risks...", duration: 1200 },
  { label: "Checking compliance...", duration: 1000 },
  { label: "Preparing summary...", duration: 700 },
];

const riskColors = {
  High: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
  Medium: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
  },
  Low: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
  },
};

const riskIcons = {
  High: AlertTriangle,
  Medium: AlertCircle,
  Low: CheckCircle2,
};

export default function ContractReviewDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [review, setReview] = useState<ContractReview | null>(null);
  const [loading, setLoading] = useState(false);

  const simulation = useAISimulation(aiSteps);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto animate-pulse">
            <FileCheck className="h-5 w-5 text-[#2563EB]" />
          </div>
          <p className="text-sm text-gray-500">Loading contract review...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Contract review not found.</p>
          <Button variant="outline" asChild>
            <Link href="/lawyers/contract-review">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Contract Reviewer
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Group clauses by risk level
  const highRiskClauses = review.clauses.filter((c) => c.risk === "High");
  const mediumRiskClauses = review.clauses.filter((c) => c.risk === "Medium");
  const lowRiskClauses = review.clauses.filter((c) => c.risk === "Low");

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/lawyers/contract-review">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {review.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <RiskBadge level={review.overallRisk} />
              <span className="text-xs text-gray-400">{formattedDate}</span>
              <span className="text-xs text-gray-400">&middot;</span>
              <span className="text-xs text-gray-500">{review.fileName}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ExportMenu title="Contract Review Report" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Review saved to your files")}
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Files
          </Button>
        </div>
      </div>

      <Separator />

      {/* AI Progress Steps */}
      {simulation.isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <FileCheck className="h-3.5 w-3.5 text-[#2563EB]" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Reviewing {review.title}...
              </span>
            </div>
            <AIProgressSteps
              steps={aiSteps.map((s) => ({ label: s.label }))}
              currentStepIndex={simulation.currentStepIndex}
              completedSteps={simulation.completedSteps}
              isRunning={simulation.isRunning}
            />
          </CardContent>
        </Card>
      )}

      {/* Analysis Content (shown after progress completes) */}
      {simulation.isComplete && review.status === "Complete" && (
        <>
          {/* Risk Assessment Overview */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
              Risk Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* High Risk */}
              <Card
                className={cn(
                  "border",
                  riskColors.High.border,
                  riskColors.High.bg
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {highRiskClauses.length}
                      </p>
                      <p className="text-sm text-gray-600">High Risk</p>
                    </div>
                  </div>
                  {highRiskClauses.length > 0 && (
                    <div className="space-y-1">
                      {highRiskClauses.map((c) => (
                        <p
                          key={c.id}
                          className="text-xs text-red-700 truncate"
                        >
                          &bull; {c.title}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medium Risk */}
              <Card
                className={cn(
                  "border",
                  riskColors.Medium.border,
                  riskColors.Medium.bg
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {mediumRiskClauses.length}
                      </p>
                      <p className="text-sm text-gray-600">Medium Risk</p>
                    </div>
                  </div>
                  {mediumRiskClauses.length > 0 && (
                    <div className="space-y-1">
                      {mediumRiskClauses.map((c) => (
                        <p
                          key={c.id}
                          className="text-xs text-amber-700 truncate"
                        >
                          &bull; {c.title}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Low Risk */}
              <Card
                className={cn(
                  "border",
                  riskColors.Low.border,
                  riskColors.Low.bg
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {lowRiskClauses.length}
                      </p>
                      <p className="text-sm text-gray-600">Low Risk</p>
                    </div>
                  </div>
                  {lowRiskClauses.length > 0 && (
                    <div className="space-y-1">
                      {lowRiskClauses.map((c) => (
                        <p
                          key={c.id}
                          className="text-xs text-emerald-700 truncate"
                        >
                          &bull; {c.title}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Clause-by-Clause Analysis */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
              Clause-by-Clause Analysis
            </h2>
            <Accordion type="multiple" className="space-y-3">
              {review.clauses.map((clause) => {
                const RiskIcon = riskIcons[clause.risk];
                const colors = riskColors[clause.risk];
                return (
                  <AccordionItem
                    key={clause.id}
                    value={clause.id}
                    className={cn(
                      "rounded-lg border px-4",
                      colors.border,
                      "data-[state=open]:bg-white"
                    )}
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <RiskIcon
                          className={cn("h-4 w-4 shrink-0", colors.icon)}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {clause.title}
                            </span>
                            <RiskBadge level={clause.risk} />
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pb-2">
                        {/* Clause Content */}
                        <div className="rounded-lg bg-gray-50 p-4">
                          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                            Contract Language
                          </p>
                          <p className="text-sm text-gray-700 font-serif leading-relaxed italic">
                            &ldquo;{clause.content}&rdquo;
                          </p>
                        </div>

                        {/* AI Analysis */}
                        <div className="rounded-lg border border-[#2563EB]/20 bg-[#2563EB]/[0.02] p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-3.5 w-3.5 text-[#2563EB]" />
                            <p className="text-xs font-medium text-[#2563EB] uppercase tracking-wider">
                              AI Analysis
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {clause.analysis}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2563EB]" />
                <CardTitle className="text-base">Contract Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Overall Summary */}
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                {review.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Terms */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Key Terms
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {review.keyTerms.map((term, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-gray-300 mt-1.5 shrink-0">
                          &bull;
                        </span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Obligations */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Obligations
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {review.obligations.map((obligation, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-gray-300 mt-1.5 shrink-0">
                          &bull;
                        </span>
                        {obligation}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deadlines */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-gray-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Deadlines
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {review.deadlines.map((deadline, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <Clock className="h-3.5 w-3.5 text-gray-400 mt-0.5 shrink-0" />
                        {deadline}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Red Flags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-red-500" />
                    <h4 className="text-sm font-semibold text-gray-900">
                      Red Flags
                    </h4>
                  </div>
                  <ul className="space-y-1.5">
                    {review.redFlags.map((flag, index) => (
                      <li
                        key={index}
                        className="text-sm text-red-600 flex items-start gap-2"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ExportMenu title="Contract Review Report" />
            <Button
              variant="outline"
              size="sm"
              className="hover:border-[#2563EB] hover:text-[#2563EB]"
              onClick={() => toast.success("Report saved to your files")}
            >
              <Save className="h-4 w-4 mr-2" />
              Save to Files
            </Button>
          </div>
        </>
      )}

      {/* If still analyzing (no clauses) */}
      {simulation.isComplete && review.status === "Analyzing" && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto mb-3">
              <FileCheck className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Analysis in Progress
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              This contract is still being analyzed. Results will appear here
              once the review is complete.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
