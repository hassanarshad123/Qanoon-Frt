"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Grid3X3,
  FileText,
  FilePen,
  Search,
  BookOpen,
  Scale,
  FileCheck,
  Library,
  BookMarked,
  FileStack,
  Building2,
  ClipboardList,
  Bell,
  Users,
  CalendarDays,
  FolderOpen,
  Receipt,
  HardDrive,
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
import { UserMenu } from "@/components/shared/UserMenu";

const topItems = [
  { href: "/lawyers", label: "Home", icon: LayoutDashboard, tourId: "nav-home" },
  { href: "/lawyers/all-tools", label: "All Tools", icon: Grid3X3, tourId: "nav-all-tools" },
];

const sidebarGroups = [
  {
    id: "ai-tools",
    label: "AI Tools",
    icon: Scale,
    items: [
      { href: "/lawyers/brief", label: "Case Brief", icon: FileText, tourId: "nav-brief" },
      { href: "/lawyers/petition", label: "Petition Drafter", icon: FilePen, tourId: "nav-petition" },
      { href: "/lawyers/research", label: "Legal Research", icon: Search, tourId: "nav-research" },
      { href: "/lawyers/case-finder", label: "Case Law Finder", icon: BookOpen, tourId: "nav-case-finder" },
      { href: "/lawyers/statute-analyzer", label: "Statute Analyzer", icon: Scale, tourId: "nav-statute-analyzer" },
      { href: "/lawyers/contract-review", label: "Contract Review", icon: FileCheck, tourId: "nav-contract-review" },
    ],
  },
  {
    id: "database",
    label: "Database & Research",
    icon: Library,
    items: [
      { href: "/lawyers/case-law", label: "Case Law Repository", icon: Library, tourId: "nav-case-law" },
      { href: "/lawyers/statutes", label: "Statute Library", icon: BookMarked, tourId: "nav-statutes" },
      { href: "/lawyers/legal-forms", label: "Legal Forms", icon: FileStack, tourId: "nav-legal-forms" },
      { href: "/lawyers/court-directory", label: "Court Directory", icon: Building2, tourId: "nav-court-directory" },
      { href: "/lawyers/case-tracker", label: "Case Tracker", icon: ClipboardList, tourId: "nav-case-tracker" },
      { href: "/lawyers/amendments", label: "Amendment Alerts", icon: Bell, tourId: "nav-amendments" },
    ],
  },
  {
    id: "practice",
    label: "Practice Management",
    icon: Users,
    items: [
      { href: "/lawyers/clients", label: "Clients", icon: Users, tourId: "nav-clients" },
      { href: "/lawyers/calendar", label: "Calendar", icon: CalendarDays, tourId: "nav-calendar" },
      { href: "/lawyers/documents", label: "Documents", icon: FolderOpen, tourId: "nav-documents" },
      { href: "/lawyers/billing", label: "Billing", icon: Receipt, tourId: "nav-billing" },
      { href: "/lawyers/files", label: "File Manager", icon: HardDrive, tourId: "nav-files" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function LawyerSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/lawyers" && pathname.startsWith(href));

  // Find which group the current page belongs to
  const activeGroupId = sidebarGroups.find((group) =>
    group.items.some((item) => isActive(item.href))
  )?.id;

  const renderLink = (
    item: { href: string; label: string; icon: React.ElementType; tourId?: string },
    indent = false
  ) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        data-tour={item.tourId}
        className={cn(
          "mx-2 flex items-center rounded-lg transition-colors",
          collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
          indent && !collapsed && "ml-4",
          active
            ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
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
              <Scale className="h-6 w-6 text-[#2563EB]" />
            </div>
          ) : (
            <div>
              <h2 className="text-sm font-semibold text-[#2563EB] tracking-wide uppercase">
                QanoonAI
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Lawyer Portal</p>
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
            // Collapsed: show group icons only
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
                            ? "bg-[#2563EB]/10 text-[#2563EB]"
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
            // Expanded: accordion groups
            <Accordion
              type="single"
              collapsible
              defaultValue={activeGroupId}
              className="space-y-0"
            >
              {sidebarGroups.map((group) => (
                <AccordionItem key={group.id} value={group.id} className="border-0">
                  <AccordionTrigger
                    data-tour-group={group.id}
                    className="mx-2 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-gray-400 hover:bg-gray-50 hover:no-underline [&[data-state=open]]:text-[#2563EB]"
                  >
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

        {/* User menu */}
        <div className="border-t border-gray-200 px-2 py-2">
          <UserMenu collapsed={collapsed} />
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
