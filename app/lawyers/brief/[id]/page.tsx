"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Users,
  ListOrdered,
  HelpCircle,
  ScrollText,
  MessageSquare,
  Landmark,
  Brain,
  Scale,
  FilePen,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { AIProgressSteps } from "@/components/judges/shared/ai-progress-steps";
import { ConversationThread } from "@/components/judges/shared/conversation-thread";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { useAIResponse } from "@/hooks/use-ai-response";
import type { LawyerBrief, BriefConversationMessage } from "@/lib/types/lawyer-portal";

// ---------------------------------------------------------------------------
// AI Generation Steps
// ---------------------------------------------------------------------------
const GENERATION_STEPS = [
  { label: "Reading documents...", duration: 800 },
  { label: "Identifying parties...", duration: 900 },
  { label: "Extracting facts...", duration: 1100 },
  { label: "Analyzing legal issues...", duration: 1200 },
  { label: "Finding applicable law...", duration: 1000 },
  { label: "Mapping arguments...", duration: 1300 },
  { label: "Searching precedents...", duration: 1500 },
  { label: "Drafting strategy notes...", duration: 1000 },
];

const PROMPT_SUGGESTIONS = [
  "What are the strongest precedents?",
  "Elaborate on the legal issues",
  "Summarize the key arguments",
  "Identify potential weaknesses",
];

// ---------------------------------------------------------------------------
// Simulated AI follow-up responses
// ---------------------------------------------------------------------------
const SIMULATED_AI_RESPONSES: Record<string, string> = {
  "What are the strongest precedents?":
    "Based on my analysis, the strongest precedents supporting our position are those from the Supreme Court that directly address the procedural requirements at issue. These decisions establish binding authority on lower courts and provide clear legal principles that align with our factual matrix. I recommend emphasizing these authorities in our written submissions as they create the most persuasive framework for the court to rule in our favour.",
  "Elaborate on the legal issues":
    "The legal issues in this case are multi-faceted. At the core, the dispute involves a tension between statutory authority and fundamental rights protection. The key question is whether the procedural requirements mandated by the applicable statute were followed, and if not, what is the appropriate remedy. The constitutional dimension adds another layer, as the right to due process under Article 10A is non-derogable. The interplay between these statutory and constitutional provisions forms the crux of the legal analysis.",
  "Summarize the key arguments":
    "The case rests on three main pillars: (1) Procedural irregularity -- the opposing party failed to follow the mandatory procedural requirements of the governing statute, rendering their actions void ab initio; (2) Constitutional violation -- the actions violate fundamental rights guaranteed under the Constitution, particularly Articles 4, 10A, and 25; (3) Precedential support -- multiple Supreme Court decisions have consistently held that similar procedural failures invalidate the underlying action. Our opponents will likely argue jurisdictional limitations and factual distinctions, but these arguments are weakened by the clear statutory language and binding precedent.",
  "Identify potential weaknesses":
    "There are two potential areas of vulnerability: (1) The opposing party may argue that there was substantial compliance with procedural requirements, even if not perfect compliance. We should prepare to demonstrate that the deficiencies were not merely technical but went to the root of the statutory scheme. (2) There could be a limitation argument if any filing deadlines were not strictly met. However, the constitutional nature of the rights at stake provides a strong basis for condonation of any delay. I recommend proactively addressing these points in our submissions.",
};

const DEFAULT_AI_RESPONSE =
  "That is an excellent question. Based on my analysis of the case documents and applicable jurisprudence, there are several important aspects to consider. The legal framework in this area has evolved through a series of significant decisions that establish clear principles. I recommend examining both the statutory provisions and the constitutional guarantees to develop a comprehensive understanding. The interplay between procedural requirements and substantive rights remains a central theme in this line of cases.";

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
function BriefStatusBadge({ status }: { status: LawyerBrief["status"] }) {
  const styles: Record<LawyerBrief["status"], string> = {
    Generating: "bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/10",
    Complete: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  };
  return <Badge className={styles[status]}>{status}</Badge>;
}

// ---------------------------------------------------------------------------
// Section icons mapping
// ---------------------------------------------------------------------------
const SECTION_ICONS: Record<string, React.ElementType> = {
  "Case Header": Landmark,
  Facts: ListOrdered,
  Issues: HelpCircle,
  Arguments: MessageSquare,
  "Applicable Law": ScrollText,
  Precedents: Scale,
  "Strategy Notes": Brain,
  "Parties & Representation": Users,
};

