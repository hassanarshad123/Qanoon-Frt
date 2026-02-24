import { addDays, differenceInDays, format } from "date-fns";
import type { IddatInput, IddatResult } from "./types";

// ============================================================
// Iddat Period Calculator — Pure Computation Logic
// Based on Islamic family law as applicable in Pakistan
// Muslim Family Laws Ordinance 1961
// ============================================================

const IDDAT_RULES: Record<
  string,
  { days: number; label: string; legalBasis: string; description: string }
> = {
  "divorce-talaq": {
    days: 90, // 3 menstrual cycles or 3 months
    label: "Divorce (Talaq)",
    legalBasis: "Quran 2:228; Muslim Family Laws Ordinance 1961, Section 7",
    description:
      "Three menstrual cycles (quru) or three calendar months if the woman does not menstruate. This is the standard iddat for talaq.",
  },
  "divorce-khula": {
    days: 90, // Same as talaq
    label: "Divorce (Khula)",
    legalBasis: "Quran 2:228; Dissolution of Muslim Marriages Act 1939",
    description:
      "Three menstrual cycles or three calendar months. Khula follows the same iddat period as talaq once the decree is granted.",
  },
  "death-of-husband": {
    days: 130, // 4 months and 10 days
    label: "Death of Husband",
    legalBasis: "Quran 2:234; Muslim Family Laws Ordinance 1961",
    description:
      "Four months and ten days (4 months 10 days = 130 days). This applies regardless of whether the marriage was consummated.",
  },
  annulment: {
    days: 90, // Same as divorce
    label: "Annulment",
    legalBasis: "Dissolution of Muslim Marriages Act 1939",
    description:
      "Three menstrual cycles or three calendar months, same as divorce. Applicable when the marriage is annulled by court decree.",
  },
};

export function calculateIddat(input: IddatInput): IddatResult {
  const rule = IDDAT_RULES[input.reason];
  if (!rule) {
    throw new Error(`Unknown iddat reason: ${input.reason}`);
  }

  // If pregnant, iddat continues until delivery
  if (input.isPregnant) {
    return {
      reason: input.reason,
      reasonLabel: rule.label,
      eventDate: input.eventDate,
      endDate: null, // unknown — until delivery
      durationDays: null,
      daysRemaining: null,
      ruleApplied:
        "Iddat for a pregnant woman continues until delivery, regardless of the cause (Quran 65:4). This overrides the standard period.",
      legalBasis: "Quran 65:4; " + rule.legalBasis,
      isPregnant: true,
    };
  }

  const endDate = addDays(input.eventDate, rule.days);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));

  return {
    reason: input.reason,
    reasonLabel: rule.label,
    eventDate: input.eventDate,
    endDate,
    durationDays: rule.days,
    daysRemaining,
    ruleApplied: rule.description,
    legalBasis: rule.legalBasis,
    isPregnant: false,
  };
}

export function getIddatBreakdown(result: IddatResult) {
  if (result.isPregnant) {
    return [
      {
        step: 1,
        label: "Identify reason",
        calculation: result.reasonLabel,
        result: "Pregnancy overrides standard period",
      },
      {
        step: 2,
        label: "Pregnancy rule",
        calculation: "Quran 65:4 — Iddat continues until delivery",
        result: "End date: Upon delivery",
      },
    ];
  }

  return [
    {
      step: 1,
      label: "Identify reason",
      calculation: result.reasonLabel,
      result: `Standard period: ${result.durationDays} days`,
    },
    {
      step: 2,
      label: "Calculate from event date",
      calculation: `${format(result.eventDate, "dd MMM yyyy")} + ${result.durationDays} days`,
      result: result.endDate
        ? format(result.endDate, "dd MMM yyyy")
        : "N/A",
    },
    {
      step: 3,
      label: "Days remaining",
      calculation: `Today: ${format(new Date(), "dd MMM yyyy")}`,
      result:
        result.daysRemaining !== null
          ? result.daysRemaining > 0
            ? `${result.daysRemaining} days remaining`
            : "Iddat period has ended"
          : "N/A",
    },
  ];
}
