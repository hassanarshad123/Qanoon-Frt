"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { CaseSelector } from "@/components/judges/shared/case-selector";
import { ResearchConversationCard } from "@/components/judges/shared/research-conversation-card";
import { researchApi, type ResearchConversationSummary } from "@/lib/api/research";
import type { ResearchMode } from "@/lib/research/types";
import { toast } from "sonner";

const suggestions = [
  "What is the test for granting bail in non-bailable offences?",
  "Grounds for constitutional petition under Article 184(3)",
  "Precedents on right to fair trial under Article 10A",
  "Maintenance rights under Muslim Family Laws Ordinance",
];

export default function ResearchListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<ResearchMode>("general");
  const [selectedCaseId, setSelectedCaseId] = useState<string>("");
  const [conversations, setConversations] = useState<ResearchConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  useEffect(() => {
    researchApi.listConversations().then((data) => {
      setConversations(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = () => {
    if (!query.trim()) return;
    const params = new URLSearchParams({ q: query });
    if (mode === "case_linked" && selectedCaseId) {
      params.set("caseId", selectedCaseId);
    }
    router.push(`/judges/research/new?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    const params = new URLSearchParams({ q: suggestion });
    if (mode === "case_linked" && selectedCaseId) {
      params.set("caseId", selectedCaseId);
    }
    router.push(`/judges/research/new?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleDelete = async (id: string) => {
    await researchApi.deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    toast.success("Conversation deleted");
  };

  const handleTogglePin = async (id: string) => {
    const result = await researchApi.togglePin(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: result.pinned } : c))
    );
    toast.success(result.pinned ? "Pinned" : "Unpinned");
  };

  // Filter conversations client-side
  const filtered = searchFilter.trim()
    ? conversations.filter(
        (c) => c.title.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : conversations;

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        label="Research"
        title="Legal Research"
        description="AI-powered legal research across 300,000+ Pakistani judgments"
      />

      {/* Mode Toggle + Hero Search */}
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Mode Tabs */}
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as ResearchMode)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Research</TabsTrigger>
            <TabsTrigger value="case_linked">Case Research</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Case Selector (only in case mode) */}
        {mode === "case_linked" && (
          <CaseSelector
            value={selectedCaseId}
            onSelect={setSelectedCaseId}
            placeholder="Select a case to link your research..."
          />
        )}

        {/* Search Icon + Heading */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-[#A21CAF]/10 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6 text-[#A21CAF]" />
          </div>
          <p className="text-sm text-gray-500">
            Ask any legal question and get AI-powered answers with cited
            precedents
          </p>
        </div>

        {/* Textarea */}
        <div className="relative">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a legal question..."
            className="min-h-[120px] resize-none text-base leading-relaxed pr-4 focus-visible:ring-[#A21CAF]/30"
            rows={4}
          />
        </div>

        {/* Start Research Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!query.trim()}
            className="bg-[#A21CAF] hover:bg-[#86198F] px-8 h-11 text-sm font-medium"
          >
            <Search className="h-4 w-4 mr-2" />
            Start Research
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 text-center uppercase tracking-wider">
            Suggested queries
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="text-xs h-8 hover:border-[#A21CAF] hover:text-[#A21CAF] transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Search/Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-gray-400">
          {filtered.length} conversation{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Pinned Conversations */}
      {pinned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pin className="h-4 w-4 text-[#A21CAF]" />
            <h2 className="text-sm font-semibold text-gray-700">Pinned</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinned.map((conv) => (
              <ResearchConversationCard key={conv.id} conversation={conv} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Conversations */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">
          {pinned.length > 0 ? "Recent" : "Previous Conversations"}
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recent.length === 0 && pinned.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Start your first research query above to get AI-powered legal insights."
          />
        ) : recent.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">
            No recent conversations. All conversations are pinned.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((conv) => (
              <ResearchConversationCard key={conv.id} conversation={conv} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
