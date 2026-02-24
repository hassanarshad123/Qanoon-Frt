import type { CustomsDutyCategory } from "../types";

// ============================================================
// Customs Duty — Common Product Categories & Standard Rates
// Customs Act 1969, Pakistan Customs Tariff
// ============================================================

export const CUSTOMS_CATEGORIES: CustomsDutyCategory[] = [
  { id: "raw-materials", label: "Raw Materials", description: "Basic industrial inputs, ores, crude materials", cdRate: 0.03, rdRate: 0, fedRate: 0, whtRate: 0.055 },
  { id: "agri-inputs", label: "Agricultural Inputs", description: "Seeds, fertilizer, pesticides, farm equipment", cdRate: 0, rdRate: 0, fedRate: 0, whtRate: 0.02 },
  { id: "chemicals", label: "Chemicals & Pharmaceuticals", description: "Industrial chemicals, pharmaceutical raw materials", cdRate: 0.05, rdRate: 0, fedRate: 0, whtRate: 0.04 },
  { id: "textiles", label: "Textiles & Fabric", description: "Yarn, fabric, garments, apparel", cdRate: 0.11, rdRate: 0.05, fedRate: 0, whtRate: 0.055 },
  { id: "machinery", label: "Machinery & Equipment", description: "Industrial machinery, plant equipment, tools", cdRate: 0.05, rdRate: 0, fedRate: 0, whtRate: 0.055 },
  { id: "electronics", label: "Electronics & Appliances", description: "Consumer electronics, mobile phones, computers", cdRate: 0.20, rdRate: 0.05, fedRate: 0.05, whtRate: 0.06 },
  { id: "food-items", label: "Food Items", description: "Processed food, beverages, edible oils", cdRate: 0.20, rdRate: 0.10, fedRate: 0, whtRate: 0.055 },
  { id: "vehicles-cbu", label: "Vehicles (CBU)", description: "Completely built-up cars, trucks, buses", cdRate: 0.50, rdRate: 0.15, fedRate: 0.25, whtRate: 0.06 },
  { id: "vehicles-ckd", label: "Vehicles (CKD/SKD)", description: "Knocked-down kits for local assembly", cdRate: 0.15, rdRate: 0, fedRate: 0.025, whtRate: 0.055 },
  { id: "luxury", label: "Luxury & Non-Essential", description: "Cosmetics, perfumes, premium goods", cdRate: 0.25, rdRate: 0.15, fedRate: 0.10, whtRate: 0.06 },
  { id: "iron-steel", label: "Iron & Steel", description: "Steel bars, coils, sheets, structural steel", cdRate: 0.11, rdRate: 0.02, fedRate: 0, whtRate: 0.055 },
  { id: "petroleum", label: "Petroleum Products", description: "Fuel, lubricants, petroleum chemicals", cdRate: 0.05, rdRate: 0, fedRate: 0.17, whtRate: 0.055 },
];

// Standard Additional Customs Duty rate
export const ACD_RATE = 0.02;

// Standard Sales Tax rate on imports
export const IMPORT_SALES_TAX_RATE = 0.18;

// WHT multiplier for non-filers
export const WHT_NON_FILER_MULTIPLIER = 2;

export function getCustomsCategory(id: string): CustomsDutyCategory | undefined {
  return CUSTOMS_CATEGORIES.find((c) => c.id === id);
}
