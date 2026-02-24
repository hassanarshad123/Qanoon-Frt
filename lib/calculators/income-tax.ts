import type { IncomeTaxInput, IncomeTaxResult, IncomeTaxSlab } from "./types";
import {
  SALARIED_SLABS,
  NON_SALARIED_SLABS,
  SURCHARGE_THRESHOLD,
  SALARIED_SURCHARGE_RATE,
  NON_SALARIED_SURCHARGE_RATE,
  getSlabLabel,
} from "./data/income-tax-slabs";

// ============================================================
// Income Tax Calculator — Pure Computation Logic
// Income Tax Ordinance 2001, First Schedule Part I Division I
// Finance Act 2025, Tax Year 2026
// ============================================================

function getSlabs(type: "salaried" | "non-salaried"): IncomeTaxSlab[] {
  return type === "salaried" ? SALARIED_SLABS : NON_SALARIED_SLABS;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const { taxpayerType, annualIncome } = input;
  const slabs = getSlabs(taxpayerType);
  const income = Math.max(0, annualIncome);

  let baseTax = 0;
  const slabBreakdown: IncomeTaxResult["slabBreakdown"] = [];

  for (const slab of slabs) {
    if (income <= slab.min) {
      slabBreakdown.push({
        slab: getSlabLabel(slab),
        income: 0,
        rate: slab.rate,
        tax: 0,
      });
      continue;
    }

    const taxableInSlab = Math.min(income, slab.max) - slab.min;

    if (taxableInSlab > 0) {
      const taxInSlab = slab.min === 0 && slab.rate === 0
        ? 0
        : slab === slabs[0]
          ? 0
          : taxableInSlab * slab.rate;

      slabBreakdown.push({
        slab: getSlabLabel(slab),
        income: taxableInSlab,
        rate: slab.rate,
        tax: Math.round(taxInSlab),
      });
    }
  }

  // Calculate base tax using the slab-based formula
  for (const slab of slabs) {
    if (income > slab.min && income <= slab.max) {
      baseTax = slab.fixedAmount + (income - slab.min) * slab.rate;
      break;
    }
    if (income > slab.max && slab.max === Infinity) {
      baseTax = slab.fixedAmount + (income - slab.min) * slab.rate;
      break;
    }
  }

  baseTax = Math.round(baseTax);

  // Surcharge
  const surchargeRate =
    income > SURCHARGE_THRESHOLD
      ? taxpayerType === "salaried"
        ? SALARIED_SURCHARGE_RATE
        : NON_SALARIED_SURCHARGE_RATE
      : 0;
  const surchargeAmount = Math.round(baseTax * surchargeRate);
  const totalTax = baseTax + surchargeAmount;
  const monthlyTax = Math.round(totalTax / 12);
  const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    taxpayerType,
    taxableIncome: income,
    baseTax,
    surchargeRate,
    surchargeAmount,
    totalTax,
    monthlyTax,
    effectiveRate,
    slabBreakdown,
  };
}

export function getIncomeTaxBreakdown(result: IncomeTaxResult) {
  const steps = [
    {
      step: 1,
      label: "Taxable Income",
      calculation: "Annual taxable income entered",
      result: `Rs. ${result.taxableIncome.toLocaleString("en-PK")}`,
    },
  ];

  let stepNum = 2;
  for (const slab of result.slabBreakdown) {
    if (slab.income > 0 && slab.rate > 0) {
      steps.push({
        step: stepNum++,
        label: `Slab: ${slab.slab}`,
        calculation: `Rs. ${slab.income.toLocaleString("en-PK")} × ${(slab.rate * 100).toFixed(0)}%`,
        result: `Rs. ${slab.tax.toLocaleString("en-PK")}`,
      });
    }
  }

  steps.push({
    step: stepNum++,
    label: "Base Tax",
    calculation: "Sum of slab-wise tax",
    result: `Rs. ${result.baseTax.toLocaleString("en-PK")}`,
  });

  if (result.surchargeAmount > 0) {
    steps.push({
      step: stepNum++,
      label: `Surcharge (${(result.surchargeRate * 100).toFixed(0)}%)`,
      calculation: `Rs. ${result.baseTax.toLocaleString("en-PK")} × ${(result.surchargeRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.surchargeAmount.toLocaleString("en-PK")}`,
    });
  }

  steps.push({
    step: stepNum,
    label: "Total Annual Tax",
    calculation: result.surchargeAmount > 0
      ? `Rs. ${result.baseTax.toLocaleString("en-PK")} + Rs. ${result.surchargeAmount.toLocaleString("en-PK")}`
      : "Base tax (no surcharge applicable)",
    result: `Rs. ${result.totalTax.toLocaleString("en-PK")}`,
  });

  return steps;
}
