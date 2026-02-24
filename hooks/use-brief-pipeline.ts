"use client";

import { useState, useCallback } from "react";
import type {
  UploadedDocument,
  ExtractedCaseData,
  EnhancedBriefSection,
} from "@/lib/brief-pipeline/types";
import type { RAGSearchResult } from "@/lib/rag/types";
import { chunkDocuments } from "@/lib/brief-pipeline/chunker";
import { mergeAnalysisResults } from "@/lib/brief-pipeline/merge-analysis";
import { stripMarkdown } from "@/lib/utils/strip-markdown";
import { briefsApi } from "@/lib/api/briefs";

export type PipelinePhase =
  | "idle"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "matching_precedents"
  | "generating_sections"
  | "complete"
  | "error";

interface PipelineProgress {
  step: number;
  total: number;
  label: string;
}

const PHASE_LABELS: Record<string, string> = {
  uploading: "Uploading documents...",
  extracting: "Extracting text from PDFs...",
  analyzing: "AI is analyzing document structure...",
  matching_precedents: "Searching precedent database with AI...",
  generating_sections: "AI is generating brief sections...",
  complete: "Brief generation complete",
};

/** Small delay helper to space out API calls and avoid rate limits */
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Parse streamed sections from Claude's XML-delimited output
// ---------------------------------------------------------------------------
function parseSections(fullText: string): EnhancedBriefSection[] {
  const sections: EnhancedBriefSection[] = [];
  const regex = /<section\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/section>/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(fullText)) !== null) {
    sections.push({
      id: match[1],
      title: match[2],
      content: stripMarkdown(match[3].trim()),
      sources: [],
      reviewStatus: "pending_review",
      regenerationCount: 0,
    });
  }

  return sections;
}

export function useBriefPipeline() {
  const [phase, setPhase] = useState<PipelinePhase>("idle");
  const [extractedData, setExtractedData] = useState<ExtractedCaseData | null>(null);
  const [ragResults, setRagResults] = useState<RAGSearchResult[]>([]);
  const [generatedSections, setGeneratedSections] = useState<EnhancedBriefSection[]>([]);
  const [progress, setProgress] = useState<PipelineProgress>({ step: 0, total: 5, label: "" });
  const [error, setError] = useState<string | null>(null);

  const startPipeline = useCallback(async (documents: UploadedDocument[]) => {
    try {
      setError(null);
      const extractedDocs = documents.filter(d => d.status === "extracted");

      if (extractedDocs.length === 0) {
        setError("No successfully extracted documents to process.");
        setPhase("error");
        return;
      }

      // Phase 1: Analyze documents with Claude (chunked for large uploads)
      setPhase("analyzing");
      setProgress({ step: 1, total: 5, label: PHASE_LABELS.analyzing });

      const docInputs = extractedDocs.map(d => ({
        fileName: d.fileName,
        text: d.extractedText,
      }));

      const chunks = chunkDocuments(docInputs);
      const chunkResults: ExtractedCaseData[] = [];

      for (const chunk of chunks) {
        if (chunks.length > 1) {
          setProgress({
            step: 1,
            total: 5,
            label: `Analyzing documents... (batch ${chunk.chunkIndex + 1} of ${chunk.totalChunks})`,
          });
        }

        const chunkData = chunks.length > 1
          ? await briefsApi.analyzeChunk(chunk.documents, chunk.chunkIndex, chunk.totalChunks)
          : await briefsApi.analyze(chunk.documents);
        chunkResults.push(chunkData as unknown as ExtractedCaseData);
      }

      // Merge chunk results (no-op if single chunk)
      const data = mergeAnalysisResults(chunkResults);
      // Attach raw document info
      data.rawDocuments = extractedDocs.map(d => ({
        id: d.id,
        fileName: d.fileName,
        documentType: d.documentType,
        totalPages: d.totalPages,
      }));
      setExtractedData(data);

      // Delay between analyze and precedents to avoid rate limits
      setProgress({ step: 1, total: 5, label: "Preparing precedent search..." });
      await delay(10_000);

      // Phase 2: Match precedents with AI-ranked search
      setPhase("matching_precedents");
      setProgress({ step: 2, total: 5, label: PHASE_LABELS.matching_precedents });

      let results: RAGSearchResult[] = [];
      try {
        results = await briefsApi.findPrecedents(
          data as unknown as Record<string, unknown>
        ) as unknown as RAGSearchResult[];
      } catch {
        // Gracefully continue without precedents
      }
      setRagResults(results);

      // Delay between precedents and generate to avoid rate limits
      setProgress({ step: 2, total: 5, label: "Preparing brief generation..." });
      await delay(8_000);

      // Phase 3: Generate sections with Claude (streaming)
      setPhase("generating_sections");
      setProgress({ step: 3, total: 5, label: PHASE_LABELS.generating_sections });

      let fullText = "";
      for await (const event of briefsApi.generate(
        data as unknown as Record<string, unknown>,
        results as unknown as Record<string, unknown>[]
      )) {
        const parsed = event as Record<string, unknown>;
        if (parsed.text) {
          fullText += parsed.text as string;
          const currentSections = parseSections(fullText);
          if (currentSections.length > 0) {
            setGeneratedSections(currentSections);
            setProgress({
              step: 3,
              total: 5,
              label: `Generating sections... (${currentSections.length}/10)`,
            });
          }
        }
        if (parsed.error) {
          throw new Error(parsed.error as string);
        }
      }

      // Final parse of complete text
      const finalSections = parseSections(fullText);
      if (finalSections.length === 0) {
        throw new Error("No sections were generated");
      }
      setGeneratedSections(finalSections);

      // Complete
      setPhase("complete");
      setProgress({ step: 5, total: 5, label: PHASE_LABELS.complete });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pipeline failed");
      setPhase("error");
    }
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setExtractedData(null);
    setRagResults([]);
    setGeneratedSections([]);
    setProgress({ step: 0, total: 5, label: "" });
    setError(null);
  }, []);

  return {
    phase,
    extractedData,
    ragResults,
    generatedSections,
    progress,
    error,
    startPipeline,
    reset,
  };
}
