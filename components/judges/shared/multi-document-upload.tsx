"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  ImageIcon,
  FolderOpen,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentTypeSelector } from "./document-type-selector";
import { useDocumentExtraction } from "@/hooks/use-pdf-extraction";
import { cn } from "@/lib/utils/cn";
import type { UploadedDocument, FileFormat } from "@/lib/brief-pipeline/types";

const ACCEPTED_EXTENSIONS = [
  ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".csv", ".txt", ".rtf",
  ".jpg", ".jpeg", ".png", ".gif", ".tiff", ".bmp", ".webp",
];

const ACCEPT_STRING = ACCEPTED_EXTENSIONS.join(",");

const HIDDEN_FILES = new Set([".ds_store", "thumbs.db", "desktop.ini", ".gitkeep"]);

function isAcceptedFile(file: File): boolean {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (HIDDEN_FILES.has(file.name.toLowerCase())) return false;
  if (file.name.startsWith(".")) return false;
  return ACCEPTED_EXTENSIONS.includes(ext);
}

interface MultiDocumentUploadProps {
  onDocumentsReady: (docs: UploadedDocument[]) => void;
}

// Recursively traverse folder entries from drag-drop
async function traverseEntries(entries: FileSystemEntry[]): Promise<File[]> {
  const files: File[] = [];

  async function readEntry(entry: FileSystemEntry): Promise<void> {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) => {
        (entry as FileSystemFileEntry).file(resolve, reject);
      });
      if (isAcceptedFile(file)) {
        files.push(file);
      }
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      // readEntries() returns batches of ~100 max — loop until empty
      let allDirEntries: FileSystemEntry[] = [];
      let batch: FileSystemEntry[];
      do {
        batch = await new Promise<FileSystemEntry[]>((resolve, reject) => {
          reader.readEntries(resolve, reject);
        });
        allDirEntries.push(...batch);
      } while (batch.length > 0);
      for (const dirEntry of allDirEntries) {
        await readEntry(dirEntry);
      }
    }
  }

  for (const entry of entries) {
    await readEntry(entry);
  }

  return files;
}

export function MultiDocumentUpload({ onDocumentsReady }: MultiDocumentUploadProps) {
  const { documents, addFiles, removeFile, updateDocumentType } = useDocumentExtraction();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const onDocumentsReadyRef = useRef(onDocumentsReady);
  onDocumentsReadyRef.current = onDocumentsReady;

  // Set webkitdirectory imperatively (not in React's type definitions)
  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      // Check for folder/entry-based drops (supports recursive traversal)
      const items = e.dataTransfer.items;
      if (items && items.length > 0) {
        const entries: FileSystemEntry[] = [];
        for (let i = 0; i < items.length; i++) {
          const entry = items[i].webkitGetAsEntry?.();
          if (entry) entries.push(entry);
        }

        if (entries.length > 0) {
          const files = await traverseEntries(entries);
          if (files.length > 0) addFiles(files);
          return;
        }
      }

      // Fallback: plain file drop
      const files = Array.from(e.dataTransfer.files).filter(isAcceptedFile);
      if (files.length > 0) addFiles(files);
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(isAcceptedFile);
      if (files.length > 0) addFiles(files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [addFiles]
  );

  const handleFolderSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(isAcceptedFile);
      if (files.length > 0) addFiles(files);
      if (folderInputRef.current) folderInputRef.current.value = "";
    },
    [addFiles]
  );

  const allReady =
    documents.length > 0 &&
    documents.every((d) => d.status === "extracted" || d.status === "skipped" || d.status === "error") &&
    documents.some((d) => d.status === "extracted");
  const hasErrors = documents.some((d) => d.status === "error");

  // Stable key: only changes when terminal-status counts change (not on progress updates)
  const documentsKey = useMemo(() => {
    const extracted = documents.filter((d) => d.status === "extracted").length;
    const skipped = documents.filter((d) => d.status === "skipped").length;
    const errored = documents.filter((d) => d.status === "error").length;
    return `${documents.length}:${extracted}:${skipped}:${errored}`;
  }, [documents]);

  // Guard: fire onDocumentsReady exactly once per completion state
  const firedForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Reset guard when documents are cleared
    if (documents.length === 0) {
      firedForKeyRef.current = null;
      return;
    }
    if (allReady && firedForKeyRef.current !== documentsKey) {
      firedForKeyRef.current = documentsKey;
      onDocumentsReadyRef.current(documents);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allReady, documentsKey]);
  const isProcessing = documents.some((d) => d.status === "extracting" || d.status === "pending");

  const statusIcon = (status: UploadedDocument["status"]) => {
    switch (status) {
      case "extracted":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "skipped":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "extracting":
      case "pending":
        return <Loader2 className="h-4 w-4 text-[#A21CAF] animate-spin" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const fileIcon = (format: FileFormat) => {
    switch (format) {
      case "xlsx":
      case "xls":
      case "csv":
        return <FileSpreadsheet className="h-4 w-4 text-[#A21CAF]" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-[#A21CAF]" />;
      default:
        return <FileText className="h-4 w-4 text-[#A21CAF]" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border-2 border-dashed transition-colors cursor-pointer p-6",
          isDragging
            ? "border-[#A21CAF] bg-[#A21CAF]/5"
            : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-700">
            {isDragging ? "Drop your files or folders here" : "Drag & drop documents or folders here"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOCX, XLSX, TXT, CSV, RTF, and images
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Select Files
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={(e) => { e.stopPropagation(); folderInputRef.current?.click(); }}
            >
              <FolderOpen className="h-3.5 w-3.5 mr-1" />
              Select Folder
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_STRING}
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={folderInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFolderSelect}
        />
      </div>

      {/* File list */}
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="h-9 w-9 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center shrink-0">
                {fileIcon(doc.fileFormat)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.fileName}
                  </p>
                  {statusIcon(doc.status)}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{formatSize(doc.fileSize)}</span>
                  {doc.totalPages > 0 && <span>{doc.totalPages} pages</span>}
                  {doc.status === "extracting" && <span>Extracting text...</span>}
                  {doc.status === "skipped" && (
                    <span className="text-amber-600">
                      Legacy .doc — convert to .docx
                    </span>
                  )}
                  {doc.status === "error" && (
                    <span className="text-red-500">{doc.error}</span>
                  )}
                </div>
                {doc.status === "extracting" && (
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#A21CAF] rounded-full transition-all duration-300"
                      style={{ width: `${doc.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <DocumentTypeSelector
                value={doc.documentType}
                onChange={(type) => updateDocumentType(doc.id, type)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => removeFile(doc.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Summary */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
            <span>
              {documents.length} document{documents.length !== 1 ? "s" : ""} —{" "}
              {documents.filter((d) => d.status === "extracted").length} extracted
              {documents.some((d) => d.status === "skipped") &&
                `, ${documents.filter((d) => d.status === "skipped").length} skipped`}
              {hasErrors && `, ${documents.filter((d) => d.status === "error").length} failed`}
            </span>
            {allReady && (
              <Button
                size="sm"
                className="bg-[#A21CAF] hover:bg-[#86198F] text-xs h-7"
                onClick={() => onDocumentsReady(documents)}
              >
                Documents Ready
              </Button>
            )}
            {isProcessing && (
              <span className="text-[#A21CAF] font-medium">Processing...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
