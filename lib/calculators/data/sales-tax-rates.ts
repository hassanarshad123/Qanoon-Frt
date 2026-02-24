// ============================================================
// Sales Tax Rates — Pakistan
// Based on the Sales Tax Act 1990
// ============================================================

export const SALES_TAX_RATES = {
  // Standard GST on goods
  standardRate: 0.18, // 18%

  // Reduced rate (certain essential goods)
  reducedRate: 0.10, // 10%

  // Zero-rated (exported goods, certain supplies)
  zeroRate: 0,

  // Provincial service tax rates
  provincialRates: {
    punjab: 0.16, // 16%
    sindh: 0.15, // 15%
    kpk: 0.15, // 15%
    balochistan: 0.15, // 15%
    islamabad: 0.16, // 16% (federal for ICT)
  } as Record<string, number>,

  // Federal services rate
  federalServiceRate: 0.16, // 16%

  // Extra tax for unregistered persons buying from registered
  extraTaxUnregistered: 0.03, // 3%

  // Further tax for supplies to unregistered
  furtherTax: 0.04, // 4%
};

export const PROVINCE_LABELS: Record<string, string> = {
  punjab: "Punjab",
  sindh: "Sindh",
  kpk: "Khyber Pakhtunkhwa",
  balochistan: "Balochistan",
  islamabad: "Islamabad Capital Territory",
};
