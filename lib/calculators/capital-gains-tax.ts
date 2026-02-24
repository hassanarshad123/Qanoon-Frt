import type { CGTInput, CGTResult, CGTAssetType, FilerStatus, PropertyType } from "./types";
import {
  SECURITIES_2022_2024_RATES,
  OPEN_PLOT_RATES,
  CONSTRUCTED_RATES,
  ERA_BEFORE_2013,
  ERA_2013_2022,
  ERA_2022_2024,
  ERA_2024_2025,
  PMEX_RATE,
  NEW_REGIME_FLAT_RATE,
} from "./data/capital-gains-rates";

// ============================================================
// Capital Gains Tax Calculator — Pure Computation Logic
// Income Tax Ordinance 2001, Sections 37 & 37A
// ============================================================

function daysBetween(d1: Date, d2: Date): number {
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function yearsBetween(d1: Date, d2: Date): number {
  return daysBetween(d1, d2) / 365.25;
}

function formatHoldingPeriod(days: number): string {
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  if (years === 0 && months === 0) return `${days} days`;
  if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""}, ${months} month${months > 1 ? "s" : ""}`;
}

function getSecuritiesRate(acquisitionDate: Date, holdingYears: number, filerStatus: FilerStatus): { rate: number; era: string } {
  // Before July 1, 2013 — exempt
  if (acquisitionDate < ERA_BEFORE_2013) {
    return { rate: 0, era: "Acquired before July 2013 — Exempt" };
  }

  // July 1, 2013 – June 30, 2022 — flat 12.5%
  if (acquisitionDate < ERA_2013_2022) {
    return { rate: 0.125, era: "Acquired Jul 2013 – Jun 2022 — Flat 12.5%" };
  }

  // July 1, 2022 – June 30, 2024 — progressive by holding period
  if (acquisitionDate < ERA_2022_2024) {
    for (const tier of SECURITIES_2022_2024_RATES) {
      if (holdingYears >= tier.minYears && holdingYears < tier.maxYears) {
        return { rate: tier.rate, era: `Acquired Jul 2022 – Jun 2024 — ${(tier.rate * 100).toFixed(1)}% (${formatHoldingPeriod(Math.round(holdingYears * 365))} held)` };
      }
    }
    return { rate: 0, era: "Acquired Jul 2022 – Jun 2024" };
  }

  // July 1, 2024 – June 30, 2025
  if (acquisitionDate < ERA_2024_2025) {
    return { rate: NEW_REGIME_FLAT_RATE, era: "Acquired Jul 2024 – Jun 2025 — Flat 15%" };
  }

  // On or after July 1, 2025
  return { rate: NEW_REGIME_FLAT_RATE, era: "Acquired on/after Jul 2025 — Flat 15%" };
}

function getImmovablePropertyRate(
  acquisitionDate: Date,
  holdingYears: number,
  filerStatus: FilerStatus,
  propertyType: PropertyType
): { rate: number; era: string } {
  // New regime: acquired on/after July 1, 2024
  if (acquisitionDate >= ERA_2022_2024) {
    return { rate: NEW_REGIME_FLAT_RATE, era: "Acquired on/after Jul 2024 — New Regime, Flat 15%" };
  }

  // Old regime: acquired before July 1, 2024
  const rates = propertyType === "open-plot" ? OPEN_PLOT_RATES : CONSTRUCTED_RATES;
  const isFiler = filerStatus === "filer";

  for (const tier of rates) {
    if (holdingYears >= tier.minYears && holdingYears < tier.maxYears) {
      const rate = isFiler ? tier.filerRate : tier.nonFilerRate;
      return {
        rate,
        era: `Old Regime (pre-Jul 2024) — ${propertyType === "open-plot" ? "Open Plot" : "Constructed/Flat"}, ${(rate * 100).toFixed(1)}%`,
      };
    }
  }
  return { rate: 0, era: "Old Regime (pre-Jul 2024)" };
}

export function calculateCGT(input: CGTInput): CGTResult {
  const acquisitionDate = new Date(input.acquisitionDate);
  const disposalDate = new Date(input.disposalDate);
  const holdingDays = daysBetween(acquisitionDate, disposalDate);
  const holdingYears = yearsBetween(acquisitionDate, disposalDate);
  const capitalGain = input.salePrice - input.acquisitionCost;

  let rate = 0;
  let era = "";
  let section = "";

  switch (input.assetType) {
    case "listed-securities": {
      const result = getSecuritiesRate(acquisitionDate, holdingYears, input.filerStatus);
      rate = result.rate;
      era = result.era;
      section = "s.37A";
      break;
    }
    case "immovable-property": {
      const propType = input.propertyType ?? "open-plot";
      const result = getImmovablePropertyRate(acquisitionDate, holdingYears, input.filerStatus, propType);
      rate = result.rate;
      era = result.era;
      section = "s.37";
      break;
    }
    case "pmex": {
      rate = PMEX_RATE;
      era = "PMEX Commodities — Flat 5%";
      section = "s.37A";
      break;
    }
    case "other": {
      rate = NEW_REGIME_FLAT_RATE;
      era = "Other Movable Assets — Taxed at normal slab rates (approx 15%)";
      section = "s.37";
      break;
    }
  }

  const taxableGain = Math.max(0, capitalGain);
  const cgtAmount = Math.round(taxableGain * rate);
  const netProceeds = input.salePrice - cgtAmount;

  return {
    assetType: input.assetType,
    propertyType: input.propertyType,
    acquisitionCost: input.acquisitionCost,
    salePrice: input.salePrice,
    capitalGain,
    holdingPeriodDays: holdingDays,
    holdingPeriodYears: holdingYears,
    holdingPeriodLabel: formatHoldingPeriod(holdingDays),
    acquisitionEra: era,
    applicableRate: rate,
    cgtAmount: capitalGain <= 0 ? 0 : cgtAmount,
    netProceeds: capitalGain <= 0 ? input.salePrice : netProceeds,
    section,
  };
}

export function getCGTBreakdown(result: CGTResult) {
  const steps = [
    {
      step: 1,
      label: "Cost of Acquisition",
      calculation: "Purchase price of asset",
      result: `Rs. ${result.acquisitionCost.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: "Sale Proceeds",
      calculation: "Amount received on disposal",
      result: `Rs. ${result.salePrice.toLocaleString("en-PK")}`,
    },
    {
      step: 3,
      label: "Capital Gain",
      calculation: `Rs. ${result.salePrice.toLocaleString("en-PK")} − Rs. ${result.acquisitionCost.toLocaleString("en-PK")}`,
      result: `Rs. ${result.capitalGain.toLocaleString("en-PK")}`,
    },
    {
      step: 4,
      label: "Holding Period",
      calculation: `${result.holdingPeriodDays} days`,
      result: result.holdingPeriodLabel,
    },
    {
      step: 5,
      label: "Applicable Rate",
      calculation: result.acquisitionEra,
      result: `${(result.applicableRate * 100).toFixed(1)}%`,
    },
    {
      step: 6,
      label: "CGT Payable",
      calculation: result.capitalGain <= 0
        ? "No capital gain — no tax"
        : `Rs. ${Math.max(0, result.capitalGain).toLocaleString("en-PK")} × ${(result.applicableRate * 100).toFixed(1)}%`,
      result: `Rs. ${result.cgtAmount.toLocaleString("en-PK")}`,
    },
  ];
  return steps;
}
