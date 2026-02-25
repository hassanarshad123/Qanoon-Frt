"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { SaveToNotesDialog } from "@/components/judges/shared/save-to-notes-dialog";
import { PrecedentCard } from "@/components/judges/shared/precedent-card";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { SectionReviewControls } from "@/components/judges/shared/section-review-controls";
import { SectionEditor } from "@/components/judges/shared/section-editor";
import { RegenerateDialog } from "@/components/judges/shared/regenerate-dialog";
import { LegalStatusBadge } from "@/components/judges/shared/legal-status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  judgmentsApi,
  type JudgmentDetail,
  type JudgmentSection,
} from "@/lib/api/judgments";

type Judgment = JudgmentDetail;
import Markdown from "react-markdown";
import { toast } from "sonner";

const AI_SUGGESTIONS = [
  "Expand the analysis section",
  "Add more precedents",
  "Refine the holding",
  "Strengthen legal reasoning",
];

export default function JudgmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [judgment, setJudgment] = useState<Judgment | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [regenerateSection, setRegenerateSection] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [streamingChat, setStreamingChat] = useState("");

  useEffect(() => {
    if (!id) return;
    judgmentsApi.get(id)
      .then((data) => {
        if (data) {
          setJudgment(data);
          const initialOpen: Record<string, boolean> = {};
          data.sections.forEach((s) => {
            initialOpen[s.id] = true;
          });
          setOpenSections(initialOpen);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const handleApprove = useCallback((sectionId: string) => {
    setJudgment((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, reviewStatus: "approved", flagNote: null } : s
        ),
      };
    });
    judgmentsApi.updateSectionReview(sectionId, "approved").catch(console.error);
  }, []);

  const handleFlag = useCallback((sectionId: string, note: string) => {
    setJudgment((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, reviewStatus: "flagged", flagNote: note } : s
        ),
      };
    });
    judgmentsApi.updateSectionReview(sectionId, "flagged", note).catch(console.error);
  }, []);

  const handleEditSave = useCallback((sectionId: string, newContent: string) => {
    setJudgment((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, content: newContent } : s
        ),
      };
    });
    setEditingSection(null);
    judgmentsApi.updateSectionContent(sectionId, newContent).catch(console.error);
  }, []);

  const handleRegenerate = useCallback(
    async (sectionId: string, instructions?: string) => {
      if (!judgment || !instructions || regenerating) return;

      setRegenerating(true);
      setRegenerateSection(null);

      const section = judgment.sections.find((s) => s.id === sectionId);
      if (!section) {
        setRegenerating(false);
        return;
      }

      // Send full content only for the target section, truncate others
      const judgmentContext = judgment.sections
        .map((s) =>
          s.id === sectionId
            ? `## ${s.title}\n${s.content}`
            : `## ${s.title}\n${s.content.slice(0, 200)}`
        )
        .join("\n\n");

      try {
        let fullText = "";
        for await (const chunk of judgmentsApi.regenerate(
          section.title,
          section.content,
          instructions,
          judgmentContext
        )) {
          const parsed = chunk as Record<string, unknown>;
          if (parsed.text) {
            fullText += parsed.text as string;
          }
        }

        setJudgment((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === sectionId
                ? {
                    ...s,
                    content: fullText,
                    regenerationCount: s.regenerationCount + 1,
                    reviewStatus: "pending_review",
                  }
                : s
            ),
          };
        });

        judgmentsApi.updateSectionContent(sectionId, fullText, true).catch(console.error);
        toast.success("Section regenerated");
      } catch (err) {
        console.error("Regeneration error:", err);
        toast.error("Failed to regenerate section");
      } finally {
        setRegenerating(false);
      }
    },
    [judgment, regenerating]
  );

  const handleChat = useCallback(
    async (message: string) => {
      if (!judgment || chatLoading) return;

      setChatLoading(true);
      setStreamingChat("");

      // Add user message to local state
      const userMsg = {
        id: `temp-${Date.now()}`,
        role: "user" as const,
        content: message,
        citations: [],
        createdAt: new Date().toISOString(),
      };
      setJudgment((prev) =>
        prev ? { ...prev, chatMessages: [...prev.chatMessages, userMsg] } : prev
      );

      judgmentsApi.saveChatMessage(id, "user", message).catch(console.error);

      // Truncate sections to reduce token usage
      const judgmentContext = judgment.sections
        .map((s) => `## ${s.title}\n${s.content.slice(0, 300)}...`)
        .join("\n\n");

      // Limit chat history to last 10 messages (5 turns) to stay under rate limit
      const recentMessages = judgment.chatMessages.slice(-10);
      const safeMessages = recentMessages[0]?.role === "assistant"
        ? recentMessages.slice(1)
        : recentMessages;

      try {
        let fullText = "";
        for await (const chunk of judgmentsApi.chatStream(
          judgmentContext,
          safeMessages.map((m) => ({ role: m.role, content: m.content })),
          message
        )) {
          const parsed = chunk as Record<string, unknown>;
          if (parsed.text) {
            fullText += parsed.text as string;
            setStreamingChat(fullText);
          }
        }

        const aiMsg = {
          id: `temp-${Date.now()}-ai`,
          role: "assistant" as const,
          content: fullText,
          citations: [],
          createdAt: new Date().toISOString(),
        };
        setJudgment((prev) =>
          prev ? { ...prev, chatMessages: [...prev.chatMessages, aiMsg] } : prev
        );
        setStreamingChat("");

        judgmentsApi.saveChatMessage(id, "assistant", fullText).catch(console.error);
      } catch (err) {
        console.error("Chat error:", err);
        toast.error("Failed to get AI response");
      } finally {
        setChatLoading(false);
      }
    },
    [judgment, chatLoading, id]
  );

  const handleFinalize = useCallback(() => {
    if (!judgment) return;
    setJudgment((prev) => (prev ? { ...prev, status: "finalized" } : prev));
    judgmentsApi.updateStatus(id, "finalized").catch(console.error);
    toast.success("Judgment finalized");
  }, [judgment, id]);

  const handleDelete = useCallback(async () => {
    try {
      await judgmentsApi.delete(id);
      toast.success("Judgment deleted");
      router.push("/judges/judgment");
    } catch {
      toast.error("Failed to delete judgment");
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-[600px] bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!judgment) {
    return (
      <div className="space-y-4">
        <Link href="/judges/judgment">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Judgments
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Judgment not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract precedents from RAG results for the right panel
  const precedents = (judgment.ragResults || []).map((r: any) => ({
    id: r.precedent?.id || `prec-${Math.random()}`,
    caseName: r.precedent?.caseName || "",
    citation: r.precedent?.citation || "",
    court: r.precedent?.court || "",
    year: r.precedent?.year || "",
    relevance: r.precedent?.summary || "",
    summary: r.precedent?.summary || "",
    relevanceScore: r.relevanceScore || 0,
  }));

  const allApproved = judgment.sections.every((s) => s.reviewStatus === "approved");

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between">
        <Link href="/judges/judgment">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Judgments
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <LegalStatusBadge status={judgment.status} />
          <ExportMenu
            title={judgment.caseTitle}
            sections={judgment.sections.map(s => ({ title: s.title, content: s.content }))}
          />
          <SaveToNotesDialog
            title="Save Judgment to Notes"
            sourceLabel={judgment.caseTitle}
            content={judgment.sections.map(s => `${s.title}\n${s.content}`).join("\n\n")}
            sourceId={id}
            sourceType="judgment"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Judgment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this judgment? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {judgment.status !== "finalized" && allApproved && (
            <Button
              onClick={handleFinalize}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Finalize Judgment
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {judgment.caseTitle}
        </h1>
        {judgment.caseNumber && (
          <p className="text-sm text-gray-500 font-mono mt-1">
            {judgment.caseNumber}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">
          Created{" "}
          {new Date(judgment.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

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

      {/* Resizable Panel Layout */}
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[700px] rounded-lg border"
      >
        {/* Left Panel - Judgment Sections */}
        <ResizablePanel defaultSize={65} minSize={40}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-gray-50/50">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
                Judgment Draft
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {judgment.sections.length} sections &mdash; Pakistani judgment format
              </p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {judgment.sections.map((section, index) => {
                  const isEditing = editingSection === section.id;

                  return (
                    <Collapsible
                      key={section.id}
                      open={openSections[section.id]}
                      onOpenChange={() => toggleSection(section.id)}
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50/80 transition-colors py-3.5 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#84752F]/10 text-[#84752F] text-xs font-semibold">
                                  {index + 1}
                                </span>
                                <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
                                  {section.title}
                                </span>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                                  openSections[section.id] ? "rotate-180" : "rotate-0"
                                }`}
                              />
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0 px-4 pb-5">
                            <Separator className="mb-3" />
                            {isEditing ? (
                              <SectionEditor
                                content={section.content}
                                onSave={(newContent) => handleEditSave(section.id, newContent)}
                                onCancel={() => setEditingSection(null)}
                              />
                            ) : (
                              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                                <Markdown>{section.content}</Markdown>
                              </div>
                            )}
                            {judgment.status !== "finalized" && !isEditing && (
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <SectionReviewControls
                                  reviewStatus={section.reviewStatus as any}
                                  flagNote={section.flagNote ?? undefined}
                                  onApprove={() => handleApprove(section.id)}
                                  onFlag={(note) => handleFlag(section.id, note)}
                                  onEdit={() => setEditingSection(section.id)}
                                  onRegenerate={() => setRegenerateSection(section.id)}
                                />
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>

              {/* AI Follow-up Area */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#84752F] mb-3">
                  AI Follow-up
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Ask the AI to refine, expand, or modify specific sections of
                  the judgment draft.
                </p>

                {/* Conversation history */}
                {judgment.chatMessages.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {judgment.chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.role === "user" ? "bg-blue-50" : "bg-gray-50"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1 text-gray-500">
                          {msg.role === "user" ? "You" : "QanoonAI"}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    ))}
                    {streamingChat && (
                      <div className="p-3 rounded-lg bg-gray-50">
                        <p className="text-xs font-medium text-[#A21CAF] mb-1">QanoonAI</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{streamingChat}</p>
                      </div>
                    )}
                  </div>
                )}

                <ConversationInput
                  onSend={handleChat}
                  promptSuggestions={AI_SUGGESTIONS}
                  placeholder="Ask to refine any section of the judgment..."
                />
                {chatLoading && !streamingChat && (
                  <div className="flex items-center gap-2 mt-2">
                    <Loader2 className="h-3 w-3 animate-spin text-[#A21CAF]" />
                    <span className="text-xs text-gray-500">QanoonAI is thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Precedents */}
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-gray-50/50">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
                Relevant Precedents
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {precedents.length} relevant cases found
              </p>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {precedents.map((precedent: any) => (
                  <PrecedentCard
                    key={precedent.id}
                    precedent={precedent}
                    onSaveToNotes={() => {}}
                  />
                ))}

                {precedents.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">
                      No precedents found from the RAG search.
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Regenerate Dialog */}
      {regenerateSection && (
        <RegenerateDialog
          sectionTitle={
            judgment.sections.find((s) => s.id === regenerateSection)?.title || ""
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
    </div>
  );
}
