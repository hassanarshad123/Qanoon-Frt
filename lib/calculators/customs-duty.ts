import type { CustomsDutyInput, CustomsDutyResult } from "./types";
import {
  CUSTOMS_CATEGORIES,
  ACD_RATE,
  IMPORT_SALES_TAX_RATE,
  WHT_NON_FILER_MULTIPLIER,
} from "./data/customs-duty-rates";

// ============================================================
// Customs Duty Calculator — Pure Computation Logic
// Customs Act 1969
// ============================================================

export function calculateCustomsDuty(input: CustomsDutyInput): CustomsDutyResult {
  const { cifValue, filerStatus, inputMode } = input;

  // Get rates (from category or manual)
  let cdRate = 0, rdRate = 0, fedRate = 0, whtRate = 0;
  let categoryLabel = "Manual Entry";

  if (inputMode === "category" && input.categoryId) {
    const cat = CUSTOMS_CATEGORIES.find((c) => c.id === input.categoryId);
    if (cat) {
      cdRate = cat.cdRate;
      rdRate = cat.rdRate;
      fedRate = cat.fedRate;
      whtRate = cat.whtRate;
      categoryLabel = cat.label;
    }
  } else {
    cdRate = input.cdRate ?? 0;
    rdRate = input.rdRate ?? 0;
    fedRate = input.fedRate ?? 0;
    whtRate = input.whtRate ?? 0;
    categoryLabel = "Manual Rate Entry";
  }

  // Adjust WHT for non-filer
  const effectiveWhtRate = filerStatus === "non-filer"
    ? whtRate * WHT_NON_FILER_MULTIPLIER
    : whtRate;

  // Layered calculation
  const customsDuty = Math.round(cifValue * cdRate);
  const regulatoryDuty = Math.round(cifValue * rdRate);
  const acdBase = cifValue + customsDuty;
  const additionalCustomsDuty = Math.round(acdBase * ACD_RATE);
  const fedBase = cifValue + customsDuty;
  const federalExciseDuty = Math.round(fedBase * fedRate);
  const stBase = cifValue + customsDuty + federalExciseDuty;
  const salesTax = Math.round(stBase * IMPORT_SALES_TAX_RATE);
  const whtBase = cifValue + customsDuty + salesTax + federalExciseDuty;
  const whtOnImport = Math.round(whtBase * effectiveWhtRate);

  const totalDutiesAndTaxes = customsDuty + regulatoryDuty + additionalCustomsDuty + federalExciseDuty + salesTax + whtOnImport;
  const totalLandedCost = cifValue + totalDutiesAndTaxes;
  const dutiesAsPercentOfCIF = cifValue > 0 ? (totalDutiesAndTaxes / cifValue) * 100 : 0;

  return {
    cifValue,
    categoryLabel,
    cdRate,
    customsDuty,
    rdRate,
    regulatoryDuty,
    acdRate: ACD_RATE,
    additionalCustomsDuty,
    fedRate,
    federalExciseDuty,
    stRate: IMPORT_SALES_TAX_RATE,
    salesTax,
    whtRate: effectiveWhtRate,
    whtOnImport,
    totalDutiesAndTaxes,
    totalLandedCost,
    dutiesAsPercentOfCIF,
  };
}

export function getCustomsDutyBreakdown(result: CustomsDutyResult) {
  return [
    {
      step: 1,
      label: "CIF Value",
      calculation: "Cost + Insurance + Freight",
      result: `Rs. ${result.cifValue.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: `Customs Duty (${(result.cdRate * 100).toFixed(0)}%)`,
      calculation: `Rs. ${result.cifValue.toLocaleString("en-PK")} × ${(result.cdRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.customsDuty.toLocaleString("en-PK")}`,
    },
    {
      step: 3,
      label: `Regulatory Duty (${(result.rdRate * 100).toFixed(0)}%)`,
      calculation: `Rs. ${result.cifValue.toLocaleString("en-PK")} × ${(result.rdRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.regulatoryDuty.toLocaleString("en-PK")}`,
    },
    {
      step: 4,
      label: `Additional Customs Duty (${(result.acdRate * 100).toFixed(0)}%)`,
      calculation: `(CIF + CD) × ${(result.acdRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.additionalCustomsDuty.toLocaleString("en-PK")}`,
    },
    {
      step: 5,
      label: `Federal Excise Duty (${(result.fedRate * 100).toFixed(0)}%)`,
      calculation: `(CIF + CD) × ${(result.fedRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.federalExciseDuty.toLocaleString("en-PK")}`,
    },
    {
      step: 6,
      label: `Sales Tax (${(result.stRate * 100).toFixed(0)}%)`,
      calculation: `(CIF + CD + FED) × ${(result.stRate * 100).toFixed(0)}%`,
      result: `Rs. ${result.salesTax.toLocaleString("en-PK")}`,
    },
    {
      step: 7,
      label: `WHT on Import (${(result.whtRate * 100).toFixed(1)}%)`,
      calculation: `(CIF + CD + ST + FED) × ${(result.whtRate * 100).toFixed(1)}%`,
      result: `Rs. ${result.whtOnImport.toLocaleString("en-PK")}`,
    },
    {
      step: 8,
      label: "Total Landed Cost",
      calculation: `CIF + All Duties & Taxes`,
      result: `Rs. ${result.totalLandedCost.toLocaleString("en-PK")}`,
    },
  ];
}
