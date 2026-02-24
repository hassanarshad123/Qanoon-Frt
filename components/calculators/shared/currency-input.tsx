"use client";

import { forwardRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
}

function formatWithCommas(num: number): string {
  if (isNaN(num) || num === 0) return "";
  return num.toLocaleString("en-PK");
}

function parseCommaNumber(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  function CurrencyInput({ value, onChange, label, error, className, ...props }, ref) {
    const [displayValue, setDisplayValue] = useState(
      value ? formatWithCommas(value) : ""
    );
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const numeric = parseCommaNumber(raw);
        setDisplayValue(raw.replace(/[^0-9,]/g, ""));
        onChange(numeric);
      },
      [onChange]
    );

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      setDisplayValue(value ? formatWithCommas(value) : "");
    }, [value]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      setDisplayValue(value ? formatWithCommas(value) : "");
    }, [value]);

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">
            Rs.
          </span>
          <Input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={cn("pl-10", error && "border-red-500", className)}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
