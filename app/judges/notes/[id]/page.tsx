"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Trash2,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { notesApi } from "@/lib/api/notes";
import { useAutoSave, type SaveStatus } from "@/hooks/use-auto-save";
import type { Note, Folder, Tag } from "@/lib/types/portal";

function getSourceHref(note: Note): string | null {
  if (!note.sourceId || !note.sourceType) return null;
  switch (note.sourceType) {
    case "brief":
      return `/judges/brief/${note.sourceId}`;
    case "judgment":
      return `/judges/judgments/${note.sourceId}`;
    case "research":
      return `/judges/research/${note.sourceId}`;
    default:
      return null;
  }
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <span className="text-xs text-gray-400 flex items-center gap-1.5">
      {status === "saving" && (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Saving...
        </>
      )}
      {status === "saved" && (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Saved
        </>
      )}
      {status === "error" && (
        <>
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Save failed
        </>
      )}
    </span>
  );
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("");
  const [noteTags, setNoteTags] = useState<string[]>([]);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-save for content
  const handleSaveContent = useCallback(
    async (value: string) => {
      return notesApi.updateContent(id, value);
    },
    [id]
  );

  const { saveStatus } = useAutoSave(content, {
    onSave: handleSaveContent,
    delay: 1000,
  });

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [noteData, foldersData, tagsData] = await Promise.all([
          notesApi.get(id),
          notesApi.listFolders(),
          notesApi.getTags(),
        ]);

        if (noteData) {
          setNote(noteData);
          setTitle(noteData.title);
          setContent(noteData.content);
          setSelectedFolder(noteData.folder);
          setNoteTags(noteData.tags);
        }
        setFolders(foldersData);
        setAllTags(tagsData);
      } catch (error) {
        console.error("Failed to load note:", error);
        toast.error("Failed to load note");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

  const tagMap = allTags.reduce<Record<string, Tag>>((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {});

  const availableTags = allTags.filter((t) => !noteTags.includes(t.id));

  // Debounced title save
  const titleTimeoutRef = useState<NodeJS.Timeout | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    // Debounce title save
    if (titleTimeoutRef[0]) {
      clearTimeout(titleTimeoutRef[0]);
    }
    const timeout = setTimeout(async () => {
      try {
        await notesApi.updateTitle(id, newTitle);
      } catch (error) {
        console.error("Failed to save title:", error);
      }
    }, 500);
    titleTimeoutRef[1](timeout);
  };

  const handleFolderChange = async (newFolder: string) => {
    setSelectedFolder(newFolder);
    try {
      await notesApi.updateMetadata(id, { folder: newFolder });
    } catch (error) {
      console.error("Failed to update folder:", error);
      toast.error("Failed to update folder");
    }
  };

  const removeTag = async (tagId: string) => {
    const newTags = noteTags.filter((t) => t !== tagId);
    setNoteTags(newTags);
    try {
      await notesApi.updateMetadata(id, { tags: newTags });
      toast.success("Tag removed");
    } catch (error) {
      console.error("Failed to remove tag:", error);
      toast.error("Failed to remove tag");
    }
  };

  const addTag = async (tagId: string) => {
    const newTags = [...noteTags, tagId];
    setNoteTags(newTags);
    setShowTagPicker(false);
    try {
      await notesApi.updateMetadata(id, { tags: newTags });
      toast.success("Tag added");
    } catch (error) {
      console.error("Failed to add tag:", error);
      toast.error("Failed to add tag");
    }
  };

  const handleDelete = async () => {
    try {
      await notesApi.delete(id);
      toast.success("Note deleted");
      router.push("/judges/notes");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-500">Note not found</p>
        <Link href="/judges/notes">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </Link>
      </div>
    );
  }

  const sourceHref = getSourceHref(note);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/judges/notes"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notes
      </Link>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <SaveStatusIndicator status={saveStatus} />
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this note? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Separator />

      {/* Note Content Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Editable Title */}
          <Input
            value={title}
            onChange={handleTitleChange}
            className="text-2xl font-semibold border-none shadow-none px-0 focus-visible:ring-0 text-gray-900 h-auto"
            placeholder="Note title..."
          />

          {/* Folder Selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">Folder:</span>
            <Select value={selectedFolder} onValueChange={handleFolderChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select folder" />
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

          {/* Tags Editor */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-500">Tags:</span>
            <div className="flex flex-wrap items-center gap-2">
              {noteTags.map((tagId) => {
                const tag = tagMap[tagId];
                if (!tag) return null;
                return (
                  <Badge
                    key={tagId}
                    variant="secondary"
                    className={`${tag.color} cursor-pointer group`}
                    onClick={() => removeTag(tagId)}
                  >
                    {tag.name}
                    <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Badge>
                );
              })}

              {/* Add Tag Button / Picker */}
              {showTagPicker ? (
                <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-md border bg-gray-50">
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => addTag(tag.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      All tags applied
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => setShowTagPicker(false)}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setShowTagPicker(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Editable Note Content */}
          <div className="prose prose-gray max-w-none">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[400px] resize-none border-none shadow-none
                         focus:ring-0 focus:outline-none text-gray-800
                         leading-relaxed text-[15px] bg-transparent px-1 py-2"
              placeholder="Start typing your note..."
            />
          </div>

          {/* Source Link */}
          {note.sourceLabel && sourceHref && (
            <>
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">From:</span>
                <Link
                  href={sourceHref}
                  className="inline-flex items-center gap-1.5 text-sm text-[#A21CAF] hover:text-[#A21CAF]/80 font-medium transition-colors"
                >
                  {note.sourceLabel}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-4 pt-2 text-xs text-gray-400">
            <span>
              Created:{" "}
              {new Date(note.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>
              Last updated:{" "}
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
