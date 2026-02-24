"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PageHeader } from "@/components/judges/shared/page-header";
import { CalendarEventCard } from "@/components/lawyers/shared/calendar-event-card";
import type { CalendarEvent } from "@/lib/types/lawyer-portal";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM

const typeColors: Record<string, string> = {
  Hearing: "bg-[#2563EB] text-white",
  Deadline: "bg-red-500 text-white",
  Meeting: "bg-emerald-500 text-white",
  Reminder: "bg-amber-500 text-white",
};

const typeDots: Record<string, string> = {
  Hearing: "bg-[#2563EB]",
  Deadline: "bg-red-500",
  Meeting: "bg-emerald-500",
  Reminder: "bg-amber-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const [events] = useState<CalendarEvent[]>([]);
  const [loading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(new Date());
  };

  const prevWeek = () => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() - 7);
    setSelectedDay(d);
    setCurrentDate(d);
  };
  const nextWeek = () => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() + 7);
    setSelectedDay(d);
    setCurrentDate(d);
  };

  const prevDay = () => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() - 1);
    setSelectedDay(d);
    setCurrentDate(d);
  };
  const nextDay = () => {
    const d = new Date(selectedDay);
    d.setDate(d.getDate() + 1);
    setSelectedDay(d);
    setCurrentDate(d);
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = formatDateStr(new Date());

  // Build calendar grid
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  const weekDates = getWeekDates(selectedDay);
  const selectedDayStr = formatDateStr(selectedDay);
  const selectedDayEvents = eventsByDate[selectedDayStr] || [];

  // Sort events for list view
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) =>
          new Date(a.date + "T" + a.startTime).getTime() -
          new Date(b.date + "T" + b.startTime).getTime()
      ),
    [events]
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        label="Practice Management"
        title="Calendar"
        actions={
          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            onClick={() => toast.success("Add Event dialog coming soon")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        }
      />

      <Tabs defaultValue="month">
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        {/* ─── Month View ─── */}
        <TabsContent value="month" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {monthName}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}
                {calendarCells.map((day, idx) => {
                  const dateStr = day
                    ? formatDate(year, month, day)
                    : "";
                  const dayEvents = dateStr ? eventsByDate[dateStr] || [] : [];
                  const isToday = dateStr === todayStr;

                  return (
                    <div
                      key={idx}
                      className={`bg-white min-h-[80px] p-1.5 ${
                        day
                          ? "cursor-pointer hover:bg-blue-50/50"
                          : "bg-gray-50"
                      }`}
                      onClick={() => {
                        if (day) {
                          setSelectedDay(new Date(year, month, day));
                        }
                      }}
                    >
                      {day && (
                        <>
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                              isToday
                                ? "bg-[#2563EB] text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {day}
                          </span>
                          {dayEvents.length > 0 && (
                            <div className="flex gap-0.5 mt-1 flex-wrap">
                              {dayEvents.slice(0, 3).map((ev) => (
                                <span
                                  key={ev.id}
                                  className={`h-1.5 w-1.5 rounded-full ${typeDots[ev.type] || typeDots.Reminder}`}
                                  title={ev.title}
                                />
                              ))}
                              {dayEvents.length > 3 && (
                                <span className="text-[10px] text-gray-400">
                                  +{dayEvents.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Week View ─── */}
        <TabsContent value="week" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Week of{" "}
                  {weekDates[0].toLocaleDateString("default", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  &ndash;{" "}
                  {weekDates[6].toLocaleDateString("default", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevWeek}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextWeek}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="overflow-auto">
                <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[700px]">
                  {/* Header row */}
                  <div className="border-b border-gray-200 p-2" />
                  {weekDates.map((d, i) => {
                    const isT = formatDateStr(d) === todayStr;
                    return (
                      <div
                        key={i}
                        className={`border-b border-l border-gray-200 p-2 text-center ${
                          isT ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="text-xs text-gray-500">{DAYS[i]}</div>
                        <div
                          className={`text-sm font-medium ${
                            isT ? "text-[#2563EB]" : "text-gray-900"
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      </div>
                    );
                  })}

                  {/* Time rows */}
                  {HOURS.map((hour) => (
                    <div key={hour} className="contents">
                      <div className="border-b border-gray-100 p-1 text-right pr-2">
                        <span className="text-[10px] text-gray-400">
                          {hour > 12
                            ? `${hour - 12} PM`
                            : hour === 12
                              ? "12 PM"
                              : `${hour} AM`}
                        </span>
                      </div>
                      {weekDates.map((d, i) => {
                        const dStr = formatDateStr(d);
                        const hourEvents = (eventsByDate[dStr] || []).filter(
                          (ev) => {
                            const h = parseInt(ev.startTime.split(":")[0], 10);
                            return h === hour;
                          }
                        );
                        return (
                          <div
                            key={i}
                            className="border-b border-l border-gray-100 min-h-[40px] p-0.5"
                          >
                            {hourEvents.map((ev) => (
                              <div
                                key={ev.id}
                                className={`text-[10px] px-1 py-0.5 rounded truncate mb-0.5 ${typeColors[ev.type] || typeColors.Reminder}`}
                                title={ev.title}
                              >
                                {ev.title}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Day View ─── */}
        <TabsContent value="day" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDay.toLocaleDateString("default", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={prevDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-0">
                {HOURS.map((hour) => {
                  const hourEvents = selectedDayEvents.filter((ev) => {
                    const h = parseInt(ev.startTime.split(":")[0], 10);
                    return h === hour;
                  });
                  return (
                    <div
                      key={hour}
                      className="flex border-b border-gray-100"
                    >
                      <div className="w-16 py-3 text-right pr-3 shrink-0">
                        <span className="text-xs text-gray-400">
                          {hour > 12
                            ? `${hour - 12} PM`
                            : hour === 12
                              ? "12 PM"
                              : `${hour} AM`}
                        </span>
                      </div>
                      <div className="flex-1 py-1 min-h-[48px] pl-3 border-l border-gray-200">
                        {hourEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className={`text-xs px-2 py-1.5 rounded mb-1 ${typeColors[ev.type] || typeColors.Reminder}`}
                          >
                            <span className="font-medium">{ev.title}</span>
                            <span className="ml-2 opacity-80">
                              {ev.startTime} - {ev.endTime}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── List View ─── */}
        <TabsContent value="list" className="mt-4 space-y-3">
          {sortedEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-gray-400">
                No upcoming events
              </CardContent>
            </Card>
          ) : (
            sortedEvents.map((ev) => (
              <div key={ev.id}>
                <CalendarEventCard event={ev} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
