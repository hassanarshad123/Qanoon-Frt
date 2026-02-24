"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Scale,
  Calendar,
  User,
  Building2,
  BookOpen,
  CheckCircle2,
  BookmarkPlus,
  FileText,
  FileSignature,
  Search,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CaseFinderResult } from "@/lib/types/lawyer-portal";
import { toast } from "sonner";

export default function CaseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [caseData, setCaseData] = useState<CaseFinderResult | null>(null);
  const [relatedCases, setRelatedCases] = useState<CaseFinderResult[]>([]);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto animate-pulse">
            <Scale className="h-5 w-5 text-[#2563EB]" />
          </div>
          <p className="text-sm text-gray-500">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-500">Case not found.</p>
          <Button variant="outline" asChild>
            <Link href="/lawyers/case-finder">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/lawyers/case-finder"
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#2563EB] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Search Results
        </Link>
      </div>

      {/* Case Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 min-w-0">
            <h1 className="text-2xl font-bold font-serif text-gray-900 leading-tight">
              {caseData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="font-mono text-sm border-[#2563EB]/30 text-[#2563EB]"
              >
                {caseData.citation}
              </Badge>
            </div>
          </div>
        </div>

        {/* Case Metadata */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <User className="h-3.5 w-3.5" />
                  Parties
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {caseData.parties}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Building2 className="h-3.5 w-3.5" />
                  Court
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {caseData.court}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5" />
                  Date
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDate(caseData.date)}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <Scale className="h-3.5 w-3.5" />
                  Judge
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {caseData.judge}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applicable Statutes */}
        {caseData.statutes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider self-center mr-1">
              Statutes:
            </span>
            {caseData.statutes.map((statute) => (
              <Badge
                key={statute}
                variant="secondary"
                className="text-xs font-normal"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {statute}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* AI-Generated Summary */}
      <Card className="border-[#2563EB]/20 bg-[#2563EB]/[0.02]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-[#2563EB] flex items-center justify-center">
              <Scale className="h-3.5 w-3.5 text-white" />
            </div>
            AI-Generated Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {caseData.summary}
          </p>
        </CardContent>
      </Card>

      {/* Key Holdings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#2563EB]" />
            Key Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {caseData.keyHoldings.map((holding, index) => (
              <div key={index} className="flex gap-3">
                <div className="h-6 w-6 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-[#2563EB]">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {holding}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          onClick={() =>
            toast.success("Saved to Library", {
              description: caseData.title,
            })
          }
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save to Library
        </Button>
        <Button
          variant="outline"
          className="hover:border-[#2563EB] hover:text-[#2563EB]"
          onClick={() =>
            toast.info("Opening Brief Editor", {
              description: `Adding ${caseData.citation} to brief`,
            })
          }
        >
          <FileText className="h-4 w-4 mr-2" />
          Use in Brief
        </Button>
        <Button
          variant="outline"
          className="hover:border-[#2563EB] hover:text-[#2563EB]"
          onClick={() =>
            toast.info("Opening Petition Editor", {
              description: `Adding ${caseData.citation} to petition`,
            })
          }
        >
          <FileSignature className="h-4 w-4 mr-2" />
          Use in Petition
        </Button>
        <Button
          variant="outline"
          className="hover:border-[#2563EB] hover:text-[#2563EB]"
          onClick={() =>
            toast.info("Opening Research", {
              description: `Citing ${caseData.citation} in research`,
            })
          }
        >
          <Search className="h-4 w-4 mr-2" />
          Cite in Research
        </Button>
      </div>

      {/* Related Cases */}
      {relatedCases.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <h2 className="text-lg font-semibold text-gray-900">
            Related Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedCases.map((related) => (
              <Link
                key={related.id}
                href={`/lawyers/case-finder/${related.id}`}
              >
                <Card className="hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-pointer h-full">
                  <CardContent className="pt-5 pb-5">
                    <div className="space-y-2.5">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {related.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs font-mono border-[#2563EB]/30 text-[#2563EB]"
                      >
                        {related.citation}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{related.court}</span>
                        <span className="text-gray-300">|</span>
                        <span>{formatDate(related.date)}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {related.summary}
                      </p>
                      <div className="flex items-center text-xs font-medium text-[#2563EB] pt-1">
                        View Case
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
