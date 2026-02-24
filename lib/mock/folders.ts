import type { Folder, Tag } from "./types";

export const folders: Folder[] = [
  { id: "folder-001", name: "General", count: 5 },
  { id: "folder-002", name: "Case Research", count: 6 },
  { id: "folder-003", name: "Brief Notes", count: 4 },
  { id: "folder-004", name: "Judgment Drafts", count: 3 },
  { id: "folder-005", name: "Hearing Prep", count: 4 },
];

export const tags: Tag[] = [
  { id: "tag-001", name: "Constitutional", color: "bg-purple-100 text-purple-700" },
  { id: "tag-002", name: "Criminal", color: "bg-red-100 text-red-700" },
  { id: "tag-003", name: "Important", color: "bg-amber-100 text-amber-700" },
  { id: "tag-004", name: "Precedent", color: "bg-blue-100 text-blue-700" },
  { id: "tag-005", name: "Family Law", color: "bg-pink-100 text-pink-700" },
  { id: "tag-006", name: "Tax", color: "bg-emerald-100 text-emerald-700" },
  { id: "tag-007", name: "Review Needed", color: "bg-orange-100 text-orange-700" },
  { id: "tag-008", name: "Urgent", color: "bg-rose-100 text-rose-700" },
];
