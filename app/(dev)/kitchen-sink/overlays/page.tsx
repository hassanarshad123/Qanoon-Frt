"use client";

import { useState } from "react";
import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Scale, FileText, Users, Gavel, Search } from "lucide-react";

export default function OverlaysPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Overlays
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Dialogs, alert dialogs, toasts, tooltips, popovers, command palette,
          and loading skeletons.
        </p>
      </div>

      {/* 1. Dialog */}
      <SectionBlock
        title="Dialog"
        description="A modal dialog for adding a new case with form fields."
        code={`<Dialog>
  <DialogTrigger asChild>
    <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">Add New Case</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add New Case</DialogTitle>
      <DialogDescription>Enter the details for the new case filing.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Case Title</Label>
        <Input placeholder="e.g. Ali v. State" />
      </div>
      <div className="space-y-2">
        <Label>Case Number</Label>
        <Input placeholder="e.g. CP-1234/2024" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">Save Case</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
              Add New Case
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Case</DialogTitle>
              <DialogDescription>
                Enter the details for the new case filing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Case Title</Label>
                <Input placeholder="e.g. Ali v. State" />
              </div>
              <div className="space-y-2">
                <Label>Case Number</Label>
                <Input placeholder="e.g. CP-1234/2024" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
                Save Case
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SectionBlock>

      {/* 2. Alert Dialog */}
      <SectionBlock
        title="Alert Dialog"
        description="A confirmation dialog for destructive actions like deleting a case."
        code={`<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Case</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the case
        record and all associated documents from the system.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-600 hover:bg-red-700">
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`}
      >
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Case</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                case record and all associated documents from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SectionBlock>

      {/* 3. Toasts */}
      <SectionBlock
        title="Toasts"
        description="Notification toasts for success, error, warning, and info states using Sonner."
        code={`<div className="flex flex-wrap gap-3">
  <Button variant="outline" onClick={() => toast.success("Case filed successfully", {
    description: "Case CP-1234/2024 has been registered.",
  })}>
    Success Toast
  </Button>
  <Button variant="outline" onClick={() => toast.error("Failed to save", {
    description: "Please check your connection and try again.",
  })}>
    Error Toast
  </Button>
  <Button variant="outline" onClick={() => toast.warning("Hearing date conflict", {
    description: "This date overlaps with another scheduled hearing.",
  })}>
    Warning Toast
  </Button>
  <Button variant="outline" onClick={() => toast("New notification", {
    description: "You have 3 pending case reviews.",
  })}>
    Info Toast
  </Button>
</div>`}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Case filed successfully", {
                description: "Case CP-1234/2024 has been registered.",
              })
            }
          >
            Success Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Failed to save", {
                description:
                  "Please check your connection and try again.",
              })
            }
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Hearing date conflict", {
                description:
                  "This date overlaps with another scheduled hearing.",
              })
            }
          >
            Warning Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("New notification", {
                description: "You have 3 pending case reviews.",
              })
            }
          >
            Info Toast
          </Button>
        </div>
      </SectionBlock>

      {/* 4. Tooltips */}
      <SectionBlock
        title="Tooltips"
        description="Tooltips displayed in all four positions: top, right, bottom, and left."
        code={`<TooltipProvider>
  <div className="flex flex-wrap gap-4">
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline">Top</Button></TooltipTrigger>
      <TooltipContent side="top"><p>Tooltip on top</p></TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline">Right</Button></TooltipTrigger>
      <TooltipContent side="right"><p>Tooltip on right</p></TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline">Bottom</Button></TooltipTrigger>
      <TooltipContent side="bottom"><p>Tooltip on bottom</p></TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger asChild><Button variant="outline">Left</Button></TooltipTrigger>
      <TooltipContent side="left"><p>Tooltip on left</p></TooltipContent>
    </Tooltip>
  </div>
</TooltipProvider>`}
      >
        <TooltipProvider>
          <div className="flex flex-wrap gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Top</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Tooltip on top</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Right</Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Tooltip on right</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Tooltip on bottom</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Left</Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Tooltip on left</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </SectionBlock>

      {/* 5. Popover with Form */}
      <SectionBlock
        title="Popover with Form"
        description="A popover containing a mini filter form for narrowing down case results."
        code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Filter</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
    <div className="space-y-4">
      <h4 className="font-medium text-sm">Filter Cases</h4>
      <div className="space-y-2">
        <Label>Court</Label>
        <Input placeholder="Search courts..." />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Input placeholder="e.g. Active, Pending" />
      </div>
      <Button size="sm" className="w-full bg-[#A21CAF] hover:bg-[#86198F] text-white">
        Apply Filters
      </Button>
    </div>
  </PopoverContent>
</Popover>`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Filter</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Filter Cases</h4>
              <div className="space-y-2">
                <Label>Court</Label>
                <Input placeholder="Search courts..." />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Input placeholder="e.g. Active, Pending" />
              </div>
              <Button
                size="sm"
                className="w-full bg-[#A21CAF] hover:bg-[#86198F] text-white"
              >
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SectionBlock>

      {/* 6. Command Palette */}
      <SectionBlock
        title="Command Palette"
        description="An inline command palette for searching cases, documents, and judges."
        code={`<Command className="rounded-xl border border-gray-200">
  <CommandInput placeholder="Search cases, judges, or documents..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Cases">
      <CommandItem>
        <Scale className="mr-2 h-4 w-4" />Ali v. State — CP-1234/2024
      </CommandItem>
      <CommandItem>
        <Scale className="mr-2 h-4 w-4" />Khan v. Federation — WP-5678/2024
      </CommandItem>
    </CommandGroup>
    <CommandGroup heading="Documents">
      <CommandItem>
        <FileText className="mr-2 h-4 w-4" />Judgment Draft — PLD 2024 SC 112
      </CommandItem>
      <CommandItem>
        <FileText className="mr-2 h-4 w-4" />Order Sheet — CMA 789/2024
      </CommandItem>
    </CommandGroup>
    <CommandGroup heading="Judges">
      <CommandItem>
        <Users className="mr-2 h-4 w-4" />Hon. Justice Ahmed
      </CommandItem>
      <CommandItem>
        <Users className="mr-2 h-4 w-4" />Hon. Justice Malik
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`}
      >
        <Command className="rounded-xl border border-gray-200">
          <CommandInput placeholder="Search cases, judges, or documents..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Cases">
              <CommandItem>
                <Scale className="mr-2 h-4 w-4" />
                Ali v. State — CP-1234/2024
              </CommandItem>
              <CommandItem>
                <Scale className="mr-2 h-4 w-4" />
                Khan v. Federation — WP-5678/2024
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Documents">
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" />
                Judgment Draft — PLD 2024 SC 112
              </CommandItem>
              <CommandItem>
                <FileText className="mr-2 h-4 w-4" />
                Order Sheet — CMA 789/2024
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Judges">
              <CommandItem>
                <Users className="mr-2 h-4 w-4" />
                Hon. Justice Ahmed
              </CommandItem>
              <CommandItem>
                <Users className="mr-2 h-4 w-4" />
                Hon. Justice Malik
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </SectionBlock>

      {/* 7. Loading Skeletons */}
      <SectionBlock
        title="Loading Skeletons"
        description="Placeholder skeletons for cards and table rows while content is loading."
        code={`{/* Card Skeleton */}
<div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-20 w-full" />
  <div className="flex gap-2">
    <Skeleton className="h-8 w-24" />
    <Skeleton className="h-8 w-24" />
  </div>
</div>

{/* Table Row Skeletons */}
<div className="space-y-3">
  {[1, 2, 3].map((i) => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  ))}
</div>`}
      >
        <div className="space-y-8">
          {/* Card Skeleton */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Card Skeleton
            </p>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>

          {/* Table Row Skeletons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Table Row Skeletons
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
