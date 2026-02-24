"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Receipt,
  CheckCircle2,
  Send,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceStatusBadge } from "@/components/lawyers/shared/invoice-status-badge";
import { ExportMenu } from "@/components/judges/shared/export-menu";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { Invoice } from "@/lib/types/lawyer-portal";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="h-48 bg-gray-100 animate-pulse rounded-xl" />
        <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/billing"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>
        <EmptyState
          icon={Receipt}
          title="Invoice not found"
          description="The invoice you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lawyers/billing"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Billing
      </Link>

      {/* Invoice header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-serif text-gray-900">
                  {invoice.number}
                </h1>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                <span>
                  Date: <span className="text-gray-700">{invoice.date}</span>
                </span>
                <span>
                  Due:{" "}
                  <span className="text-gray-700">{invoice.dueDate}</span>
                </span>
                <span>
                  Client:{" "}
                  <Link
                    href={`/lawyers/clients/${invoice.clientId}`}
                    className="text-[#2563EB] hover:underline"
                  >
                    {invoice.clientName}
                  </Link>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
                size="sm"
                onClick={() =>
                  toast.success(`Invoice ${invoice.number} marked as Paid`)
                }
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Paid
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success(`Invoice ${invoice.number} sent to client`)
                }
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <ExportMenu title={`Invoice ${invoice.number}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line items table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
            Line Items
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Description</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Rate (PKR)</TableHead>
                <TableHead className="text-right">Amount (PKR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.hours > 0 ? item.hours : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.rate > 0 ? item.rate.toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {item.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-xs ml-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-900">
                PKR {invoice.subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-medium text-gray-900">
                PKR {invoice.tax.toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <span className="text-base font-semibold text-gray-900">
                Total
              </span>
              <span className="text-lg font-bold text-gray-900">
                PKR {invoice.total.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
