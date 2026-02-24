"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Gavel,
  Scale,
  BookOpen,
  Users,
  ListOrdered,
  HelpCircle,
  ScrollText,
  MessageSquare,
  Landmark,
  Brain,
  Columns3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/judges/shared/page-header";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { SaveToNotesDialog } from "@/components/judges/shared/save-to-notes-dialog";
import { AIProgressSteps } from "@/components/judges/shared/ai-progress-steps";
import { PrecedentCard } from "@/components/judges/shared/precedent-card";
import { CitationBadge } from "@/components/judges/shared/citation-badge";
import { ConversationThread } from "@/components/judges/shared/conversation-thread";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { LegalStatusBadge } from "@/components/judges/shared/legal-status-badge";
import { SourceReferenceBadge } from "@/components/judges/shared/source-reference-badge";
import { SectionReviewControls } from "@/components/judges/shared/section-review-controls";
import { SectionEditor } from "@/components/judges/shared/section-editor";
import { RegenerateDialog } from "@/components/judges/shared/regenerate-dialog";
import { BriefReviewProgress } from "@/components/judges/shared/brief-review-progress";
import { briefsApi, type BriefDetail, type BriefSection, type BriefChatMessage } from "@/lib/api/briefs";
import type { EnhancedBriefSection, SectionReviewStatus } from "@/lib/brief-pipeline/types";
import type { Citation, Precedent } from "@/lib/types/portal";

// Bridge types: the detail page used Brief/EnhancedBrief aliases; map to API types
type Brief = BriefDetail;
type EnhancedBrief = BriefDetail;
type BriefConversationMessage = BriefChatMessage;

// -------------------------------------------------------------------
// Prompt suggestions
// -------------------------------------------------------------------
const PROMPT_SUGGESTIONS = [
  "Elaborate on the constitutional issues",
  "What are the strongest precedents?",
  "Summarize the key arguments",
  "Identify potential weaknesses",
];

// -------------------------------------------------------------------
// Helper: parse inline citations from brief section content
// -------------------------------------------------------------------
function extractCitations(content: string): Citation[] {
  const citations: Citation[] = [];
  const citationRegex =
    /([A-Z][A-Za-z.\s]+v\.\s[A-Z][A-Za-z.\s]+)\s*\(([A-Z]{2,4}\s\d{4}\s[A-Z]{1,4}\s\d+)\)/g;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = citationRegex.exec(content)) !== null) {
    const yearMatch = match[2].match(/\d{4}/);
    citations.push({
      id: `extracted-cit-${idx++}`,
      caseName: match[1].trim(),
      citation: match[2].trim(),
      court: "Superior Courts of Pakistan",
      year: yearMatch ? yearMatch[0] : "",
      relevance: "Cited in brief",
      snippet: "",
    });
  }
  return citations;
}

// -------------------------------------------------------------------
// Helper: parse precedents from the "Relevant Precedents" section
// -------------------------------------------------------------------
function extractPrecedents(content: string): Precedent[] {
  const precedents: Precedent[] = [];
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    const match = line.match(
      /\d+\.\s*(.+?)\s*\(([^)]+)\):\s*(.*)/
    );
    if (match) {
      const yearMatch = match[2].match(/\d{4}/);
      precedents.push({
        id: `prec-${idx}`,
        caseName: match[1].trim(),
        citation: match[2].trim(),
        court: "Superior Courts of Pakistan",
        year: yearMatch ? yearMatch[0] : "",
        relevance: match[3].trim(),
        summary: match[3].trim(),
        relevanceScore: Math.floor(70 + Math.random() * 25),
      });
    }
  });

  return precedents;
}

// -------------------------------------------------------------------
// Section icons mapping
// -------------------------------------------------------------------
const SECTION_ICONS: Record<string, React.ElementType> = {
  "Case Header": Landmark,
  "Parties & Representation": Users,
  "Material Facts": ListOrdered,
  "Legal Issues": HelpCircle,
  "Applicable Statutes": ScrollText,
  "Petitioner's Arguments": MessageSquare,
  "Respondent's Arguments": MessageSquare,
  "Relevant Precedents": Scale,
  "Comparative Matrix": Columns3,
  "Preliminary Analysis": Brain,
};

