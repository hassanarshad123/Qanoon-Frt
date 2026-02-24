"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ChevronRight,
  Calendar,
  Layers,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { Statute } from "@/lib/types/lawyer-portal";

export default function StatutesPage() {
  const [statutes] = useState<Statute[]>([]);
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return statutes;
    const term = search.toLowerCase();
    return statutes.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.shortName.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
    );
  }, [statutes, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          label="Database & Research"
          title="Statute Library"
          description="Browse the principal statutes and legislation of Pakistan."
        />
        <div className="flex items-center justify-center h-[40vh]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
              <BookOpen className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Loading statutes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Database & Research"
        title="Statute Library"
        description="Browse the principal statutes and legislation of Pakistan."
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search statutes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No statutes found"
          description="Try adjusting your search terms to find relevant legislation."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((statute) => (
            <Link key={statute.id} href={`/lawyers/statutes/${statute.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-[#2563EB]">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="border-[#2563EB] text-[#2563EB] text-xs font-semibold"
                        >
                          {statute.shortName}
                        </Badge>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {statute.year}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                        {statute.name}
                      </h3>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#2563EB] shrink-0 mt-1 transition-colors" />
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {statute.description}
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Layers className="h-3.5 w-3.5" />
                      {statute.chapters} Chapter{statute.chapters !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-500">
                      <FileText className="h-3.5 w-3.5" />
                      {statute.totalSections} Section{statute.totalSections !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
