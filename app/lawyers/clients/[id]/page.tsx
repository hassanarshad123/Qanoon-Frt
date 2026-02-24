"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Scale,
  FileText,
  Receipt,
  StickyNote,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceStatusBadge } from "@/components/lawyers/shared/invoice-status-badge";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type {
  Client,
  TrackedCase,
  LawyerDocument,
  Invoice,
} from "@/lib/types/lawyer-portal";

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
  Closed: "bg-gray-100 text-gray-600",
  Adjourned: "bg-orange-100 text-orange-700",
  Disposed: "bg-gray-100 text-gray-500",
  Reserved: "bg-purple-100 text-purple-700",
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [cases, setCases] = useState<TrackedCase[]>([]);
  const [documents, setDocuments] = useState<LawyerDocument[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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

  if (!client) {
    return (
      <div className="space-y-6">
        <Link
          href="/lawyers/clients"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
        <EmptyState
          icon={User}
          title="Client not found"
          description="The client you are looking for does not exist or has been removed."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/lawyers/clients"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Clients
      </Link>

      {/* Client Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-full bg-[#2563EB]/10 flex items-center justify-center shrink-0">
              <User className="h-7 w-7 text-[#2563EB]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-serif text-gray-900">
                {client.name}
              </h1>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-400" />
                  <span>{client.cnic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{client.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">
            <Scale className="h-4 w-4 mr-1.5" />
            Cases ({cases.length})
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-1.5" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Receipt className="h-4 w-4 mr-1.5" />
            Billing ({invoices.length})
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="h-4 w-4 mr-1.5" />
            Notes
          </TabsTrigger>
        </TabsList>

        {/* Cases Tab */}
        <TabsContent value="cases" className="mt-4">
          {cases.length === 0 ? (
            <EmptyState
              icon={Scale}
              title="No cases"
              description="This client does not have any tracked cases yet."
            />
          ) : (
            <div className="space-y-3">
              {cases.map((tc) => (
                <Link
                  key={tc.id}
                  href={`/lawyers/case-tracker/${tc.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {tc.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {tc.caseNumber} &middot; {tc.court}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              statusColors[tc.status] || statusColors.Active
                            }
                          >
                            {tc.status}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            Next: {tc.nextDate}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-4">
          {documents.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No documents"
              description="No documents have been uploaded for this client yet."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <Link
                        href={`/lawyers/documents/${doc.id}`}
                        className="text-[#2563EB] hover:underline font-medium"
                      >
                        {doc.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{doc.type}</Badge>
                    </TableCell>
                    <TableCell>{doc.pages}</TableCell>
                    <TableCell>{doc.fileSize}</TableCell>
                    <TableCell className="text-gray-500">
                      {doc.uploadedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="mt-4">
          {invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No invoices"
              description="No invoices have been generated for this client yet."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Link
                        href={`/lawyers/billing/${inv.id}`}
                        className="text-[#2563EB] hover:underline font-medium"
                      >
                        {inv.number}
                      </Link>
                    </TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.dueDate}</TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      PKR {inv.total.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-700">
                Client Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {client.notes || "No notes recorded for this client."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
