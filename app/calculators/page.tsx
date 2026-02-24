"use client";

import { Calculator } from "lucide-react";
import { CalculatorCard } from "@/components/calculators/shared/calculator-card";
import { CALCULATORS, CALCULATOR_GROUPS, getCalculatorsByGroup } from "@/lib/calculators/constants";

export default function CalculatorsHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="w-4 h-4 text-[#84752F]" />
          <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
            Legal Calculators
          </span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
          11 Legal Calculators. Zero Guesswork.
        </h1>
        <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
          Pure math based on Pakistani law. Every formula sourced from statute.
          Identical inputs always produce identical outputs.
        </p>
      </div>

      {/* Calculator groups */}
      {CALCULATOR_GROUPS.map((group) => {
        const calcs = getCalculatorsByGroup(group.id);
        return (
          <section key={group.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#84752F] mb-4">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calcs.map((calc) => (
                <CalculatorCard key={calc.id} calculator={calc} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Disclaimer */}
      <div className="text-center py-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 max-w-xl mx-auto">
          These calculators provide estimates based on statutory rules and standard legal
          principles. Results are for informational purposes only and do not constitute
          legal advice. Always consult a qualified legal professional for specific cases.
        </p>
      </div>
    </div>
  );
}
