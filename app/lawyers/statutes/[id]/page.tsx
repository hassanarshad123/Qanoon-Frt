"use client";

import { useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, BookOpen, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { StatuteSectionCard } from "@/components/lawyers/shared/statute-section-card";
import type { Statute } from "@/lib/types/lawyer-portal";

export default function StatuteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [statute, setStatute] = useState<Statute | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredSections = useMemo(() => {
    if (!statute) return [];
    if (!search) return statute.sections;
    const term = search.toLowerCase();
    return statute.sections.filter(
      (s) =>
        s.number.toLowerCase().includes(term) ||
        s.title.toLowerCase().includes(term) ||
        s.content.toLowerCase().includes(term)
    );
  }, [statute, search]);

  function scrollToSection(sectionId: string) {
    setActiveSection(sectionId);
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  if (loading || !statute) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
            <BookOpen className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">
            {loading ? "Loading statute..." : "Statute not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lawyers/statutes">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Statute Library
        </Link>
      </Button>

      {/* Statute header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold font-serif text-gray-900">
            {statute.name}
          </h1>
          <Badge
            variant="outline"
            className="border-[#2563EB] text-[#2563EB] font-semibold"
          >
            {statute.shortName}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {statute.year}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">
          {statute.chapters} Chapters &middot; {statute.totalSections} Sections
        </p>
      </div>

      {/* Section search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search sections..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Separator />

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel: Table of Contents (1/3) */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-3">
              Table of Contents
            </h3>
            <ScrollArea className="h-[calc(100vh-320px)]">
              <div className="space-y-0.5 pr-3">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      activeSection === section.id
                        ? "bg-[#2563EB]/10 text-[#2563EB] font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span className="shrink-0 text-xs font-mono w-10 text-gray-400">
                      S. {section.number}
                    </span>
                    <span className="truncate">{section.title}</span>
                    <ChevronRight
                      className={`h-3 w-3 shrink-0 ml-auto transition-colors ${
                        activeSection === section.id
                          ? "text-[#2563EB]"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right panel: Section content (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredSections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="h-8 w-8 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                No sections match your search.
              </p>
            </div>
          ) : (
            filteredSections.map((section) => (
              <div
                key={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
              >
                <StatuteSectionCard
                  section={section}
                  statuteId={statute.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
