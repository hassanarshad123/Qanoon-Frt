"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Clock,
  Heart,
  Receipt,
  Percent,
  TrendingUp,
  ShoppingCart,
  Ship,
  AlertTriangle,
  Scale,
  Calendar,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Clock,
  Heart,
  Receipt,
  Percent,
  TrendingUp,
  ShoppingCart,
  Ship,
  AlertTriangle,
  Scale,
  Calendar,
};

const topItems = [
  { href: "/calculators", label: "Home", icon: LayoutDashboard },
];

const sidebarGroups = [
  {
    id: "core",
    label: "Core Calculators",
    icon: Calculator,
    items: [
      { href: "/calculators/inheritance", label: "Inheritance", icon: Users },
      { href: "/calculators/limitation", label: "Limitation", icon: Clock },
      { href: "/calculators/zakat", label: "Zakat", icon: Heart },
    ],
  },
  {
    id: "tax",
    label: "Tax Calculators",
    icon: Receipt,
    items: [
      { href: "/calculators/income-tax", label: "Income Tax", icon: Receipt },
      { href: "/calculators/withholding-tax", label: "WHT", icon: Percent },
      { href: "/calculators/capital-gains-tax", label: "CGT", icon: TrendingUp },
      { href: "/calculators/sales-tax", label: "Sales Tax", icon: ShoppingCart },
      { href: "/calculators/customs-duty", label: "Customs", icon: Ship },
      { href: "/calculators/tax-penalties", label: "Penalties", icon: AlertTriangle },
    ],
  },
  {
    id: "civil",
    label: "Civil & Family",
    icon: Scale,
    items: [
      { href: "/calculators/damages", label: "Damages", icon: Scale },
      { href: "/calculators/iddat", label: "Iddat", icon: Calendar },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function CalculatorSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/calculators" && pathname.startsWith(href));

  const activeGroupId = sidebarGroups.find((group) =>
    group.items.some((item) => isActive(item.href))
  )?.id;

  const renderLink = (
    item: { href: string; label: string; icon: React.ElementType },
    indent = false
  ) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "mx-2 flex items-center rounded-lg transition-colors",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
          indent && !collapsed && "ml-4",
          active
            ? "bg-[#059669]/10 text-[#059669] font-medium"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <Icon className="h-4.5 w-4.5 shrink-0" />
        {!collapsed && <span className="text-sm">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.href}>{linkContent}</div>;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col h-full">
        {/* Logo area */}
        <div className={cn("px-4 py-5 border-b border-gray-200", collapsed && "px-2 py-5")}>
          {collapsed ? (
            <div className="flex justify-center">
              <Calculator className="h-6 w-6 text-[#059669]" />
            </div>
          ) : (
            <div>
              <h2 className="text-sm font-semibold text-[#059669] tracking-wide uppercase">
                QanoonAI
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Calculator Portal</p>
            </div>
          )}
        </div>

        {/* Top navigation items */}
        <div className="py-3 space-y-1">
          {topItems.map((item) => renderLink(item))}
        </div>

        <div className="mx-4 border-t border-gray-200" />

        {/* Accordion groups */}
        <div className="flex-1 overflow-y-auto py-2">
          {collapsed ? (
            <div className="space-y-1">
              {sidebarGroups.map((group) => {
                const GroupIcon = group.icon;
                const groupActive = group.items.some((item) => isActive(item.href));
                return (
                  <Tooltip key={group.id}>
                    <TooltipTrigger asChild>
                      <Link
                        href={group.items[0].href}
                        className={cn(
                          "mx-2 flex items-center justify-center rounded-lg px-2 py-2.5 transition-colors",
                          groupActive
                            ? "bg-[#059669]/10 text-[#059669]"
                            : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        )}
                      >
                        <GroupIcon className="h-4.5 w-4.5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8}>
                      {group.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <Accordion
              type="single"
              collapsible
              defaultValue={activeGroupId}
              className="space-y-0"
            >
              {sidebarGroups.map((group) => (
                <AccordionItem key={group.id} value={group.id} className="border-0">
                  <AccordionTrigger className="mx-2 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:text-[#059669]">
                    {group.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-2 pt-0">
                    <div className="space-y-0.5">
                      {group.items.map((item) => renderLink(item, true))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-gray-200 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn("w-full", collapsed ? "justify-center px-0" : "justify-start")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs text-gray-500">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </nav>
    </TooltipProvider>
  );
}
