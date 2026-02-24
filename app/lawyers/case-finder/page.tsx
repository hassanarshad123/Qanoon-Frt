"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Clock,
  Scale,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import type { CaseFinderResult } from "@/lib/types/lawyer-portal";

const courtOptions = [
  "All Courts",
  "Supreme Court of Pakistan",
  "Lahore High Court",
  "High Court of Sindh, Karachi",
  "Islamabad High Court",
  "Peshawar High Court",
  "Balochistan High Court",
  "Federal Shariat Court",
];

const caseTypeOptions = [
  "All Types",
  "Constitutional",
  "Civil",
  "Criminal",
  "Family",
  "Tax",
  "Labour",
  "Banking",
  "Admiralty",
  "Commercial",
];

const recentSearches = [
  {
    query: "Bail in non-bailable offences",
    court: "Supreme Court of Pakistan",
    date: "2 hours ago",
  },
  {
    query: "Right to fair trial Article 10A",
    court: "All Courts",
    date: "Yesterday",
  },
  {
    query: "Pre-emption rights Punjab",
    court: "Lahore High Court",
    date: "3 days ago",
  },
  {
    query: "Specific performance agreement to sell",
    court: "Supreme Court of Pakistan",
    date: "1 week ago",
  },
];

export default function CaseFinderPage() {
  const [keyword, setKeyword] = useState("");
  const [court, setCourt] = useState("All Courts");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [statuteFilter, setStatuteFilter] = useState("");
  const [caseType, setCaseType] = useState("All Types");
  const [results, setResults] = useState<CaseFinderResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    if (!keyword.trim()) return;
    setSearching(true);
    setHasSearched(true);

    // TODO: Replace with real API search
    setTimeout(() => {
      setResults([]);
      setSearching(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (query: string, searchCourt: string) => {
    setKeyword(query);
    setCourt(searchCourt);
    handleSearch();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        label="AI Tools"
        title="Case Law Finder"
        description="Search across 300,000+ Pakistani judgments with AI-powered semantic search and advanced filters"
      />

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#2563EB]" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Keyword Input */}
          <div className="space-y-1.5">
            <Label htmlFor="keyword" className="text-sm font-medium">
              Keyword / Legal Question
            </Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., bail in non-bailable offences, right to fair trial, specific performance..."
              className="h-11 focus-visible:ring-[#2563EB]/30"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Court Select */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Court</Label>
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courtOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Range */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Year From</Label>
              <Input
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                placeholder="e.g., 1990"
                type="number"
                min="1947"
                max="2026"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Year To</Label>
              <Input
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                placeholder="e.g., 2025"
                type="number"
                min="1947"
                max="2026"
                className="h-10"
              />
            </div>

            {/* Case Type */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Case Type</Label>
              <Select value={caseType} onValueChange={setCaseType}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {caseTypeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statute Filter */}
          <div className="space-y-1.5">
            <Label htmlFor="statute" className="text-sm font-medium">
              Statute / Act Filter
            </Label>
            <Input
              id="statute"
              value={statuteFilter}
              onChange={(e) => setStatuteFilter(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Constitution of Pakistan, Income Tax Ordinance, PPC..."
              className="h-10 focus-visible:ring-[#2563EB]/30"
            />
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSearch}
              disabled={!keyword.trim() || searching}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] px-8 h-11 text-sm font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results
            </h2>
            <span className="text-sm text-gray-400">
              {results.length} cases found
            </span>
          </div>

          {searching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Scale className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  No cases found matching your criteria. Try broadening your
                  search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/lawyers/case-finder/${result.id}`}
                >
                  <Card className="hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Title */}
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                          {result.title}
                        </h3>

                        {/* Citation + Court */}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-xs font-mono border-[#2563EB]/30 text-[#2563EB]"
                          >
                            {result.citation}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{result.court}</span>
                          <span className="text-gray-300">|</span>
                          <span>{formatDate(result.date)}</span>
                        </div>

                        {/* Summary preview */}
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {result.summary}
                        </p>

                        {/* Statutes */}
                        <div className="flex flex-wrap gap-1">
                          {result.statutes.slice(0, 2).map((statute) => (
                            <Badge
                              key={statute}
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              {statute}
                            </Badge>
                          ))}
                          {result.statutes.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-normal"
                            >
                              +{result.statutes.length - 2} more
                            </Badge>
                          )}
                        </div>

                        {/* View link */}
                        <div className="flex items-center text-xs font-medium text-[#2563EB] pt-1">
                          View Full Analysis
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Searches (only when no search performed yet) */}
      {!hasSearched && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Searches
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentSearches.map((search, i) => (
              <Card
                key={i}
                className="hover:shadow-sm hover:border-[#2563EB]/20 transition-all cursor-pointer"
                onClick={() =>
                  handleRecentSearchClick(search.query, search.court)
                }
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-[#2563EB]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {search.query}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">
                          {search.court}
                        </span>
                        <span className="text-gray-300 text-xs">&middot;</span>
                        <span className="text-xs text-gray-400">
                          {search.date}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
