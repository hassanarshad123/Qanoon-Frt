"use client";

import { ReactNode } from "react";
import { Eye, EyeOff, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CalculatorResultProps {
  label: string;
  value: string;
  subtitle?: string;
  children?: ReactNode;
  showBreakdown: boolean;
  onToggleBreakdown: () => void;
  onPrint: () => void;
  onReset: () => void;
}

export function CalculatorResult({
  label,
  value,
  subtitle,
  children,
  showBreakdown,
  onToggleBreakdown,
  onPrint,
  onReset,
}: CalculatorResultProps) {
  return (
    <Card className="border-t-4 border-t-[#059669] shadow-lg">
      <CardContent className="pt-8 pb-6 px-8">
        {/* Primary result */}
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-4xl font-bold text-[#059669]">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
          )}
        </div>

        {/* Additional result content (tables, charts, etc.) */}
        {children && <div className="mb-6">{children}</div>}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleBreakdown}
            className="gap-2"
          >
            {showBreakdown ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showBreakdown ? "Hide Breakdown" : "Show Breakdown"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Calculate Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
