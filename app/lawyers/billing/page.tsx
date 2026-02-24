"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/judges/shared/page-header";
import { InvoiceStatusBadge } from "@/components/lawyers/shared/invoice-status-badge";
import type { Invoice } from "@/lib/types/lawyer-portal";

export default function BillingPage() {
  const [invoices] = useState<Invoice[]>([]);
  const [loading] = useState(false);

  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((sum, i) => sum + i.total, 0);
    const collected = invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.total, 0);
    const outstanding = invoices
      .filter((i) => i.status === "Pending" || i.status === "Overdue")
      .reduce((sum, i) => sum + i.total, 0);
    return { totalBilled, collected, outstanding };
  }, [invoices]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        label="Practice Management"
        title="Billing"
        actions={
          <Button
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            onClick={() => toast.success("Create Invoice dialog coming soon")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total Billed
                </p>
                <p className="text-xl font-bold text-gray-900">
                  PKR {stats.totalBilled.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Collected
                </p>
                <p className="text-xl font-bold text-emerald-700">
                  PKR {stats.collected.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Outstanding
                </p>
                <p className="text-xl font-bold text-amber-700">
                  PKR {stats.outstanding.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent invoices table */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F] mb-4">
          Recent Invoices
        </h2>
        <Card>
          <CardContent className="pt-0 px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} className="cursor-pointer">
                    <TableCell>
                      <Link
                        href={`/lawyers/billing/${inv.id}`}
                        className="text-[#2563EB] hover:underline font-medium"
                      >
                        {inv.number}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      {inv.clientName}
                    </TableCell>
                    <TableCell className="text-gray-500">{inv.date}</TableCell>
                    <TableCell className="text-gray-500">
                      {inv.dueDate}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      PKR {inv.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
