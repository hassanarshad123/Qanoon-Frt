"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StickyNote, FolderIcon, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { PageHeader } from "@/components/judges/shared/page-header";
import { toast } from "sonner";
import { notesApi } from "@/lib/api/notes";
import type { Note, Folder, Tag as TagType } from "@/lib/types/portal";

export default function NotesLibraryPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Folder management state
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [notesData, foldersData, tagsData] = await Promise.all([
        notesApi.list(),
        notesApi.listFolders(),
        notesApi.getTags(),
      ]);
      setNotes(notesData);
      setFolders(foldersData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to load notes:", error);
      toast.error("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  }

  // Focus input when creating folder
  useEffect(() => {
    if (isCreatingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [isCreatingFolder]);

  const tagMap = tags.reduce<Record<string, TagType>>((acc, t) => {
    acc[t.id] = t;
    return acc;
  }, {});

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleNewNote = async () => {
    setIsCreating(true);
    try {
      const { id: noteId } = await notesApi.create({
        title: "Untitled Note",
        content: "",
        folder: activeFolder || "General",
      });
      router.push(`/judges/notes/${noteId}`);
    } catch (error) {
      console.error("Failed to create note:", error);
      toast.error("Failed to create note");
      setIsCreating(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = newFolderName.trim();
    if (!name) {
      setIsCreatingFolder(false);
      setNewFolderName("");
      return;
    }

    try {
      await notesApi.createFolder(name);
      toast.success(`Folder "${name}" created`);
      setIsCreatingFolder(false);
      setNewFolderName("");
      // Refresh folders
      const foldersData = await notesApi.listFolders();
      setFolders(foldersData);
    } catch (error: any) {
      if (error?.message?.includes("unique") || error?.message?.includes("duplicate")) {
        toast.error("A folder with this name already exists");
      } else {
        toast.error("Failed to create folder");
      }
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    const notesInFolder = notes.filter((n) => n.folder === folderName).length;

    try {
      await notesApi.deleteFolder(folderName);

      if (notesInFolder > 0) {
        toast.success(`Folder deleted. ${notesInFolder} note${notesInFolder > 1 ? "s" : ""} moved to General.`);
      } else {
        toast.success("Folder deleted");
      }

      // If we were viewing the deleted folder, go back to All Notes
      if (activeFolder === folderName) {
        setActiveFolder(null);
      }

      // Refresh data
      const [notesData, foldersData] = await Promise.all([
        notesApi.list(),
        notesApi.listFolders(),
      ]);
      setNotes(notesData);
      setFolders(foldersData);
    } catch (error) {
      toast.error("Failed to delete folder");
    }
  };

  const handleFolderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateFolder();
    } else if (e.key === "Escape") {
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  };

  const filteredNotes = notes
    .filter((note) => {
      const matchesFolder = !activeFolder || note.folder === activeFolder;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tagId) => note.tags.includes(tagId));
      const matchesSearch =
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFolder && matchesTags && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
        case "az":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });

  const totalNotesCount = notes.length;

  return (
    <div className="space-y-8">
      <PageHeader
        label="Notes"
        title="My Notes"
        description="Personal notes organized by folders and tags"
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={handleNewNote}
              disabled={isCreating}
              className="bg-[#A21CAF] hover:bg-[#A21CAF]/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "New Note"}
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-500">Loading notes...</p>
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[600px] rounded-lg border"
        >
          {/* Left Panel - Folders & Tags */}
          <ResizablePanel defaultSize={25} minSize={20}>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Folders Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#84752F]">
                      Folders
                    </h3>
                    <button
                      onClick={() => setIsCreatingFolder(true)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      title="New folder"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {/* All Notes option */}
                    <button
                      onClick={() => setActiveFolder(null)}
                      className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                        activeFolder === null
                          ? "bg-[#A21CAF]/10 text-[#A21CAF] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        <span>All Notes</span>
                      </div>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {totalNotesCount}
                      </Badge>
                    </button>

                    {/* Inline folder creation */}
                    {isCreatingFolder && (
                      <div className="px-3 py-1.5">
                        <Input
                          ref={folderInputRef}
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={handleFolderKeyDown}
                          onBlur={handleCreateFolder}
                          placeholder="Folder name..."
                          className="h-8 text-sm"
                        />
                      </div>
                    )}

                    {/* Folder list */}
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="group relative"
                      >
                        <button
                          onClick={() =>
                            setActiveFolder(
                              activeFolder === folder.name ? null : folder.name
                            )
                          }
                          className={`w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors ${
                            activeFolder === folder.name
                              ? "bg-[#A21CAF]/10 text-[#A21CAF] font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FolderIcon className="h-4 w-4" />
                            <span className="truncate">{folder.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {/* Delete button - only for non-General folders */}
                            {folder.name !== "General" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFolder(folder.name);
                                }}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                                title="Delete folder"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                            <Badge
                              variant="secondary"
                              className="text-xs px-1.5 py-0"
                            >
                              {folder.count}
                            </Badge>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tags Section */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#84752F] mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={
                          selectedTags.includes(tag.id) ? "default" : "outline"
                        }
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag.id)
                            ? "bg-[#A21CAF] hover:bg-[#A21CAF]/80 text-white border-[#A21CAF]"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => toggleTag(tag.id)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Notes Grid */}
          <ResizablePanel defaultSize={75}>
            <div className="p-4 space-y-4">
              {/* Search & Sort */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="az">A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-500">
                {filteredNotes.length} note
                {filteredNotes.length !== 1 ? "s" : ""} found
              </p>

              {/* Notes Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                  <Link key={note.id} href={`/judges/notes/${note.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          {/* Title */}
                          <h3 className="font-medium text-gray-900 line-clamp-1">
                            {note.title}
                          </h3>

                          {/* Folder */}
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FolderIcon className="h-3 w-3" />
                            {note.folder}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tagId) => {
                              const tag = tagMap[tagId];
                              if (!tag) return null;
                              return (
                                <Badge
                                  key={tagId}
                                  variant="secondary"
                                  className={`text-[10px] px-1.5 py-0 ${tag.color}`}
                                >
                                  {tag.name}
                                </Badge>
                              );
                            })}
                          </div>

                          {/* Content Snippet */}
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {note.content || "No content yet..."}
                          </p>

                          {/* Footer: Date & Source */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs text-gray-400">
                              {new Date(note.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            {note.sourceLabel && (
                              <span className="text-xs text-[#A21CAF]">
                                From: {note.sourceLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {filteredNotes.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                    <StickyNote className="h-6 w-6 text-gray-400" />
                  </div>
                  {notes.length === 0 ? (
                    <>
                      <p className="text-gray-500 mb-4">No notes yet</p>
                      <Button
                        onClick={handleNewNote}
                        disabled={isCreating}
                        className="bg-[#A21CAF] hover:bg-[#A21CAF]/90 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create your first note
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500">No notes match your filters.</p>
                  )}
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
