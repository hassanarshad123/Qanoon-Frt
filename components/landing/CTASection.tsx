"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #A21CAF 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
            Get Started
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6">
          Pakistan&apos;s legal system deserves better tools.
        </h2>

        <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Join the judges and lawyers already using QanoonAI to deliver justice
          faster, draft smarter, and research deeper.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button onClick={() => router.push('/onboarding')} className="group bg-[#A21CAF] hover:bg-[#86198F] text-white px-8 py-4 rounded-xl text-base font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#A21CAF]/25 hover:-translate-y-0.5">
            Get Started Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => router.push('/onboarding')} className="border border-gray-300 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:-translate-y-0.5">
            Request Institutional Demo
          </button>
        </div>

        <p className="text-sm text-gray-400">
          No credit card required for free tier. Institutional plans include
          training and onboarding.
        </p>
      </div>
    </section>
  );
}
