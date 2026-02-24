"use client";

import { useState, useCallback, useRef } from "react";
import type { UploadedDocument, UploadDocumentType, FileFormat } from "@/lib/brief-pipeline/types";
import { detectFileFormat, extractTextFromFile } from "@/lib/brief-pipeline/file-extractor";
import { processWithConcurrency } from "@/lib/utils/concurrency";

// Per-file extraction timeout (2 minutes)
const EXTRACTION_TIMEOUT_MS = 120_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Extraction timeout (${ms / 1000}s): ${label}`)),
      ms,
    );
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

export function useDocumentExtraction() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  // Throttle map: docId -> last flush timestamp
  const lastFlushRef = useRef<Map<string, number>>(new Map());

  const addFiles = useCallback(async (files: File[]) => {
    // Build newDocs with correct initial status in a single pass (RC4 fix)
    const newDocs: UploadedDocument[] = files.map((file) => {
      const format = detectFileFormat(file);
      const isDoc = format === "doc";
      return {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        fileFormat: format,
        documentType: guessDocumentType(file.name, format),
        status: isDoc ? ("skipped" as const) : ("extracting" as const),
        progress: isDoc ? 100 : 10,
        totalPages: 0,
        extractedText: "",
        pages: [],
      };
    });

    // Single atomic state update instead of two consecutive calls
    setDocuments((prev) => [...prev, ...newDocs]);

    // Filter to extractable docs (everything except .doc)
    const extractable = newDocs.filter((doc) => doc.fileFormat !== "doc");

    // Adaptive concurrency: 3 workers for large uploads, 5 for small
    const concurrency = extractable.length > 20 ? 3 : 5;

    await processWithConcurrency(extractable, concurrency, async (doc) => {
      try {
        const result = await withTimeout(
          extractTextFromFile(doc.file, doc.fileFormat, (percent) => {
            // Throttle progress updates: max 1 per 200ms per document (RC2 fix)
            const now = Date.now();
            const last = lastFlushRef.current.get(doc.id) ?? 0;
            if (now - last < 200) return;
            lastFlushRef.current.set(doc.id, now);

            setDocuments((prev) =>
              prev.map((d) => (d.id === doc.id ? { ...d, progress: Math.max(10, percent) } : d))
            );
          }),
          EXTRACTION_TIMEOUT_MS,
          doc.fileName,
        );

        // Clean up throttle entry
        lastFlushRef.current.delete(doc.id);

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === doc.id
              ? {
                  ...d,
                  status: "extracted" as const,
                  progress: 100,
                  totalPages: result.totalPages,
                  extractedText: result.fullText,
                  pages: result.pages,
                }
              : d
          )
        );
      } catch (err) {
        lastFlushRef.current.delete(doc.id);

        setDocuments((prev) =>
          prev.map((d) =>
            d.id === doc.id
              ? {
                  ...d,
                  status: "error" as const,
                  progress: 0,
                  error: err instanceof Error ? err.message : "Extraction failed",
                }
              : d
          )
        );
      }
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    lastFlushRef.current.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const updateDocumentType = useCallback((id: string, type: UploadDocumentType) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, documentType: type } : d))
    );
  }, []);

  const reset = useCallback(() => {
    lastFlushRef.current.clear();
    setDocuments([]);
  }, []);

  return { documents, addFiles, removeFile, updateDocumentType, reset };
}

// Backward-compatible alias
export const usePdfExtraction = useDocumentExtraction;

function guessDocumentType(fileName: string, format: FileFormat): UploadDocumentType {
  // Spreadsheet formats
  if (format === "xlsx" || format === "xls" || format === "csv") return "Spreadsheet";

  const lower = fileName.toLowerCase();
  if (lower.includes("petition")) return "Petition";
  if (lower.includes("argument")) return "Written Arguments";
  if (lower.includes("evidence") || lower.includes("exhibit")) return "Evidence";
  if (lower.includes("affidavit")) return "Affidavit";
  if (lower.includes("order")) return "Court Order";
  if (lower.includes("judgment") || lower.includes("judgement")) return "Previous Judgment";
  if (lower.includes("fir")) return "FIR";
  if (lower.includes("statute") || lower.includes("act") || lower.includes("ordinance")) return "Statutory Extract";
  if (lower.includes("contract") || lower.includes("agreement")) return "Contract";
  return "Other";
}