// -------------------------------------------------------------------
// Check if section is enhanced
// -------------------------------------------------------------------
function isEnhancedSection(section: any): section is EnhancedBriefSection {
  return "reviewStatus" in section;
}

function isEnhancedBrief(brief: Brief | EnhancedBrief): brief is EnhancedBrief {
  return brief.sections.length > 0 && isEnhancedSection(brief.sections[0]);
}

// ===================================================================
// COMPONENT
// ===================================================================
export default function BriefDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [brief, setBrief] = useState<Brief | EnhancedBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversationMessages, setConversationMessages] = useState<
    BriefConversationMessage[]
  >([]);

  // Enhanced brief state
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [regenerateSection, setRegenerateSection] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState<string>("");

  // -------------------------------------------------------------------
  // Load brief data from DB
  // -------------------------------------------------------------------
  useEffect(() => {
    briefsApi.get(id).then((data) => {
      if (data) {
        setBrief(data);
        setConversationMessages(data.chatMessages || []);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [id]);

  // -------------------------------------------------------------------
  // Conversation handler — real AI chat
  // -------------------------------------------------------------------
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!brief || chatLoading) return;

      const userMessage: BriefConversationMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        citations: [],
        createdAt: new Date().toISOString(),
      };

      setConversationMessages((prev) => [...prev, userMessage]);
      setChatLoading(true);
      setStreamingChat("");

      // Save user message to DB
      briefsApi.saveChatMessage(id, "user", message).catch(console.error);

      // Build brief context for Claude — truncate sections to reduce token usage
      const briefContext = brief.sections
        .map((s) => `## ${s.title}\n${s.content.slice(0, 300)}...`)
        .join("\n\n");

      // Limit chat history to last 10 messages (5 turns) to stay under rate limit
      const recentMessages = conversationMessages.slice(-10);
      const safeMessages = recentMessages[0]?.role === "assistant"
        ? recentMessages.slice(1)
        : recentMessages;

      try {
        let fullText = "";
        for await (const chunk of briefsApi.chatStream(
          briefContext,
          safeMessages.map((m) => ({ role: m.role, content: m.content })),
          message
        )) {
          const parsed = chunk as Record<string, unknown>;
          if (parsed.text) {
            fullText += parsed.text as string;
            setStreamingChat(fullText);
          }
        }

        const aiMessage: BriefConversationMessage = {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: fullText,
          citations: [],
          createdAt: new Date().toISOString(),
        };

        setConversationMessages((prev) => [...prev, aiMessage]);
        setStreamingChat("");

        // Save AI message to DB
        briefsApi.saveChatMessage(id, "assistant", fullText).catch(console.error);
      } catch (err) {
        const errorMessage: BriefConversationMessage = {
          id: `msg-${Date.now()}-err`,
          role: "assistant",
          content: "I apologize, but I encountered an error processing your request. Please try again.",
          citations: [],
          createdAt: new Date().toISOString(),
        };
        setConversationMessages((prev) => [...prev, errorMessage]);
      } finally {
        setChatLoading(false);
      }
    },
    [brief, chatLoading, conversationMessages, id]
  );

  // -------------------------------------------------------------------
  // Enhanced brief handlers
  // -------------------------------------------------------------------
  const handleApproveSection = useCallback(
    (sectionId: string) => {
      if (!brief) return;
      setBrief((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? { ...s, reviewStatus: "approved" as string, flagNote: null }
              : s
          ),
        };
      });
      briefsApi.updateSectionReview(sectionId, "approved").catch(console.error);
    },
    [brief]
  );

  const handleFlagSection = useCallback(
    (sectionId: string, note: string) => {
      if (!brief) return;
      setBrief((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.id === sectionId
              ? { ...s, reviewStatus: "flagged" as string, flagNote: note }
              : s
          ),
        };
      });
      briefsApi.updateSectionReview(sectionId, "flagged", note).catch(console.error);
    },
    [brief]
  );

  const handleEditSave = useCallback(
    (sectionId: string, newContent: string) => {
      setBrief((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.sections = updated.sections.map((s) =>
          s.id === sectionId ? { ...s, content: newContent } : s
        );
        return updated;
      });
      setEditingSection(null);
      briefsApi.updateSectionContent(sectionId, newContent).catch(console.error);
    },
    []
  );

  const handleRegenerate = useCallback(
    async (sectionId: string, instructions?: string) => {
      if (!brief || !instructions || regenerating) return;

      setRegenerating(true);
      setRegenerateSection(null);

      const section = brief.sections.find((s) => s.id === sectionId);
      if (!section) {
        setRegenerating(false);
        return;
      }

      // Send full content only for the target section, truncate others
      const briefContext = brief.sections
        .map((s) =>
          s.id === sectionId
            ? `## ${s.title}\n${s.content}`
            : `## ${s.title}\n${s.content.slice(0, 200)}`
        )
        .join("\n\n");

      try {
        let fullText = "";
        for await (const chunk of briefsApi.regenerate(
          section.title,
          section.content,
          instructions,
          briefContext
        )) {
          const parsed = chunk as Record<string, unknown>;
          if (parsed.text) {
            fullText += parsed.text as string;
          }
        }

        // Update local state
        setBrief((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          updated.sections = updated.sections.map((s) =>
            s.id === sectionId && isEnhancedSection(s)
              ? {
                  ...s,
                  content: fullText,
                  regenerationCount: s.regenerationCount + 1,
                  reviewStatus: "pending_review" as SectionReviewStatus,
                }
              : s
          );
          return updated;
        });

        // Save to DB
        briefsApi.updateSectionContent(sectionId, fullText, true).catch(console.error);
      } catch (err) {
        console.error("Regeneration error:", err);
      } finally {
        setRegenerating(false);
      }
    },
    [brief, regenerating]
  );

  const handleFinalize = useCallback(() => {
    if (!brief) return;
    setBrief((prev) => (prev ? { ...prev, status: "finalized" } : prev));
    briefsApi.updateStatus(id, "finalized").catch(console.error);
  }, [brief, id]);

  // -------------------------------------------------------------------
  // Section rendering helpers
  // -------------------------------------------------------------------
  const getSectionByTitle = (title: string) =>
    brief?.sections.find((s) => s.title === title);

  // -------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Brief not found
  // -------------------------------------------------------------------
  if (!brief) {
    return (
      <div className="space-y-6">
        <Link
          href="/judges/brief"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Briefs
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">
              Brief Not Found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              The requested brief could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Extract rich data from sections
  // -------------------------------------------------------------------
  const precedentsSection = getSectionByTitle("Relevant Precedents");
  const precedents = precedentsSection
    ? extractPrecedents(precedentsSection.content)
    : [];

  const petitionerSection = getSectionByTitle("Petitioner's Arguments");
  const petitionerCitations = petitionerSection
    ? extractCitations(petitionerSection.content)
    : [];

  const respondentSection = getSectionByTitle("Respondent's Arguments");
  const respondentCitations = respondentSection
    ? extractCitations(respondentSection.content)
    : [];

  // -------------------------------------------------------------------
  // Build Comparative Matrix data
  // -------------------------------------------------------------------
  const legalIssuesSection = getSectionByTitle("Legal Issues");
  const legalIssues = legalIssuesSection
    ? legalIssuesSection.content
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => l.replace(/^\d+\.\s*/, ""))
    : [];

  const petitionerArgs = petitionerSection
    ? petitionerSection.content
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => l.replace(/^\d+\.\s*/, ""))
    : [];

  const respondentArgs = respondentSection
    ? respondentSection.content
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => l.replace(/^\d+\.\s*/, ""))
    : [];

  const matrixRows = legalIssues.map((issue, i) => {
    const petArg = petitionerArgs[i] || "";
    const resArg = respondentArgs[i] || "";

    const petPrecedent = precedents.find((p) =>
      petArg.toLowerCase().includes(p.caseName.toLowerCase())
    );
    const resPrecedent = precedents.find((p) =>
      resArg.toLowerCase().includes(p.caseName.toLowerCase())
    );

    return {
      issue,
      petitionerArg: petArg,
      respondentArg: resArg,
      petitionerPrecedent: petPrecedent || null,
      respondentPrecedent: resPrecedent || null,
    };
  });

  const enhanced = isEnhancedBrief(brief);

  // Review progress — compute from sections
  const reviewProgress = enhanced
    ? (() => {
        const sections = brief.sections.filter(isEnhancedSection);
        const total = sections.length;
        const approved = sections.filter((s) => s.reviewStatus === "approved").length;
        const flagged = sections.filter((s) => s.reviewStatus === "flagged").length;
        return { total, approved, flagged };
      })()
    : null;

  // ===================================================================
  // RENDER
  // ===================================================================
  return (
    <div className="space-y-8">
      {/* ----------------------------------------------------------- */}
      {/* TOP TOOLBAR                                                  */}
      {/* ----------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/judges/brief"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Briefs
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportMenu title="Case Brief" />
          <SaveToNotesDialog
            title="Save Brief to Notes"
            sourceLabel={brief.caseTitle}
          />
          <Button
            asChild
            className="bg-[#A21CAF] hover:bg-[#86198F] gap-2"
          >
            <Link href={`/judges/judgment?briefId=${id}`}>
              <Gavel className="h-4 w-4" />
              Draft Judgment
            </Link>
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* BRIEF TITLE HEADER                                           */}
      {/* ----------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#A21CAF]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {brief.caseTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Generated on{" "}
                {new Date(brief.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <LegalStatusBadge status={brief.status} />
      </div>

      {/* ----------------------------------------------------------- */}
      {/* REVIEW PROGRESS BAR (enhanced briefs only)                   */}
      {/* ----------------------------------------------------------- */}
      {enhanced && reviewProgress && brief.status !== "finalized" && (
        <BriefReviewProgress
          totalSections={reviewProgress.total}
          approvedSections={reviewProgress.approved}
          flaggedSections={reviewProgress.flagged}
          onFinalize={
            reviewProgress.approved === reviewProgress.total ? handleFinalize : undefined
          }
        />
      )}

      {brief.status === "finalized" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-emerald-800">Brief Finalized</p>
            <p className="text-xs text-emerald-600">
              All sections have been reviewed and approved. This brief is ready for court use.
            </p>
          </div>
        </div>
      )}

      {/* Regeneration indicator */}
      {regenerating && (
        <Card className="border-[#A21CAF]/20 bg-gradient-to-br from-[#A21CAF]/[0.02] to-purple-50/30">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-[#A21CAF] animate-spin" />
              <span className="text-sm text-gray-700">AI is regenerating section...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ----------------------------------------------------------- */}
      {/* BRIEF CONTENT SECTIONS                                       */}
      {/* ----------------------------------------------------------- */}
      <div className="space-y-6">
        {/* ======================================================= */}
        {/* SECTION 1: Case Header                                   */}
        {/* ======================================================= */}
        {getSectionByTitle("Case Header") && (
          <Card className="overflow-hidden">
            <div className="bg-gray-900 px-8 py-8 text-center">
              <p className="text-[#84752F] uppercase tracking-[0.2em] text-xs font-semibold mb-4">
                Case Header
              </p>
              {getSectionByTitle("Case Header")!
                .content.split("\n")
                .map((line, i) => (
                  <p
                    key={i}
                    className={`${
                      i === 0
                        ? "text-xl font-bold text-white mb-2"
                        : i === 1
                        ? "text-sm text-gray-300 font-mono mb-1"
                        : "text-sm text-gray-400"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              {/* Source references for enhanced sections */}
              {isEnhancedSection(getSectionByTitle("Case Header")!) && (
                <div className="mt-4 flex justify-center gap-1">
                  {(getSectionByTitle("Case Header") as EnhancedBriefSection).sources.map(
                    (src, i) => (
                      <SourceReferenceBadge key={i} source={src} compact />
                    )
                  )}
                </div>
              )}
            </div>
            {/* Review controls for enhanced sections */}
            {isEnhancedSection(getSectionByTitle("Case Header")!) &&
              brief.status !== "finalized" && (
                <CardContent className="pt-3 pb-3">
                  <SectionReviewControls
                    reviewStatus={
                      (getSectionByTitle("Case Header") as EnhancedBriefSection).reviewStatus
                    }
                    flagNote={
                      (getSectionByTitle("Case Header") as EnhancedBriefSection).flagNote
                    }
                    onApprove={() =>
                      handleApproveSection(getSectionByTitle("Case Header")!.id)
                    }
                    onFlag={(note) =>
                      handleFlagSection(getSectionByTitle("Case Header")!.id, note)
                    }
                    onEdit={() => setEditingSection(getSectionByTitle("Case Header")!.id)}
                    onRegenerate={() =>
                      setRegenerateSection(getSectionByTitle("Case Header")!.id)
                    }
                  />
                </CardContent>
              )}
          </Card>
        )}

        {/* ======================================================= */}
        {/* SECTION 2: Parties & Representation                      */}
        {/* ======================================================= */}
        {getSectionByTitle("Parties & Representation") && (() => {
          const section = getSectionByTitle("Parties & Representation")!;
          const content = section.content;
          const parts = content.split("\n\n");
          const isEditing = editingSection === section.id;
          return (
            <Card>
              <CardContent className="pt-6">
                <SectionLabel title="Parties & Representation" />
                {isEditing ? (
                  <div className="mt-4">
                    <SectionEditor
                      content={content}
                      onSave={(newContent) => handleEditSave(section.id, newContent)}
                      onCancel={() => setEditingSection(null)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {parts.map((part, i) => {
                        const isPetitioner = part.toUpperCase().includes("PETITIONER") || part.toUpperCase().includes("APPELLANT");
                        return (
                          <div
                            key={i}
                            className={`p-4 rounded-xl border ${
                              isPetitioner
                                ? "border-blue-100 bg-blue-50/30"
                                : "border-rose-100 bg-rose-50/30"
                            }`}
                          >
                            <Badge
                              className={`mb-3 ${
                                isPetitioner
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                              }`}
                            >
                              {isPetitioner ? "Petitioner" : "Respondent"}
                            </Badge>
                            {part.split("\n").map((line, j) => (
                              <p
                                key={j}
                                className={`text-sm ${
                                  j === 0
                                    ? "font-medium text-gray-900"
                                    : "text-gray-600 mt-1"
                                }`}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    {isEnhancedSection(section) && section.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {section.sources.map((src, i) => (
                          <SourceReferenceBadge key={i} source={src} compact />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {isEnhancedSection(section) && brief.status !== "finalized" && !isEditing && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <SectionReviewControls
                      reviewStatus={section.reviewStatus}
                      flagNote={section.flagNote}
                      onApprove={() => handleApproveSection(section.id)}
                      onFlag={(note) => handleFlagSection(section.id, note)}
                      onEdit={() => setEditingSection(section.id)}
                      onRegenerate={() => setRegenerateSection(section.id)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}

        {/* ======================================================= */}
        {/* GENERIC ENHANCED SECTION RENDERER                        */}
        {/* For: Material Facts, Legal Issues, Statutes, Arguments,  */}
        {/*       Precedents, Analysis                                */}
        {/* ======================================================= */}
        {brief.sections
          .filter(
            (s) =>
              s.title !== "Case Header" &&
              s.title !== "Parties & Representation" &&
              s.title !== "Relevant Precedents" &&
              s.title !== "Comparative Matrix"
          )
          .map((section) => {
            const isEditing = editingSection === section.id;
            const isEnhanced = isEnhancedSection(section);
            const enhancedSection = isEnhanced ? (section as EnhancedBriefSection) : null;

            // Determine card styling based on section title
            const isAnalysis = section.title === "Preliminary Analysis";
            const isLegalIssues = section.title === "Legal Issues";
            const isPetitioner = section.title === "Petitioner's Arguments";
            const isRespondent = section.title === "Respondent's Arguments";

            const cardClass = isAnalysis
              ? "border-[#A21CAF]/20 bg-gradient-to-br from-[#A21CAF]/[0.02] to-purple-50/20"
              : isLegalIssues
              ? "border-[#84752F]/20"
              : "";

            return (
              <Card key={section.id} className={cardClass}>
                <CardContent className="pt-6">
                  <SectionLabel title={section.title} />
                  {isEditing ? (
                    <div className="mt-4">
                      <SectionEditor
                        content={section.content}
                        onSave={(newContent) => handleEditSave(section.id, newContent)}
                        onCancel={() => setEditingSection(null)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="mt-4 space-y-3">
                        {section.content
                          .split("\n")
                          .filter((l) => l.trim())
                          .map((line, i) => {
                            const cleaned = line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, "");

                            if (section.title === "Material Facts") {
                              return (
                                <div key={i} className="flex gap-3">
                                  <div className="h-6 w-6 rounded-full bg-[#A21CAF]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-[#A21CAF]">
                                      {i + 1}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {cleaned}
                                  </p>
                                </div>
                              );
                            }

                            if (isLegalIssues) {
                              return (
                                <div
                                  key={i}
                                  className="flex gap-3 p-3 rounded-lg bg-amber-50/50 border border-amber-100/50"
                                >
                                  <HelpCircle className="h-4 w-4 text-[#84752F] shrink-0 mt-0.5" />
                                  <p className="text-sm text-gray-800 italic leading-relaxed">
                                    {cleaned}
                                  </p>
                                </div>
                              );
                            }

                            if (section.title === "Applicable Statutes") {
                              const parts = cleaned.split(":");
                              return (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <ScrollText className="h-4 w-4 text-[#84752F] shrink-0 mt-0.5" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {parts[0]}
                                    </span>
                                    {parts[1] && (
                                      <span className="text-sm text-gray-600">
                                        : {parts[1]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }

                            if (isPetitioner) {
                              return (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg bg-blue-50/40 border border-blue-100/50"
                                >
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {cleaned}
                                  </p>
                                </div>
                              );
                            }

                            if (isRespondent) {
                              return (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg bg-rose-50/40 border border-rose-100/50"
                                >
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {cleaned}
                                  </p>
                                </div>
                              );
                            }

                            // Default (Analysis and other)
                            return (
                              <p
                                key={i}
                                className="text-sm text-gray-700 leading-relaxed"
                              >
                                {line}
                              </p>
                            );
                          })}
                      </div>

                      {/* Citations for petitioner/respondent arguments */}
                      {isPetitioner && petitionerCitations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Citations Referenced
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {petitionerCitations.map((cit) => (
                              <CitationBadge
                                key={cit.id}
                                citation={cit}
                                linkToResearch
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      {isRespondent && respondentCitations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Citations Referenced
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {respondentCitations.map((cit) => (
                              <CitationBadge
                                key={cit.id}
                                citation={cit}
                                linkToResearch
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Source reference badges */}
                      {enhancedSection && enhancedSection.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {enhancedSection.sources.map((src, i) => (
                            <SourceReferenceBadge key={i} source={src} compact />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* Review controls */}
                  {enhancedSection && brief.status !== "finalized" && !isEditing && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <SectionReviewControls
                        reviewStatus={enhancedSection.reviewStatus}
                        flagNote={enhancedSection.flagNote}
                        onApprove={() => handleApproveSection(section.id)}
                        onFlag={(note) => handleFlagSection(section.id, note)}
                        onEdit={() => setEditingSection(section.id)}
                        onRegenerate={() => setRegenerateSection(section.id)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

        {/* ======================================================= */}
        {/* SECTION: Relevant Precedents                             */}
        {/* ======================================================= */}
        {precedents.length > 0 && (() => {
          const section = getSectionByTitle("Relevant Precedents")!;
          const isEditing = editingSection === section.id;
          const isEnhanced = isEnhancedSection(section);
          const enhancedSection = isEnhanced ? (section as EnhancedBriefSection) : null;

          return (
            <div>
              <SectionLabel title="Relevant Precedents" />
              {isEditing ? (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <SectionEditor
                      content={section.content}
                      onSave={(newContent) => handleEditSave(section.id, newContent)}
                      onCancel={() => setEditingSection(null)}
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {precedents.map((prec) => (
                      <PrecedentCard key={prec.id} precedent={prec} />
                    ))}
                  </div>
                  {enhancedSection && brief.status !== "finalized" && (
                    <div className="mt-4">
                      <SectionReviewControls
                        reviewStatus={enhancedSection.reviewStatus}
                        flagNote={enhancedSection.flagNote}
                        onApprove={() => handleApproveSection(section.id)}
                        onFlag={(note) => handleFlagSection(section.id, note)}
                        onEdit={() => setEditingSection(section.id)}
                        onRegenerate={() => setRegenerateSection(section.id)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* ======================================================= */}
        {/* SECTION: Comparative Matrix                               */}
        {/* ======================================================= */}
        {matrixRows.length > 0 && (() => {
          const section = getSectionByTitle("Comparative Matrix");
          const isEnhanced = section && isEnhancedSection(section);
          const enhancedSection = isEnhanced ? (section as EnhancedBriefSection) : null;

          return (
            <Card>
              <CardContent className="pt-6">
                <SectionLabel title="Comparative Matrix" />

                {/* Desktop table (md+) */}
                <div className="hidden md:block mt-4 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-4 bg-gray-50 border border-gray-200 rounded-tl-lg w-10 text-gray-500 font-medium">
                          #
                        </th>
                        <th className="text-left p-4 bg-gray-50 border border-gray-200 text-gray-700 font-medium w-[28%]">
                          Legal Issue
                        </th>
                        <th className="text-left p-4 bg-blue-50/60 border border-blue-100 text-blue-800 font-medium w-[33%]">
                          Petitioner&apos;s Position
                        </th>
                        <th className="text-left p-4 bg-rose-50/60 border border-rose-100 text-rose-800 font-medium rounded-tr-lg w-[33%]">
                          Respondent&apos;s Position
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrixRows.map((row, i) => (
                        <tr key={i}>
                          <td className="p-4 border border-gray-200 align-top">
                            <div className="h-6 w-6 rounded-full bg-[#A21CAF]/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-[#A21CAF]">
                                {i + 1}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 border border-gray-200 align-top">
                            <p className="text-sm text-gray-800 font-medium leading-relaxed">
                              {row.issue}
                            </p>
                          </td>
                          <td className="p-4 border border-blue-100 bg-blue-50/20 align-top">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {row.petitionerArg}
                            </p>
                            {row.petitionerPrecedent && (
                              <div className="mt-2">
                                <CitationBadge
                                  citation={{
                                    id: row.petitionerPrecedent.id,
                                    caseName: row.petitionerPrecedent.caseName,
                                    citation: row.petitionerPrecedent.citation,
                                    court: row.petitionerPrecedent.court,
                                    year: row.petitionerPrecedent.year,
                                    relevance: row.petitionerPrecedent.relevance || "",
                                    snippet: "",
                                  }}
                                  linkToResearch
                                />
                              </div>
                            )}
                          </td>
                          <td className="p-4 border border-rose-100 bg-rose-50/20 align-top">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {row.respondentArg}
                            </p>
                            {row.respondentPrecedent && (
                              <div className="mt-2">
                                <CitationBadge
                                  citation={{
                                    id: row.respondentPrecedent.id,
                                    caseName: row.respondentPrecedent.caseName,
                                    citation: row.respondentPrecedent.citation,
                                    court: row.respondentPrecedent.court,
                                    year: row.respondentPrecedent.year,
                                    relevance: row.respondentPrecedent.relevance || "",
                                    snippet: "",
                                  }}
                                  linkToResearch
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile stacked cards */}
                <div className="md:hidden mt-4 space-y-4">
                  {matrixRows.map((row, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-gray-200 overflow-hidden"
                    >
                      <div className="flex items-start gap-3 p-4 bg-gray-50 border-b border-gray-200">
                        <div className="h-6 w-6 rounded-full bg-[#A21CAF]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-[#A21CAF]">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">
                          {row.issue}
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50/30 border-b border-blue-100">
                        <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Petitioner
                        </Badge>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {row.petitionerArg || "—"}
                        </p>
                        {row.petitionerPrecedent && (
                          <div className="mt-2">
                            <CitationBadge
                              citation={{
                                id: row.petitionerPrecedent.id,
                                caseName: row.petitionerPrecedent.caseName,
                                citation: row.petitionerPrecedent.citation,
                                court: row.petitionerPrecedent.court,
                                year: row.petitionerPrecedent.year,
                                relevance: row.petitionerPrecedent.relevance || "",
                                snippet: "",
                              }}
                              linkToResearch
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-4 bg-rose-50/30">
                        <Badge className="mb-2 bg-rose-100 text-rose-700 hover:bg-rose-100">
                          Respondent
                        </Badge>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {row.respondentArg || "—"}
                        </p>
                        {row.respondentPrecedent && (
                          <div className="mt-2">
                            <CitationBadge
                              citation={{
                                id: row.respondentPrecedent.id,
                                caseName: row.respondentPrecedent.caseName,
                                citation: row.respondentPrecedent.citation,
                                court: row.respondentPrecedent.court,
                                year: row.respondentPrecedent.year,
                                relevance: row.respondentPrecedent.relevance || "",
                                snippet: "",
                              }}
                              linkToResearch
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review controls for comparative matrix */}
                {enhancedSection && brief.status !== "finalized" && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <SectionReviewControls
                      reviewStatus={enhancedSection.reviewStatus}
                      flagNote={enhancedSection.flagNote}
                      onApprove={() => handleApproveSection(section!.id)}
                      onFlag={(note) => handleFlagSection(section!.id, note)}
                      onEdit={() => setEditingSection(section!.id)}
                      onRegenerate={() => setRegenerateSection(section!.id)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })()}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* REGENERATE DIALOG                                            */}
      {/* ----------------------------------------------------------- */}
      {regenerateSection && (
        <RegenerateDialog
          sectionTitle={
            brief.sections.find((s) => s.id === regenerateSection)?.title || ""
          }
          open={!!regenerateSection}
          onOpenChange={(open) => {
            if (!open) setRegenerateSection(null);
          }}
          onRegenerate={(instructions) =>
            handleRegenerate(regenerateSection, instructions)
          }
        />
      )}

      {/* ----------------------------------------------------------- */}
      {/* FOLLOW-UP CONVERSATION                                       */}
      {/* ----------------------------------------------------------- */}
      <Separator className="my-2" />

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-[#A21CAF]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Follow-up Conversation
            </h2>
            <p className="text-sm text-gray-500">
              Ask QanoonAI to elaborate, clarify, or analyze further
            </p>
          </div>
        </div>

        {(conversationMessages.length > 0 || streamingChat) && (
          <Card>
            <CardContent className="pt-6 pb-6">
              <ConversationThread messages={conversationMessages.map((m) => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
                timestamp: new Date(m.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                citations: m.citations as any[],
              }))} />
              {streamingChat && (
                <div className="mt-4 p-4 rounded-lg bg-gray-50">
                  <p className="text-xs font-medium text-[#A21CAF] mb-1">QanoonAI</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{streamingChat}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <ConversationInput
              onSend={handleSendMessage}
              promptSuggestions={PROMPT_SUGGESTIONS}
              placeholder="Ask a follow-up question about this brief..."
            />
            {chatLoading && !streamingChat && (
              <div className="flex items-center gap-2 mt-3">
                <Loader2 className="h-3 w-3 animate-spin text-[#A21CAF]" />
                <span className="text-xs text-gray-500">QanoonAI is thinking...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===================================================================
// SECTION LABEL COMPONENT
// ===================================================================
function SectionLabel({ title }: { title: string }) {
  const Icon = SECTION_ICONS[title] || BookOpen;
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#84752F]" />
      <span className="text-[#84752F] uppercase tracking-wider text-xs font-medium">
        {title}
      </span>
    </div>
  );
}
