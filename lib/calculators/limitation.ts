import { addDays, differenceInDays, format } from "date-fns";
import type { LimitationInput, LimitationResult } from "./types";
import { getLimitationArticle } from "./data/limitation-articles";

// ============================================================
// Limitation Period Calculator — Pure Computation Logic
// Based on the Limitation Act 1908 (Pakistan)
// ============================================================

/**
 * Extension rules per Sections 6-18 of the Limitation Act 1908:
 * - Section 6: Legal disability (minority) — period does not begin until disability ceases
 * - Section 7: Disability of one of several plaintiffs
 * - Section 8: Special exceptions — disability
 * - Section 9: Continuous running after disability ceases
 * - Section 13: Exclusion of time of proceeding bona fide in court without jurisdiction
 * - Section 14: Exclusion of time of proceeding bona fide in court without jurisdiction
 * - Section 15: Exclusion of time in certain cases — absence from Pakistan
 * - Section 18: Acknowledgment — fresh start from date of acknowledgment
 */

const MINORITY_EXTENSION_DAYS = 365; // 1 year after attaining majority
const DISABILITY_EXTENSION_DAYS = 365; // 1 year after disability ceases
const ABSENCE_EXTENSION_DAYS = 180; // 6 months (approximate, varies by case)

export function calculateLimitation(input: LimitationInput): LimitationResult {
  const article = getLimitationArticle(input.articleNumber);
  if (!article) {
    throw new Error(`Article ${input.articleNumber} not found`);
  }

  // Step 1: Calculate base deadline
  const baseDeadline = addDays(input.accrualDate, article.periodDays);

  // Step 2: Calculate extensions
  const extensionBreakdown: { label: string; days: number }[] = [];
  let totalExtensionDays = 0;

  if (input.extensions.minority) {
    extensionBreakdown.push({
      label: "Minority/Legal disability (Section 6)",
      days: MINORITY_EXTENSION_DAYS,
    });
    totalExtensionDays += MINORITY_EXTENSION_DAYS;
  }

  if (input.extensions.disability) {
    extensionBreakdown.push({
      label: "Physical/mental disability (Section 6)",
      days: DISABILITY_EXTENSION_DAYS,
    });
    totalExtensionDays += DISABILITY_EXTENSION_DAYS;
  }

  if (input.extensions.absenceFromPakistan) {
    extensionBreakdown.push({
      label: "Absence from Pakistan (Section 15)",
      days: ABSENCE_EXTENSION_DAYS,
    });
    totalExtensionDays += ABSENCE_EXTENSION_DAYS;
  }

  // Section 18: Acknowledgment of debt/liability — period restarts from acknowledgment date
  if (input.extensions.acknowledgmentDate) {
    const ackDate = input.extensions.acknowledgmentDate;
    const newBaseDeadline = addDays(ackDate, article.periodDays);
    const ackExtension = differenceInDays(newBaseDeadline, baseDeadline);
    if (ackExtension > 0) {
      extensionBreakdown.push({
        label: `Acknowledgment of liability (Section 18) — period restarts from ${format(ackDate, "dd MMM yyyy")}`,
        days: ackExtension,
      });
      totalExtensionDays += ackExtension;
    }
  }

  // Step 3: Calculate final deadline
  const finalDeadline = addDays(baseDeadline, totalExtensionDays);

  // Step 4: Calculate days remaining
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysRemaining = differenceInDays(finalDeadline, today);

  // Step 5: Determine status
  let status: "safe" | "warning" | "expired";
  if (daysRemaining < 0) {
    status = "expired";
  } else if (daysRemaining <= 30) {
    status = "warning";
  } else {
    status = "safe";
  }

  return {
    article,
    accrualDate: input.accrualDate,
    baseDeadline,
    extensionDays: totalExtensionDays,
    finalDeadline,
    daysRemaining,
    status,
    extensionBreakdown,
  };
}

export function getLimitationBreakdown(result: LimitationResult) {
  const steps = [
    {
      step: 1,
      label: "Identify applicable article",
      calculation: `Article ${result.article.article}: ${result.article.description}`,
      result: `Limitation period: ${result.article.period}`,
    },
    {
      step: 2,
      label: "Determine accrual date",
      calculation: `Cause of action accrued: ${format(result.accrualDate, "dd MMM yyyy")}`,
      result: `Starting point: ${result.article.startPoint}`,
    },
    {
      step: 3,
      label: "Calculate base deadline",
      calculation: `${format(result.accrualDate, "dd MMM yyyy")} + ${result.article.periodDays} days`,
      result: format(result.baseDeadline, "dd MMM yyyy"),
    },
  ];

  if (result.extensionBreakdown.length > 0) {
    steps.push({
      step: 4,
      label: "Apply extensions",
      calculation: result.extensionBreakdown
        .map((e) => `${e.label}: +${e.days} days`)
        .join("; "),
      result: `Total extension: ${result.extensionDays} days`,
    });
    steps.push({
      step: 5,
      label: "Final filing deadline",
      calculation: `${format(result.baseDeadline, "dd MMM yyyy")} + ${result.extensionDays} days`,
      result: format(result.finalDeadline, "dd MMM yyyy"),
    });
  } else {
    steps.push({
      step: 4,
      label: "Final filing deadline (no extensions)",
      calculation: "No extensions applicable",
      result: format(result.finalDeadline, "dd MMM yyyy"),
    });
  }

  return steps;
}
