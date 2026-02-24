"use client";

import { useState } from "react";
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
import { Sidebar } from "@/components/kitchen-sink/Sidebar";
import { KitchenSinkBreadcrumbs } from "@/components/kitchen-sink/KitchenSinkBreadcrumbs";

export default function KitchenSinkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-200 bg-white">
          <Sidebar />
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
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 lg:pl-64">
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-8" /> {/* spacer for mobile menu button */}
              <KitchenSinkBreadcrumbs />
            </div>
          </div>
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
