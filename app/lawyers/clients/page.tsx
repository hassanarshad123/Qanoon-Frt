"use client";

import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/judges/shared/page-header";
import { ClientCard } from "@/components/lawyers/shared/client-card";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { Client } from "@/lib/types/lawyer-portal";

export default function ClientsPage() {
  const [clients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading] = useState(false);

  const filtered = search
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      )
    : clients;

  return (
    <div className="space-y-8">
      <PageHeader
        label="Practice Management"
        title="Clients"
        actions={
          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            onClick={() => toast.success("Add Client dialog coming soon")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search clients by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No clients found"
          description="Try adjusting your search query to find the client you are looking for."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  );
}
