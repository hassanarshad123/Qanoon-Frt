"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scale,
  Clock,
  FileText,
  Users,
  FilePen,
  Search,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardApi } from "@/lib/api/dashboard";
import type { LawyerDashboardData, ActivityEntry } from "@/lib/types/shared";

const iconMap: Record<string, React.ElementType> = {
  scale: Scale,
  "file-text": FileText,
  search: Search,
  clock: Clock,
  users: Users,
  "file-pen": FilePen,
  "book-open": BookOpen,
};

const quickActions = [
  { label: "Generate Brief", href: "/lawyers/brief", icon: FileText, color: "bg-[#2563EB]/10 text-[#2563EB]" },
  { label: "Draft Petition", href: "/lawyers/petition", icon: FilePen, color: "bg-purple-50 text-purple-600" },
  { label: "Legal Research", href: "/lawyers/research", icon: Search, color: "bg-emerald-50 text-emerald-600" },
  { label: "Find Case Law", href: "/lawyers/case-finder", icon: BookOpen, color: "bg-amber-50 text-amber-600" },
  { label: "Track Cases", href: "/lawyers/case-tracker", icon: Scale, color: "bg-rose-50 text-rose-600" },
  { label: "View Clients", href: "/lawyers/clients", icon: Users, color: "bg-blue-50 text-blue-600" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const activityEntityIcons: Record<string, React.ElementType> = {
  brief: FileText,
  judgment: Scale,
  research: Search,
  note: BookOpen,
  document: FileText,
};

function formatActivityText(entry: ActivityEntry): string {
  const verb = entry.action === "created" ? "Created" : entry.action === "updated" ? "Updated" : entry.action === "deleted" ? "Deleted" : entry.action === "finalized" ? "Finalized" : "Viewed";
  const type = entry.entityType === "brief" ? "brief" : entry.entityType === "judgment" ? "judgment" : entry.entityType === "research" ? "research session" : entry.entityType === "note" ? "note" : "document";
  const title = entry.entityTitle ? `: ${entry.entityTitle}` : "";
  return `${verb} ${type}${title}`;
}

function formatTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LawyerDashboard() {
  const [dashboardData, setDashboardData] = useState<LawyerDashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getLawyerDashboard()
      .then(setDashboardData)
      .catch((err) => console.error("Failed to load dashboard data:", err))
      .finally(() => setDashboardLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div data-tour="lawyer-greeting">
        <p className="text-sm font-medium text-[#2563EB] tracking-wide uppercase mb-1">
          {getGreeting()}
        </p>
        <h1 className="text-4xl font-bold font-serif text-gray-900">
          {dashboardLoading ? (
            <span className="inline-block h-10 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>Advocate <span className="text-[#2563EB]">{dashboardData?.profile.fullName?.split(" ")[0] || "Counsel"}</span></>
          )}
        </h1>
        <p className="mt-2 text-gray-500">{today}</p>
      </div>

      {/* Stat Cards */}
      <div data-tour="lawyer-stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <Scale className="h-5 w-5 text-[#2563EB]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.totalBriefs ?? 0}</p>
              <p className="text-sm text-gray-500">Briefs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.totalResearch ?? 0}</p>
              <p className="text-sm text-gray-500">Research Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.totalDocuments ?? 0}</p>
              <p className="text-sm text-gray-500">Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.stats.totalNotes ?? 0}</p>
              <p className="text-sm text-gray-500">Notes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card data-tour="lawyer-schedule" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Today&apos;s Schedule</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link href="/lawyers/calendar">View Calendar</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[280px] text-sm text-gray-400">
              No events scheduled
            </div>
          </CardContent>
        </Card>

        <Card data-tour="lawyer-quick-actions">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button key={action.label} variant="ghost" className="w-full justify-start h-12" asChild>
                  <Link href={action.href}>
                    <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    {action.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card data-tour="lawyer-activity">
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {dashboardData && dashboardData.recentActivity.length > 0
                ? dashboardData.recentActivity.map((entry) => {
                    const Icon = activityEntityIcons[entry.entityType] || FileText;
                    return (
                      <div key={entry.id} className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900">{formatActivityText(entry)}</p>
                          <p className="text-xs text-gray-400">{formatTimeAgo(entry.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })
                : (
                  <div className="flex items-center justify-center h-full text-sm text-gray-400">
                    No recent activity
                  </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
