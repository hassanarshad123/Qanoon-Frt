import { differenceInDays } from "date-fns";
import type { TaxPenaltyInput, TaxPenaltyResult } from "./types";
import {
  PENALTY_RULES,
  DEFAULT_SURCHARGE_ANNUAL_RATE,
  LATE_FILING_PENALTY,
  CONCEALMENT_PENALTY,
} from "./data/tax-penalty-rules";

// ============================================================
// Tax Penalties Calculator — Pure Computation Logic
// Based on Income Tax Ordinance 2001
// ============================================================

export function calculateTaxPenalty(input: TaxPenaltyInput): TaxPenaltyResult {
  const rule = PENALTY_RULES.find((r) => r.type === input.penaltyType);
  if (!rule) {
    throw new Error(`Unknown penalty type: ${input.penaltyType}`);
  }

  const daysLate = Math.max(0, differenceInDays(input.actualDate, input.dueDate));
  let penaltyAmount = 0;
  let defaultSurcharge = 0;
  let explanation = "";

  switch (input.penaltyType) {
    case "late-filing": {
      // Base penalty — tiered by income for individuals, flat for companies
      const entityType = input.entityType ?? "individual";
      let basePenalty: number;
      if (entityType === "company") {
        basePenalty = LATE_FILING_PENALTY.company;
      } else {
        const income = input.income ?? 0;
        const tier = LATE_FILING_PENALTY.individualTiers.find((t) => income <= t.maxIncome);
        basePenalty = tier ? tier.penalty : LATE_FILING_PENALTY.individualTiers[LATE_FILING_PENALTY.individualTiers.length - 1].penalty;
      }
      // Daily penalty
      const dailyPenalty = daysLate * LATE_FILING_PENALTY.dailyRate;
      // Cap at 25% of tax payable
      const maxPenalty = input.amountInvolved * LATE_FILING_PENALTY.maxPercentOfTax;
      penaltyAmount = Math.min(basePenalty + dailyPenalty, maxPenalty > 0 ? maxPenalty : basePenalty + dailyPenalty);

      // Reduction for voluntary disclosure
      if (input.isVoluntaryDisclosure) {
        penaltyAmount = Math.round(penaltyAmount * 0.5);
        explanation = `Base penalty Rs. ${basePenalty.toLocaleString()} + Rs. ${LATE_FILING_PENALTY.dailyRate.toLocaleString()}/day for ${daysLate} days. 50% reduction for voluntary filing.`;
      } else {
        explanation = `Base penalty Rs. ${basePenalty.toLocaleString()} + Rs. ${LATE_FILING_PENALTY.dailyRate.toLocaleString()}/day for ${daysLate} days of default. Capped at 25% of tax payable.`;
      }
      break;
    }

    case "late-payment":
    case "default-surcharge": {
      // Default surcharge at KIBOR + 3% per annum
      const dailyRate = DEFAULT_SURCHARGE_ANNUAL_RATE / 365;
      defaultSurcharge = Math.round(input.amountInvolved * dailyRate * daysLate);
      penaltyAmount = 0;
      explanation = `Default surcharge calculated at approximately ${(DEFAULT_SURCHARGE_ANNUAL_RATE * 100).toFixed(0)}% per annum (KIBOR + 3%) for ${daysLate} days on Rs. ${input.amountInvolved.toLocaleString()}.`;
      break;
    }

    case "failure-to-furnish": {
      const dailyPenalty = 2500;
      const minPenalty = 25000;
      penaltyAmount = Math.max(minPenalty, dailyPenalty * daysLate);

      if (input.isFirstOffense) {
        penaltyAmount = Math.round(penaltyAmount * 0.75);
        explanation = `Rs. 2,500/day for ${daysLate} days (min Rs. 25,000). 25% reduction for first offense.`;
      } else {
        explanation = `Rs. 2,500/day for ${daysLate} days of default. Minimum penalty Rs. 25,000.`;
      }
      break;
    }

    case "concealment": {
      let rate: number;
      if (input.isVoluntaryDisclosure) {
        rate = CONCEALMENT_PENALTY.voluntaryDisclosure;
        explanation = `Voluntary disclosure before detection: ${(rate * 100).toFixed(0)}% of tax sought to be evaded.`;
      } else if (input.isFirstOffense) {
        rate = CONCEALMENT_PENALTY.firstOffense;
        explanation = `First offense: ${(rate * 100).toFixed(0)}% of tax sought to be evaded (Rs. ${input.amountInvolved.toLocaleString()}).`;
      } else {
        rate = CONCEALMENT_PENALTY.secondOffense;
        explanation = `Repeat offense: ${(rate * 100).toFixed(0)}% of tax sought to be evaded (Rs. ${input.amountInvolved.toLocaleString()}).`;
      }
      penaltyAmount = Math.round(input.amountInvolved * rate);
      break;
    }
  }

  const totalPayable = penaltyAmount + defaultSurcharge;

  return {
    penaltyType: input.penaltyType,
    penaltyTypeLabel: rule.label,
    daysLate,
    penaltyAmount,
    defaultSurcharge,
    totalPayable,
    relevantSection: rule.section,
    explanation,
  };
}

export function getTaxPenaltyBreakdown(result: TaxPenaltyResult) {
  const steps = [
    {
      step: 1,
      label: "Identify penalty type",
      calculation: `${result.penaltyTypeLabel} (${result.relevantSection})`,
      result: `${result.daysLate} days late`,
    },
    {
      step: 2,
      label: "Calculate penalty",
      calculation: result.explanation,
      result: `Rs. ${result.penaltyAmount.toLocaleString("en-PK")}`,
    },
  ];

  if (result.defaultSurcharge > 0) {
    steps.push({
      step: 3,
      label: "Calculate default surcharge",
      calculation: `KIBOR + 3% per annum for ${result.daysLate} days`,
      result: `Rs. ${result.defaultSurcharge.toLocaleString("en-PK")}`,
    });
  }

  steps.push({
    step: steps.length + 1,
    label: "Total payable",
    calculation: result.defaultSurcharge > 0
      ? `Penalty Rs. ${result.penaltyAmount.toLocaleString("en-PK")} + Surcharge Rs. ${result.defaultSurcharge.toLocaleString("en-PK")}`
      : `Penalty: Rs. ${result.penaltyAmount.toLocaleString("en-PK")}`,
    result: `Rs. ${result.totalPayable.toLocaleString("en-PK")}`,
  });

  return steps;
}