// ===========================================================================
// COMPONENT
// ===========================================================================
export default function LawyerBriefDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [brief, setBrief] = useState<LawyerBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGeneration, setShowGeneration] = useState(false);
  const [conversationMessages, setConversationMessages] = useState<
    BriefConversationMessage[]
  >([]);

  // AI generation animation hook
  const aiResponse = useAIResponse(
    GENERATION_STEPS,
    "Brief generation complete. All sections have been analyzed and structured.",
    20,
    4
  );

  // Start generation when flag is set
  useEffect(() => {
    if (showGeneration && aiResponse.phase === "idle") {
      aiResponse.start();
    }
  }, [showGeneration, aiResponse.phase]);

  // -------------------------------------------------------------------------
  // Conversation handler
  // -------------------------------------------------------------------------
  const handleSendMessage = useCallback((message: string) => {
    const userMessage: BriefConversationMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversationMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const responseContent =
        SIMULATED_AI_RESPONSES[message] || DEFAULT_AI_RESPONSE;

      const aiMessage: BriefConversationMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversationMessages((prev) => [...prev, aiMessage]);
    }, 1200);
  }, []);

  // -------------------------------------------------------------------------
  // Section helpers
  // -------------------------------------------------------------------------
  const getSectionByTitle = (title: string) =>
    brief?.sections.find((s) => s.title === title);

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Brief not found
  // -------------------------------------------------------------------------
  if (!brief) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/brief"
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

  const isGenerating = showGeneration && aiResponse.phase !== "complete";

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <div className="space-y-8">
      {/* --------------------------------------------------------------- */}
      {/* TOP TOOLBAR                                                      */}
      {/* --------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/lawyers/brief"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Briefs
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportMenu title="Case Brief" />
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={`/lawyers/research?from=brief&caseId=${brief.caseId}`}>
              <Search className="h-4 w-4" />
              Open in Research
            </Link>
          </Button>
          <Button
            asChild
            className="bg-[#2563EB] hover:bg-[#1D4ED8] gap-2"
            size="sm"
          >
            <Link href={`/lawyers/petition?from=brief&caseId=${brief.caseId}`}>
              <FilePen className="h-4 w-4" />
              Draft Petition
            </Link>
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* BRIEF TITLE HEADER                                               */}
      {/* --------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-gray-900">
                {brief.caseTitle}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
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
        <BriefStatusBadge status={brief.status} />
      </div>

      {/* --------------------------------------------------------------- */}
      {/* AI GENERATION STATE (if generating)                              */}
      {/* --------------------------------------------------------------- */}
      {isGenerating && (
        <Card className="border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.02] to-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-[#2563EB] animate-pulse" />
              Generating Brief...
            </CardTitle>
            <p className="text-sm text-gray-500">
              QanoonAI is analyzing documents and preparing your case brief
            </p>
          </CardHeader>
          <CardContent>
            <AIProgressSteps
              steps={GENERATION_STEPS}
              currentStepIndex={aiResponse.currentStepIndex}
              completedSteps={aiResponse.completedSteps}
              isRunning={aiResponse.phase === "progress"}
            />
            {aiResponse.phase === "streaming" && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {aiResponse.displayedText}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* --------------------------------------------------------------- */}
      {/* BRIEF CONTENT SECTIONS                                           */}
      {/* --------------------------------------------------------------- */}
      {(!showGeneration || aiResponse.phase === "complete") && (
        <div className="space-y-6">
          {/* ============================================================ */}
          {/* Case Header                                                   */}
          {/* ============================================================ */}
          {getSectionByTitle("Case Header") && (
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-10 text-center">
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
                          ? "text-xl font-serif font-bold text-white mb-2"
                          : i === 1
                          ? "text-sm text-gray-300 font-mono mb-1"
                          : "text-sm text-gray-400"
                      }`}
                    >
                      {line}
                    </p>
                  ))}
              </div>
            </Card>
          )}

          {/* ============================================================ */}
          {/* Facts                                                         */}
          {/* ============================================================ */}
          {getSectionByTitle("Facts") && (
            <Card>
              <CardContent className="pt-6">
                <SectionLabel title="Facts" />
                <div className="mt-4 space-y-3">
                  {getSectionByTitle("Facts")!
                    .content.split("\n")
                    .filter((l) => l.trim())
                    .map((line, i) => {
                      const cleaned = line.replace(/^\d+\.\s*/, "");
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="h-6 w-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-[#2563EB]">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {cleaned}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================================================ */}
          {/* Issues                                                        */}
          {/* ============================================================ */}
          {getSectionByTitle("Issues") && (
            <Card className="border-[#84752F]/20">
              <CardContent className="pt-6">
                <SectionLabel title="Issues" />
                <div className="mt-4 space-y-4">
                  {getSectionByTitle("Issues")!
                    .content.split("\n")
                    .filter((l) => l.trim())
                    .map((line, i) => {
                      const cleaned = line.replace(/^\d+\.\s*/, "");
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
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================================================ */}
          {/* Arguments                                                     */}
          {/* ============================================================ */}
          {getSectionByTitle("Arguments") && (() => {
            const lines = getSectionByTitle("Arguments")!
              .content.split("\n")
              .filter((l) => l.trim());

            // Find the respondent header index to determine sides
            const respondentIdx = lines.findIndex(
              (l) =>
                (l.toLowerCase().includes("respondent") ||
                  l.toLowerCase().includes("prosecution")) &&
                l.includes("Arguments")
            );

            return (
              <Card>
                <CardContent className="pt-6">
                  <SectionLabel title="Arguments" />
                  <div className="mt-4 space-y-3">
                    {lines.map((line, i) => {
                      const isHeader =
                        line.includes("Arguments:") ||
                        line.includes("arguments:");
                      if (isHeader) {
                        const isPetitionerSide =
                          line.toLowerCase().includes("petitioner") ||
                          line.toLowerCase().includes("plaintiff") ||
                          line.toLowerCase().includes("appellant") ||
                          line.toLowerCase().includes("defence") ||
                          line.toLowerCase().includes("applicant");
                        return (
                          <div key={i} className="pt-2 first:pt-0">
                            <Badge
                              className={
                                isPetitionerSide
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                  : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                              }
                            >
                              {line.replace(":", "").trim()}
                            </Badge>
                          </div>
                        );
                      }
                      const cleaned = line.replace(/^\d+\.\s*/, "");
                      const isRespondentSide =
                        respondentIdx > -1 && i > respondentIdx;
                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-lg ${
                            isRespondentSide
                              ? "bg-rose-50/40 border border-rose-100/50"
                              : "bg-blue-50/40 border border-blue-100/50"
                          }`}
                        >
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {cleaned}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* ============================================================ */}
          {/* Applicable Law                                                */}
          {/* ============================================================ */}
          {getSectionByTitle("Applicable Law") && (
            <Card>
              <CardContent className="pt-6">
                <SectionLabel title="Applicable Law" />
                <div className="mt-4 space-y-2">
                  {getSectionByTitle("Applicable Law")!
                    .content.split("\n")
                    .filter((l) => l.trim())
                    .map((line, i) => {
                      const cleaned = line.replace(/^-\s*/, "");
                      const parts = cleaned.split(":");
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ScrollText className="h-4 w-4 text-[#84752F] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {parts[0]}
                            </span>
                            {parts[1] && (
                              <span className="text-sm text-gray-600">
                                : {parts.slice(1).join(":")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================================================ */}
          {/* Precedents                                                    */}
          {/* ============================================================ */}
          {getSectionByTitle("Precedents") && (
            <Card>
              <CardContent className="pt-6">
                <SectionLabel title="Precedents" />
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getSectionByTitle("Precedents")!
                    .content.split("\n")
                    .filter((l) => l.trim())
                    .map((line, i) => {
                      const match = line.match(
                        /\d+\.\s*(.+?)\s*\(([^)]+)\):\s*(.*)/
                      );
                      if (!match) return null;
                      return (
                        <div
                          key={i}
                          className="p-4 rounded-xl border border-gray-200 hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <Scale className="h-4 w-4 text-[#2563EB] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {match[1].trim()}
                              </p>
                              <p className="text-xs text-[#2563EB] font-mono mt-1">
                                {match[2].trim()}
                              </p>
                              <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                                {match[3].trim()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ============================================================ */}
          {/* Strategy Notes                                                */}
          {/* ============================================================ */}
          {getSectionByTitle("Strategy Notes") && (
            <Card className="border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.02] to-blue-50/20">
              <CardContent className="pt-6">
                <SectionLabel title="Strategy Notes" />
                <div className="mt-4 prose prose-sm max-w-none">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {getSectionByTitle("Strategy Notes")!.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------- */}
      {/* FOLLOW-UP CONVERSATION                                           */}
      {/* --------------------------------------------------------------- */}
      {(!showGeneration || aiResponse.phase === "complete") && (
        <>
          <Separator className="my-2" />

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-[#2563EB]" />
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

            {/* Existing conversation messages */}
            {conversationMessages.length > 0 && (
              <Card>
                <CardContent className="pt-6 pb-6">
                  <ConversationThread messages={conversationMessages} />
                </CardContent>
              </Card>
            )}

            {/* Conversation input with prompt suggestions */}
            <Card>
              <CardContent className="pt-5 pb-5">
                <ConversationInput
                  onSend={handleSendMessage}
                  promptSuggestions={PROMPT_SUGGESTIONS}
                  placeholder="Ask a follow-up question about this brief..."
                />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

// ===========================================================================
// SECTION LABEL COMPONENT
// ===========================================================================
function SectionLabel({ title }: { title: string }) {
  const Icon = SECTION_ICONS[title] || BookOpen;
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-[#84752F]" />
      <span className="text-[#84752F] uppercase tracking-wider text-xs font-semibold">
        {title}
      </span>
    </div>
  );
}
