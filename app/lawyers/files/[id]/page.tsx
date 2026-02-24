"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  FolderOpen,
  Download,
  Trash2,
  MoveRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderTree } from "@/components/lawyers/shared/folder-tree";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { FileItem } from "@/lib/types/lawyer-portal";

export default function FolderPage() {
  const params = useParams();
  const folderId = params.id as string;

  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentFolder = useMemo(
    () => items.find((i) => i.id === folderId),
    [items, folderId]
  );

  const parentFolder = useMemo(
    () =>
      currentFolder?.parentId
        ? items.find((i) => i.id === currentFolder.parentId)
        : null,
    [items, currentFolder]
  );

  const childItems = useMemo(
    () => items.filter((i) => i.parentId === folderId),
    [items, folderId]
  );

  const fileChildren = useMemo(
    () => childItems.filter((i) => i.type === "file"),
    [childItems]
  );

  // Build breadcrumb
  const breadcrumbs = useMemo(() => {
    const crumbs: { id: string | null; name: string }[] = [];
    let current = currentFolder;
    while (current) {
      crumbs.unshift({ id: current.id, name: current.name });
      current = current.parentId
        ? items.find((i) => i.id === current!.parentId)
        : undefined;
    }
    crumbs.unshift({ id: null, name: "Files" });
    return crumbs;
  }, [items, currentFolder]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!currentFolder) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/files"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Files
        </Link>
        <EmptyState
          icon={Folder}
          title="Folder not found"
          description="The folder you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={
          currentFolder.parentId
            ? `/lawyers/files/${currentFolder.parentId}`
            : "/lawyers/files"
        }
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {parentFolder ? `Back to ${parentFolder.name}` : "Back to Files"}
      </Link>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <span className="text-gray-300">/</span>}
              {isLast ? (
                <span className="font-medium text-gray-900">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={
                    crumb.id
                      ? `/lawyers/files/${crumb.id}`
                      : "/lawyers/files"
                  }
                  className="text-[#2563EB] hover:underline"
                >
                  {crumb.name}
                </Link>
              )}
            </span>
          );
        })}
      </div>

      {/* Current folder header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <FolderOpen className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900">
            {currentFolder.name}
          </h1>
          <p className="text-sm text-gray-500">
            {childItems.length} items
          </p>
        </div>
      </div>

      {/* Contents */}
      <Card>
        <CardContent className="pt-4">
          <FolderTree items={items} parentId={folderId} />
        </CardContent>
      </Card>

      {/* File actions for files within this folder */}
      {fileChildren.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F] mb-4">
            File Actions
          </h2>
          <div className="space-y-2">
            {fileChildren.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {file.size} &middot; {file.date}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.success(`Opening ${file.name}`)
                    }
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.success(`${file.name} moved`)
                    }
                  >
                    <MoveRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.error(`${file.name} deleted`)
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast.success(`Downloading ${file.name}`)
                    }
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
