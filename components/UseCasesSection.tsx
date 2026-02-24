"use client";

import { useState } from "react";
import { Gavel, Briefcase, Users, Building2, ArrowRight } from "lucide-react";

const userTypes = [
  { id: "judges", label: "Judges", icon: Gavel },
  { id: "lawyers", label: "Lawyers", icon: Briefcase },
  { id: "citizens", label: "Citizens", icon: Users },
  { id: "firms", label: "Firms & Institutions", icon: Building2 },
];

const useCaseContent: Record<string, { smallLabel: string; title: string; description: string; cta: string; href: string }> = {
  judges: {
    smallLabel: "Judicial Intelligence",
    title: "For Judges",
    description:
      "Upload a 300-page case file and receive a neutral 5-page brief in minutes. AI-powered research that presents authorities from both sides. Judgment structuring assistance that helps with format — never with decisions. A private, isolated workspace with zero advocacy influence.",
    cta: "Explore Judicial Tools",
    href: "https://www.zensbots.site/judges",
  },
  lawyers: {
    smallLabel: "Legal Practice",
    title: "For Lawyers",
    description:
      "Draft petitions in 45 minutes instead of 6 hours. Research across 300,000+ judgments with AI that understands legal concepts, not just keywords. Manage your practice with a digital diary, file management, and limitation tracking — all in one platform.",
    cta: "Explore Lawyer Tools",
    href: "https://www.zensbots.site/lawyers",
  },
  citizens: {
    smallLabel: "Public Access",
    title: "For Everyone",
    description:
      "Free legal guidance in Urdu and English. Understand your rights as a tenant, employee, consumer, or family member. Simplify complex court decisions into plain language. Access 17 legal calculators for inheritance, court fees, tax, and more — completely free.",
    cta: "Access Free Tools",
    href: "https://www.zensbots.site/calculators",
  },
  firms: {
    smallLabel: "Enterprise",
    title: "For Firms & Courts",
    description:
      "Custom integrations, dedicated support, and institutional onboarding for law firms and judicial offices. API access for bulk operations. Complete data isolation for judicial institutions. Training and change management included.",
    cta: "Contact Us",
    href: "#",
  },
};

function LegalDataPreview() {
  return (
    <div className="bg-[#FEF3C7] rounded-lg p-6 h-full min-h-[300px]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-[#84752F] rounded flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
            ))}
          </div>
        </div>
        <span className="bg-[#84752F] text-white text-xs px-2 py-1 rounded font-mono">
          Case Brief
        </span>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-6 text-xs">
          <div className="p-2 bg-gray-50 border-b border-r border-gray-200 text-gray-500" />
          {["Citation", "Court", "Year", "Subject", "Ratio"].map((col) => (
            <div
              key={col}
              className="p-2 bg-gray-50 border-b border-r border-gray-200 text-gray-500 text-center text-[10px]"
            >
              {col}
            </div>
          ))}
        </div>
        {[
          ["PLD 2019", "SC", "2019", "Contract", "Binding"],
          ["SCMR 452", "SC", "2021", "Property", "Valid"],
          ["CLC 891", "HC", "2022", "Family", "Upheld"],
        ].map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 text-xs">
            <div className="p-2 bg-gray-50 border-b border-r border-gray-200 text-gray-500 text-center">
              {rowIndex + 1}
            </div>
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className="p-2 border-b border-r border-gray-200 text-gray-700 text-[10px]"
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UseCasesSection() {
  const [activeUserType, setActiveUserType] = useState("judges");

  return (
    <section className="w-full bg-white py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <svg className="w-4 h-4 text-[#84752F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-[#84752F] text-sm font-medium">Who it&apos;s for</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight">
            Built for everyone in
            <br />
            Pakistan&apos;s legal system.
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
            From the bench to the bar to the public — every user
            <br />
            gets tools designed for their exact needs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {userTypes.map((userType) => (
            <button
              key={userType.id}
              onClick={() => setActiveUserType(userType.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeUserType === userType.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <userType.icon className="w-4 h-4" />
              {userType.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 lg:p-12">
              <p className="text-[#84752F] text-sm font-medium mb-2">{useCaseContent[activeUserType].smallLabel}</p>
              <h3 className="font-serif text-3xl md:text-4xl text-gray-900 mb-6">
                {useCaseContent[activeUserType].title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                {useCaseContent[activeUserType].description}
              </p>
              <a href={useCaseContent[activeUserType].href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors">
                {useCaseContent[activeUserType].cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="p-8 lg:p-12">
              <LegalDataPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
