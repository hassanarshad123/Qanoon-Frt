"use client";

import { useState } from "react";
import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Scale,
} from "lucide-react";

const cases = [
  {
    id: 1,
    title: "Muhammad Ali v. Federation of Pakistan",
    number: "CP No. 1234/2024",
    court: "Supreme Court",
    citation: "PLD 2024 SC 112",
    status: "Active",
    type: "Constitutional",
    judge: "Hon. Justice Isa",
    filed: "2024-01-15",
    nextHearing: "2024-04-10",
  },
  {
    id: 2,
    title: "Fatima Bibi v. Province of Punjab",
    number: "WP No. 5678/2024",
    court: "Lahore High Court",
    citation: "PLD 2024 Lah 45",
    status: "Pending",
    type: "Civil",
    judge: "Hon. Justice Bandial",
    filed: "2024-02-20",
    nextHearing: "2024-04-15",
  },
  {
    id: 3,
    title: "State v. Ahmed Khan",
    number: "Crl.A No. 901/2023",
    court: "Sindh High Court",
    citation: "SCMR 2024 SC 78",
    status: "Urgent",
    type: "Criminal",
    judge: "Hon. Justice Nisar",
    filed: "2023-11-10",
    nextHearing: "2024-03-28",
  },
  {
    id: 4,
    title: "Zainab Noor v. Tariq Mahmood",
    number: "FA No. 234/2024",
    court: "Family Court Lahore",
    citation: "CLC 2024 Lah 156",
    status: "Active",
    type: "Family",
    judge: "Hon. Justice Munir",
    filed: "2024-01-08",
    nextHearing: "2024-04-05",
  },
  {
    id: 5,
    title: "Pakistan Steel Mills v. FBR",
    number: "CP No. 4567/2023",
    court: "Islamabad High Court",
    citation: "PLD 2024 Isl 89",
    status: "Closed",
    type: "Tax",
    judge: "Hon. Justice Khosa",
    filed: "2023-06-15",
    nextHearing: "\u2014",
  },
  {
    id: 6,
    title: "Baloch Welfare Trust v. Govt of Balochistan",
    number: "CP No. 789/2024",
    court: "Balochistan High Court",
    citation: "SCMR 2024 Quet 34",
    status: "Pending",
    type: "Constitutional",
    judge: "Hon. Justice Shah",
    filed: "2024-03-01",
    nextHearing: "2024-05-10",
  },
  {
    id: 7,
    title: "Rehman Industries v. SECP",
    number: "CO No. 321/2024",
    court: "Peshawar High Court",
    citation: "CLC 2024 Pesh 67",
    status: "Active",
    type: "Corporate",
    judge: "Hon. Justice Afridi",
    filed: "2024-02-14",
    nextHearing: "2024-04-20",
  },
  {
    id: 8,
    title: "Aisha Siddiqui v. State",
    number: "Crl.R No. 456/2024",
    court: "Supreme Court",
    citation: "PLD 2024 SC 201",
    status: "Urgent",
    type: "Criminal",
    judge: "Hon. Justice Isa",
    filed: "2024-03-05",
    nextHearing: "2024-03-25",
  },
];

const timelineEvents = [
  {
    title: "Case Filed",
    date: "15 January 2024",
    description: "Constitutional Petition filed by petitioner's counsel.",
    completed: true,
  },
  {
    title: "Notice Issued",
    date: "22 January 2024",
    description: "Notice issued to Attorney General and respondents.",
    completed: true,
  },
  {
    title: "Written Arguments Submitted",
    date: "10 February 2024",
    description: "Both parties submitted written arguments.",
    completed: true,
  },
  {
    title: "Hearing \u2014 Arguments",
    date: "15 February 2024",
    description: "Oral arguments heard. Case adjourned for order.",
    completed: true,
  },
  {
    title: "Next Hearing",
    date: "10 April 2024",
    description: "Reserved for judgment. Bench: 3-member.",
    completed: false,
  },
  {
    title: "Judgment",
    date: "Pending",
    description: "Awaiting final judgment.",
    completed: false,
  },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Closed: "bg-gray-100 text-gray-700",
    Urgent: "bg-red-100 text-red-700",
    Reserved: "bg-purple-100 text-purple-700",
    Adjourned: "bg-blue-100 text-blue-700",
    Dismissed: "bg-rose-100 text-rose-700",
    Decreed: "bg-teal-100 text-teal-700",
  };
  return (
    <Badge
      className={`${styles[status] || "bg-gray-100 text-gray-700"} hover:${styles[status] || "bg-gray-100"}`}
    >
      {status}
    </Badge>
  );
}

