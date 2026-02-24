// ============================================================
// Capital Gains Tax Rate Tables — Tax Year 2026
// Income Tax Ordinance 2001, Sections 37 & 37A
// ============================================================

// --- Listed Securities (PSX, Mutual Funds) ---

export interface HoldingPeriodRate {
  minYears: number;
  maxYears: number; // Infinity for open-ended
  rate: number;
}

// Securities acquired July 1, 2022 – June 30, 2024
export const SECURITIES_2022_2024_RATES: HoldingPeriodRate[] = [
  { minYears: 0, maxYears: 1, rate: 0.15 },
  { minYears: 1, maxYears: 2, rate: 0.125 },
  { minYears: 2, maxYears: 3, rate: 0.10 },
  { minYears: 3, maxYears: 4, rate: 0.075 },
  { minYears: 4, maxYears: 5, rate: 0.05 },
  { minYears: 5, maxYears: 6, rate: 0.025 },
  { minYears: 6, maxYears: Infinity, rate: 0 },
];

// --- Immovable Property (Old Regime, acquired before July 1, 2024) ---

export const OPEN_PLOT_RATES: { minYears: number; maxYears: number; filerRate: number; nonFilerRate: number }[] = [
  { minYears: 0, maxYears: 1, filerRate: 0.15, nonFilerRate: 0.45 },
  { minYears: 1, maxYears: 2, filerRate: 0.125, nonFilerRate: 0.375 },
  { minYears: 2, maxYears: 3, filerRate: 0.10, nonFilerRate: 0.30 },
  { minYears: 3, maxYears: 4, filerRate: 0.075, nonFilerRate: 0.225 },
  { minYears: 4, maxYears: 5, filerRate: 0.05, nonFilerRate: 0.15 },
  { minYears: 5, maxYears: 6, filerRate: 0.025, nonFilerRate: 0.075 },
  { minYears: 6, maxYears: Infinity, filerRate: 0, nonFilerRate: 0 },
];

export const CONSTRUCTED_RATES: { minYears: number; maxYears: number; filerRate: number; nonFilerRate: number }[] = [
  { minYears: 0, maxYears: 1, filerRate: 0.15, nonFilerRate: 0.45 },
  { minYears: 1, maxYears: 2, filerRate: 0.10, nonFilerRate: 0.30 },
  { minYears: 2, maxYears: 3, filerRate: 0.075, nonFilerRate: 0.225 },
  { minYears: 3, maxYears: 4, filerRate: 0.05, nonFilerRate: 0.15 },
  { minYears: 4, maxYears: Infinity, filerRate: 0, nonFilerRate: 0 },
];

// --- Era boundaries ---
export const ERA_BEFORE_2013 = new Date("2013-07-01");
export const ERA_2013_2022 = new Date("2022-07-01");
export const ERA_2022_2024 = new Date("2024-07-01");
export const ERA_2024_2025 = new Date("2025-07-01");

// --- PMEX rate ---
export const PMEX_RATE = 0.05;

// --- New regime flat rate (acquired on/after Jul 1, 2024 for property, Jul 1, 2025 for securities) ---
export const NEW_REGIME_FLAT_RATE = 0.15;
