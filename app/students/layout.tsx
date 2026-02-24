"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Scale } from "lucide-react";
import Link from "next/link";

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <div className="min-h-screen bg-gray-50">
        {/* Top nav */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/students" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-serif text-lg font-semibold text-gray-900">QanoonAI</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Student</span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
