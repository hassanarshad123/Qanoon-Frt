"use client";

import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  Scale,
  FileText,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Gavel,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const activities = [
  {
    icon: Gavel,
    text: "Judgment reserved in Ali v. Federation (CP-1234/2024)",
    time: "2 hours ago",
  },
  {
    icon: FileText,
    text: "New petition filed: Bibi v. Province of Punjab",
    time: "4 hours ago",
  },
  {
    icon: Scale,
    text: "Case CP-4567/2023 marked as closed",
    time: "Yesterday",
  },
  {
    icon: AlertCircle,
    text: "Urgent: Criminal appeal hearing rescheduled",
    time: "Yesterday",
  },
  {
    icon: Users,
    text: "Bench assigned for WP-789/2024",
    time: "2 days ago",
  },
  {
    icon: FileText,
    text: "Written arguments received in FA-234/2024",
    time: "2 days ago",
  },
  {
    icon: Gavel,
    text: "Order passed in Rehman Industries v. SECP",
    time: "3 days ago",
  },
  {
    icon: Scale,
    text: "New case assigned: Siddiqui v. State",
    time: "3 days ago",
  },
];

const chartData = [
  { month: "Jul", cases: 18 },
  { month: "Aug", cases: 24 },
  { month: "Sep", cases: 15 },
  { month: "Oct", cases: 31 },
  { month: "Nov", cases: 22 },
  { month: "Dec", cases: 28 },
  { month: "Jan", cases: 35 },
  { month: "Feb", cases: 20 },
  { month: "Mar", cases: 27 },
];

