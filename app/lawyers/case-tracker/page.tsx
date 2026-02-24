"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, Scale } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import { useToast } from "@/hooks/use-toast";
import type { TrackedCase, LawyerCaseStatus } from "@/lib/types/lawyer-portal";

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Urgent: "bg-red-100 text-red-700 hover:bg-red-100",
  Closed: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  Adjourned: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Disposed: "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Reserved: "bg-orange-100 text-orange-700 hover:bg-orange-100",
};

const statuses: LawyerCaseStatus[] = [
  "Active",
  "Pending",
  "Urgent",
  "Closed",
  "Adjourned",
  "Disposed",
  "Reserved",
];

export default function CaseTrackerPage() {
  const [cases] = useState<TrackedCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        !search ||
        c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.court.toLowerCase().includes(search.toLowerCase()) ||
        c.clientName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [cases, search, statusFilter]);

  return (
    <div className="space-y-8">
      <PageHeader
        label="Database & Research"
        title="Case Tracker"
        actions={
          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            onClick={() =>
              toast({
                title: "Coming soon",
                description:
                  "The Add Case feature is currently under development.",
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Case
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search cases, courts, clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No cases found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/lawyers/case-tracker/${c.id}`}
                      className="font-mono text-sm text-[#2563EB] hover:underline"
                    >
                      {c.caseNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/lawyers/case-tracker/${c.id}`}
                      className="font-medium text-gray-900 hover:text-[#2563EB]"
                    >
                      {c.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-600">{c.court}</TableCell>
                  <TableCell className="text-gray-600">{c.nextDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        statusStyles[c.status] || "bg-gray-100 text-gray-600"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {c.clientName}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
