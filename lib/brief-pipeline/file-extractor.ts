import type { FileFormat } from "./types";
import { extractTextFromPDF } from "./pdf-extractor";
import type { PDFExtractionResult } from "./pdf-extractor";
import { extractTextFromImage } from "./ocr-extractor";

export interface ExtractionResult {
  totalPages: number;
  pages: { pageNumber: number; text: string }[];
  fullText: string;
}

const EXTENSION_MAP: Record<string, FileFormat> = {
  ".pdf": "pdf",
  ".docx": "docx",
  ".doc": "doc",
  ".xlsx": "xlsx",
  ".xls": "xls",
  ".csv": "csv",
  ".txt": "txt",
  ".rtf": "rtf",
  ".jpg": "image",
  ".jpeg": "image",
  ".png": "image",
  ".gif": "image",
  ".tiff": "image",
  ".tif": "image",
  ".bmp": "image",
  ".webp": "image",
};

export function detectFileFormat(file: File): FileFormat {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (ext && EXTENSION_MAP[ext]) return EXTENSION_MAP[ext];

  // Fallback to MIME type
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
  if (file.type === "application/msword") return "doc";
  if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") return "xlsx";
  if (file.type === "application/vnd.ms-excel") return "xls";
  if (file.type === "text/csv") return "csv";
  if (file.type === "text/plain") return "txt";
  if (file.type === "application/rtf" || file.type === "text/rtf") return "rtf";
  if (file.type.startsWith("image/")) return "image";

  return "unsupported";
}

async function extractDocx(file: File): Promise<ExtractionResult> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();
  return {
    totalPages: 1,
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

async function extractSpreadsheet(file: File): Promise<ExtractionResult> {
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });

  const pages: { pageNumber: number; text: string }[] = [];
  const textParts: string[] = [];

  workbook.SheetNames.forEach((sheetName, index) => {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    const text = `--- Sheet: ${sheetName} ---\n${csv}`;
    pages.push({ pageNumber: index + 1, text });
    textParts.push(text);
  });

  return {
    totalPages: pages.length,
    pages,
    fullText: textParts.join("\n\n"),
  };
}

async function extractPlainText(file: File): Promise<ExtractionResult> {
  const text = await file.text();
  return {
    totalPages: 1,
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

function stripRtf(rtf: string): string {
  // Remove RTF header/groups and control words, extract plain text
  let text = rtf;
  // Remove RTF groups like {\fonttbl...}, {\colortbl...}, etc.
  text = text.replace(/\{\\[^{}]*\}/g, "");
  // Remove control words (e.g. \par, \b0, \fs24)
  text = text.replace(/\\[a-z]+\d*\s?/gi, " ");
  // Remove remaining braces
  text = text.replace(/[{}]/g, "");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

async function extractRtf(file: File): Promise<ExtractionResult> {
  const raw = await file.text();
  const text = stripRtf(raw);
  return {
    totalPages: 1,
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

async function extractImage(file: File): Promise<ExtractionResult> {
  const text = await extractTextFromImage(file);
  return {
    totalPages: 1,
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

export async function extractTextFromFile(
  file: File,
  format: FileFormat,
  onProgress?: (percent: number) => void
): Promise<ExtractionResult> {
  switch (format) {
    case "pdf":
      return extractTextFromPDF(file, onProgress);
    case "docx":
      return extractDocx(file);
    case "doc":
      return {
        totalPages: 0,
        pages: [],
        fullText: `[Legacy .doc file: ${file.name} — please convert to .docx for text extraction]`,
      };
    case "xlsx":
    case "xls":
    case "csv":
      return extractSpreadsheet(file);
    case "txt":
      return extractPlainText(file);
    case "rtf":
      return extractRtf(file);
    case "image":
      return extractImage(file);
    case "unsupported":
      throw new Error(`Unsupported file format: ${file.name}`);
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}
