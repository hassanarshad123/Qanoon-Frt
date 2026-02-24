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
  calculators: "Calculators",
  inheritance: "Inheritance",
  limitation: "Limitation Period",
  zakat: "Zakat",
  "income-tax": "Income Tax",
  "withholding-tax": "Withholding Tax",
  "capital-gains-tax": "Capital Gains Tax",
  "sales-tax": "Sales Tax",
  "customs-duty": "Customs Duty",
  "tax-penalties": "Tax Penalties",
  damages: "Damages",
  iddat: "Iddat Period",
};

export function CalculatorBreadcrumbs() {
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
