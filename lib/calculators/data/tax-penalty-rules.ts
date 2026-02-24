// ============================================================
// Tax Penalty Rules — Pakistan
// Based on Income Tax Ordinance 2001, Sections 114, 118, 119, 120, 122, 182, 205
// ============================================================

export interface PenaltyRule {
  type: string;
  label: string;
  description: string;
  section: string;
  penaltyFormula: string;
  notes: string;
}

export const PENALTY_RULES: PenaltyRule[] = [
  {
    type: "late-filing",
    label: "Late Filing of Return",
    description: "Return of income not filed within the due date under Section 114",
    section: "Section 182",
    penaltyFormula: "Tiered by income: Rs. 1,000 (income ≤ Rs. 5L), Rs. 5,000 (≤ Rs. 10L), Rs. 25,000 (> Rs. 10L) for individuals; Rs. 50,000 for companies/AOPs, plus Rs. 100/day for continued default up to 25% of tax payable",
    notes: "Penalty may be reduced for voluntary filing. First-time offenders may receive leniency.",
  },
  {
    type: "late-payment",
    label: "Late Payment of Tax",
    description: "Tax not paid by the due date specified in the demand notice",
    section: "Section 205",
    penaltyFormula: "Default surcharge at KIBOR + 3% per annum on the outstanding tax amount",
    notes: "Default surcharge is calculated from the due date to the date of payment.",
  },
  {
    type: "failure-to-furnish",
    label: "Failure to Furnish Information / Statement",
    description: "Failure to furnish statement or information required under the Ordinance",
    section: "Section 182(1)",
    penaltyFormula: "Rs. 2,500 per day of default, minimum Rs. 25,000",
    notes: "Applicable for failure to file wealth statement, withholding statements, etc.",
  },
  {
    type: "concealment",
    label: "Concealment of Income",
    description: "Furnishing inaccurate particulars of income or concealing income",
    section: "Section 191",
    penaltyFormula: "25% to 100% of the tax sought to be evaded, depending on the degree of concealment",
    notes: "First offense typically attracts 25%. Repeat offenses or willful concealment can attract up to 100%. Voluntary disclosure before detection may reduce penalty.",
  },
  {
    type: "default-surcharge",
    label: "Default Surcharge",
    description: "Surcharge on unpaid tax from the due date to the date of actual payment",
    section: "Section 205",
    penaltyFormula: "KIBOR + 3% per annum, calculated daily",
    notes: "The KIBOR rate used is the rate applicable on the first day of each quarter. Currently approximately 20-22% + 3%.",
  },
];

// Approximate KIBOR rate + 3% for default surcharge calculation
// This should be updated periodically
export const DEFAULT_SURCHARGE_ANNUAL_RATE = 0.25; // 25% per annum (KIBOR ~22% + 3%)

// Late filing penalty amounts
export const LATE_FILING_PENALTY = {
  // Income-tiered base penalties for individuals
  individualTiers: [
    { maxIncome: 500000, penalty: 1000 },    // income ≤ Rs. 5 lakh
    { maxIncome: 1000000, penalty: 5000 },   // income ≤ Rs. 10 lakh
    { maxIncome: Infinity, penalty: 25000 },  // income > Rs. 10 lakh
  ],
  company: 50000,
  dailyRate: 100,
  maxPercentOfTax: 0.25, // 25% of tax payable
};

// Concealment penalty ranges
export const CONCEALMENT_PENALTY = {
  firstOffense: 0.25, // 25%
  secondOffense: 0.50, // 50%
  willful: 1.0, // 100%
  voluntaryDisclosure: 0.10, // 10% (reduced)
};
