"use client";

import Link from "next/link";
import {
  FileText, FilePen, Search, BookOpen, Scale, FileCheck,
  Library, BookMarked, FileStack, Building2, ClipboardList, Bell,
  Users, CalendarDays, FolderOpen, Receipt, HardDrive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  FileText, FilePen, Search, BookOpen, Scale, FileCheck,
  Library, BookMarked, FileStack, Building2, ClipboardList, Bell,
  Users, CalendarDays, FolderOpen, Receipt, HardDrive,
};

interface ToolCardProps {
  name: string;
  description: string;
  icon: string;
  href: string;
}

export function ToolCard({ name, description, icon, href }: ToolCardProps) {
  const Icon = iconMap[icon] || FileText;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
            <Button
              asChild
              size="sm"
              className="mt-3 bg-[#2563EB] hover:bg-[#1D4ED8] h-8 text-xs"
            >
              <Link href={href}>Open</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
