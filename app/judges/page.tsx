"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scale,
  Clock,
  Gavel,
  FileText,
  FileStack,
  Search,
  StickyNote,
  ChevronRight,
  ArrowUpRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dashboardApi } from "@/lib/api/dashboard";
import type { DashboardData, ActivityEntry } from "@/lib/types/shared";

const quickActions = [
  { label: "Generate Brief", href: "/judges/brief", icon: FileText, color: "bg-[#A21CAF]/10 text-[#A21CAF]" },
  { label: "Research Law", href: "/judges/research", icon: Search, color: "bg-blue-50 text-blue-600" },
  { label: "Draft Judgment", href: "/judges/judgment", icon: Gavel, color: "bg-amber-50 text-amber-600" },
  { label: "View Documents", href: "/judges/documents", icon: FileStack, color: "bg-emerald-50 text-emerald-600" },
  { label: "My Notes", href: "/judges/notes", icon: StickyNote, color: "bg-pink-50 text-pink-600" },
];

const entityIcons: Record<string, React.ElementType> = {
  brief: FileText,
  judgment: Gavel,
  research: Search,
  note: StickyNote,
  document: FileStack,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatActivityText(item: ActivityEntry): string {
  const action = item.action === "created" ? "Created" :
    item.action === "updated" ? "Updated" :
    item.action === "deleted" ? "Deleted" :
    item.action === "finalized" ? "Finalized" : item.action;
  const type = item.entityType === "brief" ? "brief" :
    item.entityType === "research" ? "research session" :
    item.entityType === "note" ? "note" :
    item.entityType === "judgment" ? "judgment" :
    item.entityType === "document" ? "document" : item.entityType;
  const title = item.entityTitle ? `: ${item.entityTitle}` : "";
  return `${action} ${type}${title}`;
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function JudgesDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = () => {
    setLoading(true);
    setError(null);
    dashboardApi.getJudgeDashboard()
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const displayName = data?.profile?.fullName || data?.profile?.email || "Justice";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div data-tour="dashboard-greeting">
        <p className="text-sm font-medium text-[#A21CAF] tracking-wide uppercase mb-1">
          {getGreeting()}
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">
          {loading ? (
            <span className="inline-block h-9 w-48 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              {data?.profile?.designation || "Justice"}{" "}
              <span className="text-[#A21CAF]">{firstName}</span>
            </>
          )}
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">{today}</p>
        {data?.profile?.courtName && (
          <p className="text-xs text-gray-400 mt-0.5">{data.profile.courtName}</p>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadDashboard}>
            Retry
          </Button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-tour="dashboard-stats">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-[#A21CAF]/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#A21CAF]" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : data?.stats.totalBriefs ?? 0}
              </p>
              <p className="text-sm text-gray-500">Total Briefs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : data?.stats.totalResearch ?? 0}
              </p>
              <p className="text-sm text-gray-500">Research Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <Gavel className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : data?.stats.totalJudgments ?? 0}
              </p>
              <p className="text-sm text-gray-500">Draft Judgments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <StickyNote className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : data?.stats.totalNotes ?? 0}
              </p>
              <p className="text-sm text-gray-500">Notes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FileStack className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "—" : data?.stats.totalDocuments ?? 0}
              </p>
              <p className="text-sm text-gray-500">Documents</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In Progress + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* In Progress / Recent Work */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[280px]">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (data?.recentWork?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">No work in progress yet</p>
                  <Button asChild className="bg-[#A21CAF] hover:bg-[#86198F]">
                    <Link href="/judges/brief">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate your first brief
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {data!.recentWork.map((item) => (
                    <Link
                      key={item.id}
                      href={`/judges/${item.type}/${item.id}`}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className={
                            item.status === "in_review"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                              : item.status === "finalized"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                          }
                        >
                          {item.status === "in_review" ? "In Review" :
                           item.status === "finalized" ? "Finalized" :
                           item.status === "generating" ? "Generating" : item.status}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card data-tour="quick-actions">
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className="w-full justify-start h-12"
                  asChild
                >
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (data?.recentActivity?.length ?? 0) === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Your activity will appear here as you use the platform
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data!.recentActivity.map((item) => {
                  const Icon = entityIcons[item.entityType] || FileText;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{formatActivityText(item)}</p>
                        <p className="text-xs text-gray-400">{formatRelativeTime(item.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
