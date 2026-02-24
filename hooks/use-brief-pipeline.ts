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

// -- Endpoint configuration --------------------------------------------------
// Currently uses Next.js API routes for AI calls. When FastAPI backend is
// validated, switch these to use briefsApi from "@/lib/api" instead.
const ENDPOINTS = {
  analyze: "/api/brief/analyze",
  analyzeChunk: "/api/brief/analyze-chunk",
  precedents: "/api/brief/precedents",
  generate: "/api/brief/generate",
} as const;

/** Small delay helper to space out API calls and avoid rate limits */
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Shared SSE stream reader
// ---------------------------------------------------------------------------
async function readSSEStream(
  response: Response,
  onText: (text: string) => void
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response stream");

  const decoder = new TextDecoder();
  let fullText = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6);
        if (payload === "[DONE]") break;
        let parsed: { text?: string; error?: string };
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue;
        }
        if (parsed.error) {
          throw new Error(parsed.error);
        }
        if (parsed.text) {
          fullText += parsed.text;
          onText(fullText);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return fullText;
}

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

        const endpoint =
          chunks.length > 1 ? ENDPOINTS.analyzeChunk : ENDPOINTS.analyze;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 120_000);

        try {
          const analyzeRes = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              documents: chunk.documents,
              ...(chunks.length > 1 && {
                chunkIndex: chunk.chunkIndex,
                totalChunks: chunk.totalChunks,
              }),
            }),
          });

          if (!analyzeRes.ok) {
            const err = await analyzeRes.json().catch(() => ({ error: "Analysis failed" }));
            throw new Error(err.error || "Document analysis failed");
          }

          const chunkData: ExtractedCaseData = await analyzeRes.json();
          chunkResults.push(chunkData);
        } finally {
          clearTimeout(timeout);
        }
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

      const precedentController = new AbortController();
      const precedentTimeout = setTimeout(() => precedentController.abort(), 55_000);
      let precedentRes: Response;
      try {
        precedentRes = await fetch(ENDPOINTS.precedents, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: precedentController.signal,
          body: JSON.stringify({ extractedData: data }),
        });
      } finally {
        clearTimeout(precedentTimeout);
      }

      let results: RAGSearchResult[] = [];
      if (precedentRes.ok) {
        results = await precedentRes.json();
      }
      setRagResults(results);

      // Delay between precedents and generate to avoid rate limits
      setProgress({ step: 2, total: 5, label: "Preparing brief generation..." });
      await delay(8_000);

      // Phase 3: Generate sections with Claude (streaming)
      setPhase("generating_sections");
      setProgress({ step: 3, total: 5, label: PHASE_LABELS.generating_sections });

      const generateRes = await fetch(ENDPOINTS.generate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extractedData: data, ragResults: results }),
      });

      if (!generateRes.ok) {
        throw new Error("Section generation failed");
      }

      const fullText = await readSSEStream(generateRes, (text) => {
        const currentSections = parseSections(text);
        if (currentSections.length > 0) {
          setGeneratedSections(currentSections);
          setProgress({
            step: 3,
            total: 5,
            label: `Generating sections... (${currentSections.length}/10)`,
          });
        }
      });

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
