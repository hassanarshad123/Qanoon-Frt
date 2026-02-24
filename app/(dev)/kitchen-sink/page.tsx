"use client";

import Link from "next/link";
import {
  Palette,
  Type,
  MousePointerClick,
  FormInput,
  LayoutGrid,
  Table2,
  Navigation,
  Layers,
  Scale,
  BarChart3,
} from "lucide-react";

const pages = [
  {
    href: "/kitchen-sink/colors",
    label: "Colors",
    icon: Palette,
    description: "Brand colors, gray scale, semantic tokens, gradients, and shadows",
  },
  {
    href: "/kitchen-sink/typography",
    label: "Typography",
    icon: Type,
    description: "Font families, heading scale, body text, weights, and patterns",
  },
  {
    href: "/kitchen-sink/buttons",
    label: "Buttons",
    icon: MousePointerClick,
    description: "Variants, sizes, branded CTAs, icon buttons, and loading states",
  },
  {
    href: "/kitchen-sink/forms",
    label: "Forms",
    icon: FormInput,
    description: "Inputs, selects, checkboxes, date picker, OTP, and validation",
  },
  {
    href: "/kitchen-sink/cards",
    label: "Cards",
    icon: LayoutGrid,
    description: "Basic cards, stat cards, feature cards, dashboard widgets, pricing",
  },
  {
    href: "/kitchen-sink/tables",
    label: "Tables",
    icon: Table2,
    description: "Sortable tables, row actions, pagination, badges, and progress",
  },
  {
    href: "/kitchen-sink/navigation",
    label: "Navigation",
    icon: Navigation,
    description: "Header, sidebar, breadcrumbs, tabs, pagination, sheets, drawers",
  },
  {
    href: "/kitchen-sink/overlays",
    label: "Overlays",
    icon: Layers,
    description: "Dialogs, alerts, toasts, tooltips, popovers, command palette, skeletons",
  },
  {
    href: "/kitchen-sink/judges-case-management",
    label: "Case Management",
    icon: Scale,
    description: "Case tables, detail cards, legal badges, and case timelines",
  },
  {
    href: "/kitchen-sink/judges-dashboard",
    label: "Judges Dashboard",
    icon: BarChart3,
    description: "Stat cards, calendar, activity feed, charts, and document panels",
  },
];

export default function KitchenSinkIndex() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Design System
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          QanoonAI Kitchen Sink
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          A living style guide showcasing every color, font, component, and composite
          pattern used across QanoonAI. Use these pages as a plug-and-play reference
          for building tool pages.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#A21CAF]/30 hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A21CAF]/10 text-[#A21CAF] group-hover:bg-[#A21CAF] group-hover:text-white transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {page.label}
                </h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {page.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
