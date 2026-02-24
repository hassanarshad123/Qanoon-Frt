"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    monthlyPrice: "PKR 0",
    annualPrice: "PKR 0",
    period: "forever",
    subtitle: "For citizens & students",
    features: [
      "5 tool uses per day",
      "Legal guidance chatbot",
      "Know Your Rights portal",
      "All 17 calculators",
      "Case law simplifier",
      "Basic search",
    ],
    cta: "Get Started",
    popular: false,
    highlight: false,
  },
  {
    name: "Professional",
    monthlyPrice: "PKR 2,999",
    annualPrice: "PKR 2,499",
    period: "month",
    subtitle: "For practicing lawyers",
    features: [
      "Everything in Free, plus:",
      "Unlimited AI tools",
      "AI legal drafting",
      "Full research agent",
      "300,000+ judgment database",
      "Notice analysis",
      "Case strategy advisor",
      "Practice management",
      "Priority support",
    ],
    cta: "Start 7-Day Free Trial",
    popular: true,
    highlight: true,
  },
  {
    name: "Professional Plus",
    monthlyPrice: "PKR 4,999",
    annualPrice: "PKR 4,166",
    period: "month",
    subtitle: "For senior lawyers & firms",
    features: [
      "Everything in Professional, plus:",
      "API access",
      "Bulk document processing",
      "Advanced analytics",
      "Priority AI processing",
      "Dedicated support",
    ],
    cta: "Start Free Trial",
    popular: false,
    highlight: false,
  },
  {
    name: "Institutional",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    period: "pricing",
    subtitle: "For courts & judicial offices",
    features: [
      "Complete judicial workspace",
      "Isolated infrastructure",
      "Judicial identity verification",
      "Custom onboarding & training",
      "Dedicated support team",
      "Compliance certification",
    ],
    cta: "Contact Us",
    popular: false,
    highlight: false,
  },
];

export default function PricingSection() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="w-full bg-gray-50 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              Pricing
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            Plans for every legal professional.
          </h2>
          <p className="mt-6 text-gray-500 text-lg">
            Start free. Upgrade when you need more.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                isAnnual ? "bg-[#A21CAF]" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  isAnnual ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? "text-gray-900" : "text-gray-500"}`}
            >
              Annual
              <span className="ml-2 text-xs text-[#A21CAF] font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl p-6 transition-all duration-200 ${
                plan.highlight
                  ? "border-2 border-[#A21CAF] shadow-xl shadow-[#A21CAF]/10 scale-[1.02] lg:scale-[1.03]"
                  : "border border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="bg-[#A21CAF] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.subtitle}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  {plan.period !== "pricing" && (
                    <span className="text-gray-500 text-sm">
                      / {plan.period}
                    </span>
                  )}
                </div>
                {isAnnual && plan.period === "month" && (
                  <p className="text-xs text-gray-500 mt-1">billed annually</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlight ? "text-[#A21CAF]" : "text-gray-400"
                      }`}
                    />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/onboarding')}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-[#A21CAF] hover:bg-[#86198F] text-white shadow-lg shadow-[#A21CAF]/25"
                    : "border border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            All plans include: Urdu support • Citation verification • Legal
            consultant oversight • 99.9% uptime SLA
          </p>
          <p className="text-xs text-gray-400">
            Accepted: Credit/Debit Cards • JazzCash • Easypaisa • Bank Transfer
            — via PayFast
          </p>
        </div>
      </div>
    </section>
  );
}
