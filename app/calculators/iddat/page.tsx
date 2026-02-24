"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateIddat, getIddatBreakdown } from "@/lib/calculators/iddat";
import type {
  IddatInput,
  IddatResult,
  IddatReason,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "reason", label: "Reason" },
  { id: "date", label: "Date" },
];

const REASON_OPTIONS: { value: IddatReason; label: string; description: string }[] = [
  {
    value: "divorce-talaq",
    label: "Divorce (Talaq)",
    description:
      "Husband-initiated divorce. Standard iddat of three menstrual cycles or three calendar months.",
  },
  {
    value: "divorce-khula",
    label: "Divorce (Khula)",
    description:
      "Wife-initiated dissolution through court decree. Same waiting period as talaq once granted.",
  },
  {
    value: "death-of-husband",
    label: "Death of Husband",
    description:
      "Iddat of four months and ten days, regardless of whether the marriage was consummated.",
  },
  {
    value: "annulment",
    label: "Annulment",
    description:
      "Court-decreed annulment of marriage. Waiting period of three menstrual cycles or three calendar months.",
  },
];

export default function IddatCalculatorPage() {
  // Form state
  const [reason, setReason] = useState<IddatReason | "">("");
  const [isPregnant, setIsPregnant] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);

  // Result state
  const [result, setResult] = useState<IddatResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const canProceedStep = (step: number) => {
    if (step === 0) return reason !== "";
    if (step === 1) return eventDate !== undefined;
    return true;
  };

  const handleCalculate = () => {
    if (!reason || !eventDate) return;
    const input: IddatInput = {
      reason: reason as IddatReason,
      eventDate,
      isPregnant,
    };
    setResult(calculateIddat(input));
  };

  const handleReset = () => {
    setReason("");
    setIsPregnant(false);
    setEventDate(undefined);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getIddatBreakdown(result) : [];

  const getDateLabel = (): string => {
    if (reason === "death-of-husband") return "Date of Death";
    if (reason === "annulment") return "Date of Annulment Decree";
    return "Date of Divorce Pronouncement";
  };

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Iddat Period Calculator",
        date: new Date(),
        inputs: [
          { label: "Reason", value: result.reasonLabel },
          {
            label: "Event Date",
            value: format(result.eventDate, "dd MMM yyyy"),
          },
          { label: "Pregnant", value: result.isPregnant ? "Yes" : "No" },
        ],
        results: result.isPregnant
          ? [
              { label: "Iddat End", value: "Until Delivery" },
              { label: "Rule Applied", value: result.ruleApplied },
              { label: "Legal Basis", value: result.legalBasis },
            ]
          : [
              {
                label: "End Date",
                value: result.endDate
                  ? format(result.endDate, "dd MMM yyyy")
                  : "N/A",
              },
              {
                label: "Duration",
                value:
                  result.durationDays !== null
                    ? `${result.durationDays} days`
                    : "N/A",
              },
              {
                label: "Days Remaining",
                value:
                  result.daysRemaining !== null
                    ? result.daysRemaining > 0
                      ? `${result.daysRemaining} days`
                      : "Period ended"
                    : "N/A",
              },
              {
                label: "Status",
                value:
                  result.daysRemaining !== null && result.daysRemaining > 0
                    ? "Ongoing"
                    : "Completed",
              },
              { label: "Rule Applied", value: result.ruleApplied },
              { label: "Legal Basis", value: result.legalBasis },
            ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculation is based on Islamic family law as applicable in Pakistan under the Muslim Family Laws Ordinance 1961 and the Dissolution of Muslim Marriages Act 1939. The iddat period for a pregnant woman continues until delivery regardless of the standard period. Always consult a qualified legal professional or Islamic scholar for specific guidance.",
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
          Iddat Period Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Calculate the mandatory waiting period (iddat) after divorce or death
          of husband under Islamic family law as applicable in Pakistan.
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
            if (result.isPregnant) {
              return (
                <div className="space-y-6">
                  <CalculatorResult
                    label="Iddat End Date"
                    value="Until Delivery"
                    subtitle="Pregnancy overrides the standard waiting period"
                    showBreakdown={showBreakdown}
                    onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                    onPrint={() => window.print()}
                    onReset={handleReset}
                  >
                    <div className="flex justify-center mt-2">
                      <Badge className="bg-amber-100 text-amber-700">
                        Pregnant &mdash; Extended Period
                      </Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Reason</p>
                        <p className="font-semibold">{result.reasonLabel}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Event Date</p>
                        <p className="font-semibold">
                          {format(result.eventDate, "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">Quranic Basis (65:4):</span>{" "}
                        For a pregnant woman, the iddat period continues until
                        delivery, regardless of whether the cause is divorce or
                        death of husband. This overrides the standard period of{" "}
                        {result.reason === "death-of-husband"
                          ? "4 months and 10 days"
                          : "3 months / 3 menstrual cycles"}
                        .
                      </p>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                      <p className="text-gray-500">Legal Basis</p>
                      <p className="font-medium text-gray-700 mt-1">
                        {result.legalBasis}
                      </p>
                    </div>
                  </CalculatorResult>

                  {showBreakdown && (
                    <CalculatorBreakdown
                      open={showBreakdown}
                      onOpenChange={setShowBreakdown}
                      steps={breakdownSteps}
                      legalBasis={result.legalBasis}
                    />
                  )}
                </div>
              );
            }

            // Non-pregnant result
            const isOngoing =
              result.daysRemaining !== null && result.daysRemaining > 0;

            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Iddat End Date"
                  value={
                    result.endDate
                      ? format(result.endDate, "dd MMMM yyyy")
                      : "N/A"
                  }
                  subtitle={
                    result.daysRemaining !== null
                      ? result.daysRemaining > 0
                        ? `${result.daysRemaining} days remaining`
                        : "Iddat period has ended"
                      : undefined
                  }
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  <div className="flex justify-center mt-2">
                    <Badge
                      className={
                        isOngoing
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {isOngoing ? "Ongoing" : "Completed"}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Reason</p>
                      <p className="font-semibold">{result.reasonLabel}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold">
                        {result.durationDays} days
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Days Remaining</p>
                      <p className="font-semibold">
                        {result.daysRemaining !== null
                          ? result.daysRemaining
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-500">Rule Applied</p>
                    <p className="font-medium text-gray-700 mt-1">
                      {result.ruleApplied}
                    </p>
                  </div>
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                    <p className="text-gray-500">Legal Basis</p>
                    <p className="font-medium text-gray-700 mt-1">
                      {result.legalBasis}
                    </p>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis={result.legalBasis}
                  />
                )}
              </div>
            );
          }

          // Step 0: Reason
          if (currentStep === 0) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Reason for Iddat
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the event that triggered the waiting period
                  </p>
                </div>

                <RadioGroup
                  value={reason}
                  onValueChange={(val) => setReason(val as IddatReason)}
                  className="space-y-3"
                >
                  {REASON_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={option.value}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                        reason === option.value
                          ? "border-[#059669] bg-[#059669]/5"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="border-t pt-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="pregnant"
                      checked={isPregnant}
                      onCheckedChange={(c) => setIsPregnant(c === true)}
                    />
                    <div>
                      <label
                        htmlFor="pregnant"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Is pregnant?
                      </label>
                      <p className="text-xs text-gray-500">
                        If pregnant, the iddat period continues until delivery
                        regardless of the standard waiting period (Quran 65:4).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Step 1: Date
          if (currentStep === 1) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    {getDateLabel()}
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the date when the{" "}
                    {reason === "death-of-husband"
                      ? "death occurred"
                      : reason === "annulment"
                        ? "annulment decree was issued"
                        : "divorce was pronounced / decree was granted"}
                  </p>
                  {reason && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Selected reason:</span>{" "}
                        {REASON_OPTIONS.find((o) => o.value === reason)?.label}
                      </p>
                      {isPregnant && (
                        <p className="text-xs text-amber-600 mt-1 font-medium">
                          Pregnancy flag is set &mdash; standard period will be
                          overridden
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !eventDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {eventDate
                          ? format(eventDate, "dd MMMM yyyy")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={eventDate}
                        onSelect={setEventDate}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Iddat in Pakistani & Islamic Law"
        sources={[
          {
            label: "Primary Legislation",
            reference: "Muslim Family Laws Ordinance 1961 (VIII of 1961)",
          },
          {
            label: "Dissolution",
            reference: "Dissolution of Muslim Marriages Act 1939 (VIII of 1939)",
          },
          {
            label: "Quranic Verses",
            reference: "Surah Al-Baqarah 2:228, 2:234; Surah At-Talaq 65:4",
          },
          {
            label: "Jurisprudence",
            reference:
              "Hanafi, Shafi, Maliki, and Hanbali schools of Islamic jurisprudence",
          },
        ]}
      >
        <h3>What is Iddat?</h3>
        <p>
          Iddat (also spelled &lsquo;iddah&rsquo;) is the mandatory waiting period that a
          Muslim woman must observe after the dissolution of her marriage, whether
          through divorce or the death of her husband. During this period, the woman
          may not remarry. The institution of iddat serves multiple purposes in
          Islamic law: it ensures clarity regarding paternity of any potential
          offspring, provides a window for possible reconciliation in cases of
          divorce, and respects the sanctity of the marital bond through a period
          of mourning in cases of death.
        </p>

        <h3>Iddat After Divorce (Talaq or Khula)</h3>
        <p>
          When a marriage ends through talaq (husband-initiated divorce) or khula
          (wife-initiated dissolution), the iddat period is three menstrual cycles
          (quru) for women who menstruate. For women who do not menstruate &mdash;
          whether due to age or other reasons &mdash; the waiting period is three
          calendar months. The Quranic basis for this rule is found in Surah
          Al-Baqarah (2:228): &ldquo;Divorced women shall wait concerning themselves for
          three monthly periods.&rdquo; Under Pakistani law, Section 7 of the Muslim
          Family Laws Ordinance 1961 governs the procedure for talaq, requiring
          notice to the Chairman of the Union Council and providing a 90-day
          reconciliation period that effectively coincides with the iddat.
        </p>

        <h3>Iddat After Death of Husband</h3>
        <p>
          When the husband passes away, the iddat period is four months and ten days
          (approximately 130 days), regardless of whether the marriage was
          consummated. This is based on Surah Al-Baqarah (2:234): &ldquo;If any of you
          die and leave widows behind, they shall wait concerning themselves four
          months and ten days.&rdquo; During this period, the widow is expected to observe
          mourning (ihdad) and refrain from adornment, perfume, and leaving the
          marital home except out of necessity. This applies to all Muslim widows,
          irrespective of their age.
        </p>

        <h3>Iddat for Pregnant Women</h3>
        <p>
          For a pregnant woman, the iddat period &mdash; regardless of whether it arises
          from divorce or death of husband &mdash; continues until the delivery of the
          child. This rule overrides the standard period entirely and is based on
          Surah At-Talaq (65:4): &ldquo;For those who are pregnant, their period is until
          they deliver their burden.&rdquo; If the woman delivers shortly after the
          divorce or death, the iddat ends at delivery even if the standard period
          has not elapsed. Conversely, if the pregnancy extends beyond the standard
          period, the iddat continues until delivery.
        </p>

        <h3>Annulment</h3>
        <p>
          When a marriage is annulled by a court under the Dissolution of Muslim
          Marriages Act 1939, the waiting period follows the same rules as divorce:
          three menstrual cycles or three calendar months. The Act provides various
          grounds for annulment, including cruelty, desertion, failure to maintain,
          impotence, and other specified reasons. Once the court decree is granted,
          the iddat begins from the date of the decree.
        </p>

        <h3>Relationship to the Muslim Family Laws Ordinance 1961</h3>
        <p>
          The Muslim Family Laws Ordinance 1961 (MFLO) is the primary legislation
          governing Muslim family matters in Pakistan. Section 7 of the MFLO requires
          that any man who wishes to divorce his wife must give written notice to the
          Chairman of the Arbitration Council and supply a copy to the wife. The
          divorce does not become effective until ninety days have elapsed from the
          date of notice delivery. This 90-day notice period serves a dual purpose:
          it provides time for attempted reconciliation through the Arbitration
          Council, and it aligns with the iddat period for divorce. If reconciliation
          fails during this period, the divorce becomes effective and the iddat is
          considered to have been observed.
        </p>

        <h3>Remarriage Rights</h3>
        <p>
          A woman may not enter into a new marriage until the iddat period has fully
          expired. Any nikah contracted during the iddat period is void under Islamic
          law and Pakistani statute. After the expiry of iddat following a revocable
          divorce (talaq raj&rsquo;i), the husband loses his right of revocation and the
          woman becomes free to marry anyone, including her former husband, through
          a fresh nikah. After the death of a husband, the widow may remarry freely
          after the completion of the four months and ten days mourning period. The
          purpose is to protect the rights of all parties &mdash; especially any
          potential unborn child &mdash; and to ensure legal clarity regarding lineage
          and maintenance obligations.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
