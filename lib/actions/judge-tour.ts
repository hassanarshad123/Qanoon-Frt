/**
 * @deprecated This module is replaced by the API client layer (lib/api/).
 * All frontend code should use the corresponding API client instead.
 * Kept for rollback purposes only — do not use in new code.
 */

import type { DriveStep } from "driver.js";

export const judgeTourSteps: DriveStep[] = [
  {
    element: '[data-tour="dashboard-greeting"]',
    popover: {
      title: "Your Dashboard",
      description:
        "This is your personalized judicial workspace. You'll see your name, court, and today's date here.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="dashboard-stats"]',
    popover: {
      title: "Your Statistics",
      description:
        "Track your productivity — briefs generated, research sessions, judgments drafted, and notes saved.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: '[data-tour="quick-actions"]',
    popover: {
      title: "Quick Actions",
      description:
        "Jump straight to any feature from here. Generate a brief, research law, or draft a judgment in one click.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="nav-documents"]',
    popover: {
      title: "Document Library",
      description:
        "Upload and organize your court documents — petitions, affidavits, evidence, and more.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-brief"]',
    popover: {
      title: "AI Case Brief Generator",
      description:
        "Generate comprehensive case briefs with AI. Enter case details and get a structured legal brief in minutes.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-judgment"]',
    popover: {
      title: "Judgment Assistant",
      description:
        "Draft judgments with AI assistance. Start from an existing brief or enter case details manually.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-research"]',
    popover: {
      title: "Legal Research",
      description:
        "Ask any legal question about Pakistani law. Get relevant statutes, precedents, and legal analysis.",
      side: "right",
      align: "center",
    },
  },
  {
    element: '[data-tour="nav-notes"]',
    popover: {
      title: "Notes",
      description:
        "Keep notes from your briefs, research, and judgments. Organize them in folders for easy reference.",
      side: "right",
      align: "center",
    },
  },
];
