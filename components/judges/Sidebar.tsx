"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileStack,
  FileText,
  Gavel,
  Search,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserMenu } from "@/components/shared/UserMenu";

const pages = [
  { href: "/judges", label: "Dashboard", icon: LayoutDashboard, tourId: "nav-dashboard" },
  { href: "/judges/documents", label: "Documents", icon: FileStack, tourId: "nav-documents" },
  { href: "/judges/brief", label: "Case Brief", icon: FileText, tourId: "nav-brief" },
  { href: "/judges/judgment", label: "Judgment", icon: Gavel, tourId: "nav-judgment" },
  { href: "/judges/research", label: "Research", icon: Search, tourId: "nav-research" },
  { href: "/judges/notes", label: "Notes", icon: StickyNote, tourId: "nav-notes" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="flex flex-col h-full">
        {/* Logo area */}
        <div className={cn("px-4 py-5 border-b border-gray-200", collapsed && "px-3 py-5")}>
          {collapsed ? (
            <div className="flex justify-center">
              <Scale className="h-6 w-6 text-[#A21CAF]" />
            </div>
          ) : (
            <div>
              <h2 className="text-xs font-semibold text-[#A21CAF] tracking-wide uppercase">
                QanoonAI
              </h2>
              <p className="text-xs text-gray-400 mt-1">Judicial Portal</p>
            </div>
          )}
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-4 space-y-1.5">
          {pages.map((page) => {
            const isActive =
              pathname === page.href ||
              (page.href !== "/judges" && pathname.startsWith(page.href));
            const Icon = page.icon;

            const linkContent = (
              <Link
                key={page.href}
                href={page.href}
                data-tour={page.tourId}
                className={cn(
                  "mx-2 flex items-center rounded-lg transition-colors",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-[#A21CAF]/10 text-[#A21CAF] font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-sm">{page.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={page.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {page.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return linkContent;
          })}
        </div>

        {/* User menu */}
        <div className="border-t border-gray-200 px-2 py-2">
          <UserMenu collapsed={collapsed} />
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-gray-200 p-3">
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
