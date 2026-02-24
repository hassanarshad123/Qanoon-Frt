"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/judges/Sidebar";
import { JudgesBreadcrumbs } from "@/components/judges/Breadcrumbs";
import { ProductTour } from "@/components/judges/shared/product-tour";
import { cn } from "@/lib/utils/cn";

const SIDEBAR_COLLAPSED_KEY = "judges-sidebar-collapsed";

export default function JudgesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
  };

  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white transition-all duration-200",
            collapsed ? "lg:w-16" : "lg:w-64"
          )}
        >
          <Sidebar collapsed={collapsed} onToggle={handleToggle} />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 left-3 z-40 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <Sidebar collapsed={false} onToggle={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main
          className={cn(
            "flex-1 transition-all duration-200",
            collapsed ? "lg:pl-16" : "lg:pl-64"
          )}
        >
          <div className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-8" />
              <JudgesBreadcrumbs />
            </div>
          </div>
          <div className="px-6 py-6 lg:px-10 lg:py-8 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
      <ProductTour />
      <Toaster />
    </ThemeProvider>
  );
}
