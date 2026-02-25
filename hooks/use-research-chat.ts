"use client";

import { useState, useCallback } from "react";
import type { ResearchMessageDB } from "@/lib/research/types";
import type { StructuredResearchResponse } from "@/lib/research/types";
import type { Citation } from "@/lib/types/portal";
import type { RAGSearchResult } from "@/lib/rag/types";
import { researchApi } from "@/lib/api/research";

export function useResearchChat() {
  const [messages, setMessages] = useState<ResearchMessageDB[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [parsedSections, setParsedSections] =
    useState<Partial<StructuredResearchResponse> | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState("New Research");
  const [ragResults, setRagResults] = useState<RAGSearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Progressive XML parser
  // -------------------------------------------------------------------------
  function parseStructuredResponse(
    text: string
  ): Partial<StructuredResearchResponse> {
    const sections = [
      "summary",
      "applicable_law",
      "precedents",
      "analysis",
      "contrary_views",
    ] as const;
    const result: Partial<StructuredResearchResponse> = {};

    for (const section of sections) {
      const openTag = `<${section}>`;
      const closeTag = `</${section}>`;
      const openIdx = text.indexOf(openTag);
      if (openIdx === -1) continue;

      const contentStart = openIdx + openTag.length;
      const closeIdx = text.indexOf(closeTag, contentStart);

      if (closeIdx !== -1) {
        result[section] = text.slice(contentStart, closeIdx).trim();
      } else {
        // Still streaming — show what we have so far
        result[section] = text.slice(contentStart).trim();
      }
    }

    return result;
  }

  // -------------------------------------------------------------------------
  // Citation extractor
  // -------------------------------------------------------------------------
  function extractCitations(text: string): Citation[] {
    const citationRegex =
      /([A-Z][a-zA-Z\s.]+(?:v\.?\s+[A-Z][a-zA-Z\s.]+)?)\s*\((\d{4}\s+(?:PLD|SCMR|CLC|PCrLJ|YLR|MLD|PLJ|NLR|ALD)\s+\w+\s+\d+)\)/g;
    const citations: Citation[] = [];
    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = citationRegex.exec(text)) !== null) {
      const citation = match[2].trim();
      if (seen.has(citation)) continue;
      seen.add(citation);

      citations.push({
        id: `cit-${citations.length + 1}`,
        caseName: match[1].trim(),
        citation,
        court: citation.includes("SC")
          ? "Supreme Court of Pakistan"
          : "High Court",
        year: citation.match(/\d{4}/)?.[0] || "",
        relevance: "",
        snippet: "",
      });
    }

    return citations;
  }

  // -------------------------------------------------------------------------
  // Send initial query
  // -------------------------------------------------------------------------
  const sendQuery = useCallback(
    async (
      question: string,
      options?: { caseId?: string; caseContext?: Record<string, unknown> }
    ) => {
      setError(null);
      setIsStreaming(true);
      setStreamingText("");
      setParsedSections(null);

      // Add optimistic user message
      const userMsg: ResearchMessageDB = {
        id: `temp-${Date.now()}`,
        conversationId: conversationId || "",
        role: "user",
        content: question,
        structuredResponse: null,
        citations: [],
        ragContext: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        let fullText = "";
        let completeMeta: Record<string, unknown> | null = null;

        for await (const chunk of researchApi.query({
          question,
          conversationId: conversationId || undefined,
          caseId: options?.caseId,
          caseContext: options?.caseContext,
        })) {
          const parsed = chunk as Record<string, unknown>;

          if (parsed.meta) {
            const meta = parsed.meta as Record<string, unknown>;
            if (meta.conversationId) setConversationId(meta.conversationId as string);
            if (meta.ragResults) setRagResults(meta.ragResults as RAGSearchResult[]);
            continue;
          }

          if (parsed.text) {
            fullText += parsed.text as string;
            setStreamingText(fullText);
            setParsedSections(parseStructuredResponse(fullText));
          }

          if (parsed.complete) {
            completeMeta = parsed.complete as Record<string, unknown>;
          }

          if (parsed.error) {
            throw new Error(parsed.error as string);
          }
        }

        // Build final assistant message
        const structured = parseStructuredResponse(fullText);
        const citations = extractCitations(fullText);

        const assistantMsg: ResearchMessageDB = {
          id: (completeMeta?.messageId as string) || `msg-${Date.now()}`,
          conversationId: conversationId || "",
          role: "assistant",
          content: fullText,
          structuredResponse:
            Object.keys(structured).length > 0
              ? (structured as StructuredResearchResponse)
              : null,
          citations,
          ragContext: null,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (completeMeta?.title) {
          setConversationTitle(completeMeta.title as string);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Query failed");
      } finally {
        setIsStreaming(false);
        setStreamingText("");
        setParsedSections(null);
      }
    },
    [conversationId]
  );

  // -------------------------------------------------------------------------
  // Send follow-up
  // -------------------------------------------------------------------------
  const sendFollowUp = useCallback(
    async (question: string, caseContext?: Record<string, unknown>) => {
      if (!conversationId) return;

      setError(null);
      setIsStreaming(true);
      setStreamingText("");
      setParsedSections(null);

      const userMsg: ResearchMessageDB = {
        id: `temp-${Date.now()}`,
        conversationId,
        role: "user",
        content: question,
        structuredResponse: null,
        citations: [],
        ragContext: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        let fullText = "";
        let completeMeta: Record<string, unknown> | null = null;

        for await (const chunk of researchApi.followUp({
          conversationId,
          question,
          caseContext,
        })) {
          const parsed = chunk as Record<string, unknown>;

          if (parsed.meta) {
            const meta = parsed.meta as Record<string, unknown>;
            if (meta.ragResults) setRagResults(meta.ragResults as RAGSearchResult[]);
            continue;
          }

          if (parsed.text) {
            fullText += parsed.text as string;
            setStreamingText(fullText);
            setParsedSections(parseStructuredResponse(fullText));
          }

          if (parsed.complete) {
            completeMeta = parsed.complete as Record<string, unknown>;
          }

          if (parsed.error) {
            throw new Error(parsed.error as string);
          }
        }

        const structured = parseStructuredResponse(fullText);
        const citations = extractCitations(fullText);

        const assistantMsg: ResearchMessageDB = {
          id: (completeMeta?.messageId as string) || `msg-${Date.now()}`,
          conversationId,
          role: "assistant",
          content: fullText,
          structuredResponse:
            Object.keys(structured).length > 0
              ? (structured as StructuredResearchResponse)
              : null,
          citations,
          ragContext: null,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Follow-up failed");
      } finally {
        setIsStreaming(false);
        setStreamingText("");
        setParsedSections(null);
      }
    },
    [conversationId]
  );

  // -------------------------------------------------------------------------
  // Load existing conversation
  // -------------------------------------------------------------------------
  const loadConversation = useCallback(
    async (id: string, title?: string) => {
      setConversationId(id);
      if (title) setConversationTitle(title);

      try {
        const apiMsgs = await researchApi.getMessages(id);
        setMessages(apiMsgs.map((m) => {
          const isAssistant = m.role === "assistant";
          const structured = isAssistant ? parseStructuredResponse(m.content) : {};
          const hasStructured = Object.keys(structured).length > 0;
          return {
            id: m.id,
            conversationId: id,
            role: m.role as "user" | "assistant",
            content: m.content,
            structuredResponse: isAssistant && hasStructured
              ? (structured as StructuredResearchResponse)
              : null,
            citations: isAssistant
              ? extractCitations(m.content)
              : (m.citations as Citation[]),
            ragContext: null,
            createdAt: m.createdAt,
          };
        }));
      } catch {
        setError("Failed to load conversation");
      }
    },
    []
  );

  return {
    messages,
    isStreaming,
    streamingText,
    parsedSections,
    conversationId,
    conversationTitle,
    ragResults,
    error,
    sendQuery,
    sendFollowUp,
    loadConversation,
    setConversationId,
    setConversationTitle,
  };
}
