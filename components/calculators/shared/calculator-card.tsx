"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  Heart,
  Receipt,
  Percent,
  TrendingUp,
  ShoppingCart,
  Ship,
  AlertTriangle,
  Scale,
  Calendar,
  ArrowRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CalculatorMeta } from "@/lib/calculators/types";

const iconMap: Record<string, React.ElementType> = {
  Users,
  Clock,
  Heart,
  Receipt,
  Percent,
  TrendingUp,
  ShoppingCart,
  Ship,
  AlertTriangle,
  Scale,
  Calendar,
};

interface CalculatorCardProps {
  calculator: CalculatorMeta;
}

export function CalculatorCard({ calculator }: CalculatorCardProps) {
  const Icon = iconMap[calculator.icon] || Scale;
  const isActive = calculator.status === "active";

  const content = (
    <div
      className={cn(
        "group relative bg-white border border-gray-200 rounded-xl p-6 transition-all duration-200",
        isActive
          ? "hover:border-[#059669]/30 hover:shadow-lg hover:shadow-[#059669]/5 hover:-translate-y-1 cursor-pointer"
          : "opacity-70 cursor-default"
      )}
    >
      {!isActive && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            <Lock className="h-3 w-3" />
            Coming Soon
          </span>
        </div>
      )}
      <div
        className={cn(
          "inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4",
          isActive ? "bg-[#059669]/10" : "bg-gray-100"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            isActive
              ? "text-[#059669] group-hover:text-[#047857]"
              : "text-gray-400"
          )}
        />
      </div>
      <h3
        className={cn(
          "font-semibold text-gray-900 mb-1 transition-colors",
          isActive && "group-hover:text-[#059669]"
        )}
      >
        {calculator.name}
      </h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
        {calculator.description}
      </p>
      <p className="text-xs text-gray-400">{calculator.legalBasis}</p>
      {isActive && (
        <div className="mt-4 flex items-center text-sm font-medium text-[#059669] opacity-0 group-hover:opacity-100 transition-opacity">
          Open Calculator
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );

  if (isActive) {
    return <Link href={calculator.href}>{content}</Link>;
  }

  return content;
}
