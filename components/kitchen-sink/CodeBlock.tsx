"use client";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = "TSX" }: CodeBlockProps) {
  return (
    <div className="relative mt-4 rounded-xl bg-gray-950 p-5 overflow-x-auto">
      <span className="absolute top-3 right-4 text-[11px] font-mono uppercase tracking-wider text-gray-500">
        {language}
      </span>
      <pre className="text-sm leading-relaxed text-gray-300 font-mono whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}
