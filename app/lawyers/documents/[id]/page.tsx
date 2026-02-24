"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  File,
  Calendar,
  Layers,
  HardDrive,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { LawyerDocument } from "@/lib/types/lawyer-portal";

export default function DocumentDetailPage() {
  const params = useParams();
  const docId = params.id as string;

  const [doc, setDoc] = useState<LawyerDocument | null>(null);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/documents"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Documents
        </Link>
        <EmptyState
          icon={FileText}
          title="Document not found"
          description="The document you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lawyers/documents"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documents
      </Link>

      {/* Document header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
            <File className="h-6 w-6 text-[#2563EB]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-gray-900">
              {doc.title}
            </h1>
            <Badge variant="outline" className="mt-1">
              {doc.type}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Preview placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-gray-100 rounded-xl h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-400">
                    Document Preview
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {doc.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Metadata + Actions */}
        <div className="space-y-6">
          {/* Metadata panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Document Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Layers className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Pages</span>
                <span className="ml-auto font-medium text-gray-900">
                  {doc.pages}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <HardDrive className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">File Size</span>
                <span className="ml-auto font-medium text-gray-900">
                  {doc.fileSize}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Uploaded</span>
                <span className="ml-auto font-medium text-gray-900">
                  {doc.uploadedAt}
                </span>
              </div>
              {doc.caseId && (
                <div className="flex items-center gap-3 text-sm">
                  <File className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">Case</span>
                  <span className="ml-auto font-medium text-gray-900">
                    {doc.caseId}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">Category</span>
                <span className="ml-auto font-medium text-gray-900">
                  {doc.category}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]"
                onClick={() => toast.success("Download started")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Link href={`/lawyers/brief/${doc.caseId || "new"}`}>
                <Button variant="outline" className="w-full mt-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Open in Brief Generator
                </Button>
              </Link>
              <Link href={`/lawyers/contract-review/${doc.id}`}>
                <Button variant="outline" className="w-full mt-2">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Review Contract
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
