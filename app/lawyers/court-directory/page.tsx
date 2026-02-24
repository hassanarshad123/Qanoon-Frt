"use client";

import { useState, useMemo } from "react";
import { Search, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { CourtCard } from "@/components/lawyers/shared/court-card";
import type { CourtEntry, Province, CourtLevel } from "@/lib/types/lawyer-portal";

const provinces: Province[] = [
  "Federal",
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Islamabad",
];

const courtLevels: CourtLevel[] = [
  "Supreme Court",
  "High Court",
  "District Court",
  "Tribunal",
  "Special Court",
];

export default function CourtDirectoryPage() {
  const [courts] = useState<CourtEntry[]>([]);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  const filtered = useMemo(() => {
    return courts.filter((court) => {
      const matchesSearch =
        !search ||
        court.name.toLowerCase().includes(search.toLowerCase()) ||
        court.chiefJustice.toLowerCase().includes(search.toLowerCase()) ||
        court.location.toLowerCase().includes(search.toLowerCase());
      const matchesProvince =
        province === "all" || court.province === province;
      const matchesLevel = level === "all" || court.level === level;
      return matchesSearch && matchesProvince && matchesLevel;
    });
  }, [courts, search, province, level]);

  return (
    <div className="space-y-8">
      <PageHeader
        label="Database & Research"
        title="Court Directory"
        description="Browse courts across all provinces and jurisdictions in Pakistan"
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search courts, judges, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Provinces</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={setLevel}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Court Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {courtLevels.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No courts found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
