"use client";

import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import { ColorSwatch } from "@/components/kitchen-sink/ColorSwatch";

export default function ColorsPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Design Tokens
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Colors
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Brand colors, gray scale, semantic tokens, gradients, shadows, and CSS
          variables powering QanoonAI.
        </p>
      </div>

      {/* Brand Colors */}
      <SectionBlock
        title="Brand Colors"
        description="Core brand palette used across the QanoonAI design system."
        code={`<div className="flex flex-wrap gap-6">
  <ColorSwatch name="Primary Purple" hex="#A21CAF" />
  <ColorSwatch name="Purple Dark" hex="#86198F" />
  <ColorSwatch name="Gold" hex="#84752F" />
  <ColorSwatch name="Dark Plum" hex="#2D1F2D" />
</div>`}
      >
        <div className="flex flex-wrap gap-6">
          <ColorSwatch name="Primary Purple" hex="#A21CAF" />
          <ColorSwatch name="Purple Dark" hex="#86198F" />
          <ColorSwatch name="Gold" hex="#84752F" />
          <ColorSwatch name="Dark Plum" hex="#2D1F2D" />
        </div>
      </SectionBlock>

      {/* Gray Scale */}
      <SectionBlock
        title="Gray Scale"
        description="Neutral gray tones used for text, backgrounds, borders, and subtle UI elements."
        code={`<div className="flex flex-wrap gap-6">
  <ColorSwatch name="White" hex="#FFFFFF" />
  <ColorSwatch name="Gray 50" hex="#F9FAFB" />
  <ColorSwatch name="Gray 100" hex="#F3F4F6" />
  <ColorSwatch name="Gray 200" hex="#E5E7EB" />
  <ColorSwatch name="Gray 300" hex="#D1D5DB" />
  <ColorSwatch name="Gray 400" hex="#9CA3AF" />
  <ColorSwatch name="Gray 500" hex="#6B7280" />
  <ColorSwatch name="Gray 600" hex="#4B5563" />
  <ColorSwatch name="Gray 700" hex="#374151" />
  <ColorSwatch name="Gray 800" hex="#1F2937" />
  <ColorSwatch name="Gray 900" hex="#111827" />
  <ColorSwatch name="Gray 950" hex="#030712" />
</div>`}
      >
        <div className="flex flex-wrap gap-6">
          <ColorSwatch name="White" hex="#FFFFFF" />
          <ColorSwatch name="Gray 50" hex="#F9FAFB" />
          <ColorSwatch name="Gray 100" hex="#F3F4F6" />
          <ColorSwatch name="Gray 200" hex="#E5E7EB" />
          <ColorSwatch name="Gray 300" hex="#D1D5DB" />
          <ColorSwatch name="Gray 400" hex="#9CA3AF" />
          <ColorSwatch name="Gray 500" hex="#6B7280" />
          <ColorSwatch name="Gray 600" hex="#4B5563" />
          <ColorSwatch name="Gray 700" hex="#374151" />
          <ColorSwatch name="Gray 800" hex="#1F2937" />
          <ColorSwatch name="Gray 900" hex="#111827" />
          <ColorSwatch name="Gray 950" hex="#030712" />
        </div>
      </SectionBlock>

      {/* Semantic Colors */}
      <SectionBlock
        title="Semantic Colors"
        description="Colors that convey meaning — success, error, warning, and informational states."
        code={`<div className="flex flex-wrap gap-6">
  <div className="flex flex-col items-center gap-2">
    <div className="h-20 w-32 rounded-xl bg-emerald-500" />
    <span className="text-sm font-medium text-gray-900">Success</span>
    <span className="text-xs font-mono text-gray-500">#10B981</span>
  </div>
  ...
</div>`}
      >
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-32 rounded-xl bg-emerald-500" />
            <span className="text-sm font-medium text-gray-900">Success</span>
            <span className="text-xs font-mono text-gray-500">#10B981</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-32 rounded-xl bg-red-500" />
            <span className="text-sm font-medium text-gray-900">Error</span>
            <span className="text-xs font-mono text-gray-500">#EF4444</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-32 rounded-xl bg-amber-500" />
            <span className="text-sm font-medium text-gray-900">Warning</span>
            <span className="text-xs font-mono text-gray-500">#F59E0B</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-32 rounded-xl bg-blue-500" />
            <span className="text-sm font-medium text-gray-900">Info</span>
            <span className="text-xs font-mono text-gray-500">#3B82F6</span>
          </div>
        </div>
      </SectionBlock>

      {/* Gradients */}
      <SectionBlock
        title="Gradients"
        description="Linear gradients used for hero sections, cards, and accent elements."
        code={`<div className="space-y-4">
  <div className="h-24 rounded-xl bg-gradient-to-r from-[#A21CAF] to-[#86198F]" />
  <div className="h-24 rounded-xl bg-gradient-to-r from-[#84752F] to-[#A68B3C]" />
  <div className="h-24 rounded-xl bg-gradient-to-r from-[#2D1F2D] to-[#111827]" />
</div>`}
      >
        <div className="space-y-4">
          <div>
            <div className="h-24 rounded-xl bg-gradient-to-r from-[#A21CAF] to-[#86198F]" />
            <p className="mt-2 text-sm text-gray-500">
              Purple gradient &mdash;{" "}
              <span className="font-mono">from-[#A21CAF] to-[#86198F]</span>
            </p>
          </div>
          <div>
            <div className="h-24 rounded-xl bg-gradient-to-r from-[#84752F] to-[#A68B3C]" />
            <p className="mt-2 text-sm text-gray-500">
              Gold gradient &mdash;{" "}
              <span className="font-mono">from-[#84752F] to-[#A68B3C]</span>
            </p>
          </div>
          <div>
            <div className="h-24 rounded-xl bg-gradient-to-r from-[#2D1F2D] to-[#111827]" />
            <p className="mt-2 text-sm text-gray-500">
              Dark gradient &mdash;{" "}
              <span className="font-mono">from-[#2D1F2D] to-[#111827]</span>
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* Shadow Scale */}
      <SectionBlock
        title="Shadow Scale"
        description="Tailwind shadow utilities used for elevation and depth throughout the UI."
        code={`<div className="flex flex-wrap gap-6">
  <div className="h-20 w-20 rounded-xl bg-white shadow-sm" />
  <div className="h-20 w-20 rounded-xl bg-white shadow" />
  <div className="h-20 w-20 rounded-xl bg-white shadow-md" />
  <div className="h-20 w-20 rounded-xl bg-white shadow-lg" />
  <div className="h-20 w-20 rounded-xl bg-white shadow-xl" />
  <div className="h-20 w-20 rounded-xl bg-white shadow-2xl" />
</div>`}
      >
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow-sm" />
            <span className="text-xs font-mono text-gray-500">shadow-sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow" />
            <span className="text-xs font-mono text-gray-500">shadow</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow-md" />
            <span className="text-xs font-mono text-gray-500">shadow-md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow-lg" />
            <span className="text-xs font-mono text-gray-500">shadow-lg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow-xl" />
            <span className="text-xs font-mono text-gray-500">shadow-xl</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-xl bg-white shadow-2xl" />
            <span className="text-xs font-mono text-gray-500">shadow-2xl</span>
          </div>
        </div>
      </SectionBlock>

      {/* CSS Variables */}
      <SectionBlock
        title="CSS Variables"
        description="Custom properties defined in globals.css that power the theming layer."
        code={`:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  --muted: 0 0% 96.1%;
  --accent: 0 0% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --qanoon-magenta: #A21CAF;
  --qanoon-magenta-hover: #86198F;
}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-6 font-semibold text-gray-900">
                  Variable
                </th>
                <th className="py-2 pr-6 font-semibold text-gray-900">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--background</td>
                <td className="py-2 pr-6">0 0% 100%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--foreground</td>
                <td className="py-2 pr-6">0 0% 3.9%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--primary</td>
                <td className="py-2 pr-6">0 0% 9%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--secondary</td>
                <td className="py-2 pr-6">0 0% 96.1%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--muted</td>
                <td className="py-2 pr-6">0 0% 96.1%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--accent</td>
                <td className="py-2 pr-6">0 0% 96.1%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--destructive</td>
                <td className="py-2 pr-6">0 84.2% 60.2%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--border</td>
                <td className="py-2 pr-6">0 0% 89.8%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--ring</td>
                <td className="py-2 pr-6">0 0% 3.9%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 pr-6">--qanoon-magenta</td>
                <td className="py-2 pr-6">#A21CAF</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">--qanoon-magenta-hover</td>
                <td className="py-2 pr-6">#86198F</td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionBlock>
    </div>
  );
}
