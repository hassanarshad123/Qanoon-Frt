"use client";

import { useState } from "react";
import { Search, FileText, Grid3X3, List, File } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/judges/shared/page-header";
import { DocumentUploadZone } from "@/components/judges/shared/document-upload-zone";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { LawyerDocument } from "@/lib/types/lawyer-portal";

const docTypeIcon: Record<string, string> = {
  Petition: "text-blue-600 bg-blue-50",
  Evidence: "text-amber-600 bg-amber-50",
  Affidavit: "text-purple-600 bg-purple-50",
  Agreement: "text-emerald-600 bg-emerald-50",
  "Written Arguments": "text-indigo-600 bg-indigo-50",
  Contract: "text-teal-600 bg-teal-50",
  "Court Order": "text-red-600 bg-red-50",
  Notice: "text-orange-600 bg-orange-50",
  "Power of Attorney": "text-pink-600 bg-pink-50",
};

export default function DocumentsPage() {
  const [documents] = useState<LawyerDocument[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading] = useState(false);

  const types = Array.from(new Set(documents.map((d) => d.type))).sort();

  const filtered = documents.filter((d) => {
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        label="Practice Management"
        title="Documents"
        actions={<DocumentUploadZone compact />}
      />

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className={viewMode === "grid" ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : ""}
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className={viewMode === "list" ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : ""}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Try adjusting your search or filter to find what you are looking for."
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const colors =
              docTypeIcon[doc.type] || "text-gray-600 bg-gray-50";
            return (
              <Link key={doc.id} href={`/lawyers/documents/${doc.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${colors}`}
                      >
                        <File className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {doc.title}
                        </h3>
                        <Badge variant="outline" className="mt-1.5 text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
                      <span>{doc.pages} pages</span>
                      <span>&middot;</span>
                      <span>{doc.fileSize}</span>
                      <span>&middot;</span>
                      <span>{doc.uploadedAt}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Link
                    href={`/lawyers/documents/${doc.id}`}
                    className="text-[#2563EB] hover:underline font-medium"
                  >
                    {doc.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell className="text-gray-500">{doc.category}</TableCell>
                <TableCell>{doc.pages}</TableCell>
                <TableCell>{doc.fileSize}</TableCell>
                <TableCell className="text-gray-500">
                  {doc.uploadedAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
