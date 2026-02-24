"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";

interface SearchResultItem {
  judgment: {
    id: string;
    caseName: string;
    citation: string;
    court: string;
    year: number;
    legalAreas: string[];
    courtTier: string | null;
    jurisdiction: string;
  };
  relevanceScore: number;
  matchedKeywords: string[];
  matchedAreas: string[];
}

interface QueryResult {
  query: string;
  resultCount: number;
  results: SearchResultItem[];
  responseTimeMs: number;
}

export function RAGTestQuery() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<string>("judge");
  const [courtTiers, setCourtTiers] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (query.trim().length < 10) {
      toast.error("Query must be at least 10 characters");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const filters: Record<string, unknown> = {};
      if (courtTiers.trim()) {
        filters.courtTier = courtTiers.split(",")[0]?.trim();
      }
      if (yearFrom) filters.yearFrom = parseInt(yearFrom, 10);
      if (yearTo) filters.yearTo = parseInt(yearTo, 10);

      const data = await adminApi.ragQuery({ query: query.trim(), filters, limit: 10 });
      setResult(data as unknown as QueryResult);
      toast.success("Query completed");
    } catch (err: any) {
      toast.error("Query failed: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Test Query</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Query
              </label>
              <Textarea
                placeholder="e.g. What is the law on child custody in Pakistan?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Role
                </label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="judge">Judge</SelectItem>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Court Tiers
                </label>
                <Input
                  placeholder="e.g. supreme,high"
                  value={courtTiers}
                  onChange={(e) => setCourtTiers(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Year From
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2000"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Year To
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2024"
                  value={yearTo}
                  onChange={(e) => setYearTo(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#A21CAF] hover:bg-[#86198f] text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Querying...
                </>
              ) : (
                "Send Test Query"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">{result.responseTimeMs}ms</Badge>
              <Badge variant="outline">
                {result.resultCount} result{result.resultCount !== 1 ? "s" : ""}
              </Badge>
            </div>

            {result.results.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Search Results</p>
                <div className="border rounded-lg overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Citation</TableHead>
                        <TableHead>Case Name</TableHead>
                        <TableHead>Court</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.results.map((r) => (
                        <TableRow key={r.judgment.id}>
                          <TableCell className="font-mono text-xs">
                            {r.judgment.citation}
                          </TableCell>
                          <TableCell>{r.judgment.caseName}</TableCell>
                          <TableCell>{r.judgment.court}</TableCell>
                          <TableCell>{r.judgment.courtTier ?? "—"}</TableCell>
                          <TableCell>{r.judgment.year}</TableCell>
                          <TableCell>{r.relevanceScore}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
              >
                {showRaw ? "Hide" : "Show"} Raw JSON
              </Button>
              {showRaw && (
                <pre className="mt-2 bg-gray-50 rounded-lg p-4 text-xs overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
