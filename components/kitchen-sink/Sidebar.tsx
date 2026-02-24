"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const pages = [
  { href: "/kitchen-sink", label: "Overview", icon: Home },
  { href: "/kitchen-sink/colors", label: "Colors", icon: Palette },
  { href: "/kitchen-sink/typography", label: "Typography", icon: Type },
  { href: "/kitchen-sink/buttons", label: "Buttons", icon: MousePointerClick },
  { href: "/kitchen-sink/forms", label: "Forms", icon: FormInput },
  { href: "/kitchen-sink/cards", label: "Cards", icon: LayoutGrid },
  { href: "/kitchen-sink/tables", label: "Tables", icon: Table2 },
  { href: "/kitchen-sink/navigation", label: "Navigation", icon: Navigation },
  { href: "/kitchen-sink/overlays", label: "Overlays", icon: Layers },
  { type: "separator" as const, label: "Judges Portal" },
  { href: "/kitchen-sink/judges-case-management", label: "Case Management", icon: Scale },
  { href: "/kitchen-sink/judges-dashboard", label: "Dashboard", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 py-4">
      <div className="px-4 mb-3">
        <h2 className="text-sm font-semibold text-[#A21CAF] tracking-wide uppercase">
          Kitchen Sink
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">QanoonAI Style Guide</p>
      </div>
      {pages.map((item, i) => {
        if ("type" in item && item.type === "separator") {
          return (
            <div key={i} className="px-4 pt-5 pb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#84752F]">
                {item.label}
              </span>
            </div>
          );
        }

        const page = item as { href: string; label: string; icon: React.ElementType };
        const isActive = pathname === page.href;
        const Icon = page.icon;

        return (
          <Link
            key={page.href}
            href={page.href}
            className={cn(
              "mx-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-[#A21CAF]/10 text-[#A21CAF] font-medium border-r-2 border-[#A21CAF]"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
