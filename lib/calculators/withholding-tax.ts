import type { WHTInput, WHTResult, WHTCategory, WHTTaxStatus, PropertyFilerStatus } from "./types";
import {
  WHT_CATEGORIES,
  RENTAL_SLABS,
  PROPERTY_SALE_TIERS,
  PROPERTY_PURCHASE_TIERS,
  type PropertyTier,
} from "./data/withholding-tax-rates";

// ============================================================
// Withholding Tax Calculator — Pure Computation Logic
// Income Tax Ordinance 2001, Sections 148–236Z
// ============================================================

function calculateRentalWHT(annualRent: number): number {
  for (const slab of RENTAL_SLABS) {
    if (annualRent > slab.min && annualRent <= slab.max) {
      return slab.fixedAmount + (annualRent - slab.min) * slab.rate;
    }
    if (slab.max === Infinity && annualRent > slab.min) {
      return slab.fixedAmount + (annualRent - slab.min) * slab.rate;
    }
  }
  return 0;
}

function getPropertyRate(
  tiers: PropertyTier[],
  amount: number,
  filerStatus: PropertyFilerStatus
): number {
  for (const tier of tiers) {
    if (amount > tier.min && amount <= tier.max) {
      if (filerStatus === "filer") return tier.filerRate;
      if (filerStatus === "late-filer") return tier.lateFilerRate;
      return tier.nonFilerRate;
    }
    if (tier.max === Infinity && amount > tier.min) {
      if (filerStatus === "filer") return tier.filerRate;
      if (filerStatus === "late-filer") return tier.lateFilerRate;
      return tier.nonFilerRate;
    }
  }
  return 0;
}

export function calculateWHT(input: WHTInput): WHTResult {
  const { category, subTypeId, amount, filerStatus, propertyFilerStatus } = input;
  const catDef = WHT_CATEGORIES.find((c) => c.id === category);
  const categoryLabel = catDef?.label ?? category;
  const section = catDef?.section ?? "";
  const isFiler = filerStatus === "filer";

  // Rental Income (slab-based)
  if (category === "rental-income") {
    const whtAmount = Math.round(calculateRentalWHT(amount));
    const effectiveRate = amount > 0 ? whtAmount / amount : 0;
    return {
      category,
      categoryLabel,
      subTypeLabel: "Individual / AOP Tenant",
      section: "s.155",
      amount,
      rate: effectiveRate,
      inactiveRate: effectiveRate, // slab-based, same calculation
      whtAmount,
      netAmount: amount - whtAmount,
      taxStatus: "adjustable",
    };
  }

  // Property Sale (s.236C)
  if (category === "property-sale") {
    const pfs = propertyFilerStatus ?? (isFiler ? "filer" : "non-filer");
    const rate = getPropertyRate(PROPERTY_SALE_TIERS, amount, pfs);
    const nonFilerRate = getPropertyRate(PROPERTY_SALE_TIERS, amount, "non-filer");
    const whtAmount = Math.round(amount * rate);
    return {
      category,
      categoryLabel,
      subTypeLabel: `${pfs === "filer" ? "Active Filer" : pfs === "late-filer" ? "Late Filer" : "Non-Filer"}`,
      section: "s.236C",
      amount,
      rate,
      inactiveRate: nonFilerRate,
      whtAmount,
      netAmount: amount - whtAmount,
      taxStatus: "adjustable",
    };
  }

  // Property Purchase (s.236K)
  if (category === "property-purchase") {
    const pfs = propertyFilerStatus ?? (isFiler ? "filer" : "non-filer");
    const rate = getPropertyRate(PROPERTY_PURCHASE_TIERS, amount, pfs);
    const nonFilerRate = getPropertyRate(PROPERTY_PURCHASE_TIERS, amount, "non-filer");
    const whtAmount = Math.round(amount * rate);
    return {
      category,
      categoryLabel,
      subTypeLabel: `${pfs === "filer" ? "Active Filer" : pfs === "late-filer" ? "Late Filer" : "Non-Filer"}`,
      section: "s.236K",
      amount,
      rate,
      inactiveRate: nonFilerRate,
      whtAmount,
      netAmount: amount - whtAmount,
      taxStatus: "adjustable",
    };
  }

  // All other categories: flat rate × amount
  const subType = catDef?.subTypes.find((s) => s.id === subTypeId);
  if (!subType) {
    return {
      category,
      categoryLabel,
      subTypeLabel: "Unknown",
      section,
      amount,
      rate: 0,
      inactiveRate: 0,
      whtAmount: 0,
      netAmount: amount,
      taxStatus: "minimum",
    };
  }

  const rate = isFiler ? subType.filerRate : subType.nonFilerRate;
  const inactiveRate = subType.nonFilerRate;
  const whtAmount = Math.round(amount * rate);

  return {
    category,
    categoryLabel,
    subTypeLabel: subType.label,
    section,
    amount,
    rate,
    inactiveRate,
    whtAmount,
    netAmount: amount - whtAmount,
    taxStatus: subType.taxStatus,
  };
}

export function getWHTBreakdown(result: WHTResult) {
  const steps = [
    {
      step: 1,
      label: "Payment Amount",
      calculation: `Gross amount subject to WHT`,
      result: `Rs. ${result.amount.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: `WHT Rate (${result.section})`,
      calculation: `${result.subTypeLabel} — ${(result.rate * 100).toFixed(2)}%`,
      result: `${(result.rate * 100).toFixed(2)}%`,
    },
    {
      step: 3,
      label: "WHT Amount",
      calculation: `Rs. ${result.amount.toLocaleString("en-PK")} × ${(result.rate * 100).toFixed(2)}%`,
      result: `Rs. ${result.whtAmount.toLocaleString("en-PK")}`,
    },
    {
      step: 4,
      label: "Net Amount After WHT",
      calculation: `Rs. ${result.amount.toLocaleString("en-PK")} − Rs. ${result.whtAmount.toLocaleString("en-PK")}`,
      result: `Rs. ${result.netAmount.toLocaleString("en-PK")}`,
    },
  ];
  return steps;
}
