import type { SalesTaxInput, SalesTaxResult } from "./types";
import { SALES_TAX_RATES } from "./data/sales-tax-rates";

// ============================================================
// Sales Tax Calculator — Pure Computation Logic
// Based on the Sales Tax Act 1990
// ============================================================

function getApplicableRate(input: SalesTaxInput): number {
  switch (input.type) {
    case "goods-standard":
      return SALES_TAX_RATES.standardRate;
    case "goods-reduced":
      return SALES_TAX_RATES.reducedRate;
    case "services-federal":
      return SALES_TAX_RATES.federalServiceRate;
    case "services-provincial":
      return input.province
        ? SALES_TAX_RATES.provincialRates[input.province] ?? SALES_TAX_RATES.federalServiceRate
        : SALES_TAX_RATES.federalServiceRate;
    default:
      return SALES_TAX_RATES.standardRate;
  }
}

export function calculateSalesTax(input: SalesTaxInput): SalesTaxResult {
  const rate = getApplicableRate(input);

  // Step 1: Determine tax-exclusive price
  let taxExclusivePrice: number;
  if (input.priceIncludesTax) {
    // Reverse calculation: price / (1 + rate) = exclusive price
    taxExclusivePrice = input.amount / (1 + rate);
  } else {
    taxExclusivePrice = input.amount;
  }

  // Step 2: Calculate sales tax
  const salesTaxAmount = taxExclusivePrice * rate;

  // Step 3: Extra tax for unregistered buyer
  const extraTaxForUnregistered = !input.isRegistered
    ? taxExclusivePrice * SALES_TAX_RATES.extraTaxUnregistered
    : 0;

  // Step 4: Further tax for supply to unregistered person
  // (only applicable if supplier is registered and buyer is not)
  const furtherTax = !input.isRegistered
    ? taxExclusivePrice * SALES_TAX_RATES.furtherTax
    : 0;

  // Step 5: Total
  const totalTax = salesTaxAmount + extraTaxForUnregistered + furtherTax;
  const totalInclusivePrice = taxExclusivePrice + totalTax;

  return {
    type: input.type,
    taxExclusivePrice: Math.round(taxExclusivePrice),
    salesTaxRate: rate,
    salesTaxAmount: Math.round(salesTaxAmount),
    extraTaxForUnregistered: Math.round(extraTaxForUnregistered),
    furtherTax: Math.round(furtherTax),
    totalTax: Math.round(totalTax),
    totalInclusivePrice: Math.round(totalInclusivePrice),
  };
}

export function getSalesTaxBreakdown(result: SalesTaxResult) {
  const steps = [
    {
      step: 1,
      label: "Tax-exclusive price",
      calculation: `Base value of supply`,
      result: `Rs. ${result.taxExclusivePrice.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: `Sales tax at ${(result.salesTaxRate * 100).toFixed(0)}%`,
      calculation: `Rs. ${result.taxExclusivePrice.toLocaleString("en-PK")} x ${(result.salesTaxRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.salesTaxAmount.toLocaleString("en-PK")}`,
    },
  ];

  if (result.extraTaxForUnregistered > 0) {
    steps.push({
      step: steps.length + 1,
      label: "Extra tax (unregistered buyer) at 3%",
      calculation: `Rs. ${result.taxExclusivePrice.toLocaleString("en-PK")} x 3%`,
      result: `Rs. ${result.extraTaxForUnregistered.toLocaleString("en-PK")}`,
    });
  }

  if (result.furtherTax > 0) {
    steps.push({
      step: steps.length + 1,
      label: "Further tax (supply to unregistered) at 3%",
      calculation: `Rs. ${result.taxExclusivePrice.toLocaleString("en-PK")} x 3%`,
      result: `Rs. ${result.furtherTax.toLocaleString("en-PK")}`,
    });
  }

  steps.push({
    step: steps.length + 1,
    label: "Total inclusive price",
    calculation: `Rs. ${result.taxExclusivePrice.toLocaleString("en-PK")} + Rs. ${result.totalTax.toLocaleString("en-PK")}`,
    result: `Rs. ${result.totalInclusivePrice.toLocaleString("en-PK")}`,
  });

  return steps;
}
