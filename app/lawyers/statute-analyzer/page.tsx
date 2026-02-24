"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { Statute, StatuteAnalysis } from "@/lib/types/lawyer-portal";

export default function StatuteAnalyzerPage() {
  const router = useRouter();
  const [statutes] = useState<Statute[]>([]);
  const [analyses] = useState<StatuteAnalysis[]>([]);
  const [loading] = useState(false);

  // Form state
  const [selectedStatute, setSelectedStatute] = useState("");
  const [sectionNumber, setSectionNumber] = useState("");
  const [question, setQuestion] = useState("");

  const handleAnalyze = () => {
    if (!selectedStatute) return;
    // Navigate to first analysis as demo
    if (analyses.length > 0) {
      router.push(`/lawyers/statute-analyzer/${analyses[0].id}`);
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
        title="Statute Analyzer"
        description="AI-powered analysis of Pakistani statutes with plain language explanations, judicial interpretations, and amendment history"
      />

      {/* Analysis Form */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Statute Icon & Heading */}
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto">
              <BookOpen className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="text-sm text-gray-500">
              Select a statute and section to get AI-powered analysis
            </p>
          </div>

          {/* Statute Dropdown */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Select Statute
              </label>
              <Select
                value={selectedStatute}
                onValueChange={setSelectedStatute}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a statute..." />
                </SelectTrigger>
                <SelectContent>
                  {statutes.map((statute) => (
                    <SelectItem key={statute.id} value={statute.id}>
                      {statute.shortName} &mdash; {statute.name} ({statute.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section Number Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Section Number
              </label>
              <Input
                placeholder="e.g., 302, 489-F, 10-A"
                value={sectionNumber}
                onChange={(e) => setSectionNumber(e.target.value)}
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-medium text-gray-400 uppercase">
                or ask a question
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Question Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your Question
              </label>
              <Textarea
                placeholder="e.g., What are the penalties for cheque fraud under PPC?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
                rows={3}
              />
            </div>

            {/* Analyze Button */}
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleAnalyze}
                disabled={!selectedStatute}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] px-8 h-11 text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Analyses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Previous Analyses
          </h2>
          <span className="text-sm text-gray-400">
            {analyses.length} {analyses.length === 1 ? "analysis" : "analyses"}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : analyses.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No analyses yet"
            description="Select a statute and section above to create your first AI-powered analysis."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={`/lawyers/statute-analyzer/${analysis.id}`}
              >
                <Card className="hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Statute Badge */}
                      <Badge
                        variant="outline"
                        className="text-[#2563EB] border-[#2563EB]/30"
                      >
                        {analysis.statuteName}
                      </Badge>

                      {/* Section Title */}
                      <h3 className="text-sm font-semibold text-gray-900 leading-snug">
                        Section {analysis.sectionNumber}
                      </h3>

                      {/* Query Preview */}
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {analysis.query}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(analysis.createdAt)}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
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
