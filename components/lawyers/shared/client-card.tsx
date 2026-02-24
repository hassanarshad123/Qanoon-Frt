"use client";

import Link from "next/link";
import { User, Briefcase, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Client } from "@/lib/types/lawyer-portal";

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Link href={`/lawyers/clients/${client.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{client.name}</h3>
                <p className="text-xs text-gray-500">{client.phone}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" />
              <span>{client.caseIds.length} cases</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{client.lastActivity}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
