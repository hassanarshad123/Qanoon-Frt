import type { HeirType } from "../types";

// ============================================================
// Islamic Inheritance Rules — Hanafi & Shia (Ja'fari)
// Muslim Personal Law (Shariat) Application Act 1962
// ============================================================

export interface HeirConfig {
  type: HeirType;
  label: string;
  gender: "male" | "female" | "both";
  allowMultiple: boolean;
  maxCount: number;
  applicableDeceasedGender: "male" | "female" | "both";
  group: "spouse" | "parents" | "children" | "siblings";
}

export const HEIR_CONFIGS: HeirConfig[] = [
  // Spouse
  { type: "husband", label: "Husband", gender: "male", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "female", group: "spouse" },
  { type: "wife", label: "Wife", gender: "female", allowMultiple: true, maxCount: 4, applicableDeceasedGender: "male", group: "spouse" },
  // Parents & Grandparents
  { type: "father", label: "Father", gender: "male", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "both", group: "parents" },
  { type: "mother", label: "Mother", gender: "female", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "both", group: "parents" },
  { type: "paternal-grandfather", label: "Paternal Grandfather", gender: "male", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "both", group: "parents" },
  { type: "paternal-grandmother", label: "Paternal Grandmother", gender: "female", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "both", group: "parents" },
  { type: "maternal-grandmother", label: "Maternal Grandmother", gender: "female", allowMultiple: false, maxCount: 1, applicableDeceasedGender: "both", group: "parents" },
  // Children & Grandchildren
  { type: "son", label: "Son", gender: "male", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "children" },
  { type: "daughter", label: "Daughter", gender: "female", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "children" },
  { type: "sons-son", label: "Son's Son", gender: "male", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "children" },
  { type: "sons-daughter", label: "Son's Daughter", gender: "female", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "children" },
  // Siblings
  { type: "full-brother", label: "Full Brother", gender: "male", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
  { type: "full-sister", label: "Full Sister", gender: "female", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
  { type: "paternal-half-brother", label: "Paternal Half-Brother", gender: "male", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
  { type: "paternal-half-sister", label: "Paternal Half-Sister", gender: "female", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
  { type: "maternal-half-brother", label: "Maternal Half-Brother", gender: "male", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
  { type: "maternal-half-sister", label: "Maternal Half-Sister", gender: "female", allowMultiple: true, maxCount: 20, applicableDeceasedGender: "both", group: "siblings" },
];

export const HEIR_GROUP_LABELS: Record<string, string> = {
  spouse: "Spouse",
  parents: "Parents & Grandparents",
  children: "Children & Grandchildren",
  siblings: "Siblings",
};

export function getHeirConfig(type: HeirType): HeirConfig | undefined {
  return HEIR_CONFIGS.find((h) => h.type === type);
}

export function getHeirLabel(type: HeirType): string {
  return getHeirConfig(type)?.label ?? type;
}
