"use client";

import { useState, useMemo } from "react";
import { Folder, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/judges/shared/page-header";
import { FolderTree } from "@/components/lawyers/shared/folder-tree";
import type { FileItem } from "@/lib/types/lawyer-portal";

export default function FilesPage() {
  const [items] = useState<FileItem[]>([]);
  const [loading] = useState(false);

  const rootFolders = useMemo(
    () => items.filter((i) => i.parentId === null && i.type === "folder"),
    [items]
  );

  const folderStats = useMemo(() => {
    const stats: Record<string, { folders: number; files: number }> = {};
    rootFolders.forEach((folder) => {
      const children = items.filter((i) => i.parentId === folder.id);
      const subFolders = children.filter((c) => c.type === "folder").length;
      const directFiles = children.filter((c) => c.type === "file").length;
      stats[folder.id] = { folders: subFolders, files: directFiles };
    });
    return stats;
  }, [items, rootFolders]);

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

  return (
    <div className="space-y-8">
      <PageHeader
        label="Practice Management"
        title="File Manager"
      />

      {/* Summary stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Folder className="h-4 w-4 text-amber-500" />
          <span>
            {items.filter((i) => i.type === "folder").length} folders
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>
            {items.filter((i) => i.type === "file").length} files
          </span>
        </div>
      </div>

      {/* Root folders with counts */}
      <Card>
        <CardContent className="pt-4">
          <FolderTree items={items} parentId={null} />
        </CardContent>
      </Card>

      {/* Per-folder breakdown */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F] mb-4">
          Folder Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rootFolders.map((folder) => {
            const stat = folderStats[folder.id] || {
              folders: 0,
              files: 0,
            };
            return (
              <Card key={folder.id}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-50 flex items-center justify-center">
                      <Folder className="h-4.5 w-4.5 text-amber-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {folder.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{stat.folders} subfolders</span>
                    <span>{stat.files} files</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
