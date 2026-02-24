"use client";

import { useState } from "react";
import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Download,
  Plus,
  Loader2,
  Mail,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ButtonsPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Components
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Buttons
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          All button variants, sizes, branded CTAs, icon buttons, loading
          states, and button groups.
        </p>
      </div>

      {/* 1. shadcn Variants */}
      <SectionBlock
        title="shadcn Variants"
        description="All six built-in button variants from the shadcn Button component."
        code={`<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </SectionBlock>

      {/* 2. Button Sizes */}
      <SectionBlock
        title="Button Sizes"
        description="Available size options: small, default, large, and icon."
        code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus className="h-4 w-4" /></Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </SectionBlock>

      {/* 3. Branded CTAs */}
      <SectionBlock
        title="Branded CTAs"
        description="QanoonAI-specific branded call-to-action buttons using custom colours."
        code={`<Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
  Get Started <ArrowRight className="ml-2 h-4 w-4" />
</Button>

<Button variant="outline" className="border-[#A21CAF] text-[#A21CAF] hover:bg-[#A21CAF]/10">
  Learn More
</Button>

<Button className="bg-[#2D1F2D] hover:bg-[#2D1F2D]/90 text-white">
  Header Action
</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button className="bg-[#A21CAF] hover:bg-[#86198F] text-white">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-[#A21CAF] text-[#A21CAF] hover:bg-[#A21CAF]/10"
          >
            Learn More
          </Button>
          <Button className="bg-[#2D1F2D] hover:bg-[#2D1F2D]/90 text-white">
            Header Action
          </Button>
        </div>
      </SectionBlock>

      {/* 4. Icon Buttons */}
      <SectionBlock
        title="Icon Buttons"
        description="Buttons paired with icons on the left, right, or as icon-only buttons."
        code={`<Button>
  <Mail className="mr-2 h-4 w-4" /> Login with Email
</Button>

<Button variant="outline">
  <Download className="mr-2 h-4 w-4" /> Download Report
</Button>

<Button>
  Next <ArrowRight className="ml-2 h-4 w-4" />
</Button>

<Button size="icon" variant="outline">
  <Search className="h-4 w-4" />
</Button>`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Login with Email
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </SectionBlock>

      {/* 5. Loading States */}
      <SectionBlock
        title="Loading States"
        description="Buttons with a spinning loader icon and disabled state. Click the second button to preview."
        code={`const [loading, setLoading] = useState(false);

{/* Always loading */}
<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>

{/* Toggle loading on click */}
{loading ? (
  <Button disabled>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Please wait
  </Button>
) : (
  <Button onClick={() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }}>
    Click me
  </Button>
)}`}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>

          {loading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 2000);
              }}
            >
              Click me
            </Button>
          )}
        </div>
      </SectionBlock>

      {/* 6. Button Group / Segmented Control */}
      <SectionBlock
        title="Button Group / Segmented Control"
        description="Buttons grouped together with shared borders to form a segmented control."
        code={`<div className="flex">
  <Button variant="outline" className="rounded-r-none">
    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
  </Button>
  <Button variant="outline" className="rounded-none border-x-0">
    Current
  </Button>
  <Button variant="outline" className="rounded-l-none">
    Next <ChevronRight className="ml-2 h-4 w-4" />
  </Button>
</div>`}
      >
        <div className="flex">
          <Button variant="outline" className="rounded-r-none">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button variant="outline" className="rounded-none border-x-0">
            Current
          </Button>
          <Button variant="outline" className="rounded-l-none">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </SectionBlock>
    </div>
  );
}
