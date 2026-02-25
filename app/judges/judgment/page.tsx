"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gavel, FileText, Loader2, Plus, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/judges/shared/page-header";
import { LegalStatusBadge } from "@/components/judges/shared/legal-status-badge";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { judgmentsApi, type JudgmentSummary } from "@/lib/api/judgments";
import { briefsApi, type BriefSummary } from "@/lib/api/briefs";
import { toast } from "sonner";

export default function JudgmentListPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Loader2 className="h-8 w-8 text-[#A21CAF] animate-spin" /></div>}>
      <JudgmentListContent />
    </Suspense>
  );
}

function JudgmentListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBriefId = searchParams.get("briefId") || "";
  const [judgments, setJudgments] = useState<JudgmentSummary[]>([]);
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState("");
  const [selectedBriefId, setSelectedBriefId] = useState<string>(preselectedBriefId);
  const [creationMode, setCreationMode] = useState<"brief" | "manual">(preselectedBriefId ? "brief" : "brief");

  // Manual form state
  const [manualTitle, setManualTitle] = useState("");
  const [manualCaseNumber, setManualCaseNumber] = useState("");
  const [manualCourt, setManualCourt] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [judgmentsData, briefsData] = await Promise.all([
        judgmentsApi.list(),
        briefsApi.list(),
      ]);
      setJudgments(judgmentsData);
      setBriefs(briefsData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load judgments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async () => {
    if (generating) return;

    let body: any;
    if (creationMode === "brief" && selectedBriefId) {
      const brief = briefs.find((b) => b.id === selectedBriefId);
      body = {
        briefId: selectedBriefId,
        caseTitle: brief?.caseTitle || "Untitled Judgment",
        caseNumber: brief ? undefined : undefined,
        court: brief ? undefined : undefined,
      };
    } else if (creationMode === "manual" && manualTitle.trim()) {
      body = {
        caseTitle: manualTitle.trim(),
        caseNumber: manualCaseNumber.trim() || undefined,
        court: manualCourt.trim() || undefined,
      };
    } else {
      return;
    }

    setGenerating(true);
    setGenerationProgress("Preparing case analysis...");
    try {
      let fullText = "";
      let sectionCount = 0;
      const sectionNames = [
        "Case Header", "Facts of the Case", "Issues for Determination",
        "Arguments & Analysis", "Applicable Law", "Findings & Reasoning",
        "Order / Judgment"
      ];

      for await (const chunk of judgmentsApi.generate(body)) {
        const parsed = chunk as Record<string, unknown>;

        if (parsed.meta) {
          setGenerationProgress("AI is analyzing the case...");
        }

        if (parsed.text) {
          fullText += parsed.text as string;
          // Detect section markers (## or numbered headings)
          const newSectionCount = (fullText.match(/^##\s/gm) || []).length;
          if (newSectionCount > sectionCount) {
            sectionCount = newSectionCount;
            const currentSection = sectionNames[sectionCount - 1] || `Section ${sectionCount}`;
            setGenerationProgress(`Drafting ${currentSection}... (${sectionCount} of 7)`);
          }
        }

        if (parsed.complete) {
          setGenerationProgress("Saving judgment...");
          const complete = parsed.complete as Record<string, unknown>;
          if (complete.judgmentId) {
            router.push(`/judges/judgment/${complete.judgmentId}`);
            return;
          }
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate judgment. Please try again.");
      setGenerating(false);
      setGenerationProgress("");
    }
  };

  const canGenerate =
    !generating &&
    ((creationMode === "brief" && selectedBriefId) ||
      (creationMode === "manual" && manualTitle.trim()));

  return (
    <div className="space-y-8">
      <PageHeader
        label="Judgment"
        title="Judgment Assistant"
        description="AI-assisted judgment drafting with precedent suggestions"
      />

      {/* New Judgment Creation Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center">
              <Gavel className="h-4 w-4 text-[#A21CAF]" />
            </div>
            Create New Judgment Draft
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generating ? (
            <div className="flex flex-col items-center py-8">
              <Loader2 className="h-8 w-8 text-[#A21CAF] animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-900">Generating Judgment...</p>
              <p className="text-xs text-[#A21CAF] font-medium mt-2">
                {generationProgress || "Preparing..."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                This may take a minute.
              </p>
            </div>
          ) : (
            <Tabs
              value={creationMode}
              onValueChange={(v) => setCreationMode(v as "brief" | "manual")}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="brief">Start from Existing Brief</TabsTrigger>
                <TabsTrigger value="manual">Enter Case Details</TabsTrigger>
              </TabsList>

              <TabsContent value="brief">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Generate a judgment from an existing case brief to
                    save time and maintain consistency.
                  </p>
                  <Select
                    value={selectedBriefId}
                    onValueChange={setSelectedBriefId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an existing brief..." />
                    </SelectTrigger>
                    <SelectContent>
                      {briefs.map((brief) => (
                        <SelectItem key={brief.id} value={brief.id}>
                          <div className="flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5 text-gray-400" />
                            <span>{brief.caseTitle}</span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({brief.status})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      {briefs.length === 0 && (
                        <SelectItem value="_none" disabled>
                          No briefs available — generate one first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="manual">
                <div className="space-y-4 max-w-lg">
                  <p className="text-sm text-gray-500">
                    Enter case details manually to generate a judgment draft.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="case-title" className="text-sm">Case Title *</Label>
                      <Input
                        id="case-title"
                        placeholder="e.g., Muhammad Ali v. State"
                        value={manualTitle}
                        onChange={(e) => setManualTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="case-number" className="text-sm">Case Number</Label>
                      <Input
                        id="case-number"
                        placeholder="e.g., Crl. Appeal No. 123/2024"
                        value={manualCaseNumber}
                        onChange={(e) => setManualCaseNumber(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="court" className="text-sm">Court</Label>
                      <Input
                        id="court"
                        placeholder="e.g., Lahore High Court"
                        value={manualCourt}
                        onChange={(e) => setManualCourt(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {!generating && (
            <div className="mt-6">
              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="bg-[#A21CAF] hover:bg-[#86198F] text-white"
              >
                <Gavel className="h-4 w-4 mr-2" />
                Generate Judgment Draft
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Previous Judgment Drafts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Previous Judgment Drafts
        </h2>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadData}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : judgments.length === 0 ? (
          <EmptyState
            icon={Gavel}
            title="No Judgment Drafts Yet"
            description="Create your first judgment — start from a brief or enter case details above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {judgments.map((judgment) => (
              <Link
                key={judgment.id}
                href={`/judges/judgment/${judgment.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-md transition-shadow group-hover:border-[#A21CAF]/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <Gavel className="h-4 w-4 text-amber-600" />
                      </div>
                      <LegalStatusBadge status={judgment.status} />
                    </div>

                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-[#A21CAF] transition-colors">
                      {judgment.caseTitle}
                    </h3>

                    <div className="space-y-1.5">
                      {judgment.caseNumber && (
                        <p className="text-xs text-gray-400 font-mono">
                          {judgment.caseNumber}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(judgment.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" }
                        )}
                      </p>
                      {judgment.court && (
                        <p className="text-xs text-gray-400">
                          {judgment.court}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
