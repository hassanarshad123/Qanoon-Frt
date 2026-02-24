"use client";

import { useState } from "react";
import { FileText, PenTool, Search, Calculator, ArrowRight } from "lucide-react";

const features = [
  {
    id: "brief",
    icon: FileText,
    title: "Brief",
    description:
      "QanoonAI reads case files like a judicial clerk would — extracting facts, identifying issues, and presenting both parties' arguments neutrally. Upload 300 pages, receive a 5-page brief in minutes.",
  },
  {
    id: "draft",
    icon: PenTool,
    title: "Draft",
    description:
      "Generate court-ready petitions, contracts, and applications. The AI identifies applicable laws, retrieves precedents from 300,000+ judgments, and formats for Pakistani courts.",
  },
  {
    id: "research",
    icon: Search,
    title: "Research",
    description:
      "Describe your legal question in plain language. QanoonAI finds factually similar cases, analyzes ratio decidendi, and presents balanced authorities — with every citation verified.",
  },
  {
    id: "calculate",
    icon: Calculator,
    title: "Calculate",
    description:
      "17 deterministic legal calculators — inheritance, court fees, stamp duty, tax, limitation periods, and more. No AI, no guessing. Identical inputs, identical outputs. Every formula validated by legal consultants.",
  },
];

const BRIEF_LINE_WIDTHS = [72, 85, 60, 90, 55, 78, 65, 88, 70, 82];

function FeaturePreview({ activeFeature }: { activeFeature: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 md:p-8 h-full min-h-[400px] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {activeFeature === "brief" && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 w-32 h-44">
                <div className="space-y-2">
                  {BRIEF_LINE_WIDTHS.map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 bg-gray-200 rounded"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 bg-[#A21CAF] rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div className="h-2 w-16 bg-[#A21CAF]/20 rounded" />
                  </div>
                  <div className="bg-white border border-[#A21CAF]/20 rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500 mb-2">Case Brief Generated</div>
                    <div className="space-y-1.5">
                      <div className="h-1.5 bg-[#A21CAF]/20 rounded w-full" />
                      <div className="h-1.5 bg-[#A21CAF]/20 rounded w-4/5" />
                      <div className="h-1.5 bg-[#A21CAF]/20 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">300 pages → 5 page brief</div>
          </div>
        )}

        {activeFeature === "draft" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <PenTool className="w-4 h-4 text-[#A21CAF]" />
                <span className="text-sm font-medium text-gray-900">Civil Petition Draft</span>
              </div>
              <div className="space-y-2 mb-3">
                <div className="h-2 bg-gray-100 rounded w-full" />
                <div className="h-2 bg-gray-100 rounded w-5/6" />
                <div className="h-2 bg-[#A21CAF]/10 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-4/5" />
              </div>
              <div className="flex items-center gap-2 text-xs text-[#A21CAF]">
                <span className="w-1.5 h-1.5 bg-[#A21CAF] rounded-full animate-pulse" />
                Citing PLD 2023 SC 456...
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">Auto-formatted for Pakistani courts</div>
          </div>
        )}

        {activeFeature === "research" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-[#A21CAF]" />
                <span className="text-sm font-medium text-gray-900">Similar Cases Found</span>
              </div>
              <div className="space-y-2">
                {["PLD 2023 SC 456", "SCMR 2022 SC 891", "CLC 2021 LHC 234"].map((citation, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span className="text-gray-700">{citation}</span>
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">Search in plain Urdu or English</div>
          </div>
        )}

        {activeFeature === "calculate" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-[#A21CAF]" />
                <span className="text-sm font-medium text-gray-900">Court Fee Calculator</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Suit Value:</span>
                  <span className="text-gray-900">PKR 5,000,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Court Fee Rate:</span>
                  <span className="text-gray-900">1.5%</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-gray-700">Total Court Fee:</span>
                  <span className="text-[#A21CAF]">PKR 75,000</span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">100% deterministic, no AI guessing</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductSection() {
  const [activeFeature, setActiveFeature] = useState("brief");

  return (
    <section id="platform" className="w-full bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg
              className="w-4 h-4 text-[#84752F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
            </svg>
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              Platform
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            Free your law from paperwork.
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto">
            44 AI-powered tools for every legal need.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-0">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`w-full text-left py-6 transition-all duration-200 ${
                  index !== features.length - 1 ? "border-b border-gray-200" : ""
                } ${activeFeature === feature.id ? "" : "opacity-60 hover:opacity-100"}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      activeFeature === feature.id
                        ? "bg-[#A21CAF] text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xl font-semibold transition-colors ${
                          activeFeature === feature.id
                            ? "text-[#A21CAF]"
                            : "text-gray-900"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      {activeFeature === feature.id && (
                        <ArrowRight className="w-4 h-4 text-[#A21CAF]" />
                      )}
                    </div>
                    {activeFeature === feature.id && (
                      <p className="mt-3 text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-32">
            <FeaturePreview activeFeature={activeFeature} />
          </div>
        </div>
      </div>
    </section>
  );
}
