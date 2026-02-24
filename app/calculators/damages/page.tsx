"use client";

import { useState, useMemo } from "react";
import { Scale } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/cn";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { NumberInput } from "@/components/calculators/shared/number-input";
import { calculateDamages, getDamagesBreakdown } from "@/lib/calculators/damages";
import {
  DAMAGES_CASE_CONFIGS,
  SEVERITY_LABELS,
  CONDUCT_MULTIPLIERS,
} from "@/lib/calculators/data/damages-multipliers";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  DamagesInput,
  DamagesResult,
  DamagesCaseType,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

// ---------------------------------------------------------------------------
// Wizard Steps
// ---------------------------------------------------------------------------

const STEPS: WizardStep[] = [
  { id: "case-type", label: "Case Type" },
  { id: "base-amounts", label: "Base Amounts" },
  { id: "factors", label: "Factors" },
  { id: "review", label: "Review" },
];

// ---------------------------------------------------------------------------
// Case type descriptions shown when selecting
// ---------------------------------------------------------------------------

const CASE_TYPE_DESCRIPTIONS: Record<DamagesCaseType, string> = {
  "personal-injury":
    "Physical or psychological harm caused by another party's actions or negligence. Includes medical costs, lost wages, and pain & suffering.",
  "property-damage":
    "Destruction or harm to real or personal property. Covers repair/replacement costs, loss of use, and diminished value.",
  "contract-breach":
    "Failure to perform contractual obligations. Covers direct losses, consequential damages, and lost profits.",
  defamation:
    "False statements harming reputation. Covers provable financial losses and general reputational damage.",
  "wrongful-termination":
    "Unlawful dismissal from employment. Covers lost salary, notice pay, and unpaid benefits.",
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function DamagesCalculatorPage() {
  // --- Form state ---
  const [caseType, setCaseType] = useState<DamagesCaseType | null>(null);
  const [baseAmounts, setBaseAmounts] = useState<Record<string, number>>({});
  const [severity, setSeverity] = useState<number>(3);
  const [defendantConduct, setDefendantConduct] = useState<
    DamagesInput["defendantConduct"]
  >("normal");
  const [contributoryNegligence, setContributoryNegligence] = useState(0);
  const [harmDuration, setHarmDuration] = useState<DamagesInput["harmDuration"]>("temporary");

  // --- Result state ---
  const [result, setResult] = useState<DamagesResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // --- Derived ---
  const selectedConfig = useMemo(
    () => DAMAGES_CASE_CONFIGS.find((c) => c.type === caseType),
    [caseType]
  );

  const totalBaseAmounts = useMemo(
    () => Object.values(baseAmounts).reduce((sum, v) => sum + (v || 0), 0),
    [baseAmounts]
  );

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const updateBaseAmount = (key: string, value: number) => {
    setBaseAmounts((prev) => ({ ...prev, [key]: value }));
  };

  const handleCaseTypeChange = (value: string) => {
    setCaseType(value as DamagesCaseType);
    // Reset base amounts when case type changes
    setBaseAmounts({});
  };

  const canProceedStep = (step: number): boolean => {
    if (step === 0) return caseType !== null;
    if (step === 1) return totalBaseAmounts > 0;
    if (step === 2) return true; // factors have defaults
    if (step === 3) return true; // review step
    return true;
  };

  const handleCalculate = () => {
    if (!caseType) return;
    const input: DamagesInput = {
      caseType,
      baseAmounts,
      severity,
      defendantConduct,
      contributoryNegligence,
      harmDuration,
    };
    setResult(calculateDamages(input));
  };

  const handleReset = () => {
    setCaseType(null);
    setBaseAmounts({});
    setSeverity(3);
    setDefendantConduct("normal");
    setContributoryNegligence(0);
    setHarmDuration("temporary");
    setResult(null);
    setShowBreakdown(false);
  };

  // ---------------------------------------------------------------------------
  // Breakdown & Print data
  // ---------------------------------------------------------------------------

  const breakdownSteps = result ? getDamagesBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Damages Calculator",
        date: new Date(),
        inputs: [
          {
            label: "Case Type",
            value:
              DAMAGES_CASE_CONFIGS.find((c) => c.type === result.caseType)
                ?.label ?? result.caseType,
          },
          ...Object.entries(baseAmounts)
            .filter(([, v]) => v > 0)
            .map(([key, v]) => ({
              label:
                selectedConfig?.baseFields.find((f) => f.key === key)?.label ??
                key,
              value: formatPKR(v),
            })),
          { label: "Severity", value: `${severity} - ${SEVERITY_LABELS[severity]}` },
          {
            label: "Defendant Conduct",
            value: CONDUCT_MULTIPLIERS[defendantConduct]?.label ?? defendantConduct,
          },
          {
            label: "Contributory Negligence",
            value: `${contributoryNegligence}%`,
          },
          {
            label: "Harm Duration",
            value:
              harmDuration === "temporary"
                ? "Temporary"
                : harmDuration === "permanent"
                  ? "Permanent"
                  : "Ongoing",
          },
        ],
        results: [
          {
            label: "Conservative Estimate",
            value: formatPKR(result.conservativeEstimate),
          },
          {
            label: "Moderate Estimate",
            value: formatPKR(result.moderateEstimate),
          },
          {
            label: "Aggressive Estimate",
            value: formatPKR(result.aggressiveEstimate),
          },
          {
            label: "Special Damages",
            value: formatPKR(result.specialDamages),
          },
          {
            label: "General Damages (moderate)",
            value: formatPKR(result.generalDamages),
          },
        ],
        breakdown: breakdownSteps,
        disclaimer: result.disclaimer,
      }
    : null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Civil &amp; Family
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Damages Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Estimate compensation ranges for personal injury, property damage,
          contract breach, defamation, and wrongful termination under Pakistani
          law.
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
          // -----------------------------------------------------------------
          // Results View (step === -1)
          // -----------------------------------------------------------------
          if (currentStep === -1 && result) {
            const caseLabel =
              DAMAGES_CASE_CONFIGS.find((c) => c.type === result.caseType)
                ?.label ?? result.caseType;

            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Estimated Damages"
                  value={formatPKR(result.moderateEstimate)}
                  subtitle={`Moderate estimate for ${caseLabel}`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Three-tier estimate display */}
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Conservative</p>
                      <p className="font-semibold text-gray-700">
                        {formatPKR(result.conservativeEstimate)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-[#059669]/10 rounded-lg border border-[#059669]/20">
                      <p className="text-[#059669] font-medium">Moderate</p>
                      <p className="font-bold text-[#059669] text-lg">
                        {formatPKR(result.moderateEstimate)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Aggressive</p>
                      <p className="font-semibold text-gray-700">
                        {formatPKR(result.aggressiveEstimate)}
                      </p>
                    </div>
                  </div>

                  {/* Breakdown stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Special Damages</p>
                      <p className="font-semibold">
                        {formatPKR(result.specialDamages)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">General Damages (mod.)</p>
                      <p className="font-semibold">
                        {formatPKR(result.generalDamages)}
                      </p>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {result.disclaimer}
                    </p>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Civil Procedure Code 1908; Specific Relief Act 1877; Pakistan Penal Code (for punitive damages); various High Court and Supreme Court precedents on quantum of damages."
                  />
                )}
              </div>
            );
          }

          // -----------------------------------------------------------------
          // Step 0: Case Type Selection
          // -----------------------------------------------------------------
          if (currentStep === 0) {
            return (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Select Case Type
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the type of damages claim to estimate compensation
                  </p>
                </div>
                <RadioGroup
                  value={caseType ?? ""}
                  onValueChange={handleCaseTypeChange}
                  className="space-y-3"
                >
                  {DAMAGES_CASE_CONFIGS.map((config) => {
                    const isSelected = caseType === config.type;
                    return (
                      <label
                        key={config.type}
                        htmlFor={`case-${config.type}`}
                        className={cn(
                          "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                          isSelected
                            ? "border-[#059669] bg-[#059669]/5"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <RadioGroupItem
                          value={config.type}
                          id={`case-${config.type}`}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isSelected ? "text-[#059669]" : "text-gray-900"
                            )}
                          >
                            {config.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {CASE_TYPE_DESCRIPTIONS[config.type as DamagesCaseType]}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          }

          // -----------------------------------------------------------------
          // Step 1: Base Amounts (dynamic per case type)
          // -----------------------------------------------------------------
          if (currentStep === 1) {
            if (!selectedConfig) {
              return (
                <p className="text-sm text-gray-500 text-center py-8">
                  Please go back and select a case type first.
                </p>
              );
            }

            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">
                    Enter Base Amounts
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide the provable financial losses for your{" "}
                    {selectedConfig.label.toLowerCase()} claim
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedConfig.baseFields.map((field) => (
                    <div key={field.key} className="space-y-1">
                      <CurrencyInput
                        label={field.label}
                        value={baseAmounts[field.key] || 0}
                        onChange={(v) => updateBaseAmount(field.key, v)}
                        placeholder="0"
                      />
                      <p className="text-xs text-gray-400 pl-1">
                        {field.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">
                    Total Special Damages:{" "}
                  </span>
                  <span className="font-semibold">
                    {formatPKR(totalBaseAmounts)}
                  </span>
                </div>
              </div>
            );
          }

          // -----------------------------------------------------------------
          // Step 2: Factors
          // -----------------------------------------------------------------
          if (currentStep === 2) {
            return (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">
                    Adjustment Factors
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    These factors adjust the general damages multiplier applied
                    to your special damages
                  </p>
                </div>

                {/* Severity */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Severity of Harm
                  </Label>
                  <RadioGroup
                    value={String(severity)}
                    onValueChange={(v) => setSeverity(parseInt(v))}
                    className="grid grid-cols-5 gap-2"
                  >
                    {[1, 2, 3, 4, 5].map((level) => {
                      const isSelected = severity === level;
                      return (
                        <label
                          key={level}
                          htmlFor={`severity-${level}`}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer transition-colors text-center",
                            isSelected
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <RadioGroupItem
                            value={String(level)}
                            id={`severity-${level}`}
                          />
                          <span
                            className={cn(
                              "text-xs font-medium",
                              isSelected
                                ? "text-[#059669]"
                                : "text-gray-700"
                            )}
                          >
                            {level}
                          </span>
                          <span className="text-[10px] text-gray-500 leading-tight">
                            {SEVERITY_LABELS[level]}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Defendant Conduct */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Defendant Conduct
                  </Label>
                  <RadioGroup
                    value={defendantConduct}
                    onValueChange={(v) =>
                      setDefendantConduct(
                        v as DamagesInput["defendantConduct"]
                      )
                    }
                    className="grid grid-cols-2 gap-2"
                  >
                    {Object.entries(CONDUCT_MULTIPLIERS).map(
                      ([key, config]) => {
                        const isSelected = defendantConduct === key;
                        return (
                          <label
                            key={key}
                            htmlFor={`conduct-${key}`}
                            className={cn(
                              "flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors",
                              isSelected
                                ? "border-[#059669] bg-[#059669]/5"
                                : "border-gray-200 hover:bg-gray-50"
                            )}
                          >
                            <RadioGroupItem
                              value={key}
                              id={`conduct-${key}`}
                            />
                            <div>
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  isSelected
                                    ? "text-[#059669]"
                                    : "text-gray-700"
                                )}
                              >
                                {config.label}
                              </span>
                              <p className="text-[10px] text-gray-400">
                                {config.multiplier}x multiplier
                              </p>
                            </div>
                          </label>
                        );
                      }
                    )}
                  </RadioGroup>
                </div>

                {/* Contributory Negligence */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Contributory Negligence
                  </Label>
                  <p className="text-xs text-gray-500">
                    Percentage by which the plaintiff contributed to their own
                    harm (0% = no fault, 100% = entirely at fault)
                  </p>
                  <NumberInput
                    value={contributoryNegligence}
                    onChange={setContributoryNegligence}
                    min={0}
                    max={100}
                    suffix="%"
                    placeholder="0"
                  />
                </div>

                {/* Harm Duration */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Duration of Harm
                  </Label>
                  <RadioGroup
                    value={harmDuration}
                    onValueChange={(v) =>
                      setHarmDuration(v as DamagesInput["harmDuration"])
                    }
                    className="grid grid-cols-3 gap-2"
                  >
                    {(
                      [
                        {
                          value: "temporary",
                          label: "Temporary",
                          desc: "Harm expected to resolve",
                        },
                        {
                          value: "permanent",
                          label: "Permanent",
                          desc: "Irreversible harm (1.5x)",
                        },
                        {
                          value: "ongoing",
                          label: "Ongoing",
                          desc: "Continuing harm (1.25x)",
                        },
                      ] as const
                    ).map((option) => {
                      const isSelected = harmDuration === option.value;
                      return (
                        <label
                          key={option.value}
                          htmlFor={`duration-${option.value}`}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-lg border cursor-pointer transition-colors text-center",
                            isSelected
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`duration-${option.value}`}
                          />
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isSelected
                                ? "text-[#059669]"
                                : "text-gray-700"
                            )}
                          >
                            {option.label}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {option.desc}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            );
          }

          // -----------------------------------------------------------------
          // Step 3: Review
          // -----------------------------------------------------------------
          if (currentStep === 3) {
            const caseLabel = selectedConfig?.label ?? "Unknown";
            const conductLabel =
              CONDUCT_MULTIPLIERS[defendantConduct]?.label ?? defendantConduct;
            const durationLabel =
              harmDuration === "temporary"
                ? "Temporary"
                : harmDuration === "permanent"
                  ? "Permanent"
                  : "Ongoing";

            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">
                    Review &amp; Calculate
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating estimated damages
                  </p>
                </div>

                <div className="border rounded-lg divide-y">
                  {/* Case Type */}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Case Type</span>
                    <span className="text-sm font-semibold">{caseLabel}</span>
                  </div>

                  {/* Base Amounts */}
                  {selectedConfig?.baseFields
                    .filter((f) => (baseAmounts[f.key] || 0) > 0)
                    .map((field) => (
                      <div
                        key={field.key}
                        className="flex justify-between p-3"
                      >
                        <span className="text-sm text-gray-600">
                          {field.label}
                        </span>
                        <span className="text-sm font-semibold">
                          {formatPKR(baseAmounts[field.key] || 0)}
                        </span>
                      </div>
                    ))}

                  {/* Total special damages */}
                  <div className="flex justify-between p-3 bg-gray-50">
                    <span className="text-sm font-medium text-gray-900">
                      Total Special Damages
                    </span>
                    <span className="text-sm font-bold">
                      {formatPKR(totalBaseAmounts)}
                    </span>
                  </div>

                  {/* Factors */}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Severity</span>
                    <span className="text-sm font-semibold">
                      {severity} - {SEVERITY_LABELS[severity]}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">
                      Defendant Conduct
                    </span>
                    <span className="text-sm font-semibold">
                      {conductLabel}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">
                      Contributory Negligence
                    </span>
                    <span className="text-sm font-semibold">
                      {contributoryNegligence}%
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">
                      Duration of Harm
                    </span>
                    <span className="text-sm font-semibold">
                      {durationLabel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to estimate the range of
                  damages based on your inputs
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Damages Under Pakistani Law"
        sources={[
          {
            label: "Civil Procedure",
            reference: "Code of Civil Procedure 1908 (Act V of 1908)",
          },
          {
            label: "Specific Relief",
            reference: "Specific Relief Act 1877",
          },
          {
            label: "Contract Law",
            reference: "Contract Act 1872, Sections 73-75",
          },
          {
            label: "Tort Law",
            reference: "Common law principles as applied by Pakistani courts",
          },
        ]}
      >
        <h3>Types of Damages</h3>
        <p>
          Pakistani courts recognize two broad categories of damages:{" "}
          <strong>special damages</strong> (also called &ldquo;actual&rdquo; or
          &ldquo;pecuniary&rdquo; damages) and{" "}
          <strong>general damages</strong> (also called
          &ldquo;non-pecuniary&rdquo; damages). Special damages are provable,
          quantifiable losses such as medical bills, repair costs, or lost
          wages. General damages compensate for intangible harm such as pain
          and suffering, mental anguish, loss of amenity, and reputational
          injury.
        </p>

        <h3>Special vs. General Damages</h3>
        <p>
          Under Section 73 of the Contract Act 1872, a party who suffers loss
          from a breach of contract is entitled to compensation for any loss
          or damage that naturally arose in the usual course of things from
          such breach, or which the parties knew at the time of the contract
          was likely to result from the breach. Special damages must be
          specifically pleaded and proved with evidence. General damages,
          by contrast, are presumed by law and need not be precisely
          quantified — the court has discretion to award a reasonable sum.
        </p>

        <h3>Principles from Case Law</h3>
        <ul>
          <li>
            <strong>Hadley v. Baxendale principle:</strong> Pakistani courts
            follow the rule that damages must be reasonably foreseeable at the
            time of contracting. Remote and speculative losses are not
            recoverable.
          </li>
          <li>
            <strong>Mitigation of loss:</strong> The injured party has a duty
            to take reasonable steps to minimize their loss. Failure to
            mitigate may reduce the quantum of damages.
          </li>
          <li>
            <strong>Restitutio in integrum:</strong> The underlying aim of
            damages is to restore the injured party to the position they would
            have been in had the wrong not occurred, so far as money can do
            so.
          </li>
        </ul>

        <h3>Contributory Negligence</h3>
        <p>
          Where the plaintiff has contributed to their own injury through
          negligence, the damages may be reduced proportionally. Pakistani
          courts apply the doctrine of contributory negligence, particularly
          in tort claims. The reduction is assessed as a percentage reflecting
          the plaintiff&apos;s share of fault.
        </p>

        <h3>Assessment of Quantum</h3>
        <p>
          Pakistani courts consider multiple factors when assessing the
          quantum of damages: the severity of injury, the defendant&apos;s
          conduct, the duration of harm, the plaintiff&apos;s age and earning
          capacity, the cost of future medical treatment, and precedent from
          comparable cases. There are no statutory caps on general damages in
          most civil matters, giving courts wide discretion.
        </p>

        <h3>Punitive / Exemplary Damages</h3>
        <p>
          While Pakistani courts primarily award compensatory damages, in
          cases of willful or grossly negligent conduct, courts may award
          enhanced damages that carry a punitive element. Defamation cases, in
          particular, may attract higher awards where malice is established.
        </p>

        <h3>Important Disclaimer</h3>
        <p>
          Courts in Pakistan have wide discretion in awarding damages, and
          actual awards vary significantly based on the jurisdiction (which
          province or district), the presiding judge, the quality of evidence,
          and the specific facts of the case. The estimates provided by this
          calculator are general guidance only and should not be relied upon as
          predictions of actual court awards. Always consult a qualified legal
          professional for advice specific to your case.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
