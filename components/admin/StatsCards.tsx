"use client";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminStats } from "@/lib/admin/types";

interface StatsCardsProps {
  stats: AdminStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { title: "Active Users", value: stats.activeUsers, icon: UserCheck, color: "text-green-600" },
    { title: "Inactive Users", value: stats.inactiveUsers, icon: UserX, color: "text-red-500" },
    { title: "New This Week", value: stats.newThisWeek, icon: UserPlus, color: "text-[#A21CAF]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              <Icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
