"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Scale,
  User,
  Bookmark,
  ExternalLink,
  History,
  FileText,
  LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIProgressSteps } from "@/components/judges/shared/ai-progress-steps";
import { ConversationInput } from "@/components/judges/shared/conversation-input";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { useAISimulation } from "@/hooks/use-ai-simulation";
import type { StatuteAnalysis, ResearchMessage } from "@/lib/types/lawyer-portal";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";

const aiSteps = [
  { label: "Loading statute section...", duration: 800 },
  { label: "Analyzing plain meaning...", duration: 1200 },
  { label: "Finding judicial interpretations...", duration: 1500 },
  { label: "Checking amendments...", duration: 1000 },
  { label: "Compiling analysis...", duration: 600 },
];

const followUpPrompts = [
  "Explain in simpler terms",
  "Show landmark judgments",
  "How does this apply in practice?",
  "What are the penalties?",
];

// Simulated follow-up response
const simulatedFollowUp = `Based on the analysis above, here are some practical considerations:

1. **Application in Courts**: This section is frequently cited in district court proceedings. The burden of proof considerations are critical for practitioners preparing their cases.

2. **Recent Trends**: The superior courts have shown a trend towards stricter interpretation in recent years, particularly in cases involving financial fraud and white-collar crime.

3. **Practical Tips for Lawyers**:
   - Always verify the latest amended version of the section
   - Check for any relevant High Court notifications or circulars
   - Consider both the substantive and procedural requirements
   - Review related sections that may complement or qualify this provision

4. **Common Pitfalls**: Practitioners should be careful not to confuse similar provisions across different statutes, as the elements and standards of proof may differ significantly.

Would you like me to find specific case citations or explore any aspect in more detail?`;

export default function StatuteAnalysisDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [analysis, setAnalysis] = useState<StatuteAnalysis | null>(null);
  const [messages, setMessages] = useState<ResearchMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const simulation = useAISimulation(aiSteps);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    const userMessage: ResearchMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const aiMessage: ResearchMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: simulatedFollowUp,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, delay);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="h-5 w-5 text-[#2563EB]" />
          </div>
          <p className="text-sm text-gray-500">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Analysis not found.</p>
          <Button variant="outline" asChild>
            <Link href="/lawyers/statute-analyzer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Statute Analyzer
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(analysis.createdAt).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="shrink-0" asChild>
            <Link href="/lawyers/statute-analyzer">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className="text-[#2563EB] border-[#2563EB]/30"
              >
                {analysis.statuteName}
              </Badge>
              <span className="text-xs text-gray-400">
                Section {analysis.sectionNumber}
              </span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {analysis.query}
            </h1>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ExportMenu title="Statute Analysis" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Analysis saved to your files")}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Analysis
          </Button>
        </div>
      </div>

      <Separator />

      {/* AI Progress Steps */}
      {simulation.isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-6 w-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Analyzing Section {analysis.sectionNumber}...
              </span>
            </div>
            <AIProgressSteps
              steps={aiSteps.map((s) => ({ label: s.label }))}
              currentStepIndex={simulation.currentStepIndex}
              completedSteps={simulation.completedSteps}
              isRunning={simulation.isRunning}
            />
          </CardContent>
        </Card>
      )}

      {/* Statute Section Text */}
      {simulation.isComplete && (
        <>
          <Card className="border-[#2563EB]/20 bg-[#2563EB]/[0.02]">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0 mt-1">
                  <BookOpen className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Section {analysis.sectionNumber} &mdash;{" "}
                    {analysis.statuteName}
                  </h3>
                  <p className="text-sm text-gray-700 font-serif leading-relaxed italic">
                    &ldquo;{analysis.plainLanguage.split("\n")[0]}&rdquo;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Plain Language Explanation */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                  <CardTitle className="text-sm">
                    Plain Language Explanation
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {analysis.plainLanguage}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Judicial Interpretations */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[#2563EB]" />
                  <CardTitle className="text-sm">
                    Judicial Interpretations
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {analysis.judicialInterpretations}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amendments History */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-[#2563EB]" />
                  <CardTitle className="text-sm">Amendments History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {analysis.amendmentsHistory}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Sections */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-[#2563EB]" />
                  <CardTitle className="text-sm">Related Sections</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.relatedSections.map((section, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700">{section}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hover:border-[#2563EB] hover:text-[#2563EB]"
              onClick={() =>
                toast.info("Opening related cases...", {
                  description: `Cases citing Section ${analysis.sectionNumber}`,
                })
              }
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Related Cases
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hover:border-[#2563EB] hover:text-[#2563EB]"
              asChild
            >
              <Link href="/lawyers/case-finder">
                <Scale className="h-4 w-4 mr-2" />
                Find Case Law
              </Link>
            </Button>
          </div>

          <Separator />

          {/* Follow-up Conversation */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Follow-up Questions
            </h2>

            {/* Messages */}
            {messages.length > 0 && (
              <ScrollArea className="max-h-[400px]">
                <div className="space-y-6 pr-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                          message.role === "assistant"
                            ? "bg-[#2563EB]"
                            : "bg-gray-200"
                        )}
                      >
                        {message.role === "assistant" ? (
                          <Scale className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-gray-900">
                            {message.role === "assistant" ? "QanoonAI" : "You"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "rounded-lg px-4 py-3",
                            message.role === "assistant"
                              ? "bg-white border border-gray-100"
                              : "bg-gray-50 border border-gray-100"
                          )}
                        >
                          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                            <div className="whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                        <Scale className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-gray-900">
                            QanoonAI
                          </span>
                        </div>
                        <div className="rounded-lg px-4 py-3 bg-white border border-gray-100 inline-block">
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:0ms]" />
                            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:150ms]" />
                            <div className="h-2 w-2 rounded-full bg-[#2563EB]/40 animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
            )}

            {/* Conversation Input */}
            <ConversationInput
              onSend={handleSendMessage}
              promptSuggestions={followUpPrompts}
              placeholder="Ask a follow-up question about this section..."
              disabled={isTyping}
            />
          </div>
        </>
      )}
    </div>
  );
}