export default function JudgesCaseManagementPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Judges Portal
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Case Management
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Case list tables, detail cards, legal status badges, and case
          timelines using Pakistani legal references.
        </p>
      </div>

      {/* 1. Case List Table */}
      <SectionBlock
        title="Case List Table"
        description="Full case list table with Pakistani legal references, status badges, and row-level actions."
        code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>#</TableHead>
      <TableHead>Case Title</TableHead>
      <TableHead>Case No.</TableHead>
      <TableHead>Court</TableHead>
      <TableHead>Citation</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Type</TableHead>
      <TableHead>Next Hearing</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {cases.map((c) => (
      <TableRow key={c.id}>
        <TableCell>{c.id}</TableCell>
        <TableCell className="font-medium max-w-[200px]">{c.title}</TableCell>
        <TableCell className="font-mono text-xs">{c.number}</TableCell>
        <TableCell>{c.court}</TableCell>
        <TableCell className="font-mono text-xs">{c.citation}</TableCell>
        <TableCell><StatusBadge status={c.status} /></TableCell>
        <TableCell>{c.type}</TableCell>
        <TableCell>{c.nextHearing}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Assign</DropdownMenuItem>
              <DropdownMenuItem>Generate AI Brief</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Case Title</TableHead>
                <TableHead>Case No.</TableHead>
                <TableHead>Court</TableHead>
                <TableHead>Citation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell className="font-medium max-w-[200px]">
                    {c.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {c.number}
                  </TableCell>
                  <TableCell>{c.court}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {c.citation}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.nextHearing}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Assign</DropdownMenuItem>
                        <DropdownMenuItem>Generate AI Brief</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionBlock>

      {/* 2. Case Detail Card */}
      <SectionBlock
        title="Case Detail Card"
        description="A detailed case card with tabbed sections for details, documents, orders, and timeline."
        code={`<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <StatusBadge status="Active" />
      <span className="text-xs text-gray-400 font-mono">PLD 2024 SC 112</span>
    </div>
    <CardTitle>Muhammad Ali v. Federation of Pakistan</CardTitle>
    <CardDescription>Constitutional Petition No. 1234/2024 — Supreme Court of Pakistan</CardDescription>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="details">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
      </TabsList>
      <TabsContent value="details" className="mt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Presiding Judge</span>
            <p className="font-medium">Hon. Justice Isa</p>
          </div>
          <div>
            <span className="text-gray-500">Filed Date</span>
            <p className="font-medium">15 January 2024</p>
          </div>
          <div>
            <span className="text-gray-500">Case Type</span>
            <p className="font-medium">Constitutional</p>
          </div>
          <div>
            <span className="text-gray-500">Next Hearing</span>
            <p className="font-medium">10 April 2024</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="documents" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Original Petition.pdf</span>
            </div>
            <Button variant="ghost" size="sm">View</Button>
          </div>
          {/* ... more documents */}
        </div>
      </TabsContent>
      <TabsContent value="orders" className="mt-4">
        <p className="text-sm text-gray-500">3 orders issued. Latest: Adjournment dated 15-02-2024.</p>
      </TabsContent>
      <TabsContent value="timeline" className="mt-4">
        <p className="text-sm text-gray-500">See timeline section below for visual timeline.</p>
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <StatusBadge status="Active" />
              <span className="text-xs text-gray-400 font-mono">
                PLD 2024 SC 112
              </span>
            </div>
            <CardTitle>Muhammad Ali v. Federation of Pakistan</CardTitle>
            <CardDescription>
              Constitutional Petition No. 1234/2024 — Supreme Court of Pakistan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Presiding Judge</span>
                    <p className="font-medium">Hon. Justice Isa</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Filed Date</span>
                    <p className="font-medium">15 January 2024</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Case Type</span>
                    <p className="font-medium">Constitutional</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Hearing</span>
                    <p className="font-medium">10 April 2024</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Original Petition.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Written Arguments.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        Court Order 15-02-2024.pdf
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="orders" className="mt-4">
                <p className="text-sm text-gray-500">
                  3 orders issued. Latest: Adjournment dated 15-02-2024.
                </p>
              </TabsContent>
              <TabsContent value="timeline" className="mt-4">
                <p className="text-sm text-gray-500">
                  See timeline section below for visual timeline.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </SectionBlock>

      {/* 3. Legal Status Badges Collection */}
      <SectionBlock
        title="Legal Status Badges Collection"
        description="All legal status badge variants and case type badges used across the judges portal."
        code={`{/* Case Status Badges */}
<div className="flex flex-wrap items-center gap-3">
  <StatusBadge status="Active" />
  <StatusBadge status="Pending" />
  <StatusBadge status="Closed" />
  <StatusBadge status="Urgent" />
  <StatusBadge status="Reserved" />
  <StatusBadge status="Adjourned" />
  <StatusBadge status="Dismissed" />
  <StatusBadge status="Decreed" />
</div>

{/* Case Type Badges */}
<div className="flex flex-wrap items-center gap-3">
  <Badge variant="outline" className="border-purple-300 text-purple-700">Constitutional</Badge>
  <Badge variant="outline" className="border-blue-300 text-blue-700">Civil</Badge>
  <Badge variant="outline" className="border-red-300 text-red-700">Criminal</Badge>
  <Badge variant="outline" className="border-pink-300 text-pink-700">Family</Badge>
  <Badge variant="outline" className="border-amber-300 text-amber-700">Tax</Badge>
  <Badge variant="outline" className="border-teal-300 text-teal-700">Corporate</Badge>
  <Badge variant="outline" className="border-indigo-300 text-indigo-700">Writ</Badge>
  <Badge variant="outline" className="border-orange-300 text-orange-700">Appeal</Badge>
</div>`}
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Case Statuses
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status="Active" />
              <StatusBadge status="Pending" />
              <StatusBadge status="Closed" />
              <StatusBadge status="Urgent" />
              <StatusBadge status="Reserved" />
              <StatusBadge status="Adjourned" />
              <StatusBadge status="Dismissed" />
              <StatusBadge status="Decreed" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Case Types
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="border-purple-300 text-purple-700"
              >
                Constitutional
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                Civil
              </Badge>
              <Badge
                variant="outline"
                className="border-red-300 text-red-700"
              >
                Criminal
              </Badge>
              <Badge
                variant="outline"
                className="border-pink-300 text-pink-700"
              >
                Family
              </Badge>
              <Badge
                variant="outline"
                className="border-amber-300 text-amber-700"
              >
                Tax
              </Badge>
              <Badge
                variant="outline"
                className="border-teal-300 text-teal-700"
              >
                Corporate
              </Badge>
              <Badge
                variant="outline"
                className="border-indigo-300 text-indigo-700"
              >
                Writ
              </Badge>
              <Badge
                variant="outline"
                className="border-orange-300 text-orange-700"
              >
                Appeal
              </Badge>
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* 4. Case Timeline */}
      <SectionBlock
        title="Case Timeline"
        description="Vertical timeline tracking a case from filing through judgment, with completed and pending milestones."
        code={`const timelineEvents = [
  { title: "Case Filed", date: "15 January 2024", description: "Constitutional Petition filed by petitioner's counsel.", completed: true },
  { title: "Notice Issued", date: "22 January 2024", description: "Notice issued to Attorney General and respondents.", completed: true },
  { title: "Written Arguments Submitted", date: "10 February 2024", description: "Both parties submitted written arguments.", completed: true },
  { title: "Hearing — Arguments", date: "15 February 2024", description: "Oral arguments heard. Case adjourned for order.", completed: true },
  { title: "Next Hearing", date: "10 April 2024", description: "Reserved for judgment. Bench: 3-member.", completed: false },
  { title: "Judgment", date: "Pending", description: "Awaiting final judgment.", completed: false },
];

<div className="space-y-0">
  {timelineEvents.map((event, i) => (
    <div key={i} className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={\`h-3 w-3 rounded-full \${event.completed ? "bg-[#A21CAF]" : "bg-gray-300"}\`} />
        {i < timelineEvents.length - 1 && <div className="w-0.5 h-16 bg-gray-200" />}
      </div>
      <div className="pb-8">
        <p className="text-sm font-medium text-gray-900">{event.title}</p>
        <p className="text-xs text-gray-500">{event.date}</p>
        <p className="mt-1 text-sm text-gray-600">{event.description}</p>
      </div>
    </div>
  ))}
</div>`}
      >
        <div className="space-y-0">
          {timelineEvents.map((event, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`h-3 w-3 rounded-full ${event.completed ? "bg-[#A21CAF]" : "bg-gray-300"}`}
                />
                {i < timelineEvents.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200" />
                )}
              </div>
              <div className="pb-8">
                <p className="text-sm font-medium text-gray-900">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500">{event.date}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
