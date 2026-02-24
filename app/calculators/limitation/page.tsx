"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateLimitation, getLimitationBreakdown } from "@/lib/calculators/limitation";
import {
  LIMITATION_ARTICLES,
  LIMITATION_CATEGORIES,
} from "@/lib/calculators/data/limitation-articles";
import type { LimitationInput, LimitationResult, WizardStep, PrintReportData } from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "case-type", label: "Case Type" },
  { id: "accrual-date", label: "Accrual Date" },
  { id: "extensions", label: "Extensions" },
];

export default function LimitationCalculatorPage() {
  // Form state
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [accrualDate, setAccrualDate] = useState<Date | undefined>(undefined);
  const [minority, setMinority] = useState(false);
  const [disability, setDisability] = useState(false);
  const [absenceFromPakistan, setAbsenceFromPakistan] = useState(false);
  const [acknowledgmentDate, setAcknowledgmentDate] = useState<Date | undefined>(undefined);

  // Result state
  const [result, setResult] = useState<LimitationResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedArticleData = useMemo(
    () => LIMITATION_ARTICLES.find((a) => a.article === selectedArticle),
    [selectedArticle]
  );

  // Filter articles by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return LIMITATION_ARTICLES;
    const q = searchQuery.toLowerCase();
    return LIMITATION_ARTICLES.filter(
      (a) =>
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        String(a.article).includes(q)
    );
  }, [searchQuery]);

  // Group filtered articles by category
  const groupedArticles = useMemo(() => {
    const groups: Record<string, typeof LIMITATION_ARTICLES> = {};
    for (const article of filteredArticles) {
      if (!groups[article.category]) groups[article.category] = [];
      groups[article.category].push(article);
    }
    return groups;
  }, [filteredArticles]);

  const canProceedStep = (step: number) => {
    if (step === 0) return selectedArticle !== null;
    if (step === 1) return accrualDate !== undefined;
    return true; // extensions are optional
  };

  const handleCalculate = () => {
    if (!selectedArticle || !accrualDate) return;
    const input: LimitationInput = {
      articleNumber: selectedArticle,
      accrualDate,
      extensions: {
        minority,
        disability,
        absenceFromPakistan,
        acknowledgmentDate,
      },
    };
    setResult(calculateLimitation(input));
  };

  const handleReset = () => {
    setSelectedArticle(null);
    setSearchQuery("");
    setAccrualDate(undefined);
    setMinority(false);
    setDisability(false);
    setAbsenceFromPakistan(false);
    setAcknowledgmentDate(undefined);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getLimitationBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Limitation Period Calculator",
        date: new Date(),
        inputs: [
          { label: "Article", value: `Article ${result.article.article}` },
          { label: "Description", value: result.article.description },
          { label: "Accrual Date", value: format(result.accrualDate, "dd MMM yyyy") },
          { label: "Extensions", value: result.extensionBreakdown.length > 0 ? result.extensionBreakdown.map((e) => e.label).join(", ") : "None" },
        ],
        results: [
          { label: "Limitation Period", value: result.article.period },
          { label: "Base Deadline", value: format(result.baseDeadline, "dd MMM yyyy") },
          { label: "Extension Days", value: `${result.extensionDays} days` },
          { label: "Final Deadline", value: format(result.finalDeadline, "dd MMM yyyy") },
          { label: "Days Remaining", value: `${result.daysRemaining} days` },
          { label: "Status", value: result.status === "safe" ? "Within time" : result.status === "warning" ? "Expiring soon" : "Expired" },
        ],
        breakdown: breakdownSteps,
        disclaimer: "This calculation is based on the Limitation Act 1908 as applicable in Pakistan. Specific extensions and exclusions may apply based on individual circumstances. Always consult a qualified legal professional.",
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Core Calculator
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Limitation Period Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Find your filing deadline under the Limitation Act 1908. Search by case type,
          set the accrual date, and apply extensions.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={canProceedStep}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            // Results view
            const statusBadge = {
              safe: { label: "Within Time", className: "bg-emerald-100 text-emerald-700" },
              warning: { label: "Expiring Soon", className: "bg-amber-100 text-amber-700" },
              expired: { label: "Expired", className: "bg-red-100 text-red-700" },
            }[result.status];

            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Filing Deadline"
                  value={format(result.finalDeadline, "dd MMMM yyyy")}
                  subtitle={
                    result.daysRemaining >= 0
                      ? `${result.daysRemaining} days remaining`
                      : `${Math.abs(result.daysRemaining)} days overdue`
                  }
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  <div className="flex justify-center mt-2">
                    <Badge className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Limitation Period</p>
                      <p className="font-semibold">{result.article.period}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Article</p>
                      <p className="font-semibold">Art. {result.article.article}</p>
                    </div>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Limitation Act 1908, First Schedule. Extensions under Sections 6-18."
                  />
                )}
              </div>
            );
          }

          // Step 0: Case Type
          if (currentStep === 0) {
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Select Case Type</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Search by article number, description, or category
                  </p>
                </div>
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-4"
                />
                <div className="max-h-[400px] overflow-y-auto space-y-4 border rounded-lg p-4">
                  {Object.entries(groupedArticles).map(([category, articles]) => (
                    <div key={category}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        {category}
                      </p>
                      <div className="space-y-1">
                        {articles.map((article) => (
                          <button
                            key={article.article}
                            onClick={() => setSelectedArticle(article.article)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                              selectedArticle === article.article
                                ? "bg-[#059669]/10 text-[#059669] font-medium"
                                : "hover:bg-gray-50 text-gray-700"
                            )}
                          >
                            <span className="font-medium">Art. {article.article}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span>{article.description}</span>
                            <span className="ml-2 text-xs text-gray-400">
                              ({article.period})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredArticles.length === 0 && (
                    <p className="text-center text-gray-400 py-8">
                      No articles match your search
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Step 1: Accrual Date
          if (currentStep === 1) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">When did the cause of action accrue?</Label>
                  {selectedArticleData && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Art. {selectedArticleData.article}:</span>{" "}
                        {selectedArticleData.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Starting point:</span>{" "}
                        {selectedArticleData.startPoint}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label>Accrual Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !accrualDate && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {accrualDate
                          ? format(accrualDate, "dd MMMM yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={accrualDate}
                        onSelect={setAccrualDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          }

          // Step 2: Extensions
          if (currentStep === 2) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Apply any extensions? (optional)
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Extensions under Sections 6-18 of the Limitation Act 1908
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="minority"
                      checked={minority}
                      onCheckedChange={(c) => setMinority(c === true)}
                    />
                    <div>
                      <label htmlFor="minority" className="text-sm font-medium cursor-pointer">
                        Minority / Legal Disability (Section 6)
                      </label>
                      <p className="text-xs text-gray-500">
                        Plaintiff was a minor or under legal disability when cause of action accrued.
                        Adds 1 year from cessation of disability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="disability"
                      checked={disability}
                      onCheckedChange={(c) => setDisability(c === true)}
                    />
                    <div>
                      <label htmlFor="disability" className="text-sm font-medium cursor-pointer">
                        Physical / Mental Disability (Section 6)
                      </label>
                      <p className="text-xs text-gray-500">
                        Plaintiff was of unsound mind or physically incapable.
                        Adds 1 year from cessation of disability.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="absence"
                      checked={absenceFromPakistan}
                      onCheckedChange={(c) => setAbsenceFromPakistan(c === true)}
                    />
                    <div>
                      <label htmlFor="absence" className="text-sm font-medium cursor-pointer">
                        Absence from Pakistan (Section 15)
                      </label>
                      <p className="text-xs text-gray-500">
                        The defendant was absent from Pakistan during the limitation period.
                        Adds approximately 6 months.
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <Label>Acknowledgment of Liability (Section 18) — Optional</Label>
                    <p className="text-xs text-gray-500 mb-2">
                      If the defendant acknowledged the debt/liability in writing, the limitation period
                      restarts from the date of acknowledgment.
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !acknowledgmentDate && "text-muted-foreground"
                          )}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {acknowledgmentDate
                            ? format(acknowledgmentDate, "dd MMMM yyyy")
                            : "No acknowledgment (leave blank)"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={acknowledgmentDate}
                          onSelect={setAcknowledgmentDate}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {acknowledgmentDate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAcknowledgmentDate(undefined)}
                        className="mt-1 text-xs text-gray-400"
                      >
                        Clear acknowledgment date
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Limitation Act 1908"
        sources={[
          { label: "Primary Legislation", reference: "Limitation Act 1908 (IX of 1908)" },
          { label: "Extensions", reference: "Sections 4-25 of the Limitation Act 1908" },
          { label: "First Schedule", reference: "Articles 1-182, Limitation Act 1908" },
        ]}
      >
        <h3>What is the Limitation Act?</h3>
        <p>
          The Limitation Act 1908 prescribes the maximum time period within which legal
          proceedings must be initiated. Once this period expires, the right to sue is
          barred by law, regardless of the merits of the case. The purpose is to ensure
          that disputes are resolved within a reasonable time and to prevent stale claims.
        </p>

        <h3>How is the Limitation Period Calculated?</h3>
        <p>
          The limitation period starts from the date the &ldquo;cause of action&rdquo; accrues — that
          is, when the right to sue first arises. The First Schedule of the Act lists
          specific articles covering different types of suits, appeals, and applications,
          each with its own limitation period and starting point.
        </p>

        <h3>What Extensions Are Available?</h3>
        <ul>
          <li>
            <strong>Legal disability (Section 6):</strong> If the plaintiff is a minor or
            of unsound mind, the limitation period does not begin until the disability ceases.
          </li>
          <li>
            <strong>Absence from Pakistan (Section 15):</strong> Time during which the
            defendant is absent from Pakistan may be excluded.
          </li>
          <li>
            <strong>Acknowledgment (Section 18):</strong> A written acknowledgment of
            liability before the expiration of the limitation period creates a fresh
            starting point.
          </li>
          <li>
            <strong>Part payment (Section 19):</strong> Payment on account of a debt
            or interest before expiration similarly extends the period.
          </li>
        </ul>

        <h3>Important Notes</h3>
        <p>
          The court is obligated to dismiss a suit filed beyond limitation, even if the
          opposing party does not raise the objection. Section 3 makes this mandatory.
          However, the court has discretion under Section 5 to condone delay in certain
          appeals and applications (not original suits) if the appellant shows
          &ldquo;sufficient cause&rdquo; for not filing within time.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
