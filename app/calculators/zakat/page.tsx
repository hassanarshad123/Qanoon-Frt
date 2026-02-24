"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateZakat, getZakatBreakdown } from "@/lib/calculators/zakat";
import { formatPKR } from "@/lib/calculators/constants";
import type { ZakatAssets, ZakatDeductions, ZakatResult, WizardStep, PrintReportData } from "@/lib/calculators/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

const STEPS: WizardStep[] = [
  { id: "assets", label: "Assets" },
  { id: "deductions", label: "Deductions" },
  { id: "review", label: "Review" },
];

const PIE_COLORS = [
  "#059669", "#0d9488", "#0891b2", "#0284c7",
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
];

const DEFAULT_ASSETS: ZakatAssets = {
  cashOnHand: 0,
  bankBalances: 0,
  goldValue: 0,
  silverValue: 0,
  investments: 0,
  businessInventory: 0,
  receivables: 0,
  otherAssets: 0,
};

const DEFAULT_DEDUCTIONS: ZakatDeductions = {
  personalDebts: 0,
  businessLiabilities: 0,
  dueExpenses: 0,
};

export default function ZakatCalculatorPage() {
  const [assets, setAssets] = useState<ZakatAssets>({ ...DEFAULT_ASSETS });
  const [deductions, setDeductions] = useState<ZakatDeductions>({ ...DEFAULT_DEDUCTIONS });
  const [result, setResult] = useState<ZakatResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const updateAsset = (key: keyof ZakatAssets, value: number) => {
    setAssets((prev) => ({ ...prev, [key]: value }));
  };

  const updateDeduction = (key: keyof ZakatDeductions, value: number) => {
    setDeductions((prev) => ({ ...prev, [key]: value }));
  };

  const totalAssets = Object.values(assets).reduce((sum, v) => sum + v, 0);
  const totalDeductions = Object.values(deductions).reduce((sum, v) => sum + v, 0);

  const handleCalculate = () => {
    setResult(calculateZakat({ assets, deductions }));
  };

  const handleReset = () => {
    setAssets({ ...DEFAULT_ASSETS });
    setDeductions({ ...DEFAULT_DEDUCTIONS });
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getZakatBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Zakat Calculator",
        date: new Date(),
        inputs: [
          ...result.assetBreakdown.map((a) => ({
            label: a.label,
            value: formatPKR(a.amount),
          })),
          { label: "Total Assets", value: formatPKR(result.totalAssets) },
          { label: "Total Deductions", value: formatPKR(result.totalDeductions) },
        ],
        results: [
          { label: "Net Worth", value: formatPKR(result.netWorth) },
          { label: "Nisab Threshold", value: formatPKR(result.nisabThreshold) },
          { label: "Above Nisab", value: result.isAboveNisab ? "Yes" : "No" },
          { label: "Zakat (2.5%)", value: formatPKR(result.zakatAmount) },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculator provides an estimate based on standard Zakat rules. Nisab rates are approximate. Consult a qualified Islamic scholar for specific rulings on your assets.",
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
          Zakat Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Calculate your annual Zakat obligation at 2.5% with nisab comparison and
          asset categorization.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={true}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Zakat Payable"
                  value={formatPKR(result.zakatAmount)}
                  subtitle={
                    result.isAboveNisab
                      ? "2.5% of your net zakatable wealth"
                      : "Your wealth is below the nisab threshold"
                  }
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  <div className="flex justify-center mt-2">
                    <Badge
                      className={
                        result.isAboveNisab
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {result.isAboveNisab ? "Above Nisab" : "Below Nisab"}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Total Assets</p>
                      <p className="font-semibold">{formatPKR(result.totalAssets)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Deductions</p>
                      <p className="font-semibold">{formatPKR(result.totalDeductions)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Net Worth</p>
                      <p className="font-semibold">{formatPKR(result.netWorth)}</p>
                    </div>
                  </div>

                  {/* Pie chart */}
                  {result.assetBreakdown.length > 0 && (
                    <div className="mt-6 h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result.assetBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="amount"
                            nameKey="label"
                          >
                            {result.assetBreakdown.map((_, idx) => (
                              <Cell
                                key={idx}
                                fill={PIE_COLORS[idx % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value: number) => formatPKR(value)}
                          />
                          <Legend
                            formatter={(value) => (
                              <span className="text-xs text-gray-600">{value}</span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Zakat & Ushr Ordinance 1980; Standard Hanafi jurisprudence on nisab and zakatable assets."
                  />
                )}
              </div>
            );
          }

          // Step 0: Assets
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Enter Your Zakatable Assets</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Include all assets held for one lunar year (hawl)
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrencyInput label="Cash on Hand" value={assets.cashOnHand} onChange={(v) => updateAsset("cashOnHand", v)} />
                  <CurrencyInput label="Bank Balances" value={assets.bankBalances} onChange={(v) => updateAsset("bankBalances", v)} />
                  <CurrencyInput label="Gold (market value)" value={assets.goldValue} onChange={(v) => updateAsset("goldValue", v)} />
                  <CurrencyInput label="Silver (market value)" value={assets.silverValue} onChange={(v) => updateAsset("silverValue", v)} />
                  <CurrencyInput label="Investments (stocks, bonds, mutual funds)" value={assets.investments} onChange={(v) => updateAsset("investments", v)} />
                  <CurrencyInput label="Business Inventory" value={assets.businessInventory} onChange={(v) => updateAsset("businessInventory", v)} />
                  <CurrencyInput label="Receivables (money owed to you)" value={assets.receivables} onChange={(v) => updateAsset("receivables", v)} />
                  <CurrencyInput label="Other Zakatable Assets" value={assets.otherAssets} onChange={(v) => updateAsset("otherAssets", v)} />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">Total Assets: </span>
                  <span className="font-semibold">{formatPKR(totalAssets)}</span>
                </div>
              </div>
            );
          }

          // Step 1: Deductions
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Deduct Liabilities</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Deduct any debts or liabilities due at the time of Zakat calculation
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrencyInput label="Personal Debts" value={deductions.personalDebts} onChange={(v) => updateDeduction("personalDebts", v)} />
                  <CurrencyInput label="Business Liabilities" value={deductions.businessLiabilities} onChange={(v) => updateDeduction("businessLiabilities", v)} />
                  <CurrencyInput label="Due Expenses" value={deductions.dueExpenses} onChange={(v) => updateDeduction("dueExpenses", v)} />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">Total Deductions: </span>
                  <span className="font-semibold">{formatPKR(totalDeductions)}</span>
                </div>
              </div>
            );
          }

          // Step 2: Review
          if (currentStep === 2) {
            const netWorth = Math.max(0, totalAssets - totalDeductions);
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating Zakat
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Total Assets</span>
                    <span className="text-sm font-semibold">{formatPKR(totalAssets)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Total Deductions</span>
                    <span className="text-sm font-semibold text-red-600">
                      - {formatPKR(totalDeductions)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">Net Zakatable Wealth</span>
                    <span className="text-sm font-bold">{formatPKR(netWorth)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compare against nisab and compute Zakat at 2.5%
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Zakat in Pakistan"
        sources={[
          { label: "Primary Legislation", reference: "Zakat & Ushr Ordinance 1980" },
          { label: "Islamic Jurisprudence", reference: "Standard Hanafi fiqh on Zakat" },
          { label: "Nisab", reference: "Based on silver standard (52.5 tola of silver)" },
        ]}
      >
        <h3>What is Zakat?</h3>
        <p>
          Zakat is one of the five pillars of Islam — a mandatory charitable contribution
          calculated at 2.5% of a Muslim&apos;s total zakatable wealth that exceeds the
          nisab threshold, held for one complete lunar year (hawl).
        </p>

        <h3>What is Nisab?</h3>
        <p>
          Nisab is the minimum amount of wealth a Muslim must possess before Zakat becomes
          obligatory. It is calculated based on the value of either 7.5 tola (87.48g) of
          gold or 52.5 tola (612.36g) of silver. The standard practice in Hanafi
          jurisprudence is to use the lower of the two values (typically silver) to ensure
          more people qualify to pay Zakat, maximizing benefit to the poor.
        </p>

        <h3>Zakatable Assets</h3>
        <ul>
          <li>Cash and bank balances</li>
          <li>Gold and silver (jewelry above personal use allowance in some schools)</li>
          <li>Stocks, bonds, and investment accounts</li>
          <li>Business inventory and trade goods</li>
          <li>Receivables (money owed to you that is expected to be paid)</li>
          <li>Rental income (if saved)</li>
        </ul>

        <h3>Non-Zakatable Assets</h3>
        <ul>
          <li>Primary residence</li>
          <li>Personal clothing and household items</li>
          <li>Personal vehicle</li>
          <li>Tools of trade (if used, not for sale)</li>
          <li>Fixed assets not held for trade</li>
        </ul>

        <h3>Zakat & Ushr Ordinance 1980</h3>
        <p>
          In Pakistan, the Zakat & Ushr Ordinance 1980 established a centralized Zakat
          collection system. The government deducts Zakat at source from savings accounts,
          fixed deposits, and certain other financial instruments on the 1st of Ramadan
          each year. Muslims can also declare exemption by filing a CZ-50 form if they
          follow a school of thought that does not mandate government collection (e.g.,
          Shia Ja&apos;fari, Ahl-e-Hadith).
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
