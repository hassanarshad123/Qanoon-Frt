"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FilePen,
  Sparkles,
  Lightbulb,
  Printer,
  BookOpen,
  Landmark,
  Users,
  ListOrdered,
  Scale,
  ScrollText,
  CheckCircle2,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { AIProgressSteps } from "@/components/judges/shared/ai-progress-steps";
import { useAIResponse } from "@/hooks/use-ai-response";
import type { Petition } from "@/lib/types/lawyer-portal";

// ---------------------------------------------------------------------------
// AI Generation Steps
// ---------------------------------------------------------------------------
const GENERATION_STEPS = [
  { label: "Analyzing case facts...", duration: 900 },
  { label: "Identifying legal grounds...", duration: 1100 },
  { label: "Researching applicable law...", duration: 1200 },
  { label: "Drafting prayer clause...", duration: 1000 },
  { label: "Formatting per court rules...", duration: 800 },
  { label: "Adding citations...", duration: 900 },
];

// ---------------------------------------------------------------------------
// Status badge styles
// ---------------------------------------------------------------------------
const statusStyles: Record<string, string> = {
  Complete: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  "Under Review": "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

// ---------------------------------------------------------------------------
// Section icons mapping
// ---------------------------------------------------------------------------
const SECTION_ICONS: Record<string, React.ElementType> = {
  Title: FilePen,
  "Court & Jurisdiction": Landmark,
  Parties: Users,
  Facts: ListOrdered,
  Grounds: Scale,
  Prayer: ScrollText,
  Verification: CheckCircle2,
};

// ===========================================================================
// COMPONENT
// ===========================================================================
export default function PetitionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(false);
  const [showGeneration, setShowGeneration] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, string>>(
    {}
  );

  // AI generation animation hook
  const aiResponse = useAIResponse(
    GENERATION_STEPS,
    "Petition drafted successfully. All sections are ready for review.",
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
  // Edit handlers
  // -------------------------------------------------------------------------
  const handleStartEdit = (sectionId: string, content: string) => {
    setEditingSectionId(sectionId);
    if (!editedContent[sectionId]) {
      setEditedContent((prev) => ({ ...prev, [sectionId]: content }));
    }
  };

  const handleSaveEdit = (sectionId: string) => {
    setEditingSectionId(null);
    // In a real app, would persist the change
  };

  const getSectionContent = (sectionId: string, originalContent: string) =>
    editedContent[sectionId] ?? originalContent;

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
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Petition not found
  // -------------------------------------------------------------------------
  if (!petition) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/petition"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Petitions
        </Link>
        <Card>
          <CardContent className="py-16 text-center">
            <FilePen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">
              Petition Not Found
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              The requested petition could not be found.
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
          href="/lawyers/petition"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Petitions
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ExportMenu title="Petition" />
          <Button
            onClick={() => window.print()}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* PETITION TITLE HEADER                                            */}
      {/* --------------------------------------------------------------- */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
              <FilePen className="h-5 w-5 text-[#2563EB]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-gray-900">
                {petition.caseTitle}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-[#2563EB] border-[#2563EB]/30"
                >
                  {petition.type}
                </Badge>
                <span className="text-sm text-gray-500">{petition.court}</span>
              </div>
            </div>
          </div>
        </div>
        <Badge
          className={statusStyles[petition.status] || statusStyles.Draft}
        >
          {petition.status}
        </Badge>
      </div>

      {/* --------------------------------------------------------------- */}
      {/* AI GENERATION STATE (if generating)                              */}
      {/* --------------------------------------------------------------- */}
      {isGenerating && (
        <Card className="border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.02] to-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-[#2563EB] animate-pulse" />
              Drafting Petition...
            </CardTitle>
            <p className="text-sm text-gray-500">
              QanoonAI is analyzing the case and drafting your petition
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
      {/* PETITION CONTENT (main + sidebar layout)                         */}
      {/* --------------------------------------------------------------- */}
      {(!showGeneration || aiResponse.phase === "complete") && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ============================================================ */}
          {/* MAIN CONTENT: Editable petition sections                      */}
          {/* ============================================================ */}
          <div className="lg:col-span-3 space-y-4">
            {petition.sections.map((section) => {
              const Icon = SECTION_ICONS[section.title] || BookOpen;
              const isEditing = editingSectionId === section.id;
              const displayContent = getSectionContent(
                section.id,
                section.content
              );

              return (
                <Card
                  key={section.id}
                  className={
                    isEditing
                      ? "border-[#2563EB]/30 ring-1 ring-[#2563EB]/20"
                      : "hover:border-gray-300 transition-colors"
                  }
                >
                  <CardContent className="pt-6">
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#84752F]" />
                        <span className="text-[#84752F] uppercase tracking-wider text-xs font-semibold">
                          {section.title}
                        </span>
                      </div>
                      {isEditing ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="text-xs h-7 bg-[#2563EB] hover:bg-[#1D4ED8]"
                          onClick={() => handleSaveEdit(section.id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 gap-1 text-gray-500 hover:text-[#2563EB]"
                          onClick={() =>
                            handleStartEdit(section.id, section.content)
                          }
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {/* Section content */}
                    {isEditing ? (
                      <Textarea
                        value={editedContent[section.id] ?? section.content}
                        onChange={(e) =>
                          setEditedContent((prev) => ({
                            ...prev,
                            [section.id]: e.target.value,
                          }))
                        }
                        className="min-h-[200px] font-serif text-sm leading-relaxed"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm text-gray-700 font-serif leading-relaxed">
                          {displayContent}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ============================================================ */}
          {/* SIDEBAR: AI Suggestions panel                                 */}
          {/* ============================================================ */}
          <div className="space-y-4">
            {/* AI Suggestions */}
            <Card className="sticky top-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  </div>
                  AI Suggestions
                </CardTitle>
                <p className="text-xs text-gray-500">
                  Recommendations to improve this petition
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {petition.suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      className="w-full text-left p-3 rounded-lg bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-3 w-3 text-[#2563EB] shrink-0 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {suggestion}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>

              <Separator />

              {/* Quick info */}
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Type</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {petition.type} Petition
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Court</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {petition.court}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Created</p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {new Date(petition.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      Sections
                    </p>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {petition.sections.length} sections
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
