"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="w-full bg-white min-h-[90vh] flex flex-col justify-center relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center pt-24 md:pt-32 lg:pt-40 pb-16">
        <h1
          className={`font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="italic">Pakistan's Law. </span>
          <span className="italic text-[#A21CAF] relative whitespace-nowrap">
            Finally Intelligent
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1"
                stroke="#A21CAF"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
            </svg>
          </span>
          <span className="text-[#A21CAF]">.</span>
          <br />
          <span className="block mt-2">Every Judgment. Every Statute. Every Answer</span>
        </h1>

        <p
          className={`mt-10 md:mt-12 text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          QanoonAI combines 300,000+ Pakistani court judgments with AI to give
          judges neutral case briefs, lawyers instant drafting, and citizens
          free legal guidance — with{" "}
          <span className="text-gray-900 font-semibold">
            99.9% citation accuracy
          </span>
          .
        </p>

        <div
          className={`mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button onClick={() => router.push('/onboarding')} className="group bg-[#A21CAF] hover:bg-[#86198F] text-white px-8 py-4 rounded-xl text-base font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#A21CAF]/25 hover:-translate-y-0.5">
            Explore Platform
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button onClick={() => router.push('/onboarding')} className="border border-gray-300 bg-white text-gray-900 px-8 py-4 rounded-xl text-base font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:-translate-y-0.5">
            Request Demo
          </button>
        </div>

        <div
          className={`mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm text-gray-400 transition-all duration-700 delay-[400ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#A21CAF] rounded-full" />
            300,000+ Judgments
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#A21CAF] rounded-full" />
            44 AI Tools
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#A21CAF] rounded-full" />
            99.9% Accuracy
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#A21CAF] rounded-full" />
            Urdu & English
          </span>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
