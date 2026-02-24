"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminStats, type AdminUser } from "@/lib/api/admin";
import { StatsCards } from "@/components/admin/StatsCards";
import { RoleChart } from "@/components/admin/RoleChart";
import { RecentUsersTable } from "@/components/admin/RecentUsersTable";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, u] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers({ page: 1, pageSize: 10 }),
        ]);
        setStats(s);
        setRecentUsers(u.users);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#A21CAF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-gray-500 text-center py-12">Failed to load dashboard data.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoleChart data={stats.byRole} />
        <RecentUsersTable users={recentUsers} />
      </div>
    </div>
  );
}
