// ============================================================
// Calculator Portal — Shared TypeScript Interfaces
// ============================================================

// --- Calculator Metadata ---

export interface CalculatorMeta {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // lucide icon name
  href: string;
  group: "core" | "tax" | "civil";
  legalBasis: string;
  status: "active" | "coming-soon";
}

// --- Wizard ---

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
}

// --- Limitation Calculator ---

export interface LimitationArticle {
  article: number;
  description: string;
  period: string; // human-readable, e.g. "3 years"
  periodDays: number;
  category: string;
  startPoint: string; // when cause of action accrues
  section?: string; // ITO or CPC section
}

export interface LimitationInput {
  articleNumber: number;
  accrualDate: Date;
  extensions: {
    minority: boolean;
    disability: boolean;
    absenceFromPakistan: boolean;
    acknowledgmentDate?: Date;
  };
}

export interface LimitationResult {
  article: LimitationArticle;
  accrualDate: Date;
  baseDeadline: Date;
  extensionDays: number;
  finalDeadline: Date;
  daysRemaining: number;
  status: "safe" | "warning" | "expired";
  extensionBreakdown: { label: string; days: number }[];
}

// --- Zakat Calculator ---

export interface ZakatAssets {
  cashOnHand: number;
  bankBalances: number;
  goldValue: number;
  silverValue: number;
  investments: number;
  businessInventory: number;
  receivables: number;
  otherAssets: number;
}

export interface ZakatDeductions {
  personalDebts: number;
  businessLiabilities: number;
  dueExpenses: number;
}

export interface ZakatInput {
  assets: ZakatAssets;
  deductions: ZakatDeductions;
}

export interface ZakatResult {
  totalAssets: number;
  totalDeductions: number;
  netWorth: number;
  nisabGold: number;
  nisabSilver: number;
  nisabThreshold: number; // lower of gold/silver
  isAboveNisab: boolean;
  zakatAmount: number;
  zakatRate: number; // 0.025
  assetBreakdown: { label: string; amount: number; percentage: number }[];
}

// --- Inheritance Calculator ---

export type InheritanceSchool = "hanafi" | "shia";

export type HeirType =
  | "husband"
  | "wife"
  | "father"
  | "mother"
  | "son"
  | "daughter"
  | "paternal-grandfather"
  | "paternal-grandmother"
  | "maternal-grandmother"
  | "full-brother"
  | "full-sister"
  | "paternal-half-brother"
  | "paternal-half-sister"
  | "maternal-half-brother"
  | "maternal-half-sister"
  | "sons-son"
  | "sons-daughter";

export interface InheritanceInput {
  school: InheritanceSchool;
  deceasedGender: "male" | "female";
  heirs: Partial<Record<HeirType, number>>; // heir type → count
  estateValue: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number; // max 1/3 of net estate
}

export interface InheritanceHeirShare {
  heir: string;
  heirType: HeirType;
  count: number;
  fraction: [number, number]; // numerator, denominator
  sharePercentage: number;
  totalAmount: number;
  perPersonAmount: number;
  basis: string;
}

export interface InheritanceResult {
  school: InheritanceSchool;
  grossEstate: number;
  debts: number;
  funeralExpenses: number;
  wasiyyah: number;
  netEstate: number;
  shares: InheritanceHeirShare[];
  blockedHeirs: { heir: string; blockedBy: string }[];
  hasAwl: boolean; // shares exceed 1
  hasRadd: boolean; // shares less than 1
  adjustmentNote?: string;
}

// --- Income Tax Calculator ---

export type TaxpayerType = "salaried" | "non-salaried";
export type FilerStatus = "filer" | "non-filer";

export interface IncomeTaxSlab {
  min: number;
  max: number; // Infinity for last slab
  fixedAmount: number;
  rate: number; // decimal, e.g. 0.11 for 11%
}

export interface IncomeTaxInput {
  taxpayerType: TaxpayerType;
  annualIncome: number;
}

export interface IncomeTaxResult {
  taxpayerType: TaxpayerType;
  taxableIncome: number;
  baseTax: number;
  surchargeRate: number;
  surchargeAmount: number;
  totalTax: number;
  monthlyTax: number;
  effectiveRate: number;
  slabBreakdown: { slab: string; income: number; rate: number; tax: number }[];
}

// --- Withholding Tax Calculator ---

export type WHTCategory =
  | "imports"
  | "salary"
  | "dividends"
  | "profit-on-debt"
  | "goods-services-contracts"
  | "rental-income"
  | "property-sale"
  | "property-purchase"
  | "other";

export type WHTTaxStatus = "final" | "minimum" | "adjustable";
export type PropertyFilerStatus = "filer" | "late-filer" | "non-filer";

export interface WHTSubType {
  id: string;
  label: string;
  filerRate: number;
  nonFilerRate: number;
  taxStatus: WHTTaxStatus;
}

export interface WHTCategoryDef {
  id: WHTCategory;
  label: string;
  section: string;
  subTypes: WHTSubType[];
}

export interface WHTInput {
  category: WHTCategory;
  subTypeId?: string;
  amount: number;
  filerStatus: FilerStatus;
  propertyFilerStatus?: PropertyFilerStatus; // for s.236C/236K
}

export interface WHTResult {
  category: WHTCategory;
  categoryLabel: string;
  subTypeLabel: string;
  section: string;
  amount: number;
  rate: number;
  inactiveRate: number;
  whtAmount: number;
  netAmount: number;
  taxStatus: WHTTaxStatus;
}

