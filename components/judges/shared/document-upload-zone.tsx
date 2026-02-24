"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface DocumentUploadZoneProps {
  onUploadComplete?: (doc: { id: string; fileName: string; blobUrl: string }) => void;
  documentType?: string;
  compact?: boolean;
}

export function DocumentUploadZone({ onUploadComplete, documentType, compact }: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setUploadedFile(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name.replace(/\.[^/.]+$/, ""));
      if (documentType) formData.append("documentType", documentType);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      onUploadComplete?.({ id: data.id, fileName: data.fileName, blobUrl: data.blobUrl });
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete, documentType]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const clearUpload = () => {
    setUploadedFile(null);
    setError(null);
  };

  if (uploading) {
    return (
      <div className={cn("rounded-xl border border-gray-200 bg-white p-4", compact && "p-3")}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center shrink-0">
            <Loader2 className="h-5 w-5 text-[#A21CAF] animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile}</p>
            <p className="text-xs text-gray-500 mt-1">Uploading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (uploadedFile && !error) {
    return (
      <div className={cn("rounded-xl border border-gray-200 bg-white p-4", compact && "p-3")}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-[#A21CAF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile}</p>
            <p className="text-xs text-emerald-600 mt-1">Upload complete</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearUpload}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
      />
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "rounded-xl border-2 border-dashed transition-colors cursor-pointer",
          isDragging ? "border-[#A21CAF] bg-[#A21CAF]/5" : "border-gray-200 hover:border-gray-300 bg-gray-50/50",
          compact ? "p-4" : "p-8"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <Upload className={cn("text-gray-400 mb-2", compact ? "h-6 w-6" : "h-8 w-8")} />
          <p className={cn("font-medium text-gray-700", compact ? "text-xs" : "text-sm")}>
            {isDragging ? "Drop your file here" : "Drag & drop documents here"}
          </p>
          <p className="text-xs text-gray-400 mt-1">PDF, Word, text, or images up to 50MB</p>
        </div>
      </div>
    </div>
  );
}
