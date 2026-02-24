"use client";

import { CodeBlock } from "./CodeBlock";

interface SectionBlockProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
}

export function SectionBlock({ title, description, code, children }: SectionBlockProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {children}
      </div>
      <CodeBlock code={code} />
    </div>
  );
}
