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
import { calculateIncomeTax, getIncomeTaxBreakdown } from "@/lib/calculators/income-tax";
import { SALARIED_SLABS, NON_SALARIED_SLABS, getSlabLabel } from "@/lib/calculators/data/income-tax-slabs";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  TaxpayerType,
  IncomeTaxResult,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "type", label: "Taxpayer" },
  { id: "income", label: "Income" },
  { id: "review", label: "Review" },
];

export default function IncomeTaxCalculatorPage() {
  const [taxpayerType, setTaxpayerType] = useState<TaxpayerType>("salaried");
  const [annualIncome, setAnnualIncome] = useState(0);
  const [result, setResult] = useState<IncomeTaxResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleCalculate = () => {
    setResult(calculateIncomeTax({ taxpayerType, annualIncome }));
  };

  const handleReset = () => {
    setTaxpayerType("salaried");
    setAnnualIncome(0);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getIncomeTaxBreakdown(result) : [];

  // Find which slab applies for live preview
  const slabs = taxpayerType === "salaried" ? SALARIED_SLABS : NON_SALARIED_SLABS;
  const activeSlab = slabs.find(
    (s) => annualIncome > s.min && annualIncome <= s.max
  );

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Income Tax Calculator",
        date: new Date(),
        inputs: [
          { label: "Taxpayer Type", value: taxpayerType === "salaried" ? "Salaried" : "Non-Salaried / Business" },
          { label: "Annual Taxable Income", value: formatPKR(result.taxableIncome) },
        ],
        results: [
          { label: "Base Tax", value: formatPKR(result.baseTax) },
          ...(result.surchargeAmount > 0
            ? [{ label: `Surcharge (${(result.surchargeRate * 100).toFixed(0)}%)`, value: formatPKR(result.surchargeAmount) }]
            : []),
          { label: "Total Annual Tax", value: formatPKR(result.totalTax) },
          { label: "Monthly Tax", value: formatPKR(result.monthlyTax) },
          { label: "Effective Rate", value: `${result.effectiveRate.toFixed(2)}%` },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculator provides an estimate based on the Income Tax Ordinance 2001 and Finance Act 2025 for Tax Year 2026. Actual tax liability may vary based on exemptions, deductions, and amendments. Consult a qualified tax advisor.",
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
          Income Tax Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Compute income tax liability using FBR slab rates for Tax Year 2026
          (Finance Act 2025). Supports salaried and non-salaried taxpayers with
          surcharge calculation.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={(step: number) => {
          if (step === 1) return annualIncome > 0;
          return true;
        }}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Annual Tax Liability"
                  value={formatPKR(result.totalTax)}
                  subtitle={`${result.taxpayerType === "salaried" ? "Salaried" : "Non-Salaried"} — Effective Rate: ${result.effectiveRate.toFixed(2)}%`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Stats grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Monthly Tax</p>
                      <p className="font-semibold">{formatPKR(result.monthlyTax)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Effective Rate</p>
                      <p className="font-semibold">{result.effectiveRate.toFixed(2)}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Taxable Income</p>
                      <p className="font-semibold">{formatPKR(result.taxableIncome)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Base Tax</p>
                      <p className="font-semibold">{formatPKR(result.baseTax)}</p>
                    </div>
                  </div>

                  {/* Surcharge box */}
                  {result.surchargeAmount > 0 && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-medium text-amber-800">
                        Surcharge Applied: {(result.surchargeRate * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        Income exceeds Rs. 10,000,000 — surcharge of{" "}
                        {formatPKR(result.surchargeAmount)} ({result.taxpayerType === "salaried" ? "9% for salaried" : "10% for non-salaried"}).
                      </p>
                    </div>
                  )}

                  {/* Slab breakdown table */}
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-600">Slab</th>
                          <th className="text-right p-3 font-medium text-gray-600">Income</th>
                          <th className="text-right p-3 font-medium text-gray-600">Rate</th>
                          <th className="text-right p-3 font-medium text-gray-600">Tax</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {result.slabBreakdown.map((row, i) => (
                          <tr key={i} className={row.income > 0 ? "" : "text-gray-400"}>
                            <td className="p-3 text-xs">{row.slab}</td>
                            <td className="p-3 text-right">{formatPKR(row.income)}</td>
                            <td className="p-3 text-right">{(row.rate * 100).toFixed(0)}%</td>
                            <td className="p-3 text-right font-medium">{formatPKR(row.tax)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Income Tax Ordinance 2001, First Schedule Part I Division I; Finance Act 2025."
                  />
                )}
              </div>
            );
          }

          // Step 0: Taxpayer Type
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Select Taxpayer Type</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Different tax slab rates apply based on your income source
                  </p>
                </div>

                <RadioGroup
                  value={taxpayerType}
                  onValueChange={(v) => setTaxpayerType(v as TaxpayerType)}
                  className="grid gap-3"
                >
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      taxpayerType === "salaried"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="salaried" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Salaried</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Salary income is 75% or more of total taxable income
                      </p>
                    </div>
                    <span className="text-xs text-[#059669] font-medium">Lower Rates</span>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      taxpayerType === "non-salaried"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="non-salaried" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Non-Salaried / Business</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Business income, or salary less than 75% of total income, or AOP
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">Higher Rates</span>
                  </label>
                </RadioGroup>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                  <strong>Note:</strong> If salary constitutes 75% or more of your total income,
                  you qualify for the lower salaried slab rates under the First Schedule.
                </div>
              </div>
            );
          }

          // Step 1: Income
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Annual Taxable Income</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your total annual taxable income after deductions and exemptions
                  </p>
                </div>

                <CurrencyInput
                  label="Annual Taxable Income"
                  value={annualIncome}
                  onChange={(v) => setAnnualIncome(v)}
                />

                {/* Live slab preview */}
                {annualIncome > 0 && activeSlab && (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500">Applicable Slab: </span>
                    <span className="font-semibold">{getSlabLabel(activeSlab)}</span>
                    {activeSlab.rate > 0 && (
                      <span className="text-[#059669] ml-2">
                        @ {(activeSlab.rate * 100).toFixed(0)}% marginal rate
                      </span>
                    )}
                  </div>
                )}

                {annualIncome <= 600_000 && annualIncome > 0 && (
                  <div className="p-3 bg-[#059669]/5 border border-[#059669]/20 rounded-lg text-sm text-[#059669]">
                    Income below Rs. 600,000 — No tax payable
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
                    Confirm your entries before calculating income tax
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Taxpayer Type</span>
                    <span className="text-sm font-semibold">
                      {taxpayerType === "salaried" ? "Salaried" : "Non-Salaried / Business"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Annual Taxable Income</span>
                    <span className="text-sm font-semibold">{formatPKR(annualIncome)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Tax Year</span>
                    <span className="text-sm font-semibold">2026 (July 2025 – June 2026)</span>
                  </div>
                  {annualIncome > 10_000_000 && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Surcharge</span>
                      <span className="text-sm font-semibold text-amber-600">
                        {taxpayerType === "salaried" ? "9%" : "10%"} (income &gt; Rs. 10M)
                      </span>
                    </div>
                  )}
                </div>

                {/* Preview slab table */}
                <div className="border rounded-lg overflow-hidden">
                  <p className="text-xs text-gray-500 p-3 bg-gray-50 font-medium">
                    {taxpayerType === "salaried" ? "Salaried" : "Non-Salaried"} Slab Rates — TY 2026
                  </p>
                  <table className="w-full text-xs">
                    <tbody className="divide-y">
                      {slabs.map((slab, i) => (
                        <tr
                          key={i}
                          className={
                            activeSlab === slab ? "bg-[#059669]/5" : ""
                          }
                        >
                          <td className="p-2 pl-3">{getSlabLabel(slab)}</td>
                          <td className="p-2 pr-3 text-right font-medium">
                            {slab.rate === 0
                              ? "Nil"
                              : slab.fixedAmount > 0
                                ? `Rs. ${slab.fixedAmount.toLocaleString("en-PK")} + ${(slab.rate * 100).toFixed(0)}%`
                                : `${(slab.rate * 100).toFixed(0)}%`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute your income tax liability
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Income Tax in Pakistan"
        sources={[
          { label: "Primary Legislation", reference: "Income Tax Ordinance 2001" },
          { label: "Tax Authority", reference: "Federal Board of Revenue (FBR)" },
          { label: "Latest Amendments", reference: "Finance Act 2025" },
        ]}
      >
        <h3>Overview</h3>
        <p>
          Income tax in Pakistan is governed by the Income Tax Ordinance 2001 and amended
          annually through the Finance Act. The Federal Board of Revenue (FBR) publishes
          slab rates that determine the rate of tax based on taxable income. Different
          slab rates apply to salaried individuals, non-salaried individuals, and
          associations of persons (AOPs).
        </p>
        <h3>Salaried vs Non-Salaried</h3>
        <p>
          Taxpayers whose salary income constitutes 75% or more of their total taxable
          income benefit from lower slab rates under the First Schedule, Part I,
          Division I. Non-salaried individuals and AOPs face higher marginal rates,
          particularly in the upper income brackets, with rates reaching up to 45%
          compared to 35% for salaried individuals.
        </p>
        <h3>Surcharge on High Incomes</h3>
        <p>
          Individuals with taxable income exceeding Rs. 10,000,000 are subject to an
          additional surcharge on their computed tax liability. The surcharge rate is
          9% for salaried taxpayers and 10% for non-salaried individuals and AOPs.
          This surcharge is calculated on the base tax amount, not on the income itself.
        </p>
        <h3>Tax Year 2026</h3>
        <p>
          Tax Year 2026 runs from July 1, 2025 to June 30, 2026. The slab rates
          used in this calculator are as per the Finance Act 2025. Rates may be
          updated in subsequent Finance Acts.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
