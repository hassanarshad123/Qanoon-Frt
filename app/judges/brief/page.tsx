"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Plus, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/judges/shared/page-header";
import { LegalStatusBadge } from "@/components/judges/shared/legal-status-badge";
import { MultiDocumentUpload } from "@/components/judges/shared/multi-document-upload";
import { CaseSelector } from "@/components/judges/shared/case-selector";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { ExtractionProgress } from "@/components/judges/shared/extraction-progress";
import { useBriefPipeline } from "@/hooks/use-brief-pipeline";
import { briefsApi, type BriefSummary } from "@/lib/api/briefs";
import type { UploadedDocument } from "@/lib/brief-pipeline/types";

export default function BriefListPage() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [documentsReady, setDocumentsReady] = useState<UploadedDocument[] | null>(null);
  const [saving, setSaving] = useState(false);

  const pipeline = useBriefPipeline();

  const loadBriefs = () => {
    setLoading(true);
    setError(null);
    briefsApi.list().then((data) => {
      setBriefs(data);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load briefs");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBriefs();
  }, []);

  // When pipeline completes, save to DB and navigate
  useEffect(() => {
    if (pipeline.phase === "complete" && pipeline.generatedSections.length > 0 && documentsReady && !saving) {
      setSaving(true);

      const caseTitle = pipeline.extractedData?.courtInfo?.caseNumber
        ? `Case ${pipeline.extractedData.courtInfo.caseNumber}`
        : `Generated Brief — ${new Date().toLocaleDateString()}`;

      briefsApi.create({
        case_title: caseTitle,
        case_number: pipeline.extractedData?.courtInfo?.caseNumber || undefined,
        court: pipeline.extractedData?.courtInfo?.courtName || undefined,
        extracted_data: pipeline.extractedData as Record<string, unknown> | null,
        uploaded_documents: documentsReady.map(d => ({
          id: d.id,
          fileName: d.fileName,
          documentType: d.documentType,
          totalPages: d.totalPages,
        })),
        rag_results: pipeline.ragResults as unknown as Record<string, unknown>[],
        sections: pipeline.generatedSections as unknown as Record<string, unknown>[],
      }).then(({ id: briefId }) => {
        router.push(`/judges/brief/${briefId}`);
      }).catch((err) => {
        console.error("Failed to save brief:", err);
        setSaving(false);
      });
    }
  }, [pipeline.phase, pipeline.generatedSections, documentsReady, saving]);

  const handleDocumentsReady = (docs: UploadedDocument[]) => {
    setDocumentsReady(docs);
  };

  const handleGenerateBrief = () => {
    if (documentsReady && documentsReady.length > 0) {
      pipeline.startPipeline(documentsReady);
    }
  };

  const isPipelineRunning =
    pipeline.phase !== "idle" && pipeline.phase !== "complete" && pipeline.phase !== "error";

  // Warn before leaving during active generation
  useEffect(() => {
    if (!isPipelineRunning && !saving) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isPipelineRunning, saving]);
  const showProgress = isPipelineRunning || saving || pipeline.phase === "error";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        label="Case Brief"
        title="Brief Generator"
        description="AI-powered case brief generation from your documents"
      />

      {/* New Brief Card */}
      <Card className="border border-dashed border-gray-300 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="h-8 w-8 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center">
              <Plus className="h-4 w-4 text-[#A21CAF]" />
            </div>
            Create New Brief
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {showProgress ? (
            /* Pipeline progress display */
            <Card className="border-[#A21CAF]/20 bg-gradient-to-br from-[#A21CAF]/[0.02] to-purple-50/30">
              <CardContent className="pt-6">
                {pipeline.phase === "error" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">!</span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">
                        Brief Generation Failed
                      </h3>
                    </div>
                    <p className="text-sm text-red-600">
                      {pipeline.error || "An unexpected error occurred during generation."}
                    </p>
                    <Button
                      variant="outline"
                      className="border-[#A21CAF] text-[#A21CAF] hover:bg-[#A21CAF]/5"
                      onClick={() => pipeline.reset()}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <Loader2 className="h-5 w-5 text-[#A21CAF] animate-spin" />
                      <h3 className="text-base font-semibold text-gray-900">
                        {saving ? "Saving Brief..." : "Generating Brief..."}
                      </h3>
                    </div>
                    <ExtractionProgress
                      phase={pipeline.phase}
                      progress={pipeline.progress}
                      documentsProcessed={
                        documentsReady?.filter((d) => d.status === "extracted").length || 0
                      }
                      totalDocuments={documentsReady?.length || 0}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="max-w-xl mx-auto space-y-6">
                {/* Option 1: Multi-Document Upload */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                    Option 1: Upload Documents
                  </p>
                  <MultiDocumentUpload onDocumentsReady={handleDocumentsReady} />
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <Separator className="flex-1" />
                </div>

                {/* Option 2: Select Existing Case */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                    Option 2: Select Existing Case
                  </p>
                  <CaseSelector
                    value={selectedCase}
                    onSelect={setSelectedCase}
                    placeholder="Choose a case to generate brief..."
                  />
                </div>

                <Separator />

                <div className="flex flex-col items-center gap-2">
                  {documentsReady && documentsReady.length > 0 && (
                    <p className="text-xs text-emerald-600 font-medium">
                      {documentsReady.length} document{documentsReady.length !== 1 ? "s" : ""} ready
                    </p>
                  )}
                  <Button
                    className="bg-[#A21CAF] hover:bg-[#86198F] gap-2"
                    onClick={handleGenerateBrief}
                    disabled={!documentsReady || documentsReady.length === 0}
                  >
                    {isPipelineRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    Generate Brief
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Previous Briefs Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Previous Briefs</h2>
          <span className="text-sm text-gray-500">{briefs.length} briefs</span>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={loadBriefs}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : briefs.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No Briefs Yet"
            description="Generate your first AI-powered case brief by uploading documents or selecting an existing case above."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefs.map((brief) => (
                <Link key={brief.id} href={`/judges/brief/${brief.id}`}>
                  <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#A21CAF] transition-colors">
                          {brief.caseTitle}
                        </h3>
                        <LegalStatusBadge status={brief.status} />
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(brief.createdAt)}
                      </p>
                      {brief.caseNumber && (
                        <p className="text-xs text-gray-400 font-mono">
                          {brief.caseNumber}
                        </p>
                      )}
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
