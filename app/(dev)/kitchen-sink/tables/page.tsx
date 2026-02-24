"use client";

import { useState } from "react";
import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const statusBadge = (status: string) => {
  switch (status) {
    case "Active":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
          Active
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          Pending
        </Badge>
      );
    case "Closed":
      return (
        <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
          Closed
        </Badge>
      );
    case "Urgent":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          Urgent
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function TablesPage() {
  const cases = [
    {
      id: "CAS-001",
      title: "Ali v. State",
      court: "Supreme Court",
      status: "Active",
      date: "2024-01-15",
      progress: 75,
    },
    {
      id: "CAS-002",
      title: "Khan v. Federation",
      court: "Lahore High Court",
      status: "Pending",
      date: "2024-02-20",
      progress: 30,
    },
    {
      id: "CAS-003",
      title: "Ahmed v. Ahmed",
      court: "Family Court Karachi",
      status: "Closed",
      date: "2023-11-05",
      progress: 100,
    },
    {
      id: "CAS-004",
      title: "State v. Malik",
      court: "Islamabad High Court",
      status: "Urgent",
      date: "2024-03-01",
      progress: 15,
    },
    {
      id: "CAS-005",
      title: "Bibi v. Province of Sindh",
      court: "Sindh High Court",
      status: "Active",
      date: "2024-01-28",
      progress: 60,
    },
  ];

  const [sortField, setSortField] = useState<string>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedCases = [...cases].sort((a, b) => {
    const aVal = a[sortField as keyof typeof a];
    const bVal = b[sortField as keyof typeof b];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Tables
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Basic tables, sortable headers, row actions, pagination, status
          badges, and progress indicators.
        </p>
      </div>

      {/* 1. Basic Table */}
      <SectionBlock
        title="Basic Table"
        description="A simple read-only table displaying case data with no interactivity."
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Case ID</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Court</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {cases.map((c) => (
      <TableRow key={c.id}>
        <TableCell className="font-medium">{c.id}</TableCell>
        <TableCell>{c.title}</TableCell>
        <TableCell>{c.court}</TableCell>
        <TableCell>{c.status}</TableCell>
        <TableCell>{c.date}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.court}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionBlock>

      {/* 2. Sortable Headers */}
      <SectionBlock
        title="Sortable Headers"
        description="Click any column header to sort ascending or descending."
        code={`const [sortField, setSortField] = useState<string>("id");
const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

const toggleSort = (field: string) => {
  if (sortField === field) {
    setSortDir(sortDir === "asc" ? "desc" : "asc");
  } else {
    setSortField(field);
    setSortDir("asc");
  }
};

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="cursor-pointer" onClick={() => toggleSort("id")}>
        <div className="flex items-center gap-1">
          Case ID <ArrowUpDown className="h-3 w-3" />
        </div>
      </TableHead>
      <TableHead className="cursor-pointer" onClick={() => toggleSort("title")}>
        <div className="flex items-center gap-1">
          Title <ArrowUpDown className="h-3 w-3" />
        </div>
      </TableHead>
      {/* ... */}
    </TableRow>
  </TableHeader>
  <TableBody>
    {sortedCases.map((c) => (
      <TableRow key={c.id}>
        <TableCell className="font-medium">{c.id}</TableCell>
        <TableCell>{c.title}</TableCell>
        <TableCell>{c.court}</TableCell>
        <TableCell>{c.status}</TableCell>
        <TableCell>{c.date}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("id")}
              >
                <div className="flex items-center gap-1">
                  Case ID <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("title")}
              >
                <div className="flex items-center gap-1">
                  Title <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("court")}
              >
                <div className="flex items-center gap-1">
                  Court <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.court}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>{c.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionBlock>

      {/* 3. Row Actions */}
      <SectionBlock
        title="Row Actions"
        description="Each row has a dropdown menu with contextual actions."
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Case ID</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Court</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {cases.map((c) => (
      <TableRow key={c.id}>
        <TableCell className="font-medium">{c.id}</TableCell>
        <TableCell>{c.title}</TableCell>
        <TableCell>{c.court}</TableCell>
        <TableCell>{statusBadge(c.status)}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Case</DropdownMenuItem>
              <DropdownMenuItem>Assign Judge</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.id}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.court}</TableCell>
                <TableCell>{statusBadge(c.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Case</DropdownMenuItem>
                      <DropdownMenuItem>Assign Judge</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionBlock>

      {/* 4. Status Badges */}
      <SectionBlock
        title="Status Badges"
        description="Four status badge styles used throughout the case management system."
        code={`<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>
<Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>
<Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Closed</Badge>
<Badge className="bg-red-100 text-red-700 hover:bg-red-100">Urgent</Badge>`}
      >
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Active
            </Badge>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              Pending
            </Badge>
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
              Closed
            </Badge>
            <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
              Urgent
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.id}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionBlock>

      {/* 5. Pagination */}
      <SectionBlock
        title="Pagination"
        description="Table with pagination controls for navigating through large datasets."
        code={`<Table>
  {/* ...table content... */}
</Table>

<div className="flex items-center justify-between pt-4">
  <p className="text-sm text-gray-500">Showing 1-5 of 24 cases</p>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm" disabled>
      <ChevronLeft className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="sm" className="bg-[#A21CAF] text-white hover:bg-[#86198F]">
      1
    </Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
    <Button variant="outline" size="sm">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>`}
      >
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.id}</TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell>{c.court}</TableCell>
                  <TableCell>{statusBadge(c.status)}</TableCell>
                  <TableCell>{c.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-500">Showing 1-5 of 24 cases</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#A21CAF] text-white hover:bg-[#86198F]"
              >
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* 6. Progress Bars */}
      <SectionBlock
        title="Progress Bars"
        description="Progress indicators at various completion levels with colour-coded semantics."
        code={`<div className="space-y-4">
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>Urgent</span><span className="text-gray-500">15%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-red-500" style={{ width: "15%" }} />
    </div>
  </div>
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>Pending</span><span className="text-gray-500">30%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-amber-500" style={{ width: "30%" }} />
    </div>
  </div>
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>In Progress</span><span className="text-gray-500">60%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-blue-500" style={{ width: "60%" }} />
    </div>
  </div>
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>Advanced</span><span className="text-gray-500">75%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-purple-500" style={{ width: "75%" }} />
    </div>
  </div>
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>Complete</span><span className="text-gray-500">100%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-emerald-500" style={{ width: "100%" }} />
    </div>
  </div>
</div>`}
      >
        <div className="space-y-4">
          {[
            { label: "Urgent", value: 15, color: "bg-red-500" },
            { label: "Pending", value: 30, color: "bg-amber-500" },
            { label: "In Progress", value: 60, color: "bg-blue-500" },
            { label: "Advanced", value: 75, color: "bg-purple-500" },
            { label: "Complete", value: 100, color: "bg-emerald-500" },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="text-gray-500">{item.value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${item.color}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
