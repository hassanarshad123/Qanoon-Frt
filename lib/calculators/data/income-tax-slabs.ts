import type { IncomeTaxSlab } from "../types";

// ============================================================
// Income Tax Slabs — Tax Year 2026 (Finance Act 2025)
// First Schedule, Part I, Division I
// ============================================================

export const SALARIED_SLABS: IncomeTaxSlab[] = [
  { min: 0, max: 600_000, fixedAmount: 0, rate: 0 },
  { min: 600_000, max: 1_200_000, fixedAmount: 0, rate: 0.01 },
  { min: 1_200_000, max: 2_200_000, fixedAmount: 6_000, rate: 0.11 },
  { min: 2_200_000, max: 3_200_000, fixedAmount: 116_000, rate: 0.23 },
  { min: 3_200_000, max: 4_100_000, fixedAmount: 346_000, rate: 0.30 },
  { min: 4_100_000, max: Infinity, fixedAmount: 616_000, rate: 0.35 },
];

export const NON_SALARIED_SLABS: IncomeTaxSlab[] = [
  { min: 0, max: 600_000, fixedAmount: 0, rate: 0 },
  { min: 600_000, max: 1_200_000, fixedAmount: 0, rate: 0.15 },
  { min: 1_200_000, max: 1_600_000, fixedAmount: 90_000, rate: 0.20 },
  { min: 1_600_000, max: 3_200_000, fixedAmount: 170_000, rate: 0.30 },
  { min: 3_200_000, max: 5_600_000, fixedAmount: 650_000, rate: 0.40 },
  { min: 5_600_000, max: Infinity, fixedAmount: 1_610_000, rate: 0.45 },
];

export const SURCHARGE_THRESHOLD = 10_000_000;
export const SALARIED_SURCHARGE_RATE = 0.09;
export const NON_SALARIED_SURCHARGE_RATE = 0.10;

export function getSlabLabel(slab: IncomeTaxSlab): string {
  if (slab.max === Infinity) {
    return `Above Rs. ${slab.min.toLocaleString("en-PK")}`;
  }
  return `Rs. ${slab.min.toLocaleString("en-PK")} – ${slab.max.toLocaleString("en-PK")}`;
}
