"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  FileText,
  Quote,
  Scale,
  Calendar,
  User,
  Users,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { CaseFinderResult } from "@/lib/types/lawyer-portal";

export default function CaseLawDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [caseData, setCaseData] = useState<CaseFinderResult | null>(null);
  const [relatedCases, setRelatedCases] = useState<CaseFinderResult[]>([]);
  const [loading, setLoading] = useState(false);

  if (loading || !caseData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
            <Scale className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">
            {loading ? "Loading case..." : "Case not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lawyers/case-law">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Case Law
        </Link>
      </Button>

      {/* Case header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold font-serif text-gray-900">
          {caseData.title}
        </h1>
        <p className="text-base font-mono text-[#2563EB]">
          {caseData.citation}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-gray-400" />
            {caseData.court}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-gray-400" />
            {caseData.judge}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            {new Date(caseData.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-gray-400" />
            {caseData.parties}
          </span>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Case saved to your library")}
        >
          <Bookmark className="h-4 w-4 mr-1.5" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link
            href={`/lawyers/brief?from=case-law&caseId=${caseData.id}`}
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Use in Brief
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(
              `${caseData.title}, ${caseData.citation}`
            );
            toast.success("Citation copied to clipboard");
          }}
        >
          <Quote className="h-4 w-4 mr-1.5" />
          Cite
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Holdings / Headnotes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-[#2563EB]" />
                </div>
                Key Holdings &amp; Headnotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {caseData.keyHoldings.map((holding, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {holding}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Full Text / Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Full Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray prose-sm max-w-none">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {caseData.summary}
                </p>
                <Separator className="my-4" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  The Court examined the facts and circumstances of the case at
                  length, considering the arguments presented by both parties.
                  After thorough deliberation and review of the applicable legal
                  provisions, the bench arrived at the findings summarized in the
                  headnotes above. The judgment discusses the interplay between
                  the relevant statutory provisions and the constitutional
                  guarantees, providing detailed reasoning for each of the key
                  holdings. The Court also considered the precedents cited by
                  both sides, distinguishing certain earlier decisions and
                  affirming others as applicable to the instant case. The full
                  text of the judgment runs to several pages and covers
                  procedural history, evidentiary analysis, statutory
                  interpretation, and the final order of the Court.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Related Cases */}
          {relatedCases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Related Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedCases.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/lawyers/case-law/${rc.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-colors group"
                  >
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {rc.title}
                    </p>
                    <p className="text-xs font-mono text-[#2563EB] mt-1">
                      {rc.citation}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{rc.court}</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Cited Statutes */}
          {caseData.statutes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cited Statutes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {caseData.statutes.map((statute, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-lg bg-gray-50"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">{statute}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
