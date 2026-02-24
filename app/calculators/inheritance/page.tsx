"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateInheritance, getInheritanceBreakdown } from "@/lib/calculators/inheritance";
import { HEIR_CONFIGS, HEIR_GROUP_LABELS } from "@/lib/calculators/data/inheritance-rules";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  InheritanceSchool,
  InheritanceResult,
  HeirType,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "school", label: "School" },
  { id: "heirs", label: "Heirs" },
  { id: "estate", label: "Estate" },
  { id: "review", label: "Review" },
];

const HEIR_COLORS = [
  "#059669", "#0891b2", "#7c3aed", "#db2777", "#ea580c",
  "#ca8a04", "#4f46e5", "#16a34a", "#dc2626", "#2563eb",
  "#9333ea", "#c026d3", "#0d9488", "#d97706", "#64748b",
  "#be123c", "#15803d",
];

export default function InheritanceCalculatorPage() {
  const [school, setSchool] = useState<InheritanceSchool>("hanafi");
  const [deceasedGender, setDeceasedGender] = useState<"male" | "female">("male");
  const [selectedHeirs, setSelectedHeirs] = useState<Partial<Record<HeirType, number>>>({});
  const [estateValue, setEstateValue] = useState(0);
  const [debtsValue, setDebtsValue] = useState(0);
  const [funeralExpenses, setFuneralExpenses] = useState(0);
  const [wasiyyah, setWasiyyah] = useState(0);
  const [result, setResult] = useState<InheritanceResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const netEstate = Math.max(0, estateValue - debtsValue - funeralExpenses - wasiyyah);
  const wasiyyahLimit = Math.round((estateValue - debtsValue - funeralExpenses) / 3);

  const applicableHeirs = useMemo(() => {
    return HEIR_CONFIGS.filter(
      (h) => h.applicableDeceasedGender === "both" || h.applicableDeceasedGender === deceasedGender
    );
  }, [deceasedGender]);

  const heirGroups = useMemo(() => {
    const groups: Record<string, typeof HEIR_CONFIGS> = {};
    for (const h of applicableHeirs) {
      if (!groups[h.group]) groups[h.group] = [];
      groups[h.group].push(h);
    }
    return groups;
  }, [applicableHeirs]);

  const toggleHeir = (type: HeirType, checked: boolean) => {
    setSelectedHeirs((prev) => {
      const next = { ...prev };
      if (checked) {
        next[type] = 1;
      } else {
        delete next[type];
      }
      return next;
    });
  };

  const setHeirCount = (type: HeirType, count: number) => {
    setSelectedHeirs((prev) => ({ ...prev, [type]: Math.max(1, count) }));
  };

  const selectedHeirCount = Object.keys(selectedHeirs).length;

  const handleCalculate = () => {
    setResult(
      calculateInheritance({
        school,
        deceasedGender,
        heirs: selectedHeirs,
        estateValue,
        debts: debtsValue,
        funeralExpenses,
        wasiyyah,
      })
    );
  };

  const handleReset = () => {
    setSchool("hanafi");
    setDeceasedGender("male");
    setSelectedHeirs({});
    setEstateValue(0);
    setDebtsValue(0);
    setFuneralExpenses(0);
    setWasiyyah(0);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getInheritanceBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Inheritance Calculator",
        date: new Date(),
        inputs: [
          { label: "School", value: result.school === "hanafi" ? "Hanafi (Sunni)" : "Shia (Ja'fari)" },
          { label: "Deceased Gender", value: deceasedGender === "male" ? "Male" : "Female" },
          { label: "Gross Estate", value: formatPKR(result.grossEstate) },
          { label: "Debts", value: formatPKR(result.debts) },
          { label: "Funeral Expenses", value: formatPKR(result.funeralExpenses) },
          { label: "Wasiyyah", value: formatPKR(result.wasiyyah) },
          { label: "Heirs", value: result.shares.map((s) => `${s.heir} (${s.count})`).join(", ") },
        ],
        results: [
          { label: "Net Estate", value: formatPKR(result.netEstate) },
          ...result.shares.map((s) => ({
            label: `${s.heir} (×${s.count})`,
            value: `${formatPKR(s.totalAmount)} — ${s.sharePercentage.toFixed(1)}%`,
          })),
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculator provides estimates based on classical Islamic inheritance rules. Inheritance cases can involve complex legal principles that vary based on specific circumstances and school of thought. Always consult a qualified Islamic scholar or lawyer.",
      }
    : null;

  // Pie chart gradient
  const pieGradient = useMemo(() => {
    if (!result || result.shares.length === 0) return "";
    let cumulative = 0;
    const segments: string[] = [];
    result.shares.forEach((share, i) => {
      const color = HEIR_COLORS[i % HEIR_COLORS.length];
      const start = cumulative;
      const end = cumulative + share.sharePercentage;
      segments.push(`${color} ${start.toFixed(1)}% ${end.toFixed(1)}%`);
      cumulative = end;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Core Calculator
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Inheritance Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Calculate Islamic inheritance shares under Hanafi and Shia Ja&apos;fari
          schools with automatic Awl/Radd adjustments and blocking rules.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={(step: number) => {
          if (step === 1) return selectedHeirCount > 0;
          if (step === 2) return estateValue > 0;
          return true;
        }}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Net Distributable Estate"
                  value={formatPKR(result.netEstate)}
                  subtitle={`${result.school === "hanafi" ? "Hanafi" : "Shia (Ja'fari)"} School`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Stats grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Gross Estate</p>
                      <p className="font-semibold">{formatPKR(result.grossEstate)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Deductions</p>
                      <p className="font-semibold">{formatPKR(result.debts + result.funeralExpenses)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Wasiyyah</p>
                      <p className="font-semibold">{formatPKR(result.wasiyyah)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Heirs</p>
                      <p className="font-semibold">{result.shares.length}</p>
                    </div>
                  </div>

                  {/* Pie chart */}
                  {result.shares.length > 0 && (
                    <div className="mt-6 flex flex-col items-center gap-4">
                      <div
                        className="w-40 h-40 rounded-full border-4 border-white shadow-md"
                        style={{ background: pieGradient }}
                      />
                      <div className="flex flex-wrap justify-center gap-2">
                        {result.shares.map((share, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: HEIR_COLORS[i % HEIR_COLORS.length] }}
                            />
                            <span>{share.heir} ({share.sharePercentage.toFixed(1)}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share table */}
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-3 font-medium text-gray-600">Heir</th>
                          <th className="text-right p-3 font-medium text-gray-600">Count</th>
                          <th className="text-right p-3 font-medium text-gray-600">%</th>
                          <th className="text-right p-3 font-medium text-gray-600">Total</th>
                          <th className="text-right p-3 font-medium text-gray-600">Per Person</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {result.shares.map((share, i) => (
                          <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50/50"}>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: HEIR_COLORS[i % HEIR_COLORS.length] }}
                                />
                                <span className="font-medium">{share.heir}</span>
                              </div>
                            </td>
                            <td className="p-3 text-right">{share.count}</td>
                            <td className="p-3 text-right">{share.sharePercentage.toFixed(1)}%</td>
                            <td className="p-3 text-right font-medium">{formatPKR(share.totalAmount)}</td>
                            <td className="p-3 text-right text-gray-600">{formatPKR(share.perPersonAmount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Awl/Radd notes */}
                  {result.hasAwl && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-medium text-amber-800">Awl (Proportional Reduction) Applied</p>
                      <p className="text-sm text-amber-700 mt-1">{result.adjustmentNote}</p>
                    </div>
                  )}
                  {result.hasRadd && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm font-medium text-amber-800">Radd (Surplus Return) Applied</p>
                      <p className="text-sm text-amber-700 mt-1">{result.adjustmentNote}</p>
                    </div>
                  )}

                  {/* Blocked heirs */}
                  {result.blockedHeirs.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Blocked (Excluded) Heirs</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {result.blockedHeirs.map((b, i) => (
                          <li key={i}>
                            <span className="font-medium">{b.heir}</span> — blocked by {b.blockedBy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Muslim Personal Law (Shariat) Application Act 1962; Surah An-Nisa 4:11-12, 4:176."
                  />
                )}
              </div>
            );
          }

          // Step 0: School
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Select School of Islamic Law</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Inheritance rules differ between Hanafi and Shia schools
                  </p>
                </div>

                <RadioGroup
                  value={school}
                  onValueChange={(v) => setSchool(v as InheritanceSchool)}
                  className="grid gap-3"
                >
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      school === "hanafi"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="hanafi" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Hanafi (Sunni)</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Majority school in Pakistan. Grandfather blocks siblings. Awl applies when shares exceed estate. Radd excludes spouse.
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      school === "shia"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="shia" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">Shia (Ja&apos;fari)</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Class-based system. No Awl — daughters/sisters reduced instead. Radd includes spouse. Grandfather does not block siblings.
                      </p>
                    </div>
                  </label>
                </RadioGroup>
              </div>
            );
          }

          // Step 1: Deceased & Heirs
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Deceased & Surviving Heirs</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the gender of the deceased and tick all surviving heirs
                  </p>
                </div>

                {/* Deceased gender */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Gender of Deceased</Label>
                  <RadioGroup
                    value={deceasedGender}
                    onValueChange={(v) => {
                      setDeceasedGender(v as "male" | "female");
                      setSelectedHeirs({});
                    }}
                    className="grid grid-cols-2 gap-2"
                  >
                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                      deceasedGender === "male" ? "border-[#059669] bg-[#059669]/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <RadioGroupItem value="male" />
                      <span className="font-medium">Male</span>
                    </label>
                    <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                      deceasedGender === "female" ? "border-[#059669] bg-[#059669]/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                      <RadioGroupItem value="female" />
                      <span className="font-medium">Female</span>
                    </label>
                  </RadioGroup>
                </div>

                {/* Heir groups */}
                {Object.entries(heirGroups).map(([group, configs]) => (
                  <div key={group} className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      {HEIR_GROUP_LABELS[group] ?? group}
                    </Label>
                    <div className="space-y-1">
                      {configs.map((config) => {
                        const isSelected = config.type in selectedHeirs;
                        return (
                          <div
                            key={config.type}
                            className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                              isSelected ? "border-[#059669]/30 bg-[#059669]/5" : "border-gray-200"
                            }`}
                          >
                            <Checkbox
                              id={config.type}
                              checked={isSelected}
                              onCheckedChange={(checked) => toggleHeir(config.type, checked === true)}
                            />
                            <label htmlFor={config.type} className="flex-1 text-sm font-medium text-gray-900 cursor-pointer">
                              {config.label}
                            </label>
                            {isSelected && config.allowMultiple && (
                              <Input
                                type="number"
                                min={1}
                                max={config.maxCount}
                                value={selectedHeirs[config.type] ?? 1}
                                onChange={(e) => setHeirCount(config.type, parseInt(e.target.value) || 1)}
                                className="w-16 h-8 text-center text-sm"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {selectedHeirCount === 0 && (
                  <p className="text-sm text-amber-600">Select at least one surviving heir to proceed.</p>
                )}
              </div>
            );
          }

          // Step 2: Estate
          if (currentStep === 2) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Estate Details</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the estate value and any deductions
                  </p>
                </div>

                <CurrencyInput
                  label="Gross Estate Value"
                  value={estateValue}
                  onChange={(v) => setEstateValue(v)}
                />
                <CurrencyInput
                  label="Outstanding Debts"
                  value={debtsValue}
                  onChange={(v) => setDebtsValue(v)}
                />
                <CurrencyInput
                  label="Funeral Expenses"
                  value={funeralExpenses}
                  onChange={(v) => setFuneralExpenses(v)}
                />
                <CurrencyInput
                  label="Wasiyyah (Bequest)"
                  value={wasiyyah}
                  onChange={(v) => setWasiyyah(v)}
                />

                {wasiyyah > wasiyyahLimit && wasiyyahLimit > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                    <strong>Warning:</strong> Wasiyyah exceeds 1/3 of net estate (max {formatPKR(wasiyyahLimit)}).
                    Under Islamic law, wasiyyah cannot exceed one-third without consent of all heirs.
                  </div>
                )}

                {estateValue > 0 && (
                  <div className="p-4 bg-[#059669]/5 rounded-lg border border-[#059669]/20 text-center">
                    <p className="text-sm text-gray-600">Net Distributable Estate</p>
                    <p className="text-2xl font-bold text-[#059669]">{formatPKR(netEstate)}</p>
                  </div>
                )}
              </div>
            );
          }

          // Step 3: Review
          if (currentStep === 3) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm all details before calculating inheritance shares
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">School</span>
                    <span className="text-sm font-semibold">
                      {school === "hanafi" ? "Hanafi (Sunni)" : "Shia (Ja'fari)"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Deceased</span>
                    <span className="text-sm font-semibold">
                      {deceasedGender === "male" ? "Male" : "Female"}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Surviving Heirs</span>
                    <span className="text-sm font-semibold">
                      {Object.entries(selectedHeirs)
                        .map(([type, count]) => {
                          const config = HEIR_CONFIGS.find((c) => c.type === type);
                          return count > 1 ? `${config?.label} (${count})` : config?.label;
                        })
                        .join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Gross Estate</span>
                    <span className="text-sm font-semibold">{formatPKR(estateValue)}</span>
                  </div>
                  {debtsValue > 0 && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Debts</span>
                      <span className="text-sm font-semibold text-red-600">−{formatPKR(debtsValue)}</span>
                    </div>
                  )}
                  {funeralExpenses > 0 && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Funeral Expenses</span>
                      <span className="text-sm font-semibold text-red-600">−{formatPKR(funeralExpenses)}</span>
                    </div>
                  )}
                  {wasiyyah > 0 && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Wasiyyah</span>
                      <span className="text-sm font-semibold text-red-600">−{formatPKR(wasiyyah)}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3 bg-gray-50">
                    <span className="text-sm text-gray-600 font-medium">Net Estate</span>
                    <span className="text-sm font-bold text-[#059669]">{formatPKR(netEstate)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute inheritance shares
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Islamic Inheritance Law"
        sources={[
          { label: "Primary Legislation", reference: "Muslim Personal Law (Shariat) Application Act 1962" },
          { label: "Quran", reference: "Surah An-Nisa (4:11-12, 4:176)" },
          { label: "Hanafi Jurisprudence", reference: "Al-Sirajiyyah (Sharh al-Sirajiyyah)" },
        ]}
      >
        <h3>Overview</h3>
        <p>
          Islamic inheritance law (Ilm al-Faraid) is a detailed system of estate
          distribution prescribed in the Quran and Sunnah. In Pakistan, Muslim
          inheritance is governed by the Muslim Personal Law (Shariat) Application
          Act 1962, which mandates that inheritance among Muslims shall be governed
          by Islamic law.
        </p>
        <h3>Key Principles</h3>
        <ul>
          <li>The estate is first used to pay funeral expenses, debts, and bequests (wasiyyah, max 1/3)</li>
          <li>Fixed share heirs (dhawu al-furud) receive their prescribed portions first</li>
          <li>Residuary heirs (asabat) receive what remains after fixed shares</li>
          <li>If total shares exceed the estate (Awl), shares are proportionally reduced</li>
          <li>If shares don&apos;t exhaust the estate (Radd), the surplus is redistributed</li>
        </ul>
        <h3>Hanafi vs. Shia Differences</h3>
        <p>
          The Hanafi school follows the Sunni system with specific rules for agnatic heirs.
          Key difference: grandfather completely blocks siblings. Radd (surplus) is returned
          to all fixed-share holders except the spouse. Awl (proportional reduction) applies
          when total fixed shares exceed the estate.
        </p>
        <p>
          The Shia Ja&apos;fari school uses a class-based system where heirs are divided into
          three classes. A nearer class completely excludes a remoter class. Crucially,
          there is no Awl — instead, the reduction falls on daughters/sisters. Radd
          includes the spouse, unlike in the Hanafi school.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
