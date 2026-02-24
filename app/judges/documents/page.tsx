"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Grid3X3,
  List,
  Upload,
  MoreHorizontal,
  FileText,
  Search as SearchIcon,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/judges/shared/page-header";
import { DocumentUploadZone } from "@/components/judges/shared/document-upload-zone";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { documentsApi, type DocumentRecord } from "@/lib/api/documents";
import { toast } from "sonner";

const docTypeStyles: Record<string, string> = {
  Petition: "border-purple-300 text-purple-700",
  "Written Arguments": "border-blue-300 text-blue-700",
  "Court Order": "border-amber-300 text-amber-700",
  Evidence: "border-emerald-300 text-emerald-700",
  Affidavit: "border-pink-300 text-pink-700",
  Judgment: "border-red-300 text-red-700",
  Notice: "border-indigo-300 text-indigo-700",
  "Bail Application": "border-orange-300 text-orange-700",
  Other: "border-gray-300 text-gray-700",
};

const documentTypes = [
  "Petition",
  "Written Arguments",
  "Court Order",
  "Evidence",
  "Affidavit",
  "Judgment",
  "Notice",
  "Bail Application",
  "Other",
];

function DocTypeBadge({ type }: { type: string }) {
  return (
    <Badge
      variant="outline"
      className={docTypeStyles[type] || "border-gray-300 text-gray-700"}
    >
      {type}
    </Badge>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await documentsApi.list({
        documentType: typeFilter !== "all" ? typeFilter : undefined,
        search: searchQuery || undefined,
      });
      setDocuments(docs);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, searchQuery]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleUploadComplete = () => {
    setUploadOpen(false);
    toast.success("Document uploaded successfully");
    loadDocuments();
  };

  const handleDelete = async (id: string) => {
    if (deleting) return;
    setDeleting(id);
    try {
      await documentsApi.delete(id);
      toast.success("Document deleted");
      loadDocuments();
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        label="Documents"
        title="Document Library"
        description="Upload and manage your court documents"
        actions={
          <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#A21CAF] hover:bg-[#A21CAF]/90 text-white">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <DocumentUploadZone onUploadComplete={handleUploadComplete} />
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Filters and View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {documentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => {
            if (value) setViewMode(value as "grid" | "list");
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <Grid3X3 className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {documents.length} document{documents.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 text-[#A21CAF] animate-spin" />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Documents Yet"
          description="Upload court documents to build your case library."
        />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Link key={doc.id} href={`/judges/documents/${doc.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-[#A21CAF]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#A21CAF] transition-colors">
                            {doc.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {doc.fileName}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <DocTypeBadge type={doc.documentType} />
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-semibold text-[#84752F]">
                            Pages
                          </span>
                          <p className="mt-0.5 text-gray-700">
                            {doc.pageCount || "—"}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[#84752F]">
                            Size
                          </span>
                          <p className="mt-0.5 text-gray-700">
                            {formatFileSize(doc.fileSize)}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-[#84752F]">
                            Date
                          </span>
                          <p className="mt-0.5 text-gray-700">
                            {new Date(doc.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[50px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Link
                          href={`/judges/documents/${doc.id}`}
                          className="flex items-center gap-3 hover:text-[#A21CAF] transition-colors"
                        >
                          <div className="h-8 w-8 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-[#A21CAF]" />
                          </div>
                          <span className="text-sm font-medium truncate max-w-[200px]">
                            {doc.title}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <DocTypeBadge type={doc.documentType} />
                      </TableCell>
                      <TableCell className="text-right text-sm text-gray-700">
                        {formatFileSize(doc.fileSize)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-700">
                        {new Date(doc.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/judges/documents/${doc.id}`}>
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(doc.id);
                              }}
                              disabled={deleting === doc.id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {deleting === doc.id ? "Deleting..." : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
