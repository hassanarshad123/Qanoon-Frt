"use client";

import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, Clock } from "lucide-react";
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
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { calculateTaxPenalty, getTaxPenaltyBreakdown } from "@/lib/calculators/tax-penalties";
import { PENALTY_RULES } from "@/lib/calculators/data/tax-penalty-rules";
import { formatPKR } from "@/lib/calculators/constants";
import type { TaxPenaltyInput, TaxPenaltyResult, PenaltyType, WizardStep, PrintReportData } from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "penalty-type", label: "Penalty Type" },
  { id: "details", label: "Details" },
  { id: "factors", label: "Factors" },
];

const PENALTY_TYPE_DESCRIPTIONS: Record<PenaltyType, string> = {
  "late-filing":
    "Return of income not filed within the due date under Section 114. Attracts a base penalty plus a daily default amount.",
  "late-payment":
    "Tax not paid by the due date specified in the demand notice. Subject to default surcharge at KIBOR + 3% per annum.",
  "failure-to-furnish":
    "Failure to furnish a statement, return, or information required under the Ordinance. Daily penalty of Rs. 2,500 applies.",
  "concealment":
    "Furnishing inaccurate particulars of income or deliberately concealing income from the tax authorities. Penalty ranges from 25% to 100% of tax evaded.",
  "default-surcharge":
    "Surcharge on unpaid tax calculated daily from the due date to the date of actual payment at KIBOR + 3% per annum.",
};

