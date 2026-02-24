"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface HealthData {
  configured: boolean;
  status: string;
  services: { openai: string; qdrant: string };
  environment: string;
  responseTimeMs: number;
}

function statusColor(status: string) {
  if (status === "ok" || status === "connected") return "bg-green-100 text-green-800";
  if (status === "degraded") return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}

export function RAGHealthCheck() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rag/health");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err: any) {
      toast.error("Failed to check RAG health: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-[#A21CAF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-gray-500 text-center py-8">Failed to load health data.</p>;
  }

  if (!data.configured) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Badge className="bg-yellow-100 text-yellow-800">Not Configured</Badge>
            <p className="text-sm text-gray-500">
              RAG_BACKEND_URL is not set. The RAG backend is not connected.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">Backend Health</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchHealth}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Check Health
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Overall Status</p>
            <Badge className={statusColor(data.status)}>{data.status}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">OpenAI</p>
            <Badge className={statusColor(data.services.openai)}>
              {data.services.openai}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Qdrant</p>
            <Badge className={statusColor(data.services.qdrant)}>
              {data.services.qdrant}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Response Time</p>
            <p className="text-sm font-medium">{data.responseTimeMs}ms</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Environment</p>
            <p className="text-sm font-medium">{data.environment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