export default function JudgesDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Judges Portal
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Stat cards, calendar widget, activity feed, bar chart, and resizable
          document workspace.
        </p>
      </div>

      {/* 1. Stat Cards Row */}
      <SectionBlock
        title="Stat Cards Row"
        description="Key metrics at a glance with trend indicators."
        code={`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
          <Scale className="h-5 w-5 text-[#A21CAF]" />
        </div>
        <span className="flex items-center gap-1 text-sm text-emerald-600">
          <ArrowUpRight className="h-3 w-3" />8.2%
        </span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">47</p>
        <p className="text-sm text-gray-500">Active Cases</p>
      </div>
    </CardContent>
  </Card>
  {/* ...more stat cards */}
</div>`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Cases */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-[#A21CAF]" />
                </div>
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  8.2%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">47</p>
                <p className="text-sm text-gray-500">Active Cases</p>
              </div>
            </CardContent>
          </Card>

          {/* Pending Hearings */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <ArrowDownRight className="h-3 w-3" />
                  2.1%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-500">Pending Hearings</p>
              </div>
            </CardContent>
          </Card>

          {/* Judgments Due */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Gavel className="h-5 w-5 text-amber-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-amber-600">
                  <ArrowUpRight className="h-3 w-3" />
                  15%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-500">Judgments Due</p>
              </div>
            </CardContent>
          </Card>

          {/* Avg Days to Close */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="flex items-center gap-1 text-sm text-emerald-600">
                  <ArrowDownRight className="h-3 w-3" />
                  12.3%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-gray-900">34</p>
                <p className="text-sm text-gray-500">Avg Days to Close</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionBlock>

      {/* 2. Calendar Widget */}
      <SectionBlock
        title="Calendar Widget"
        description="Hearing calendar with upcoming schedule items."
        code={`<Card>
  <CardHeader>
    <CardTitle className="text-base">Hearing Calendar</CardTitle>
    <CardDescription>Upcoming scheduled hearings</CardDescription>
  </CardHeader>
  <CardContent className="flex justify-center">
    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
  </CardContent>
</Card>
<div className="mt-4 space-y-2">
  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
    <div>
      <p className="text-sm font-medium">Ali v. Federation</p>
      <p className="text-xs text-gray-500">10:00 AM — Court Room 3</p>
    </div>
    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Today</Badge>
  </div>
</div>`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hearing Calendar</CardTitle>
            <CardDescription>Upcoming scheduled hearings</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
        </Card>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium">Ali v. Federation</p>
              <p className="text-xs text-gray-500">
                10:00 AM — Court Room 3
              </p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Today
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium">Bibi v. Province of Punjab</p>
              <p className="text-xs text-gray-500">
                11:30 AM — Court Room 1
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Tomorrow
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium">Rehman Industries v. SECP</p>
              <p className="text-xs text-gray-500">
                09:00 AM — Court Room 5
              </p>
            </div>
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
              Feb 15
            </Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <div>
              <p className="text-sm font-medium">Siddiqui v. State</p>
              <p className="text-xs text-gray-500">
                02:00 PM — Court Room 2
              </p>
            </div>
            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
              Feb 18
            </Badge>
          </div>
        </div>
      </SectionBlock>

      {/* 3. Activity Feed */}
      <SectionBlock
        title="Activity Feed"
        description="Scrollable feed of recent judicial activities."
        code={`<Card>
  <CardHeader>
    <CardTitle className="text-base">Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
              <a.icon className="h-4 w-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">{a.text}</p>
              <p className="text-xs text-gray-400">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {activities.map((a, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <a.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{a.text}</p>
                      <p className="text-xs text-gray-400">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </SectionBlock>

      {/* 4. Bar Chart — Cases per Month */}
      <SectionBlock
        title="Bar Chart — Cases per Month"
        description="Recharts bar chart showing case filing trends over the last 9 months."
        code={`<Card>
  <CardHeader>
    <CardTitle className="text-base">Cases Filed per Month</CardTitle>
    <CardDescription>Last 9 months overview</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="cases" fill="#A21CAF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cases Filed per Month</CardTitle>
            <CardDescription>Last 9 months overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="cases"
                    fill="#A21CAF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </SectionBlock>

      {/* 5. Document Workspace */}
      <SectionBlock
        title="Document Workspace"
        description="Resizable split-panel layout for browsing and viewing case documents."
        code={`<Card>
  <CardHeader>
    <CardTitle className="text-base">Document Workspace</CardTitle>
    <CardDescription>Resizable split-panel document viewer</CardDescription>
  </CardHeader>
  <CardContent>
    <ResizablePanelGroup direction="horizontal" className="min-h-[300px] rounded-lg border">
      <ResizablePanel defaultSize={30} minSize={20}>
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">Documents</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-[#A21CAF]/10 text-[#A21CAF] cursor-pointer">
              <FileText className="h-4 w-4" /><span className="text-sm font-medium">Petition.pdf</span>
            </div>
            <!-- more items -->
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3">Petition.pdf</h4>
          <p className="font-serif text-base font-bold text-gray-900">IN THE SUPREME COURT OF PAKISTAN</p>
          <!-- document content -->
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </CardContent>
</Card>`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Document Workspace</CardTitle>
            <CardDescription>
              Resizable split-panel document viewer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[300px] rounded-lg border"
            >
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-3">Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#A21CAF]/10 text-[#A21CAF] cursor-pointer">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">Petition.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Arguments.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Court Order.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Evidence.pdf</span>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-3">Petition.pdf</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="font-serif text-base font-bold text-gray-900">
                      IN THE SUPREME COURT OF PAKISTAN
                    </p>
                    <p className="font-serif">
                      Constitutional Petition No. 1234 of 2024
                    </p>
                    <p>
                      <strong>Muhammad Ali</strong> ..........................
                      Petitioner
                    </p>
                    <p className="text-center">Versus</p>
                    <p>
                      <strong>Federation of Pakistan</strong> ...........
                      Respondent
                    </p>
                    <hr className="my-4" />
                    <p>
                      PETITION UNDER ARTICLE 184(3) OF THE CONSTITUTION OF THE
                      ISLAMIC REPUBLIC OF PAKISTAN, 1973
                    </p>
                    <p>
                      The petitioner most respectfully submits as follows:
                    </p>
                    <p>
                      1. That the petitioner is a citizen of Pakistan and is
                      entitled to fundamental rights guaranteed under the
                      Constitution...
                    </p>
                    <p>
                      2. That the impugned action of the respondent is in
                      violation of Articles 9, 14, and 25 of the
                      Constitution...
                    </p>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>
        </Card>
      </SectionBlock>
    </div>
  );
}
