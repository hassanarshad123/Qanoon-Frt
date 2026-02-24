"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  FilePen,
  FolderOpen,
  RefreshCw,
  PlusCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/judges/shared/page-header";
import { CaseTimeline } from "@/components/lawyers/shared/case-timeline";
import { useToast } from "@/hooks/use-toast";
import type { TrackedCase } from "@/lib/types/lawyer-portal";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Urgent: "bg-red-100 text-red-700 hover:bg-red-100",
  Closed: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  Adjourned: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Disposed: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Reserved: "bg-orange-100 text-orange-700 hover:bg-orange-100",
};

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<TrackedCase | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const daysUntilNextDate = useMemo(() => {
    if (!caseData) return 0;
    const now = new Date();
    const next = new Date(caseData.nextDate);
    const diff = Math.ceil(
      (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  }, [caseData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#2563EB] border-t-transparent" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/lawyers/case-tracker">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Case Tracker
          </Link>
        </Button>
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold text-gray-900">
            Case not found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            The case you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lawyers/case-tracker">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Case Tracker
        </Link>
      </Button>

      {/* Case Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="font-mono text-sm text-gray-500">
            {caseData.caseNumber}
          </span>
          <Badge
            className={
              statusStyles[caseData.status] || "bg-gray-100 text-gray-600"
            }
          >
            {caseData.status}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-gray-900">
          {caseData.title}
        </h1>
        <p className="mt-1 text-gray-500">{caseData.court}</p>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Client Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <User className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Client</p>
                <Link
                  href={`/lawyers/clients/${caseData.clientId}`}
                  className="text-sm font-semibold text-gray-900 hover:text-[#2563EB]"
                >
                  {caseData.clientName}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Hearing Countdown */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Next Hearing</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.nextDate}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span
                className={`text-sm font-medium ${
                  daysUntilNextDate <= 3
                    ? "text-red-600"
                    : daysUntilNextDate <= 7
                    ? "text-amber-600"
                    : "text-gray-600"
                }`}
              >
                {daysUntilNextDate > 0
                  ? `${daysUntilNextDate} day${daysUntilNextDate !== 1 ? "s" : ""} away`
                  : daysUntilNextDate === 0
                  ? "Today"
                  : "Past due"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Events</p>
                <p className="text-sm font-semibold text-gray-900">
                  {caseData.events.length} recorded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "Coming soon",
              description: "Status update feature is under development.",
            })
          }
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Update Status
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast({
              title: "Coming soon",
              description: "Add event feature is under development.",
            })
          }
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Event
        </Button>
        <Button
          size="sm"
          className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          asChild
        >
          <Link href={`/lawyers/brief?caseId=${caseData.id}`}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Brief
          </Link>
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Case Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {caseData.events.length > 0 ? (
            <CaseTimeline events={caseData.events} />
          ) : (
            <p className="text-sm text-gray-500 text-center py-6">
              No events recorded yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Linked Items */}
      {(caseData.linkedBriefIds.length > 0 ||
        caseData.linkedPetitionIds.length > 0 ||
        caseData.linkedDocumentIds.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Linked Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {caseData.linkedBriefIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-2">
                  Briefs
                </p>
                <div className="flex flex-wrap gap-2">
                  {caseData.linkedBriefIds.map((briefId) => (
                    <Badge
                      key={briefId}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                    >
                      <Link href={`/lawyers/brief/${briefId}`}>
                        <FileText className="h-3 w-3 mr-1 inline" />
                        {briefId}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {caseData.linkedPetitionIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-2">
                  Petitions
                </p>
                <div className="flex flex-wrap gap-2">
                  {caseData.linkedPetitionIds.map((petId) => (
                    <Badge
                      key={petId}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                    >
                      <Link href={`/lawyers/petition/${petId}`}>
                        <FilePen className="h-3 w-3 mr-1 inline" />
                        {petId}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {caseData.linkedDocumentIds.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-2">
                  Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {caseData.linkedDocumentIds.map((docId) => (
                    <Badge
                      key={docId}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                    >
                      <Link href={`/lawyers/documents/${docId}`}>
                        <FolderOpen className="h-3 w-3 mr-1 inline" />
                        {docId}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
