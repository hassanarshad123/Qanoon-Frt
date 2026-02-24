"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  suffix?: string;
  min?: number;
  max?: number;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  function NumberInput(
    { value, onChange, label, error, suffix, min, max, className, ...props },
    ref
  ) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (raw === "") {
        onChange(0);
        return;
      }
      const numeric = parseFloat(raw);
      if (isNaN(numeric)) return;
      if (min !== undefined && numeric < min) return;
      if (max !== undefined && numeric > max) return;
      onChange(numeric);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            type="number"
            value={value || ""}
            onChange={handleChange}
            min={min}
            max={max}
            className={cn(
              suffix && "pr-12",
              error && "border-red-500",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
