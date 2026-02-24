"use client";

import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/lib/types/lawyer-portal";

const styles: Record<InvoiceStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Overdue: "bg-red-100 text-red-700 hover:bg-red-100",
  Draft: "bg-gray-100 text-gray-600 hover:bg-gray-100",
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return <Badge className={styles[status]}>{status}</Badge>;
}
