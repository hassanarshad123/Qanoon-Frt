import { createWorker, type Worker } from "tesseract.js";

// ---------- Singleton worker (guarded against concurrent init) ----------
let workerPromise: Promise<Worker> | null = null;

function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = createWorker("eng").catch((err) => {
      workerPromise = null; // allow retry on next call
      throw err;
    });
  }
  return workerPromise;
}

// ---------- Mutex: serialize all recognize() calls ----------
let queueTail: Promise<void> = Promise.resolve();

function withOcrMutex<T>(fn: () => Promise<T>): Promise<T> {
  const result = queueTail.then(fn, fn); // run fn after previous settles (success or fail)
  // Advance the queue tail — swallow errors so the chain never breaks
  queueTail = result.then(() => {}, () => {});
  return result;
}

// ---------- Per-call timeout ----------
const OCR_TIMEOUT_MS = 30_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`OCR timeout (${ms}ms): ${label}`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

/**
 * Extract text from an image file using Tesseract.js OCR.
 * - All recognize() calls are serialized via a mutex (Tesseract workers are NOT concurrent-safe).
 * - Each call is guarded by a 30-second timeout to prevent indefinite hangs.
 * - Errors are caught so a single bad image never blocks the pipeline.
 */
export async function extractTextFromImage(file: File): Promise<string> {
  try {
    const worker = await getWorker();

    // Convert file to data URL for Tesseract
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Serialize through mutex + enforce timeout
    const { data } = await withOcrMutex(() =>
      withTimeout(worker.recognize(dataUrl), OCR_TIMEOUT_MS, file.name)
    );

    const text = data.text.trim();

    if (!text || text.length < 10) {
      return `[Image file: ${file.name} — OCR detected no readable text]`;
    }

    return `[OCR extracted from: ${file.name}]\n${text}`;
  } catch {
    return `[Image file: ${file.name} — OCR extraction failed]`;
  }
}
