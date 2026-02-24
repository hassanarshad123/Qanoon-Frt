"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const labelMap: Record<string, string> = {
  lawyers: "Portal",
  "all-tools": "All Tools",
  brief: "Case Brief",
  petition: "Petition Drafter",
  research: "Legal Research",
  "case-finder": "Case Law Finder",
  "statute-analyzer": "Statute Analyzer",
  "contract-review": "Contract Review",
  "case-law": "Case Law Repository",
  statutes: "Statute Library",
  "legal-forms": "Legal Forms",
  "court-directory": "Court Directory",
  "case-tracker": "Case Tracker",
  amendments: "Amendment Alerts",
  settings: "Settings",
  clients: "Clients",
  calendar: "Calendar",
  documents: "Documents",
  billing: "Billing",
  files: "File Manager",
  profile: "Profile",
};

export function LawyerBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, idx) => ({
    label: labelMap[seg] || decodeURIComponent(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => (
          <BreadcrumbItem key={crumb.href}>
            {idx > 0 && <BreadcrumbSeparator />}
            {crumb.isLast ? (
              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link href={crumb.href}>{crumb.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
