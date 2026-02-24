export interface TourStep {
  /** Unique step ID within the chapter */
  id: string;
  /** data-tour attribute value of the target element */
  target: string;
  /** Step title shown in popover */
  title: string;
  /** Step description shown in popover */
  description: string;
  /** Optional: sidebar accordion group to expand before measuring */
  expandGroup?: string;
  /** Optional: placement preference for the popover */
  placement?: "top" | "bottom" | "left" | "right";
}

export interface TourChapter {
  /** Chapter ID, e.g. "ch-1" */
  id: string;
  /** Display title */
  title: string;
  /** Short description for the chapter panel */
  description: string;
  /** Steps within this chapter */
  steps: TourStep[];
  /** Routes that trigger this chapter's auto-prompt */
  triggerRoutes?: string[];
}

export interface LawyerTourState {
  "ch-1"?: boolean;
  "ch-2"?: boolean;
  "ch-3"?: boolean;
  "ch-4"?: boolean;
  "ch-5"?: boolean;
  "ch-6"?: boolean;
  visitedSections?: Record<string, string>;
  welcomeShown?: boolean;
  dismissed?: boolean;
}

export type TourMode =
  | "idle"
  | "welcome"
  | "chapter-prompt"
  | "touring"
  | "chapter-panel";
