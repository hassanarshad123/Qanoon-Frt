"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Download,
  Send,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { LegalForm, FormCategory } from "@/lib/types/lawyer-portal";

const categoryBadgeStyles: Record<FormCategory, string> = {
  "Court Forms": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Agreements: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Notices: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Affidavits: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

export default function LegalFormDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [form, setForm] = useState<LegalForm | null>(null);
  const [loading, setLoading] = useState(false);

  if (loading || !form) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">
            {loading ? "Loading form..." : "Form not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/lawyers/legal-forms">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Legal Forms
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-2xl font-bold font-serif text-gray-900">
            {form.title}
          </h1>
          <Badge className={`shrink-0 ${categoryBadgeStyles[form.category]}`}>
            {form.category}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Download className="h-3 w-3" />
          {form.downloadCount.toLocaleString()} downloads
        </p>
      </div>

      {/* Form preview card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-[#2563EB]" />
            </div>
            Form Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 leading-relaxed">
            {form.description}
          </p>
        </CardContent>
      </Card>

      {/* Fields section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-gray-600" />
            </div>
            Template Fields
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-4">
            The following placeholder fields need to be filled when using this
            template:
          </p>
          <div className="space-y-2">
            {form.fields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
              >
                <span className="shrink-0 h-6 w-6 rounded-full bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  {field}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          onClick={() =>
            toast.success("Template loaded into petition drafting tool")
          }
          asChild
        >
          <Link href="/lawyers/petition">
            <Send className="h-4 w-4 mr-1.5" />
            Use Template
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.success("Blank form downloaded successfully")
          }
        >
          <Download className="h-4 w-4 mr-1.5" />
          Download Blank
        </Button>
      </div>
    </div>
  );
}
