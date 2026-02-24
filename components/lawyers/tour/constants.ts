export const TOUR_COLORS = {
  primary: "#2563EB",
  primaryLight: "rgba(37, 99, 235, 0.1)",
  primaryRing: "rgba(37, 99, 235, 0.3)",
  overlay: "rgba(0, 0, 0, 0.6)",
  white: "#ffffff",
} as const;

/** Map chapter IDs to the routes that trigger their auto-prompt */
export const CHAPTER_ROUTE_TRIGGERS: Record<string, string[]> = {
  "ch-3": ["/lawyers/case-finder", "/lawyers/statute-analyzer", "/lawyers/contract-review"],
  "ch-4": ["/lawyers/case-law", "/lawyers/statutes", "/lawyers/legal-forms", "/lawyers/court-directory"],
  "ch-5": ["/lawyers/case-tracker", "/lawyers/amendments"],
  "ch-6": ["/lawyers/clients", "/lawyers/calendar", "/lawyers/documents", "/lawyers/billing", "/lawyers/files"],
};

export const SPOTLIGHT_PADDING = 8;
export const SPOTLIGHT_BORDER_RADIUS = 12;
export const POPOVER_GAP = 16;
export const CHAPTER_PROMPT_DURATION = 8000;
