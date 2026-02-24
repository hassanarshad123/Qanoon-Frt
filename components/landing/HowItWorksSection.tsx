"use client";

import { Sparkles, Database, Cpu, CheckCircle2 } from "lucide-react";

function DocumentDiagram() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative" style={{ perspective: "800px" }}>
        <div
          className="w-64 h-48 mx-auto bg-gradient-to-br from-[#F5F5DC] to-[#E8E4C9] rounded-xl border border-[#D4D0B8] shadow-lg"
          style={{
            transform: "rotateX(20deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => {
              const hasMarker = [5, 9, 10, 14].includes(i);
              return (
                <div
                  key={i}
                  className="rounded border border-[#C4C0A8] bg-white/50"
                >
                  {hasMarker && (
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#84CC16] rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="w-72 h-52 mx-auto -mt-8 bg-gradient-to-br from-[#F5F5DC] to-[#E8E4C9] rounded-xl border border-[#D4D0B8] shadow-lg relative"
          style={{
            transform: "rotateX(20deg) translateZ(20px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="absolute inset-4">
            <div className="grid grid-cols-3 gap-3 h-full">
              <div className="space-y-2">
                <div className="h-8 bg-white/60 rounded border border-[#C4C0A8] flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#A21CAF] rounded opacity-60" />
                </div>
                <div className="flex-1 bg-white/60 rounded border border-[#C4C0A8] h-20" />
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-white/60 rounded border border-[#C4C0A8]" />
                <div className="h-16 bg-white/60 rounded border border-[#C4C0A8] relative">
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-[#F59E0B] rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-white/60 rounded border border-[#C4C0A8]" />
                <div className="h-6 bg-white/60 rounded border border-[#C4C0A8]" />
                <div className="h-10 bg-white/60 rounded border border-[#C4C0A8] relative">
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Retrieve from real judgments",
    description:
      "Your query is converted to a semantic embedding and matched against 300,000+ Pakistani court judgments. The top relevant cases are retrieved — not generated, not guessed.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "AI generates with citations",
    description:
      "Our AI engine synthesizes the retrieved judgments into structured, useful output — briefs, drafts, research memos — with every claim linked to a real source.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Citations verified before display",
    description:
      "Every case citation is checked against our database in real-time. Non-existent citations are rejected. You see only verified, accurate legal references.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-gray-50 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#84752F]" />
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              How it works
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            Built to reason the way lawyers do.
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
            QanoonAI&apos;s RAG pipeline combines retrieval from 300,000+ real
            judgments with AI generation for accurate, citation-backed legal
            assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex gap-6 ${index !== steps.length - 1 ? "pb-8 border-b border-gray-200" : ""}`}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <step.icon className="w-5 h-5 text-[#A21CAF]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-[#A21CAF] bg-[#A21CAF]/10 px-2 py-1 rounded">
                      {step.number}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <DocumentDiagram />
          </div>
        </div>
      </div>
    </section>
  );
}
