// ============================================================
// Damages Multipliers & Case Type Configuration
// General estimator based on Pakistani case law principles
// ============================================================

export interface DamagesCaseConfig {
  type: string;
  label: string;
  baseFields: { key: string; label: string; description: string }[];
  generalDamagesMultiplier: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
}

export const DAMAGES_CASE_CONFIGS: DamagesCaseConfig[] = [
  {
    type: "personal-injury",
    label: "Personal Injury",
    baseFields: [
      { key: "medicalExpenses", label: "Medical Expenses", description: "Hospital bills, treatment costs, medication, rehabilitation" },
      { key: "lostWages", label: "Lost Wages", description: "Income lost during recovery period" },
      { key: "futureMedical", label: "Future Medical Costs", description: "Estimated ongoing treatment or therapy costs" },
      { key: "futureLostEarnings", label: "Future Lost Earnings", description: "Projected loss of earning capacity" },
    ],
    generalDamagesMultiplier: {
      conservative: 1.5,
      moderate: 3.0,
      aggressive: 5.0,
    },
  },
  {
    type: "property-damage",
    label: "Property Damage",
    baseFields: [
      { key: "repairCosts", label: "Repair/Replacement Costs", description: "Cost to repair or replace damaged property" },
      { key: "lossOfUse", label: "Loss of Use", description: "Rental or alternative arrangement costs during repairs" },
      { key: "diminishedValue", label: "Diminished Value", description: "Reduction in property value even after repair" },
    ],
    generalDamagesMultiplier: {
      conservative: 1.0,
      moderate: 1.5,
      aggressive: 2.0,
    },
  },
  {
    type: "contract-breach",
    label: "Breach of Contract",
    baseFields: [
      { key: "directLoss", label: "Direct Financial Loss", description: "Actual monetary loss from the breach" },
      { key: "consequentialLoss", label: "Consequential Damages", description: "Foreseeable losses resulting from the breach" },
      { key: "lostProfits", label: "Lost Profits", description: "Profits that would have been earned but for the breach" },
    ],
    generalDamagesMultiplier: {
      conservative: 1.0,
      moderate: 1.5,
      aggressive: 2.5,
    },
  },
  {
    type: "defamation",
    label: "Defamation",
    baseFields: [
      { key: "financialLoss", label: "Financial Loss", description: "Provable financial damage from the defamation" },
      { key: "reputationalDamage", label: "Reputational Damage (estimated)", description: "Estimated value of reputational harm" },
    ],
    generalDamagesMultiplier: {
      conservative: 2.0,
      moderate: 4.0,
      aggressive: 8.0,
    },
  },
  {
    type: "wrongful-termination",
    label: "Wrongful Termination",
    baseFields: [
      { key: "lostSalary", label: "Lost Salary & Benefits", description: "Salary and benefits from termination to expected resolution" },
      { key: "noticePayDue", label: "Notice Pay Due", description: "Salary in lieu of notice period not served" },
      { key: "bonusDue", label: "Bonus/Gratuity Due", description: "Unpaid bonus, gratuity, or provident fund" },
    ],
    generalDamagesMultiplier: {
      conservative: 1.0,
      moderate: 2.0,
      aggressive: 3.0,
    },
  },
];

export const SEVERITY_LABELS: Record<number, string> = {
  1: "Minor",
  2: "Moderate",
  3: "Significant",
  4: "Severe",
  5: "Catastrophic",
};

export const SEVERITY_MULTIPLIERS: Record<number, number> = {
  1: 0.5,
  2: 0.75,
  3: 1.0,
  4: 1.5,
  5: 2.0,
};

export const CONDUCT_MULTIPLIERS: Record<string, { label: string; multiplier: number }> = {
  normal: { label: "Normal/Accidental", multiplier: 1.0 },
  negligent: { label: "Negligent", multiplier: 1.25 },
  "grossly-negligent": { label: "Grossly Negligent", multiplier: 1.5 },
  willful: { label: "Willful/Intentional", multiplier: 2.0 },
};
