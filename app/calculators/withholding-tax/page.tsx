"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateWHT, getWHTBreakdown } from "@/lib/calculators/withholding-tax";
import { WHT_CATEGORIES } from "@/lib/calculators/data/withholding-tax-rates";
import { formatPKR } from "@/lib/calculators/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WHTCategory,
  WHTResult,
  FilerStatus,
  PropertyFilerStatus,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "category", label: "Category" },
  { id: "details", label: "Details" },
  { id: "review", label: "Review" },
];

const CATEGORY_ICONS: Record<string, string> = {
  imports: "s.148",
  dividends: "s.150",
  "profit-on-debt": "s.151",
  "goods-services-contracts": "s.153",
  "rental-income": "s.155",
  "property-sale": "s.236C",
  "property-purchase": "s.236K",
  other: "Various",
};

function getTaxStatusBadge(status: string) {
  switch (status) {
    case "final":
      return { label: "Final Tax", color: "bg-gray-100 text-gray-700" };
    case "minimum":
      return { label: "Minimum Tax", color: "bg-amber-100 text-amber-700" };
    case "adjustable":
      return { label: "Adjustable", color: "bg-emerald-100 text-emerald-700" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-600" };
  }
}

export default function WithholdingTaxCalculatorPage() {
  const [category, setCategory] = useState<WHTCategory>("imports");
  const [subTypeId, setSubTypeId] = useState("");
  const [amount, setAmount] = useState(0);
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");
  const [propertyFilerStatus, setPropertyFilerStatus] = useState<PropertyFilerStatus>("filer");
  const [result, setResult] = useState<WHTResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedCat = WHT_CATEGORIES.find((c) => c.id === category);
  const isPropertyCategory = category === "property-sale" || category === "property-purchase";
  const isRentalCategory = category === "rental-income";
  const hasSubTypes = selectedCat && selectedCat.subTypes.length > 0;

  const handleCalculate = () => {
    setResult(
      calculateWHT({
        category,
        subTypeId: hasSubTypes ? subTypeId : undefined,
        amount,
        filerStatus,
        propertyFilerStatus: isPropertyCategory ? propertyFilerStatus : undefined,
      })
    );
  };

  const handleReset = () => {
    setCategory("imports");
    setSubTypeId("");
    setAmount(0);
    setFilerStatus("filer");
    setPropertyFilerStatus("filer");
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getWHTBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Withholding Tax Calculator",
        date: new Date(),
        inputs: [
          { label: "Category", value: result.categoryLabel },
          { label: "Sub-Type", value: result.subTypeLabel },
          { label: "Filer Status", value: filerStatus === "filer" ? "Active (Filer)" : "Inactive (Non-Filer)" },
          { label: "Amount", value: formatPKR(result.amount) },
        ],
        results: [
          { label: "WHT Rate", value: `${(result.rate * 100).toFixed(2)}%` },
          { label: "WHT Amount", value: formatPKR(result.whtAmount) },
          { label: "Net Amount", value: formatPKR(result.netAmount) },
          { label: "Tax Status", value: result.taxStatus },
          { label: "Section", value: result.section },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "Rates based on the Income Tax Ordinance 2001 and KPMG WHT Rate Card TY 2026. Actual rates may vary based on specific circumstances, SRO notifications, and FBR clarifications. Consult a tax advisor.",
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
          Withholding Tax Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Look up WHT rates by category and sub-type. Covers imports, dividends,
          property, goods, services, contracts, and more for TY 2026.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={(step: number) => {
          if (step === 0) return !!category;
          if (step === 1) {
            if (hasSubTypes && !subTypeId) return false;
            return amount > 0;
          }
          return true;
        }}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            const badge = getTaxStatusBadge(result.taxStatus);
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="WHT Amount"
                  value={formatPKR(result.whtAmount)}
                  subtitle={`${result.categoryLabel} — ${result.section}`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Stats grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Rate Applied</p>
                      <p className="font-semibold">{(result.rate * 100).toFixed(2)}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Section</p>
                      <p className="font-semibold">{result.section}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg col-span-2">
                      <p className="text-gray-500">Net Amount After WHT</p>
                      <p className="font-semibold text-lg">{formatPKR(result.netAmount)}</p>
                    </div>
                  </div>

                  {/* Tax status badge */}
                  <div className="mt-4 flex items-center justify-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Inactive rate comparison */}
                  {result.rate !== result.inactiveRate && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                      <strong>Inactive (Non-Filer) rate:</strong>{" "}
                      {(result.inactiveRate * 100).toFixed(2)}% — WHT would be{" "}
                      {formatPKR(Math.round(result.amount * result.inactiveRate))}
                    </div>
                  )}
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis={`Income Tax Ordinance 2001, ${result.section}; Finance Act 2025.`}
                  />
                )}
              </div>
            );
          }

          // Step 0: Category Selection
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Select WHT Category</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the type of payment or transaction
                  </p>
                </div>

                <RadioGroup
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v as WHTCategory);
                    setSubTypeId("");
                  }}
                  className="grid gap-2"
                >
                  {WHT_CATEGORIES.filter((c) => c.id !== "salary").map((cat) => (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        category === cat.id
                          ? "border-[#059669] bg-[#059669]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={cat.id} />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {cat.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">
                        {CATEGORY_ICONS[cat.id] ?? cat.section}
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            );
          }

          // Step 1: Details (dynamic based on category)
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">
                    {selectedCat?.label} — Details
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    {isRentalCategory
                      ? "Enter annual gross rent (slab-based calculation)"
                      : isPropertyCategory
                        ? "Enter property value and filer status"
                        : "Select sub-type, filer status, and enter amount"}
                  </p>
                </div>

                {/* Sub-type selector (for categories with sub-types) */}
                {hasSubTypes && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Transaction Sub-Type</Label>
                    <Select value={subTypeId} onValueChange={setSubTypeId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a sub-type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCat!.subTypes.map((st) => (
                          <SelectItem key={st.id} value={st.id}>
                            <span className="flex items-center gap-2">
                              {st.label}
                              <span className="text-xs text-gray-400 ml-auto">
                                {(st.filerRate * 100).toFixed(1)}% / {(st.nonFilerRate * 100).toFixed(1)}%
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Filer status */}
                {isPropertyCategory ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Filer Status</Label>
                    <RadioGroup
                      value={propertyFilerStatus}
                      onValueChange={(v) => setPropertyFilerStatus(v as PropertyFilerStatus)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {(["filer", "late-filer", "non-filer"] as const).map((status) => (
                        <label
                          key={status}
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                            propertyFilerStatus === status
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem value={status} />
                          <span className="font-medium capitalize">
                            {status === "filer" ? "Active Filer" : status === "late-filer" ? "Late Filer" : "Non-Filer"}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                ) : !isRentalCategory ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Filer Status</Label>
                    <RadioGroup
                      value={filerStatus}
                      onValueChange={(v) => setFilerStatus(v as FilerStatus)}
                      className="grid grid-cols-2 gap-2"
                    >
                      <label
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                          filerStatus === "filer"
                            ? "border-[#059669] bg-[#059669]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value="filer" />
                        <span className="font-medium">Active (Filer)</span>
                      </label>
                      <label
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                          filerStatus === "non-filer"
                            ? "border-[#059669] bg-[#059669]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value="non-filer" />
                        <span className="font-medium">Inactive (Non-Filer)</span>
                      </label>
                    </RadioGroup>
                  </div>
                ) : null}

                {/* Amount */}
                <CurrencyInput
                  label={
                    isRentalCategory
                      ? "Annual Gross Rent"
                      : isPropertyCategory
                        ? category === "property-sale"
                          ? "Sale Consideration"
                          : "Fair Market Value"
                        : "Payment Amount"
                  }
                  value={amount}
                  onChange={(v) => setAmount(v)}
                />

                {/* Selected sub-type rate preview */}
                {hasSubTypes && subTypeId && (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500">
                      {filerStatus === "filer" ? "Active" : "Inactive"} Rate:{" "}
                    </span>
                    <span className="font-semibold text-[#059669]">
                      {(() => {
                        const st = selectedCat!.subTypes.find((s) => s.id === subTypeId);
                        if (!st) return "—";
                        const r = filerStatus === "filer" ? st.filerRate : st.nonFilerRate;
                        return `${(r * 100).toFixed(2)}%`;
                      })()}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Step 2: Review
          if (currentStep === 2) {
            const selectedSubType = hasSubTypes
              ? selectedCat!.subTypes.find((s) => s.id === subTypeId)
              : null;
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating WHT
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-sm font-semibold">{selectedCat?.label}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Section</span>
                    <span className="text-sm font-semibold">{selectedCat?.section}</span>
                  </div>
                  {selectedSubType && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Sub-Type</span>
                      <span className="text-sm font-semibold">{selectedSubType.label}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Filer Status</span>
                    <span className="text-sm font-semibold">
                      {isPropertyCategory
                        ? propertyFilerStatus === "filer"
                          ? "Active Filer"
                          : propertyFilerStatus === "late-filer"
                            ? "Late Filer"
                            : "Non-Filer"
                        : filerStatus === "filer"
                          ? "Active (Filer)"
                          : "Inactive (Non-Filer)"}
                    </span>
                  </div>
                  {selectedSubType && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Rate</span>
                      <span className="text-sm font-semibold text-[#059669]">
                        {(() => {
                          const r = filerStatus === "filer" ? selectedSubType.filerRate : selectedSubType.nonFilerRate;
                          return `${(r * 100).toFixed(2)}%`;
                        })()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span className="text-sm font-semibold">{formatPKR(amount)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute the withholding tax
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Withholding Tax in Pakistan"
        sources={[
          { label: "Primary Legislation", reference: "Income Tax Ordinance 2001, Sections 148–236Z" },
          { label: "Rate Card", reference: "KPMG WHT Rate Card TY 2026" },
          { label: "Tax Authority", reference: "Federal Board of Revenue (FBR)" },
        ]}
      >
        <h3>Overview</h3>
        <p>
          Withholding tax (WHT) in Pakistan is a mechanism where tax is deducted at source
          by the payer before remitting payment to the recipient. It covers a wide range of
          transactions including imports, dividends, profit on debt, property transactions,
          goods, services, contracts, and more. The rates differ based on whether the
          taxpayer is on the Active Taxpayer List (ATL).
        </p>
        <h3>Filer vs Non-Filer</h3>
        <p>
          Pakistan maintains a dual-rate system. Taxpayers on the Active Taxpayer List (filers)
          enjoy lower WHT rates. Non-filers (inactive taxpayers) typically face rates that are
          double the filer rate under the Tenth Schedule. This creates a strong incentive to
          file tax returns and maintain active status.
        </p>
        <h3>Tax Status: Final, Minimum, Adjustable</h3>
        <p>
          WHT can be classified as: <strong>Final Tax</strong> — the WHT is the complete tax
          liability on that income, no further tax is due; <strong>Minimum Tax</strong> — the
          WHT is the minimum tax payable, if actual tax computed on total income is higher, the
          difference must be paid; <strong>Adjustable</strong> — the WHT can be fully credited
          against the taxpayer&apos;s final tax liability computed on total income.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