// --- Capital Gains Tax Calculator ---

export type CGTAssetType = "listed-securities" | "immovable-property" | "pmex" | "other";
export type PropertyType = "open-plot" | "constructed" | "flat";

export interface CGTInput {
  assetType: CGTAssetType;
  propertyType?: PropertyType; // for immovable property
  acquisitionDate: string; // ISO date string
  disposalDate: string;
  acquisitionCost: number;
  salePrice: number;
  filerStatus: FilerStatus;
}

export interface CGTResult {
  assetType: CGTAssetType;
  propertyType?: PropertyType;
  acquisitionCost: number;
  salePrice: number;
  capitalGain: number;
  holdingPeriodDays: number;
  holdingPeriodYears: number;
  holdingPeriodLabel: string;
  acquisitionEra: string;
  applicableRate: number;
  cgtAmount: number;
  netProceeds: number;
  section: string;
}

// --- Sales Tax Calculator ---

export type SalesTaxType = "goods-standard" | "goods-reduced" | "services-federal" | "services-provincial";

export interface SalesTaxInput {
  type: SalesTaxType;
  amount: number;
  priceIncludesTax: boolean;
  isRegistered: boolean;
  province?: string;
}

export interface SalesTaxResult {
  type: SalesTaxType;
  taxExclusivePrice: number;
  salesTaxRate: number;
  salesTaxAmount: number;
  extraTaxForUnregistered: number;
  furtherTax: number;
  totalTax: number;
  totalInclusivePrice: number;
}

// --- Customs Duty Calculator ---

export type CustomsDutyInputMode = "category" | "manual";

export interface CustomsDutyCategory {
  id: string;
  label: string;
  description: string;
  cdRate: number;
  rdRate: number;
  fedRate: number;
  whtRate: number;
}

export interface CustomsDutyInput {
  inputMode: CustomsDutyInputMode;
  categoryId?: string;
  cifValue: number;
  filerStatus: FilerStatus;
  // manual overrides
  cdRate?: number;
  rdRate?: number;
  fedRate?: number;
  whtRate?: number;
}

export interface CustomsDutyResult {
  cifValue: number;
  categoryLabel: string;
  cdRate: number;
  customsDuty: number;
  rdRate: number;
  regulatoryDuty: number;
  acdRate: number;
  additionalCustomsDuty: number;
  fedRate: number;
  federalExciseDuty: number;
  stRate: number;
  salesTax: number;
  whtRate: number;
  whtOnImport: number;
  totalDutiesAndTaxes: number;
  totalLandedCost: number;
  dutiesAsPercentOfCIF: number;
}

// --- Tax Penalties Calculator ---

export type PenaltyType =
  | "late-filing"
  | "late-payment"
  | "failure-to-furnish"
  | "concealment"
  | "default-surcharge";

export interface TaxPenaltyInput {
  penaltyType: PenaltyType;
  dueDate: Date;
  actualDate: Date;
  amountInvolved: number;
  isFirstOffense: boolean;
  isVoluntaryDisclosure: boolean;
  income?: number; // annual income for tiered late-filing penalty
  entityType?: "individual" | "company"; // defaults to "individual"
}

export interface TaxPenaltyResult {
  penaltyType: PenaltyType;
  penaltyTypeLabel: string;
  daysLate: number;
  penaltyAmount: number;
  defaultSurcharge: number;
  totalPayable: number;
  relevantSection: string;
  explanation: string;
}

// --- Damages Calculator ---

export type DamagesCaseType =
  | "personal-injury"
  | "property-damage"
  | "contract-breach"
  | "defamation"
  | "wrongful-termination";

export interface DamagesInput {
  caseType: DamagesCaseType;
  baseAmounts: Record<string, number>; // dynamic fields per case type
  severity: number; // 1-5
  defendantConduct: "normal" | "negligent" | "grossly-negligent" | "willful";
  contributoryNegligence: number; // 0-100 percentage
  harmDuration: "temporary" | "permanent" | "ongoing";
}

export interface DamagesResult {
  caseType: DamagesCaseType;
  specialDamages: number;
  generalDamagesMultiplier: number;
  generalDamages: number;
  negligenceReduction: number;
  conservativeEstimate: number;
  moderateEstimate: number;
  aggressiveEstimate: number;
  breakdown: { label: string; amount: number }[];
  disclaimer: string;
}

// --- Iddat Calculator ---

export type IddatReason =
  | "divorce-talaq"
  | "divorce-khula"
  | "death-of-husband"
  | "annulment";

export interface IddatInput {
  reason: IddatReason;
  eventDate: Date;
  isPregnant: boolean;
}

export interface IddatResult {
  reason: IddatReason;
  reasonLabel: string;
  eventDate: Date;
  endDate: Date | null; // null if pregnant (until delivery)
  durationDays: number | null;
  daysRemaining: number | null;
  ruleApplied: string;
  legalBasis: string;
  isPregnant: boolean;
}

// --- Shared UI Types ---

export interface BreakdownStep {
  step: number;
  label: string;
  calculation: string;
  result: string;
}

export interface PrintReportData {
  calculatorName: string;
  date: Date;
  inputs: { label: string; value: string }[];
  results: { label: string; value: string }[];
  breakdown: BreakdownStep[];
  disclaimer: string;
}
