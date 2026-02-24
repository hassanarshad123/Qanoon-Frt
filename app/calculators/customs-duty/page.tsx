"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { NumberInput } from "@/components/calculators/shared/number-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateCustomsDuty, getCustomsDutyBreakdown } from "@/lib/calculators/customs-duty";
import { CUSTOMS_CATEGORIES } from "@/lib/calculators/data/customs-duty-rates";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  CustomsDutyInputMode,
  FilerStatus,
  CustomsDutyResult,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "product", label: "Product & Rates" },
  { id: "cif", label: "CIF Value" },
  { id: "review", label: "Review" },
];

export default function CustomsDutyCalculatorPage() {
  const [inputMode, setInputMode] = useState<CustomsDutyInputMode>("category");
  const [categoryId, setCategoryId] = useState("");
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");
  const [cifValue, setCifValue] = useState(0);
  const [cdRate, setCdRate] = useState(0);
  const [rdRate, setRdRate] = useState(0);
  const [fedRate, setFedRate] = useState(0);
  const [whtRate, setWhtRate] = useState(5.5);
  const [result, setResult] = useState<CustomsDutyResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selectedCat = CUSTOMS_CATEGORIES.find((c) => c.id === categoryId);

  const handleCalculate = () => {
    setResult(
      calculateCustomsDuty({
        inputMode,
        categoryId: inputMode === "category" ? categoryId : undefined,
        cifValue,
        filerStatus,
        cdRate: inputMode === "manual" ? cdRate / 100 : undefined,
        rdRate: inputMode === "manual" ? rdRate / 100 : undefined,
        fedRate: inputMode === "manual" ? fedRate / 100 : undefined,
        whtRate: inputMode === "manual" ? whtRate / 100 : undefined,
      })
    );
  };

  const handleReset = () => {
    setInputMode("category");
    setCategoryId("");
    setFilerStatus("filer");
    setCifValue(0);
    setCdRate(0);
    setRdRate(0);
    setFedRate(0);
    setWhtRate(5.5);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getCustomsDutyBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Customs Duty Calculator",
        date: new Date(),
        inputs: [
          { label: "Product Category", value: result.categoryLabel },
          { label: "CIF Value", value: formatPKR(result.cifValue) },
          { label: "Filer Status", value: filerStatus === "filer" ? "Active (Filer)" : "Non-Filer" },
        ],
        results: [
          { label: "Customs Duty", value: formatPKR(result.customsDuty) },
          { label: "Regulatory Duty", value: formatPKR(result.regulatoryDuty) },
          { label: "Additional CD", value: formatPKR(result.additionalCustomsDuty) },
          { label: "Federal Excise", value: formatPKR(result.federalExciseDuty) },
          { label: "Sales Tax", value: formatPKR(result.salesTax) },
          { label: "WHT", value: formatPKR(result.whtOnImport) },
          { label: "Total Duties & Taxes", value: formatPKR(result.totalDutiesAndTaxes) },
          { label: "Total Landed Cost", value: formatPKR(result.totalLandedCost) },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "Based on the Customs Act 1969 and Pakistan Customs Tariff. Actual duty rates vary by specific HS code, origin, and applicable SROs. Consult a customs clearing agent for exact calculations.",
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
          Customs Duty Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Calculate total landed cost for imports including customs duty, regulatory
          duty, ACD, FED, sales tax, and WHT. Choose from common product categories
          or enter rates manually.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={(step: number) => {
          if (step === 0) {
            if (inputMode === "category") return !!categoryId;
            return true;
          }
          if (step === 1) return cifValue > 0;
          return true;
        }}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Total Duties & Taxes"
                  value={formatPKR(result.totalDutiesAndTaxes)}
                  subtitle={result.categoryLabel}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Duty breakdown table */}
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-600">Levy</th>
                          <th className="text-right p-3 font-medium text-gray-600">Rate</th>
                          <th className="text-right p-3 font-medium text-gray-600">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-3">Customs Duty (CD)</td>
                          <td className="p-3 text-right">{(result.cdRate * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.customsDuty)}</td>
                        </tr>
                        <tr>
                          <td className="p-3">Regulatory Duty (RD)</td>
                          <td className="p-3 text-right">{(result.rdRate * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.regulatoryDuty)}</td>
                        </tr>
                        <tr>
                          <td className="p-3">Additional Customs Duty (ACD)</td>
                          <td className="p-3 text-right">{(result.acdRate * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.additionalCustomsDuty)}</td>
                        </tr>
                        <tr>
                          <td className="p-3">Federal Excise Duty (FED)</td>
                          <td className="p-3 text-right">{(result.fedRate * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.federalExciseDuty)}</td>
                        </tr>
                        <tr>
                          <td className="p-3">Sales Tax (ST)</td>
                          <td className="p-3 text-right">{(result.stRate * 100).toFixed(0)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.salesTax)}</td>
                        </tr>
                        <tr>
                          <td className="p-3">Withholding Tax (WHT)</td>
                          <td className="p-3 text-right">{(result.whtRate * 100).toFixed(1)}%</td>
                          <td className="p-3 text-right font-medium">{formatPKR(result.whtOnImport)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Total landed cost highlight */}
                  <div className="mt-4 p-4 bg-[#059669]/5 rounded-lg border border-[#059669]/20 text-center">
                    <p className="text-sm text-gray-600">Total Landed Cost</p>
                    <p className="text-2xl font-bold text-[#059669]">
                      {formatPKR(result.totalLandedCost)}
                    </p>
                  </div>

                  {/* Duties as % of CIF */}
                  <div className="mt-3 text-center text-sm text-gray-500">
                    Duties as % of CIF: <span className="font-semibold">{result.dutiesAsPercentOfCIF.toFixed(2)}%</span>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Customs Act 1969; Pakistan Customs Tariff; Sales Tax Act 1990; Income Tax Ordinance 2001 s.148."
                  />
                )}
              </div>
            );
          }

          // Step 0: Product & Rates
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Product & Rates</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a product category or enter duty rates manually
                  </p>
                </div>

                {/* Mode toggle */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode("category")}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "category"
                        ? "border-[#059669] bg-[#059669]/5 text-[#059669]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Select Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("manual")}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      inputMode === "manual"
                        ? "border-[#059669] bg-[#059669]/5 text-[#059669]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    Enter Rates Manually
                  </button>
                </div>

                {inputMode === "category" ? (
                  <RadioGroup
                    value={categoryId}
                    onValueChange={setCategoryId}
                    className="grid gap-2 max-h-[400px] overflow-y-auto"
                  >
                    {CUSTOMS_CATEGORIES.map((cat) => (
                      <label
                        key={cat.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          categoryId === cat.id
                            ? "border-[#059669] bg-[#059669]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <RadioGroupItem value={cat.id} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900">{cat.label}</span>
                          <p className="text-xs text-gray-500 truncate">{cat.description}</p>
                        </div>
                        <span className="text-xs text-[#059669] font-semibold whitespace-nowrap">
                          CD: {(cat.cdRate * 100).toFixed(0)}%
                        </span>
                      </label>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    <NumberInput
                      label="Customs Duty Rate (%)"
                      value={cdRate}
                      onChange={setCdRate}
                      suffix="%"
                      min={0}
                      max={100}
                    />
                    <NumberInput
                      label="Regulatory Duty Rate (%)"
                      value={rdRate}
                      onChange={setRdRate}
                      suffix="%"
                      min={0}
                      max={100}
                    />
                    <NumberInput
                      label="Federal Excise Duty Rate (%)"
                      value={fedRate}
                      onChange={setFedRate}
                      suffix="%"
                      min={0}
                      max={100}
                    />
                    <NumberInput
                      label="WHT Rate (%)"
                      value={whtRate}
                      onChange={setWhtRate}
                      suffix="%"
                      min={0}
                      max={100}
                    />
                    <p className="text-xs text-gray-400">
                      ACD (2%) and Sales Tax (18%) are applied automatically.
                    </p>
                  </div>
                )}

                {/* Filer status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Filer Status (affects WHT)</Label>
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
                  {filerStatus === "non-filer" && (
                    <p className="text-xs text-amber-600">
                      Non-filer WHT rate is doubled under the Tenth Schedule.
                    </p>
                  )}
                </div>
              </div>
            );
          }

          // Step 1: CIF Value
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">CIF Value</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the CIF (Cost + Insurance + Freight) value in PKR
                  </p>
                </div>

                <CurrencyInput
                  label="CIF Value (PKR)"
                  value={cifValue}
                  onChange={(v) => setCifValue(v)}
                />

                {cifValue > 0 && selectedCat && inputMode === "category" && (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500">Quick estimate — CD only: </span>
                    <span className="font-semibold">
                      {formatPKR(Math.round(cifValue * selectedCat.cdRate))}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Step 2: Review
          if (currentStep === 2) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating total landed cost
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Input Mode</span>
                    <span className="text-sm font-semibold">
                      {inputMode === "category" ? "Product Category" : "Manual Rates"}
                    </span>
                  </div>
                  {inputMode === "category" && selectedCat && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="text-sm font-semibold">{selectedCat.label}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">CIF Value</span>
                    <span className="text-sm font-semibold">{formatPKR(cifValue)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">CD Rate</span>
                    <span className="text-sm font-semibold text-[#059669]">
                      {inputMode === "category" && selectedCat
                        ? `${(selectedCat.cdRate * 100).toFixed(0)}%`
                        : `${cdRate}%`}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Filer Status</span>
                    <span className="text-sm font-semibold">
                      {filerStatus === "filer" ? "Active (Filer)" : "Non-Filer (2× WHT)"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute all duties, taxes, and total landed cost
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Customs Duty in Pakistan"
        sources={[
          { label: "Primary Legislation", reference: "Customs Act 1969" },
          { label: "Tariff Schedule", reference: "Pakistan Customs Tariff (HS Code)" },
          { label: "Sales Tax on Imports", reference: "Sales Tax Act 1990" },
        ]}
      >
        <h3>Overview</h3>
        <p>
          Customs duty in Pakistan is levied on imported goods based on the Harmonized
          System (HS) code classification under the Customs Act 1969. The total cost of
          importation includes multiple layers of levies beyond the basic customs duty.
        </p>
        <h3>Layered Import Levies</h3>
        <p>
          Import duties in Pakistan are calculated in layers: Customs Duty (CD) is applied
          first on the CIF value, followed by Regulatory Duty (RD) also on CIF, then
          Additional Customs Duty (ACD) at 2% on (CIF + CD), Federal Excise Duty (FED) on
          (CIF + CD), Sales Tax at 18% on (CIF + CD + FED), and finally Withholding Tax
          under Section 148 of the Income Tax Ordinance on the full assessable value.
        </p>
        <h3>Filer vs Non-Filer</h3>
        <p>
          The withholding tax rate on imports is doubled for non-filers (those not on the
          Active Taxpayer List) under the Tenth Schedule of the Income Tax Ordinance 2001.
          This creates a significant cost disadvantage for non-compliant importers.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
