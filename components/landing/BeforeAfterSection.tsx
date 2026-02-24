"use client";

import { Clock, Zap } from "lucide-react";

const comparisons = [
  {
    before: "Reading a 300-page case file: 3-4 hours",
    after: "AI-generated neutral case brief: 5 minutes",
  },
  {
    before: "Drafting a civil petition: 4-8 hours",
    after: "AI-drafted petition with citations: 45 minutes",
  },
  {
    before: "Researching applicable precedents: 2-3 hours",
    after: "Fact-aware search across 300,000 judgments: 30 seconds",
  },
  {
    before: "Calculating court fees: 30 minutes + errors",
    after: "Deterministic court fee calculator: 10 seconds, 100% accurate",
  },
  {
    before: "Understanding legal rights: PKR 5,000+ lawyer consultation",
    after: "Free legal guidance chatbot in Urdu: PKR 0",
  },
  {
    before: "Checking if a citation is still good law: Manual, unreliable",
    after: "Real-time citation verification: Instant, 99.9% accuracy",
  },
];

export default function BeforeAfterSection() {
  return (
    <section className="w-full bg-gray-50 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-[#84752F]" />
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              The Difference
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            The difference is measured in hours.
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-xl mx-auto">
            See how QanoonAI transforms every aspect of legal work.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-gray-100 rounded-2xl p-6 md:p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">
                  Without QanoonAI
                </h3>
                <p className="text-sm text-gray-500">The traditional way</p>
              </div>
            </div>
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg px-4 py-3 border border-gray-200 text-gray-600 text-sm md:text-base"
                >
                  {item.before}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#A21CAF]/5 to-[#A21CAF]/10 rounded-2xl p-6 md:p-8 border border-[#A21CAF]/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#A21CAF] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  With QanoonAI
                </h3>
                <p className="text-sm text-[#A21CAF]">The intelligent way</p>
              </div>
            </div>
            <div className="space-y-4">
              {comparisons.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg px-4 py-3 border border-[#A21CAF]/20 text-gray-900 text-sm md:text-base font-medium shadow-sm"
                >
                  {item.after}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
