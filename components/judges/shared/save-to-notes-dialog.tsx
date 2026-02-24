"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { notesApi } from "@/lib/api/notes";
import { useEffect } from "react";
import type { Tag, Folder } from "@/lib/types/portal";

interface SaveToNotesDialogProps {
  title?: string;
  content?: string;
  sourceId?: string;
  sourceType?: "brief" | "judgment" | "research";
  sourceLabel?: string;
  children?: React.ReactNode;
}

export function SaveToNotesDialog({
  title = "Save to Notes",
  content = "",
  sourceId,
  sourceType,
  sourceLabel,
  children,
}: SaveToNotesDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  // Load tags and folders when dialog opens
  useEffect(() => {
    if (open) {
      Promise.all([notesApi.getTags(), notesApi.listFolders()])
        .then(([tagsData, foldersData]) => {
          setTags(tagsData);
          setFolders(foldersData);
        })
        .catch(console.error);
    }
  }, [open]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { id: noteId } = await notesApi.create({
        title: noteTitle || "Untitled Note",
        content: content,
        folder: selectedFolder || "General",
        tags: selectedTags,
        source_id: sourceId,
        source_type: sourceType,
        source_label: sourceLabel,
      });

      toast.success("Saved to Notes", {
        description: `Note saved to ${selectedFolder || "General"} folder`,
        action: {
          label: "View",
          onClick: () => router.push(`/judges/notes/${noteId}`),
        },
      });

      setOpen(false);
      // Reset form
      setSelectedFolder("");
      setSelectedTags([]);
      setNoteTitle("");
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <BookmarkPlus className="h-4 w-4 mr-2" />
            Save to Notes
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Save this content to your notes for future reference.
            {sourceLabel && (
              <span className="block mt-1 text-xs">Source: {sourceLabel}</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Note Title</Label>
            <Input
              id="note-title"
              placeholder="Enter a title for your note..."
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Folder</Label>
            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder..." />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.name}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={
                    selectedTags.includes(tag.id)
                      ? "bg-[#A21CAF] hover:bg-[#86198F] cursor-pointer"
                      : "cursor-pointer hover:bg-gray-100"
                  }
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#A21CAF] hover:bg-[#86198F]"
          >
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
