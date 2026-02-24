"use client";

interface ColorSwatchProps {
  name: string;
  hex: string;
  className?: string;
}

export function ColorSwatch({ name, hex, className }: ColorSwatchProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`h-20 w-20 rounded-xl border border-gray-200 shadow-sm ${className ?? ""}`}
        style={{ backgroundColor: hex }}
      />
      <span className="text-sm font-medium text-gray-900">{name}</span>
      <span className="text-xs font-mono text-gray-500">{hex}</span>
    </div>
  );
}
