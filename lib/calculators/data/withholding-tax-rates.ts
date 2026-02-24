import type { WHTCategoryDef, WHTTaxStatus } from "../types";

// ============================================================
// Withholding Tax Rate Card — Tax Year 2026
// Income Tax Ordinance 2001, Sections 148–236Z
// ============================================================

export const WHT_CATEGORIES: WHTCategoryDef[] = [
  {
    id: "imports",
    label: "Imports",
    section: "s.148",
    subTypes: [
      { id: "imp-part1", label: "Part I (12th Schedule)", filerRate: 0.01, nonFilerRate: 0.02, taxStatus: "minimum" },
      { id: "imp-part2-non-comm", label: "Part II (Non-Commercial)", filerRate: 0.02, nonFilerRate: 0.04, taxStatus: "minimum" },
      { id: "imp-part3-non-comm", label: "Part III (Non-Commercial)", filerRate: 0.055, nonFilerRate: 0.11, taxStatus: "minimum" },
      { id: "imp-mfg-sro", label: "Manufacturers (rescinded SRO 1125)", filerRate: 0.01, nonFilerRate: 0.02, taxStatus: "adjustable" },
      { id: "imp-pharma", label: "Pharma (not made in PK, DRAP cert)", filerRate: 0.04, nonFilerRate: 0.08, taxStatus: "minimum" },
      { id: "imp-ev-ckd", label: "EV CKD kits", filerRate: 0.01, nonFilerRate: 0.02, taxStatus: "minimum" },
      { id: "imp-comm-part2", label: "Commercial Importer – Part II", filerRate: 0.035, nonFilerRate: 0.07, taxStatus: "minimum" },
      { id: "imp-comm-part3", label: "Commercial Importer – Part III", filerRate: 0.06, nonFilerRate: 0.12, taxStatus: "minimum" },
    ],
  },
  {
    id: "dividends",
    label: "Dividends",
    section: "s.150",
    subTypes: [
      { id: "div-ipp", label: "IPP pass-through", filerRate: 0.075, nonFilerRate: 0.15, taxStatus: "final" },
      { id: "div-exempt-co", label: "Company with exemption/losses/credit", filerRate: 0.25, nonFilerRate: 0.50, taxStatus: "final" },
      { id: "div-reit", label: "REIT", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
      { id: "div-mf-debt-corp", label: "Mutual Fund – Debt (Corporate)", filerRate: 0.29, nonFilerRate: 0.58, taxStatus: "final" },
      { id: "div-mf-debt-other", label: "Mutual Fund – Debt (Others)", filerRate: 0.25, nonFilerRate: 0.50, taxStatus: "final" },
      { id: "div-mf-equity", label: "Mutual Fund – Equity", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
      { id: "div-other", label: "Any other case", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
    ],
  },
  {
    id: "profit-on-debt",
    label: "Profit on Debt",
    section: "s.151",
    subTypes: [
      { id: "pod-nss", label: "National Savings / Post Office", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
      { id: "pod-bank", label: "Bank deposits", filerRate: 0.20, nonFilerRate: 0.40, taxStatus: "final" },
      { id: "pod-govt-ind", label: "Government securities (Individual)", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
      { id: "pod-govt-co", label: "Government securities (Company/AOP)", filerRate: 0.20, nonFilerRate: 0.40, taxStatus: "adjustable" },
      { id: "pod-bonds", label: "Bonds / Debentures / Certificates", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "final" },
    ],
  },
  {
    id: "goods-services-contracts",
    label: "Goods, Services & Contracts",
    section: "s.153",
    subTypes: [
      { id: "gsc-rice-oil", label: "Rice, cotton seed oil, edible oil", filerRate: 0.015, nonFilerRate: 0.03, taxStatus: "minimum" },
      { id: "gsc-dist-cig", label: "Distributors – cigarettes", filerRate: 0.025, nonFilerRate: 0.05, taxStatus: "minimum" },
      { id: "gsc-dist-pharma", label: "Distributors – pharma", filerRate: 0.01, nonFilerRate: 0.02, taxStatus: "minimum" },
      { id: "gsc-fmcg", label: "FMCG distributors (ATL in IT & ST)", filerRate: 0.0025, nonFilerRate: 0.0025, taxStatus: "minimum" },
      { id: "gsc-gold", label: "Gold / silver supplies", filerRate: 0.01, nonFilerRate: 0.02, taxStatus: "adjustable" },
      { id: "gsc-goods-co", label: "Sale of goods – Company", filerRate: 0.05, nonFilerRate: 0.10, taxStatus: "minimum" },
      { id: "gsc-goods-co-toll", label: "Sale of goods – Company (toll mfg)", filerRate: 0.09, nonFilerRate: 0.18, taxStatus: "minimum" },
      { id: "gsc-goods-other", label: "Sale of goods – Other", filerRate: 0.055, nonFilerRate: 0.11, taxStatus: "minimum" },
      { id: "gsc-svc-transport", label: "Specified services (transport, freight)", filerRate: 0.06, nonFilerRate: 0.12, taxStatus: "minimum" },
      { id: "gsc-svc-it", label: "IT services", filerRate: 0.04, nonFilerRate: 0.08, taxStatus: "minimum" },
      { id: "gsc-oil-tanker", label: "Oil tanker contractor", filerRate: 0.02, nonFilerRate: 0.04, taxStatus: "minimum" },
      { id: "gsc-svc-co", label: "Other services – Company", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "minimum" },
      { id: "gsc-svc-other", label: "Other services – Others", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "minimum" },
      { id: "gsc-media", label: "Media advertisement", filerRate: 0.015, nonFilerRate: 0.03, taxStatus: "minimum" },
      { id: "gsc-contract-co", label: "Contracts – Company", filerRate: 0.075, nonFilerRate: 0.15, taxStatus: "minimum" },
      { id: "gsc-contract-other", label: "Contracts – Others", filerRate: 0.08, nonFilerRate: 0.16, taxStatus: "minimum" },
      { id: "gsc-contract-sport", label: "Contracts – Sports person", filerRate: 0.15, nonFilerRate: 0.30, taxStatus: "minimum" },
    ],
  },
  {
    id: "rental-income",
    label: "Rental Income",
    section: "s.155",
    subTypes: [], // slab-based, handled separately
  },
  {
    id: "property-sale",
    label: "Property Sale / Transfer",
    section: "s.236C",
    subTypes: [], // tiered by value, handled separately
  },
  {
    id: "property-purchase",
    label: "Property Purchase",
    section: "s.236K",
    subTypes: [], // tiered by value, handled separately
  },
  {
    id: "other",
    label: "Other Sections",
    section: "Various",
    subTypes: [
      { id: "oth-cash", label: "Cash withdrawal >50K/day (s.231AB)", filerRate: 0, nonFilerRate: 0.008, taxStatus: "adjustable" },
      { id: "oth-ad-agent", label: "Ad agent commission (s.233-I)", filerRate: 0.10, nonFilerRate: 0.20, taxStatus: "adjustable" },
      { id: "oth-life-ins", label: "Life insurance agent <0.5M (s.233-II)", filerRate: 0.08, nonFilerRate: 0.16, taxStatus: "adjustable" },
      { id: "oth-brokerage", label: "Other brokerage/commission (s.233-III)", filerRate: 0.12, nonFilerRate: 0.24, taxStatus: "adjustable" },
      { id: "oth-phone", label: "Telephone bill >1,000 (s.236)", filerRate: 0.10, nonFilerRate: 0.10, taxStatus: "adjustable" },
      { id: "oth-internet", label: "Internet/prepaid cards (s.236-II)", filerRate: 0.15, nonFilerRate: 0.75, taxStatus: "adjustable" },
      { id: "oth-functions", label: "Functions/gatherings (s.236CB)", filerRate: 0.10, nonFilerRate: 0.10, taxStatus: "adjustable" },
      { id: "oth-remit", label: "Remittance abroad via cards (s.236Y)", filerRate: 0.05, nonFilerRate: 0.10, taxStatus: "adjustable" },
      { id: "oth-bonus", label: "Bonus shares (s.236Z)", filerRate: 0.10, nonFilerRate: 0.10, taxStatus: "final" },
    ],
  },
];

// --- Rental Income Slabs (s.155) ---
export interface RentalSlab {
  min: number;
  max: number;
  fixedAmount: number;
  rate: number;
}

export const RENTAL_SLABS: RentalSlab[] = [
  { min: 0, max: 300_000, fixedAmount: 0, rate: 0 },
  { min: 300_000, max: 600_000, fixedAmount: 0, rate: 0.05 },
  { min: 600_000, max: 2_000_000, fixedAmount: 15_000, rate: 0.10 },
  { min: 2_000_000, max: Infinity, fixedAmount: 155_000, rate: 0.25 },
];

export const RENTAL_COMPANY_FILER_RATE = 0.15;
export const RENTAL_COMPANY_NON_FILER_RATE = 0.30;

// --- Property Sale Tiers (s.236C) ---
export interface PropertyTier {
  min: number;
  max: number;
  filerRate: number;
  lateFilerRate: number;
  nonFilerRate: number;
}

export const PROPERTY_SALE_TIERS: PropertyTier[] = [
  { min: 0, max: 50_000_000, filerRate: 0.045, lateFilerRate: 0.075, nonFilerRate: 0.115 },
  { min: 50_000_000, max: 100_000_000, filerRate: 0.05, lateFilerRate: 0.085, nonFilerRate: 0.115 },
  { min: 100_000_000, max: Infinity, filerRate: 0.055, lateFilerRate: 0.095, nonFilerRate: 0.115 },
];

// --- Property Purchase Tiers (s.236K) ---
export const PROPERTY_PURCHASE_TIERS: PropertyTier[] = [
  { min: 0, max: 50_000_000, filerRate: 0.015, lateFilerRate: 0.045, nonFilerRate: 0.105 },
  { min: 50_000_000, max: 100_000_000, filerRate: 0.02, lateFilerRate: 0.055, nonFilerRate: 0.145 },
  { min: 100_000_000, max: Infinity, filerRate: 0.025, lateFilerRate: 0.065, nonFilerRate: 0.185 },
];

export function getWHTCategory(id: string): WHTCategoryDef | undefined {
  return WHT_CATEGORIES.find((c) => c.id === id);
}
