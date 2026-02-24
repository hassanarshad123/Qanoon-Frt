"use client";

import { SectionBlock } from "@/components/kitchen-sink/SectionBlock";

export default function TypographyPage() {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Design Tokens
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Typography
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Font families, heading scale, body text, weights, and text patterns
          used in QanoonAI.
        </p>
      </div>

      {/* 1. Font Families */}
      <SectionBlock
        title="Font Families"
        description="Inter (sans-serif) for UI text and Playfair Display (serif) for headings and emphasis."
        code={`{/* Inter — var(--font-inter) */}
<p className="font-sans text-2xl">
  The quick brown fox jumps over the lazy dog
</p>

{/* Playfair Display — var(--font-playfair) */}
<p className="font-serif italic text-2xl">
  The quick brown fox jumps over the lazy dog
</p>`}
      >
        <div className="space-y-6">
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
              Inter (sans) &mdash; <code className="text-xs">font-sans</code>{" "}
              / <code className="text-xs">var(--font-inter)</code>
            </span>
            <p className="font-sans text-2xl text-gray-900">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400">
              Playfair Display (serif) &mdash;{" "}
              <code className="text-xs">font-serif</code> /{" "}
              <code className="text-xs">var(--font-playfair)</code>
            </span>
            <p className="font-serif italic text-2xl text-gray-900">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* 2. Heading Scale */}
      <SectionBlock
        title="Heading Scale"
        description="H1 through H6 with classes matching the landing page hierarchy."
        code={`<h1 className="text-5xl lg:text-6xl font-bold font-serif">Justice, Reimagined</h1>
<h2 className="text-3xl lg:text-4xl font-bold font-serif">How QanoonAI Works</h2>
<h3 className="text-2xl font-bold font-serif">AI-Powered Legal Analysis</h3>
<h4 className="text-xl font-semibold">Case Management</h4>
<h5 className="text-lg font-semibold">Document Review</h5>
<h6 className="text-base font-semibold">Quick Actions</h6>`}
      >
        <div className="space-y-8">
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H1 &mdash;{" "}
              <code className="text-xs">
                text-5xl lg:text-6xl font-bold font-serif
              </code>
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold font-serif text-gray-900">
              Justice, Reimagined
            </h1>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H2 &mdash;{" "}
              <code className="text-xs">
                text-3xl lg:text-4xl font-bold font-serif
              </code>
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-gray-900">
              How QanoonAI Works
            </h2>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H3 &mdash;{" "}
              <code className="text-xs">text-2xl font-bold font-serif</code>
            </span>
            <h3 className="text-2xl font-bold font-serif text-gray-900">
              AI-Powered Legal Analysis
            </h3>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H4 &mdash;{" "}
              <code className="text-xs">text-xl font-semibold</code>
            </span>
            <h4 className="text-xl font-semibold text-gray-900">
              Case Management
            </h4>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H5 &mdash;{" "}
              <code className="text-xs">text-lg font-semibold</code>
            </span>
            <h5 className="text-lg font-semibold text-gray-900">
              Document Review
            </h5>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              H6 &mdash;{" "}
              <code className="text-xs">text-base font-semibold</code>
            </span>
            <h6 className="text-base font-semibold text-gray-900">
              Quick Actions
            </h6>
          </div>
        </div>
      </SectionBlock>

      {/* 3. Body Text Sizes */}
      <SectionBlock
        title="Body Text Sizes"
        description="Standard paragraph sizes from lead copy down to captions."
        code={`<p className="text-lg">Lead text (18px)</p>
<p className="text-base">Body text (16px)</p>
<p className="text-sm">Small text (14px)</p>
<p className="text-xs">Caption text (12px)</p>`}
      >
        <div className="space-y-6">
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              <code className="text-xs">text-lg</code> (18px lead)
            </span>
            <p className="text-lg text-gray-700">
              QanoonAI combines 300,000+ Pakistani court judgments with
              cutting-edge artificial intelligence to deliver instant legal
              research, case analysis, and document drafting for legal
              professionals across Pakistan.
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              <code className="text-xs">text-base</code> (16px body)
            </span>
            <p className="text-base text-gray-700">
              QanoonAI combines 300,000+ Pakistani court judgments with
              cutting-edge artificial intelligence to deliver instant legal
              research, case analysis, and document drafting for legal
              professionals across Pakistan.
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              <code className="text-xs">text-sm</code> (14px small)
            </span>
            <p className="text-sm text-gray-700">
              QanoonAI combines 300,000+ Pakistani court judgments with
              cutting-edge artificial intelligence to deliver instant legal
              research, case analysis, and document drafting for legal
              professionals across Pakistan.
            </p>
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-gray-400">
              <code className="text-xs">text-xs</code> (12px caption)
            </span>
            <p className="text-xs text-gray-700">
              QanoonAI combines 300,000+ Pakistani court judgments with
              cutting-edge artificial intelligence to deliver instant legal
              research, case analysis, and document drafting for legal
              professionals across Pakistan.
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* 4. Font Weights */}
      <SectionBlock
        title="Font Weights"
        description="Available font weights from light to extra-bold."
        code={`<span className="font-light">QanoonAI</span>     {/* 300 */}
<span className="font-normal">QanoonAI</span>    {/* 400 */}
<span className="font-medium">QanoonAI</span>    {/* 500 */}
<span className="font-semibold">QanoonAI</span>  {/* 600 */}
<span className="font-bold">QanoonAI</span>      {/* 700 */}
<span className="font-extrabold">QanoonAI</span> {/* 800 */}`}
      >
        <div className="space-y-4">
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-light</code> (300)
            </span>
            <span className="font-light text-2xl text-gray-900">QanoonAI</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-normal</code> (400)
            </span>
            <span className="font-normal text-2xl text-gray-900">
              QanoonAI
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-medium</code> (500)
            </span>
            <span className="font-medium text-2xl text-gray-900">
              QanoonAI
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-semibold</code> (600)
            </span>
            <span className="font-semibold text-2xl text-gray-900">
              QanoonAI
            </span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-bold</code> (700)
            </span>
            <span className="font-bold text-2xl text-gray-900">QanoonAI</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="w-36 text-xs font-medium text-gray-400">
              <code>font-extrabold</code> (800)
            </span>
            <span className="font-extrabold text-2xl text-gray-900">
              QanoonAI
            </span>
          </div>
        </div>
      </SectionBlock>

      {/* 5. Section Label Pattern */}
      <SectionBlock
        title="Section Label Pattern"
        description="The gold label + heading + description pattern used across landing page sections."
        code={`<span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
  Section Label
</span>
<h2 className="mt-2 text-3xl font-bold font-serif text-gray-900">
  Heading Text
</h2>
<p className="mt-2 text-gray-500">
  Supporting description text goes here.
</p>`}
      >
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
            Section Label
          </span>
          <h2 className="mt-2 text-3xl font-bold font-serif text-gray-900">
            Heading Text
          </h2>
          <p className="mt-2 text-gray-500">
            Supporting description text goes here.
          </p>
        </div>
      </SectionBlock>

      {/* 6. Italic Serif */}
      <SectionBlock
        title="Italic Serif"
        description="Italic serif text used for quotes and emphasis throughout the product."
        code={`<p className="font-serif italic text-xl text-gray-700">
  &ldquo;The law is reason, free from passion.&rdquo; &mdash; Aristotle
</p>`}
      >
        <p className="font-serif italic text-xl text-gray-700">
          &ldquo;The law is reason, free from passion.&rdquo; &mdash; Aristotle
        </p>
      </SectionBlock>

      {/* 7. Stat Numbers */}
      <SectionBlock
        title="Stat Numbers"
        description="Large stat number pattern used for key metrics and social proof."
        code={`<div className="text-center">
  <span className="text-4xl font-bold text-[#A21CAF]">300,000+</span>
  <p className="text-sm text-gray-500">Court Judgments</p>
</div>`}
      >
        <div className="flex items-start justify-around">
          <div className="text-center">
            <span className="text-4xl font-bold text-[#A21CAF]">300,000+</span>
            <p className="mt-1 text-sm text-gray-500">Court Judgments</p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-[#A21CAF]">50+</span>
            <p className="mt-1 text-sm text-gray-500">Legal Domains</p>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-[#A21CAF]">99.2%</span>
            <p className="mt-1 text-sm text-gray-500">Accuracy Rate</p>
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}
