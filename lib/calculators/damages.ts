import type { DamagesInput, DamagesResult } from "./types";
import {
  DAMAGES_CASE_CONFIGS,
  SEVERITY_MULTIPLIERS,
  CONDUCT_MULTIPLIERS,
} from "./data/damages-multipliers";

// ============================================================
// Damages Calculator — Pure Computation Logic
// General estimator based on Pakistani case law principles
// ============================================================

export function calculateDamages(input: DamagesInput): DamagesResult {
  const config = DAMAGES_CASE_CONFIGS.find((c) => c.type === input.caseType);
  if (!config) {
    throw new Error(`Unknown case type: ${input.caseType}`);
  }

  // Step 1: Calculate special damages (actual provable losses)
  const specialDamages = Object.values(input.baseAmounts).reduce(
    (sum, v) => sum + (v || 0),
    0
  );

  // Step 2: Apply severity multiplier
  const severityMultiplier = SEVERITY_MULTIPLIERS[input.severity] ?? 1.0;

  // Step 3: Apply defendant conduct multiplier
  const conductMultiplier =
    CONDUCT_MULTIPLIERS[input.defendantConduct]?.multiplier ?? 1.0;

  // Step 4: Calculate general damages for each tier
  const baseMultipliers = config.generalDamagesMultiplier;
  const adjustedMultipliers = {
    conservative: baseMultipliers.conservative * severityMultiplier * conductMultiplier,
    moderate: baseMultipliers.moderate * severityMultiplier * conductMultiplier,
    aggressive: baseMultipliers.aggressive * severityMultiplier * conductMultiplier,
  };

  // Harm duration modifier
  const durationMultiplier =
    input.harmDuration === "permanent"
      ? 1.5
      : input.harmDuration === "ongoing"
        ? 1.25
        : 1.0;

  const generalDamagesMultiplier = adjustedMultipliers.moderate * durationMultiplier;
  const generalDamages = Math.round(specialDamages * generalDamagesMultiplier);

  // Step 5: Apply contributory negligence reduction
  const negligenceReduction = input.contributoryNegligence / 100;

  const conservativeRaw = Math.round(
    specialDamages * (1 + adjustedMultipliers.conservative * durationMultiplier)
  );
  const moderateRaw = Math.round(
    specialDamages * (1 + adjustedMultipliers.moderate * durationMultiplier)
  );
  const aggressiveRaw = Math.round(
    specialDamages * (1 + adjustedMultipliers.aggressive * durationMultiplier)
  );

  const conservativeEstimate = Math.round(
    conservativeRaw * (1 - negligenceReduction)
  );
  const moderateEstimate = Math.round(
    moderateRaw * (1 - negligenceReduction)
  );
  const aggressiveEstimate = Math.round(
    aggressiveRaw * (1 - negligenceReduction)
  );

  // Build breakdown
  const breakdown: { label: string; amount: number }[] = [];
  for (const field of config.baseFields) {
    const amount = input.baseAmounts[field.key] || 0;
    if (amount > 0) {
      breakdown.push({ label: field.label, amount });
    }
  }
  breakdown.push({ label: "Total Special Damages", amount: specialDamages });
  breakdown.push({
    label: "General Damages (moderate estimate)",
    amount: generalDamages,
  });
  if (negligenceReduction > 0) {
    breakdown.push({
      label: `Contributory Negligence Reduction (${input.contributoryNegligence}%)`,
      amount: -Math.round(moderateRaw * negligenceReduction),
    });
  }

  return {
    caseType: input.caseType,
    specialDamages,
    generalDamagesMultiplier,
    generalDamages,
    negligenceReduction: Math.round(moderateRaw * negligenceReduction),
    conservativeEstimate,
    moderateEstimate,
    aggressiveEstimate,
    breakdown,
    disclaimer:
      "IMPORTANT: This calculator provides rough estimates only. Actual damages awarded by Pakistani courts vary significantly based on jurisdiction, judge, evidence, and specific case circumstances. These estimates do not constitute legal advice. Always consult a qualified legal professional for case-specific guidance.",
  };
}

export function getDamagesBreakdown(result: DamagesResult) {
  const steps = [
    {
      step: 1,
      label: "Special damages (provable losses)",
      calculation: result.breakdown
        .filter((b) => b.amount > 0 && b.label !== "Total Special Damages" && b.label !== "General Damages (moderate estimate)" && !b.label.includes("Reduction"))
        .map((b) => `${b.label}: Rs. ${b.amount.toLocaleString("en-PK")}`)
        .join(" + "),
      result: `Rs. ${result.specialDamages.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: "General damages multiplier",
      calculation: `Base multiplier adjusted for severity, defendant conduct, and duration`,
      result: `${result.generalDamagesMultiplier.toFixed(2)}x`,
    },
    {
      step: 3,
      label: "General damages (moderate)",
      calculation: `Rs. ${result.specialDamages.toLocaleString("en-PK")} x ${result.generalDamagesMultiplier.toFixed(2)}`,
      result: `Rs. ${result.generalDamages.toLocaleString("en-PK")}`,
    },
  ];

  if (result.negligenceReduction > 0) {
    steps.push({
      step: 4,
      label: "Contributory negligence reduction",
      calculation: `Reduced by contributory negligence`,
      result: `- Rs. ${result.negligenceReduction.toLocaleString("en-PK")}`,
    });
  }

  steps.push({
    step: steps.length + 1,
    label: "Estimated range",
    calculation: `Conservative to aggressive estimate`,
    result: `Rs. ${result.conservativeEstimate.toLocaleString("en-PK")} — Rs. ${result.aggressiveEstimate.toLocaleString("en-PK")}`,
  });

  return steps;
}
