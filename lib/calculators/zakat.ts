import type { ZakatInput, ZakatResult } from "./types";
import { GOLD_SILVER_RATES } from "./data/gold-silver-rates";
import { ZAKAT_RATE } from "./constants";

// ============================================================
// Zakat Calculator — Pure Computation Logic
// Based on the Zakat & Ushr Ordinance 1980 and Islamic jurisprudence
// ============================================================

export function calculateZakat(input: ZakatInput): ZakatResult {
  // Step 1: Sum all zakatable assets
  const assetItems = [
    { label: "Cash on Hand", amount: input.assets.cashOnHand },
    { label: "Bank Balances", amount: input.assets.bankBalances },
    { label: "Gold Value", amount: input.assets.goldValue },
    { label: "Silver Value", amount: input.assets.silverValue },
    { label: "Investments", amount: input.assets.investments },
    { label: "Business Inventory", amount: input.assets.businessInventory },
    { label: "Receivables", amount: input.assets.receivables },
    { label: "Other Assets", amount: input.assets.otherAssets },
  ];

  const totalAssets = assetItems.reduce((sum, item) => sum + item.amount, 0);

  // Step 2: Sum all deductions
  const totalDeductions =
    input.deductions.personalDebts +
    input.deductions.businessLiabilities +
    input.deductions.dueExpenses;

  // Step 3: Calculate net worth
  const netWorth = Math.max(0, totalAssets - totalDeductions);

  // Step 4: Calculate nisab
  const nisabGold = GOLD_SILVER_RATES.goldNisabValue;
  const nisabSilver = GOLD_SILVER_RATES.silverNisabValue;
  const nisabThreshold = Math.min(nisabGold, nisabSilver); // lower of the two

  // Step 5: Compare to nisab
  const isAboveNisab = netWorth >= nisabThreshold;

  // Step 6: Calculate zakat
  const zakatAmount = isAboveNisab ? Math.round(netWorth * ZAKAT_RATE) : 0;

  // Step 7: Build asset breakdown for pie chart
  const assetBreakdown = assetItems
    .filter((item) => item.amount > 0)
    .map((item) => ({
      label: item.label,
      amount: item.amount,
      percentage: totalAssets > 0 ? (item.amount / totalAssets) * 100 : 0,
    }));

  return {
    totalAssets,
    totalDeductions,
    netWorth,
    nisabGold,
    nisabSilver,
    nisabThreshold,
    isAboveNisab,
    zakatAmount,
    zakatRate: ZAKAT_RATE,
    assetBreakdown,
  };
}

export function getZakatBreakdown(result: ZakatResult) {
  const steps = [
    {
      step: 1,
      label: "Total zakatable assets",
      calculation: result.assetBreakdown
        .map((a) => `${a.label}: Rs. ${a.amount.toLocaleString("en-PK")}`)
        .join(" + "),
      result: `Rs. ${result.totalAssets.toLocaleString("en-PK")}`,
    },
    {
      step: 2,
      label: "Deduct liabilities",
      calculation: `Rs. ${result.totalAssets.toLocaleString("en-PK")} - Rs. ${result.totalDeductions.toLocaleString("en-PK")}`,
      result: `Net worth: Rs. ${result.netWorth.toLocaleString("en-PK")}`,
    },
    {
      step: 3,
      label: "Compare to nisab",
      calculation: `Nisab (silver): Rs. ${result.nisabSilver.toLocaleString("en-PK")} | Nisab (gold): Rs. ${result.nisabGold.toLocaleString("en-PK")}`,
      result: `Threshold (lower): Rs. ${result.nisabThreshold.toLocaleString("en-PK")} — ${result.isAboveNisab ? "ABOVE nisab" : "BELOW nisab"}`,
    },
  ];

  if (result.isAboveNisab) {
    steps.push({
      step: 4,
      label: "Calculate zakat at 2.5%",
      calculation: `Rs. ${result.netWorth.toLocaleString("en-PK")} x 2.5%`,
      result: `Rs. ${result.zakatAmount.toLocaleString("en-PK")}`,
    });
  } else {
    steps.push({
      step: 4,
      label: "Zakat not obligatory",
      calculation: "Net worth is below the nisab threshold",
      result: "Rs. 0",
    });
  }

  return steps;
}
