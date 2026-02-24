import { CalculatorMeta } from "./types";

// ============================================================
// Calculator Portal — Constants & Metadata
// ============================================================

// --- Brand Colors ---
export const CALC_ACCENT = "#059669"; // emerald-600
export const CALC_ACCENT_HOVER = "#047857"; // emerald-700
export const CALC_ACCENT_LIGHT = "#059669/10"; // for active sidebar

// --- Nisab Values (approximate PKR) ---
export const NISAB_GOLD_TOLA = 7.5; // 7.5 tola of gold
export const NISAB_SILVER_TOLA = 52.5; // 52.5 tola of silver
export const GOLD_RATE_PER_TOLA = 245000; // approximate, user can override
export const SILVER_RATE_PER_TOLA = 2800; // approximate, user can override

// --- Zakat ---
export const ZAKAT_RATE = 0.025; // 2.5%

// --- Currency ---
export function formatPKR(amount: number): string {
  if (isNaN(amount)) return "Rs. 0";
  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPKRDecimal(amount: number): string {
  if (isNaN(amount)) return "Rs. 0.00";
  return `Rs. ${amount.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

// --- All 11 Calculator Metadata ---
export const CALCULATORS: CalculatorMeta[] = [
  // Core Calculators
  {
    id: "inheritance",
    name: "Inheritance Calculator",
    shortName: "Inheritance",
    description:
      "Calculate Islamic inheritance shares under Hanafi and Shia Ja'fari schools with automatic aul/radd adjustments.",
    icon: "Users",
    href: "/calculators/inheritance",
    group: "core",
    legalBasis: "Muslim Personal Law (Shariat) Application Act 1962",
    status: "active",
  },
  {
    id: "limitation",
    name: "Limitation Period Calculator",
    shortName: "Limitation",
    description:
      "Find filing deadlines under the Limitation Act 1908. Search 30+ articles by case type with extension calculations.",
    icon: "Clock",
    href: "/calculators/limitation",
    group: "core",
    legalBasis: "Limitation Act 1908",
    status: "active",
  },
  {
    id: "zakat",
    name: "Zakat Calculator",
    shortName: "Zakat",
    description:
      "Calculate annual Zakat obligation at 2.5% with nisab comparison, asset categorization, and deduction support.",
    icon: "Heart",
    href: "/calculators/zakat",
    group: "core",
    legalBasis: "Zakat & Ushr Ordinance 1980",
    status: "active",
  },
  // Tax Calculators
  {
    id: "income-tax",
    name: "Income Tax Calculator",
    shortName: "Income Tax",
    description:
      "Compute income tax liability using FBR slab rates for salaried, non-salaried, and AOP taxpayers.",
    icon: "Receipt",
    href: "/calculators/income-tax",
    group: "tax",
    legalBasis: "Income Tax Ordinance 2001",
    status: "active",
  },
  {
    id: "withholding-tax",
    name: "Withholding Tax Calculator",
    shortName: "WHT",
    description:
      "Look up withholding tax rates by transaction type. Covers salary, dividends, property, goods, and services.",
    icon: "Percent",
    href: "/calculators/withholding-tax",
    group: "tax",
    legalBasis: "Income Tax Ordinance 2001",
    status: "active",
  },
  {
    id: "capital-gains-tax",
    name: "Capital Gains Tax Calculator",
    shortName: "CGT",
    description:
      "Calculate capital gains tax on securities and immovable property based on holding period and filer status.",
    icon: "TrendingUp",
    href: "/calculators/capital-gains-tax",
    group: "tax",
    legalBasis: "Income Tax Ordinance 2001",
    status: "active",
  },
  {
    id: "sales-tax",
    name: "Sales Tax Calculator",
    shortName: "Sales Tax",
    description:
      "Compute GST on goods and services at standard 18% or reduced rates. Supports reverse calculation.",
    icon: "ShoppingCart",
    href: "/calculators/sales-tax",
    group: "tax",
    legalBasis: "Sales Tax Act 1990",
    status: "active",
  },
  {
    id: "customs-duty",
    name: "Customs Duty Calculator",
    shortName: "Customs",
    description:
      "Calculate total landed cost including customs duty, regulatory duty, sales tax, and WHT on imports.",
    icon: "Ship",
    href: "/calculators/customs-duty",
    group: "tax",
    legalBasis: "Customs Act 1969",
    status: "active",
  },
  {
    id: "tax-penalties",
    name: "Tax Penalties Calculator",
    shortName: "Penalties",
    description:
      "Estimate penalties for late filing, late payment, concealment, and default surcharge under the ITO.",
    icon: "AlertTriangle",
    href: "/calculators/tax-penalties",
    group: "tax",
    legalBasis: "Income Tax Ordinance 2001",
    status: "active",
  },
  // Civil & Family
  {
    id: "damages",
    name: "Damages Calculator",
    shortName: "Damages",
    description:
      "Estimate compensation ranges for personal injury, property damage, contract breach, defamation, and wrongful termination.",
    icon: "Scale",
    href: "/calculators/damages",
    group: "civil",
    legalBasis: "Civil Procedure Code & Case Law",
    status: "active",
  },
  {
    id: "iddat",
    name: "Iddat Period Calculator",
    shortName: "Iddat",
    description:
      "Calculate the mandatory waiting period after divorce or death of husband under Islamic family law.",
    icon: "Calendar",
    href: "/calculators/iddat",
    group: "civil",
    legalBasis: "Muslim Family Laws Ordinance 1961",
    status: "active",
  },
];

export const CALCULATOR_GROUPS = [
  { id: "core", label: "Core Calculators" },
  { id: "tax", label: "Tax Calculators" },
  { id: "civil", label: "Civil & Family" },
] as const;

export function getCalculator(id: string): CalculatorMeta | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

export function getCalculatorsByGroup(group: string): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.group === group);
}
