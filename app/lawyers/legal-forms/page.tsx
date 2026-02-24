"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, Download, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/judges/shared/page-header";
import { EmptyState } from "@/components/judges/shared/empty-state";
import type { LegalForm, FormCategory } from "@/lib/types/lawyer-portal";

const categories: ("All" | FormCategory)[] = [
  "All",
  "Court Forms",
  "Agreements",
  "Notices",
  "Affidavits",
];

const categoryBadgeStyles: Record<FormCategory, string> = {
  "Court Forms": "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Agreements: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Notices: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  Affidavits: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

export default function LegalFormsPage() {
  const [forms] = useState<LegalForm[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | FormCategory>(
    "All"
  );
  const [loading] = useState(false);

  const filtered = useMemo(() => {
    return forms.filter((f) => {
      const term = search.toLowerCase();
      const matchSearch =
        !term ||
        f.title.toLowerCase().includes(term) ||
        f.description.toLowerCase().includes(term);
      const matchCategory =
        activeCategory === "All" || f.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [forms, search, activeCategory]);

  return (
    <div className="space-y-6">
      <PageHeader
        label="Database & Research"
        title="Legal Forms"
        description="Access standardized legal form templates for Pakistani courts and practice."
      />

      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            className={
              activeCategory === cat
                ? "bg-[#2563EB] hover:bg-[#1D4ED8]"
                : "hover:border-[#2563EB] hover:text-[#2563EB]"
            }
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search forms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500">
        {filtered.length} form{filtered.length !== 1 ? "s" : ""} found
      </p>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 animate-pulse">
              <FileText className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Loading forms...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No forms found"
          description="Try adjusting your search or category filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((form) => (
            <Card
              key={form.id}
              className="hover:shadow-md transition-shadow group"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                    {form.title}
                  </h3>
                  <Badge
                    className={`text-xs shrink-0 ${
                      categoryBadgeStyles[form.category]
                    }`}
                  >
                    {form.category}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {form.description}
                </p>

                <div className="flex items-center text-xs text-gray-400">
                  <Download className="h-3 w-3 mr-1" />
                  {form.downloadCount.toLocaleString()} downloads
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs hover:border-[#2563EB] hover:text-[#2563EB]"
                  asChild
                >
                  <Link href={`/lawyers/legal-forms/${form.id}`}>
                    View Template
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
