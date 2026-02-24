"use client";

import Link from "next/link";
import { Folder, FileText, ChevronRight } from "lucide-react";
import type { FileItem } from "@/lib/types/lawyer-portal";

interface FolderTreeProps {
  items: FileItem[];
  parentId: string | null;
}

export function FolderTree({ items, parentId }: FolderTreeProps) {
  const children = items.filter((item) => item.parentId === parentId);

  if (children.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400">
        This folder is empty
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {children.map((item) => {
        const isFolder = item.type === "folder";
        const childCount = isFolder
          ? items.filter((i) => i.parentId === item.id).length
          : 0;

        return (
          <Link
            key={item.id}
            href={isFolder ? `/lawyers/files/${item.id}` : `/lawyers/documents/${item.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
              isFolder ? "bg-amber-50" : "bg-blue-50"
            }`}>
              {isFolder ? (
                <Folder className="h-4.5 w-4.5 text-amber-600" />
              ) : (
                <FileText className="h-4.5 w-4.5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <p className="text-xs text-gray-400">
                {isFolder
                  ? `${childCount} items`
                  : `${item.size} · ${item.date}`}
              </p>
            </div>
            {item.source && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                {item.source}
              </span>
            )}
            <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 group-hover:text-gray-500" />
          </Link>
        );
      })}
    </div>
  );
}
