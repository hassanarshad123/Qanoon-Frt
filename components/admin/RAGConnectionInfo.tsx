"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InfoData {
  configured: boolean;
  backendUrl: string;
  timeoutMs: number;
  timeoutSeconds: number;
  healthEndpoint: string;
  chatEndpoint: string;
}

export function RAGConnectionInfo() {
  const [data, setData] = useState<InfoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const res = await fetch("/api/admin/rag/info");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setData(await res.json());
      } catch (err: any) {
        toast.error("Failed to load connection info: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-[#A21CAF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500 text-center py-8">Failed to load connection info.</p>;
  }

  const rows = [
    { label: "Configured", value: data.configured ? <Badge className="bg-green-100 text-green-800">Yes</Badge> : <Badge className="bg-red-100 text-red-800">No</Badge> },
    { label: "Backend URL", value: data.backendUrl },
    { label: "Timeout", value: `${data.timeoutSeconds}s (${data.timeoutMs}ms)` },
    { label: "Health Endpoint", value: data.healthEndpoint },
    { label: "Chat Endpoint", value: data.chatEndpoint },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Connection Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500">{row.label}</span>
              <span className="text-sm font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
