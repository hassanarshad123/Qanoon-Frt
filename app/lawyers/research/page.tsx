"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/judges/shared/page-header";
import type { ResearchConversation } from "@/lib/types/lawyer-portal";

const suggestions = [
  "What is the test for granting bail in non-bailable offences?",
  "Grounds for constitutional petition under Article 199",
  "Precedents on right to fair trial under Article 10A",
  "Maintenance rights under Muslim Family Laws Ordinance",
  "Pre-emption rights hierarchy under Punjab Pre-emption Act",
  "Defamation remedies in Pakistan - civil and criminal",
];

export default function LawyerResearchListPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [conversations] = useState<ResearchConversation[]>([]);
  const [loading] = useState(false);

  const handleSubmit = () => {
    if (!query.trim()) return;
    router.push("/lawyers/research/lres-001");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push("/lawyers/research/lres-001");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        label="AI Tools"
        title="Legal Research"
        description="AI-powered legal research across 300,000+ Pakistani judgments, statutes, and legal commentaries"
      />

      {/* Search Area */}
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Search Icon + Heading */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6 text-[#2563EB]" />
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
            className="min-h-[120px] resize-none text-base leading-relaxed pr-4 focus-visible:ring-[#2563EB]/30"
            rows={4}
          />
        </div>

        {/* Start Research Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!query.trim()}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] px-8 h-11 text-sm font-medium"
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
                className="text-xs h-8 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Conversations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Previous Conversations
          </h2>
          <span className="text-sm text-gray-400">
            {conversations.length} conversations
          </span>
        </div>

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
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">
                No previous conversations yet. Start your first research query
                above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conversations.map((conv) => (
              <Link key={conv.id} href={`/lawyers/research/${conv.id}`}>
                <Card className="hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {conv.title}
                      </h3>

                      {/* First message preview */}
                      {conv.messages.length > 0 && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {conv.messages[0].content}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(conv.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <MessageSquare className="h-3 w-3" />
                          <span>
                            {conv.messages.length}{" "}
                            {conv.messages.length === 1
                              ? "message"
                              : "messages"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
