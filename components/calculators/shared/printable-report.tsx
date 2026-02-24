"use client";

import { format } from "date-fns";
import type { PrintReportData } from "@/lib/calculators/types";

interface PrintableReportProps {
  data: PrintReportData;
}

export function PrintableReport({ data }: PrintableReportProps) {
  return (
    <div className="hidden print:block">
      {/* Header */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-xl font-bold">QanoonAI</h1>
        <p className="text-sm text-gray-500">Calculator Portal</p>
      </div>

      {/* Title & Date */}
      <div className="mb-6">
        <h2 className="text-lg font-bold font-serif">
          {data.calculatorName}
        </h2>
        <p className="text-sm text-gray-500">
          Generated on {format(data.date, "dd MMMM yyyy 'at' hh:mm a")}
        </p>
      </div>

      {/* Inputs Summary */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Input Summary
        </h3>
        <table className="w-full text-sm">
          <tbody>
            {data.inputs.map((input, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-700 w-1/3">
                  {input.label}
                </td>
                <td className="py-1.5 px-3 text-gray-900">{input.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Results */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
          Results
        </h3>
        <table className="w-full text-sm">
          <tbody>
            {data.results.map((result, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-1.5 px-3 font-medium text-gray-700 w-1/3">
                  {result.label}
                </td>
                <td className="py-1.5 px-3 font-semibold text-gray-900">
                  {result.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Breakdown */}
      {data.breakdown.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Computation Breakdown
          </h3>
          <div className="space-y-2">
            {data.breakdown.map((step) => (
              <div key={step.step} className="text-sm">
                <span className="font-medium">
                  Step {step.step}: {step.label}
                </span>
                <br />
                <span className="font-mono text-gray-600 ml-4">
                  {step.calculation}
                </span>
                <br />
                <span className="font-semibold ml-4">= {step.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t border-gray-300 pt-4 mt-8">
        <p className="text-xs text-gray-500 italic">{data.disclaimer}</p>
      </div>
    </div>
  );
}
