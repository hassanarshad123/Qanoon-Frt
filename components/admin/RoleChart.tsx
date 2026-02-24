"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RoleChartProps {
  data: { role: string; count: number }[];
}

const COLORS: Record<string, string> = {
  lawyer: "#2563EB",
  judge: "#A21CAF",
  admin: "#059669",
  unassigned: "#9CA3AF",
};

export function RoleChart({ data }: RoleChartProps) {
  const chartData = data.map((d) => ({
    name: d.role.charAt(0).toUpperCase() + d.role.slice(1),
    value: d.count,
    color: COLORS[d.role] || "#6B7280",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Users by Role</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
