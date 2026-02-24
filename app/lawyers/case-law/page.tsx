"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Scale,
  User,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { CaseFinderResult } from "@/lib/types/lawyer-portal";

const courts = [
  "All Courts",
  "Supreme Court of Pakistan",
  "Lahore High Court",
  "Islamabad High Court",
  "High Court of Sindh, Karachi",
  "Peshawar High Court",
  "High Court of Balochistan",
  "Federal Shariat Court",
  "District Court",
  "Sessions Court",
  "Anti-Terrorism Court",
];

const caseTypes = [
  "All Types",
  "Constitutional",
  "Criminal",
  "Civil",
  "Tax",
  "Family",
  "Labour",
  "Commercial",
];

const yearRanges = [
  "All Years",
  "2024-2025",
  "2020-2023",
  "2015-2019",
  "2010-2014",
  "Before 2010",
];

function matchesYearRange(dateStr: string, range: string): boolean {
  if (range === "All Years") return true;
  const year = new Date(dateStr).getFullYear();
  if (range === "Before 2010") return year < 2010;
  const [start, end] = range.split("-").map(Number);
  return year >= start && year <= end;
}

export default function CaseLawPage() {
  const [cases] = useState<CaseFinderResult[]>([]);
  const [search, setSearch] = useState("");
  const [courtFilter, setCourtFilter] = useState("All Courts");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const term = search.toLowerCase();
      const matchSearch =
        !term ||
        c.title.toLowerCase().includes(term) ||
        c.citation.toLowerCase().includes(term) ||
        c.summary.toLowerCase().includes(term);
      const matchCourt =
        courtFilter === "All Courts" || c.court === courtFilter;
      const matchYear = matchesYearRange(c.date, yearFilter);
      const matchType = typeFilter === "All Types"; // simplified: case-finder results don't have a type field, so show all unless "All Types"
      return matchSearch && matchCourt && matchYear && matchType;
    });
  }, [cases, search, courtFilter, yearFilter, typeFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Database & Research"
        title="Case Law Repository"
        description="Browse and search through landmark case law from Pakistani courts."
      />

      {/* Filters row */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by title, citation, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={courtFilter} onValueChange={setCourtFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Court" />
          </SelectTrigger>
          <SelectContent>
            {courts.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {yearRanges.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {caseTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center border rounded-lg overflow-hidden ml-auto">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className={
              viewMode === "grid"
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] rounded-none"
                : "rounded-none"
            }
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className={
              viewMode === "list"
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] rounded-none"
                : "rounded-none"
            }
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {filtered.length} case{filtered.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
              <Scale className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Loading case law...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No cases found"
          description="Try adjusting your search terms or filters to find relevant case law."
        />
      ) : viewMode === "grid" ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="hover:shadow-md transition-shadow group"
            >
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs font-mono text-[#2563EB] mt-1">
                    {c.citation}
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Scale className="h-3 w-3" />
                    {c.court}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(c.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {c.judge}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {c.summary}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover:border-[#2563EB] hover:text-[#2563EB]"
                  asChild
                >
                  <Link href={`/lawyers/case-law/${c.id}`}>
                    View Case
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List Mode */
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Citation</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Judge</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="group">
                  <TableCell className="max-w-[280px]">
                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#2563EB] transition-colors">
                      {c.title}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                      {c.summary}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono text-[#2563EB]">
                      {c.citation}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">{c.court}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">
                      {new Date(c.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-600">{c.judge}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs hover:text-[#2563EB]"
                      asChild
                    >
                      <Link href={`/lawyers/case-law/${c.id}`}>
                        View
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
