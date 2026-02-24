"use client";

import { RAGTestPanel } from "@/components/admin/RAGTestPanel";

export default function RAGTestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">RAG Test</h1>
      <RAGTestPanel />
    </div>
  );
}
