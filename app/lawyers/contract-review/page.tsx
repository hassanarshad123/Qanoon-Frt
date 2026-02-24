"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileCheck,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { DocumentUploadZone } from "@/components/judges/shared/document-upload-zone";
import { RiskBadge } from "@/components/lawyers/shared/risk-badge";
import type { ContractReview } from "@/lib/types/lawyer-portal";
import { toast } from "sonner";

export default function ContractReviewPage() {
  const [reviews] = useState<ContractReview[]>([]);
  const [loading] = useState(false);

  const handleUploadComplete = (doc: { id: string; fileName: string; blobUrl: string }) => {
    toast.success("Contract uploaded successfully", {
      description: `${doc.fileName} is being analyzed by AI`,
    });
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
        title="Contract Reviewer"
        description="AI-powered contract analysis with risk assessment, clause-by-clause review, and compliance checking"
      />

      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center mx-auto">
              <FileCheck className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              Upload a Contract for AI Review
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Upload any contract, agreement, or legal document. QanoonAI will
              analyze risks, obligations, and key terms.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <DocumentUploadZone onUploadComplete={handleUploadComplete} />
          </div>
        </CardContent>
      </Card>

      {/* Previous Reviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Previous Reviews
          </h2>
          <span className="text-sm text-gray-400">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
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
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={FileCheck}
            title="No reviews yet"
            description="Upload a contract above to get your first AI-powered review."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <Link
                key={review.id}
                href={`/lawyers/contract-review/${review.id}`}
              >
                <Card className="hover:shadow-md hover:border-[#2563EB]/20 transition-all cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {review.title}
                      </h3>

                      {/* Risk Badge + Status */}
                      <div className="flex items-center gap-2">
                        {review.status === "Complete" ? (
                          <RiskBadge level={review.overallRisk} />
                        ) : (
                          <Badge className="bg-[#2563EB]/10 text-[#2563EB] hover:bg-[#2563EB]/10">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Analyzing
                          </Badge>
                        )}
                        {review.status === "Complete" && (
                          <Badge
                            variant="outline"
                            className="text-emerald-600 border-emerald-200"
                          >
                            Complete
                          </Badge>
                        )}
                      </div>

                      {/* File name */}
                      <p className="text-xs text-gray-500 truncate">
                        {review.fileName}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(review.createdAt)}</span>
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
