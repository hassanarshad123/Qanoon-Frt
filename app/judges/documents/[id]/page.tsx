"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Trash2,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const doc = await documentsApi.get(id);
        setDocument(doc);
      } catch (err) {
        console.error("Failed to load document:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (deleting || !document) return;
    setDeleting(true);
    try {
      await documentsApi.delete(id);
      toast.success("Document deleted");
      router.push("/judges/documents");
    } catch {
      toast.error("Failed to delete document");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-[#A21CAF] animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-gray-500">Document not found</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/judges/documents">Back to Documents</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isPdf = document.fileType === "application/pdf";
  const isImage = document.fileType.startsWith("image/");

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/judges/documents">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <h2 className="text-sm font-semibold text-gray-900 truncate max-w-[400px]">
            {document.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={document.blobUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={document.blobUrl} download={document.fileName}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{document.title}&rdquo;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadata Panel */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="h-12 w-12 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-[#A21CAF]" />
              </div>
              <h1 className="text-lg font-bold font-serif text-gray-900">
                {document.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{document.fileName}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                  Document Type
                </span>
                <div className="mt-1.5">
                  <Badge
                    variant="outline"
                    className={
                      docTypeStyles[document.documentType] ||
                      "border-gray-300 text-gray-700"
                    }
                  >
                    {document.documentType}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                  File Type
                </span>
                <p className="text-sm text-gray-900 mt-1">{document.fileType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                    Pages
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {document.pageCount || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                    File Size
                  </span>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatFileSize(document.fileSize)}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                  Uploaded
                </span>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(document.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6">
              {isPdf ? (
                <iframe
                  src={document.blobUrl}
                  className="w-full h-[70vh] rounded-lg border"
                  title={document.title}
                />
              ) : isImage ? (
                <div className="flex items-center justify-center">
                  <img
                    src={document.blobUrl}
                    alt={document.title}
                    className="max-w-full max-h-[70vh] rounded-lg"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    Preview not available for this file type
                  </p>
                  <Button variant="outline" asChild>
                    <a
                      href={document.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