export default function TaxPenaltiesCalculatorPage() {
  // Form state
  const [penaltyType, setPenaltyType] = useState<PenaltyType | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [actualDate, setActualDate] = useState<Date | undefined>(undefined);
  const [amountInvolved, setAmountInvolved] = useState(0);
  const [isFirstOffense, setIsFirstOffense] = useState(false);
  const [isVoluntaryDisclosure, setIsVoluntaryDisclosure] = useState(false);
  const [entityType, setEntityType] = useState<"individual" | "company">("individual");
  const [income, setIncome] = useState(0);

  // Result state
  const [result, setResult] = useState<TaxPenaltyResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedRule = penaltyType
    ? PENALTY_RULES.find((r) => r.type === penaltyType)
    : null;

  const canProceedStep = (step: number) => {
    if (step === 0) return penaltyType !== null;
    if (step === 1) return dueDate !== undefined && actualDate !== undefined && amountInvolved > 0;
    return true; // factors are optional
  };

  const handleCalculate = () => {
    if (!penaltyType || !dueDate || !actualDate) return;
    const input: TaxPenaltyInput = {
      penaltyType,
      dueDate,
      actualDate,
      amountInvolved,
      isFirstOffense,
      isVoluntaryDisclosure,
      ...(penaltyType === "late-filing" && { entityType, income }),
    };
    setResult(calculateTaxPenalty(input));
  };

  const handleReset = () => {
    setPenaltyType(null);
    setDueDate(undefined);
    setActualDate(undefined);
    setAmountInvolved(0);
    setIsFirstOffense(false);
    setIsVoluntaryDisclosure(false);
    setEntityType("individual");
    setIncome(0);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getTaxPenaltyBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Tax Penalties Calculator",
        date: new Date(),
        inputs: [
          { label: "Penalty Type", value: result.penaltyTypeLabel },
          { label: "Relevant Section", value: result.relevantSection },
          { label: "Due Date", value: dueDate ? format(dueDate, "dd MMM yyyy") : "-" },
          { label: "Actual Date", value: actualDate ? format(actualDate, "dd MMM yyyy") : "-" },
          { label: "Amount Involved", value: formatPKR(amountInvolved) },
          { label: "First Offense", value: isFirstOffense ? "Yes" : "No" },
          { label: "Voluntary Disclosure", value: isVoluntaryDisclosure ? "Yes" : "No" },
        ],
        results: [
          { label: "Days Late", value: `${result.daysLate} days` },
          { label: "Penalty Amount", value: formatPKR(result.penaltyAmount) },
          { label: "Default Surcharge", value: formatPKR(result.defaultSurcharge) },
          { label: "Total Payable", value: formatPKR(result.totalPayable) },
          { label: "Relevant Section", value: result.relevantSection },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculation is an estimate based on the Income Tax Ordinance 2001. Actual penalties may vary based on individual circumstances, prevailing KIBOR rates, and the discretion of tax authorities. Always consult a qualified tax professional or legal advisor.",
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Tax Calculator
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Tax Penalties Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Estimate penalties for late filing, late payment, concealment, and default
          surcharge under the Income Tax Ordinance 2001.
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
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Total Payable"
                  value={formatPKR(result.totalPayable)}
                  subtitle={`${result.daysLate} days late — ${result.relevantSection}`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  <div className="flex justify-center mt-2">
                    <Badge className="bg-red-100 text-red-700">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {result.penaltyTypeLabel}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Penalty</p>
                      <p className="font-semibold">{formatPKR(result.penaltyAmount)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Default Surcharge</p>
                      <p className="font-semibold">{formatPKR(result.defaultSurcharge)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Days Late</p>
                      <p className="font-semibold">{result.daysLate}</p>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">{result.explanation}</p>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis={`Income Tax Ordinance 2001, ${result.relevantSection}. Default surcharge under Section 205.`}
                  />
                )}
              </div>
            );
          }

          // Step 0: Penalty Type
          if (currentStep === 0) {
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Select Penalty Type</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the type of tax penalty or default you want to calculate
                  </p>
                </div>
                <RadioGroup
                  value={penaltyType ?? ""}
                  onValueChange={(value) => setPenaltyType(value as PenaltyType)}
                  className="space-y-3"
                >
                  {PENALTY_RULES.map((rule) => (
                    <label
                      key={rule.type}
                      htmlFor={rule.type}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                        penaltyType === rule.type
                          ? "border-[#059669] bg-[#059669]/5"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      <RadioGroupItem value={rule.type} id={rule.type} className="mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {rule.label}
                          </span>
                          <span className="text-xs text-gray-400">{rule.section}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {PENALTY_TYPE_DESCRIPTIONS[rule.type as PenaltyType]}
                        </p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            );
          }

          // Step 1: Details
          if (currentStep === 1) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Enter Details</Label>
                  {selectedRule && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{selectedRule.label}</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-xs text-gray-400">{selectedRule.section}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Formula:</span>{" "}
                        {selectedRule.penaltyFormula}
                      </p>
                    </div>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <Label>Due Date</Label>
                  <p className="text-xs text-gray-500 mb-1">
                    The original deadline for filing or payment
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {dueDate
                          ? format(dueDate, "dd MMMM yyyy")
                          : "Pick due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Actual Date */}
                <div>
                  <Label>Actual Filing / Payment Date</Label>
                  <p className="text-xs text-gray-500 mb-1">
                    The date you actually filed or paid (or expect to)
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !actualDate && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {actualDate
                          ? format(actualDate, "dd MMMM yyyy")
                          : "Pick actual date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={actualDate}
                        onSelect={setActualDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Amount Involved */}
                <div>
                  <Label>Amount Involved</Label>
                  <p className="text-xs text-gray-500 mb-1">
                    {penaltyType === "concealment"
                      ? "Tax sought to be evaded"
                      : "Tax payable or outstanding tax amount"}
                  </p>
                  <CurrencyInput
                    value={amountInvolved}
                    onChange={setAmountInvolved}
                    placeholder="Enter amount"
                  />
                </div>

                {/* Entity Type & Income — only for late-filing */}
                {penaltyType === "late-filing" && (
                  <>
                    <div>
                      <Label>Entity Type</Label>
                      <p className="text-xs text-gray-500 mb-1">
                        Individual penalty is tiered by income; companies pay a flat Rs. 50,000
                      </p>
                      <RadioGroup
                        value={entityType}
                        onValueChange={(v) => setEntityType(v as "individual" | "company")}
                        className="flex gap-4 mt-1"
                      >
                        <label
                          htmlFor="entity-individual"
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                            entityType === "individual"
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <RadioGroupItem value="individual" id="entity-individual" />
                          <span className="text-sm">Individual</span>
                        </label>
                        <label
                          htmlFor="entity-company"
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors",
                            entityType === "company"
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <RadioGroupItem value="company" id="entity-company" />
                          <span className="text-sm">Company / AOP</span>
                        </label>
                      </RadioGroup>
                    </div>

                    {entityType === "individual" && (
                      <div>
                        <Label>Annual Income</Label>
                        <p className="text-xs text-gray-500 mb-1">
                          Used to determine the base penalty tier (Rs. 1K / 5K / 25K)
                        </p>
                        <CurrencyInput
                          value={income}
                          onChange={setIncome}
                          placeholder="Enter annual income"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          }

          // Step 2: Factors
          if (currentStep === 2) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Mitigating Factors (optional)
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Select any factors that may reduce the penalty amount
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="first-offense"
                      checked={isFirstOffense}
                      onCheckedChange={(c) => setIsFirstOffense(c === true)}
                    />
                    <div>
                      <label htmlFor="first-offense" className="text-sm font-medium cursor-pointer">
                        First Offense
                      </label>
                      <p className="text-xs text-gray-500">
                        This is the taxpayer&apos;s first time committing this type of default.
                        First-time offenders may receive reduced penalties, particularly for
                        concealment (25% instead of higher rates) and failure to furnish
                        information (25% reduction).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id="voluntary-disclosure"
                      checked={isVoluntaryDisclosure}
                      onCheckedChange={(c) => setIsVoluntaryDisclosure(c === true)}
                    />
                    <div>
                      <label htmlFor="voluntary-disclosure" className="text-sm font-medium cursor-pointer">
                        Voluntary Disclosure Before Detection
                      </label>
                      <p className="text-xs text-gray-500">
                        The taxpayer voluntarily disclosed the default or concealment before
                        it was detected by the tax authorities. Voluntary disclosure can
                        significantly reduce penalties — up to 50% for late filing and down
                        to 10% for concealment cases.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary before calculation */}
                <div className="border-t pt-4">
                  <div className="border rounded-lg divide-y">
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Penalty Type</span>
                      <span className="text-sm font-semibold">
                        {selectedRule?.label ?? "-"}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Due Date</span>
                      <span className="text-sm font-semibold">
                        {dueDate ? format(dueDate, "dd MMM yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Actual Date</span>
                      <span className="text-sm font-semibold">
                        {actualDate ? format(actualDate, "dd MMM yyyy") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Amount Involved</span>
                      <span className="text-sm font-semibold">
                        {formatPKR(amountInvolved)}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50">
                      <span className="text-sm text-gray-600">Mitigating Factors</span>
                      <span className="text-sm font-semibold">
                        {[
                          isFirstOffense && "First offense",
                          isVoluntaryDisclosure && "Voluntary disclosure",
                        ]
                          .filter(Boolean)
                          .join(", ") || "None"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Click &ldquo;Calculate&rdquo; to estimate your penalty under the ITO 2001
                  </p>
                </div>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Tax Penalties under ITO 2001"
        sources={[
          { label: "Primary Legislation", reference: "Income Tax Ordinance 2001" },
          { label: "Late Filing Penalty", reference: "Section 182, ITO 2001" },
          { label: "Default Surcharge", reference: "Section 205, ITO 2001" },
          { label: "Concealment Penalty", reference: "Section 191, ITO 2001" },
        ]}
      >
        <h3>Overview of Tax Penalties in Pakistan</h3>
        <p>
          The Income Tax Ordinance 2001 (ITO 2001) prescribes a comprehensive penalty
          regime to ensure taxpayer compliance. Penalties range from monetary fines for
          procedural defaults (such as late filing) to severe punitive measures for
          deliberate tax evasion and concealment. Understanding these penalties is
          essential for taxpayers and their advisors to manage compliance risk and
          avoid unnecessary financial exposure.
        </p>

        <h3>Section 182 — Penalty for Late Filing</h3>
        <p>
          Under Section 182 of the ITO 2001, failure to file a return of income by the
          due date prescribed under Section 114 attracts a tiered penalty for individuals:
          Rs. 1,000 (income up to Rs. 5 lakh), Rs. 5,000 (up to Rs. 10 lakh), or
          Rs. 25,000 (above Rs. 10 lakh). Companies and AOPs face a flat Rs. 50,000.
          In addition, a daily penalty of Rs. 100 accrues for each day the default
          continues. However, the total penalty is capped at 25% of the tax payable for
          the relevant tax year. Taxpayers who voluntarily file before receiving a notice
          from the FBR may benefit from reduced penalties, typically at 50% of the
          otherwise applicable amount.
        </p>

        <h3>Section 205 — Default Surcharge</h3>
        <p>
          Section 205 imposes a default surcharge on any tax that remains unpaid after
          the due date. The surcharge is computed at the KIBOR rate (as applicable on
          the first day of the relevant quarter) plus 3% per annum, calculated on a
          daily basis from the due date to the date of actual payment. This provision
          applies to both late payment of assessed tax and unpaid advance tax
          installments. The surcharge is mandatory and applies regardless of whether
          the default was intentional or inadvertent.
        </p>

        <h3>Section 191 — Concealment of Income</h3>
        <p>
          Section 191 addresses the most serious tax offenses — concealment of income
          and furnishing inaccurate particulars. The penalty structure is progressive:
          a first offense typically attracts a penalty of 25% of the tax sought to be
          evaded. Repeat offenses or cases involving willful concealment can result in
          penalties of 50% to 100% of the evaded tax. In egregious cases, prosecution
          proceedings may also be initiated under Sections 192 and 194, which can lead
          to imprisonment. Voluntary disclosure before detection by the authorities is
          viewed favorably and can reduce the penalty to as low as 10% of the
          evaded amount.
        </p>

        <h3>Voluntary Compliance Benefits</h3>
        <p>
          Pakistan&apos;s tax framework recognizes and incentivizes voluntary compliance.
          Taxpayers who come forward before receiving a notice or before their default
          is detected by the Federal Board of Revenue (FBR) typically receive
          significantly reduced penalties. This principle applies across penalty types:
          voluntary late filing attracts a 50% reduction, and voluntary disclosure of
          concealed income can reduce the penalty from 25% (or higher) down to 10%.
          The rationale is to encourage self-correction and reduce the administrative
          burden of enforcement.
        </p>

        <h3>Appeal Process</h3>
        <p>
          Taxpayers who disagree with a penalty order have the right to appeal. The
          first level of appeal is to the Commissioner (Appeals) under Section 127,
          which must be filed within 30 days of the penalty order. If the taxpayer
          is unsatisfied with the Commissioner&apos;s decision, a further appeal can
          be made to the Appellate Tribunal Inland Revenue (ATIR) under Section 131.
          Questions of law can be referred to the High Court under Section 133.
          During the appeal process, taxpayers may also apply for a stay of demand
          to prevent recovery proceedings while the matter is being adjudicated.
          It is advisable to engage a qualified tax practitioner or advocate when
          contesting penalty orders.
        </p>

        <h3>Important Considerations</h3>
        <ul>
          <li>
            <strong>KIBOR fluctuation:</strong> Default surcharge rates change quarterly
            based on prevailing KIBOR rates. The calculator uses an approximate rate
            that may differ from the actual applicable rate.
          </li>
          <li>
            <strong>Commissioner&apos;s discretion:</strong> The Commissioner has
            discretion in certain cases to waive or reduce penalties based on
            reasonable cause shown by the taxpayer.
          </li>
          <li>
            <strong>Prosecution risk:</strong> In cases of willful concealment
            exceeding certain thresholds, criminal prosecution under Sections 192-194
            is possible in addition to monetary penalties.
          </li>
          <li>
            <strong>Compounding of offenses:</strong> Under Section 208, certain
            offenses may be compounded by paying an agreed-upon sum before or during
            prosecution proceedings.
          </li>
          <li>
            <strong>Non-filer surcharges:</strong> Non-filers face additional
            withholding tax surcharges on banking transactions, property purchases,
            and vehicle registration — separate from the penalties calculated here.
          </li>
        </ul>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
