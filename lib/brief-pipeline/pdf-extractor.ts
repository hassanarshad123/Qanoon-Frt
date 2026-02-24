export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface PDFExtractionResult {
  totalPages: number;
  pages: ExtractedPage[];
  fullText: string;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (percent: number) => void
): Promise<PDFExtractionResult> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
  } catch {
    // Fallback: disable worker and retry
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";
    pdf = await pdfjsLib.getDocument({ data, isEvalSupported: false }).promise;
  }

  const pages: ExtractedPage[] = [];
  const totalPages = pdf.numPages;

  for (let i = 1; i <= totalPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      pages.push({ pageNumber: i, text });
    } catch {
      pages.push({ pageNumber: i, text: `[Page ${i}: extraction failed]` });
    }
    onProgress?.(Math.round((i / totalPages) * 100));
  }

  const fullText = pages.map(p => p.text).join("\n\n");

  return { totalPages, pages, fullText };
}
