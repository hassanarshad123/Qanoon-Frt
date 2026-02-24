// ============================================================
// Gold & Silver Rates for Nisab Calculation
// These are approximate reference rates in PKR. Users can override.
// ============================================================

export const GOLD_SILVER_RATES = {
  // Gold: 7.5 tola is the nisab threshold
  goldRatePerTola: 245000, // approximate PKR per tola
  goldNisabTola: 7.5,

  // Silver: 52.5 tola is the nisab threshold
  silverRatePerTola: 2800, // approximate PKR per tola
  silverNisabTola: 52.5,

  // Pre-computed nisab values
  get goldNisabValue() {
    return this.goldRatePerTola * this.goldNisabTola;
  },
  get silverNisabValue() {
    return this.silverRatePerTola * this.silverNisabTola;
  },

  // The nisab threshold is the LOWER of gold and silver
  get nisabThreshold() {
    return Math.min(this.goldNisabValue, this.silverNisabValue);
  },

  lastUpdated: "2024-01-01",
  note: "Rates are approximate. For precise calculations, use current market rates.",
};

// Conversion helpers
export const TOLA_TO_GRAMS = 11.6638; // 1 tola = 11.6638 grams
export const TOLA_TO_OUNCES = 0.375; // 1 tola ≈ 0.375 troy ounces
