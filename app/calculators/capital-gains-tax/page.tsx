"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateCGT, getCGTBreakdown } from "@/lib/calculators/capital-gains-tax";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  CGTAssetType,
  PropertyType,
  FilerStatus,
  CGTResult,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";

const STEPS: WizardStep[] = [
  { id: "asset", label: "Asset" },
  { id: "dates", label: "Dates & Values" },
  { id: "filer", label: "Filer Status" },
  { id: "review", label: "Review" },
];

const ASSET_TYPE_OPTIONS: { value: CGTAssetType; label: string; section: string; desc: string }[] = [
  { value: "listed-securities", label: "Listed Securities", section: "s.37A", desc: "PSX stocks, mutual funds" },
  { value: "immovable-property", label: "Immovable Property", section: "s.37", desc: "Land, houses, flats, plots" },
  { value: "pmex", label: "PMEX Commodities", section: "s.37A", desc: "Pakistan Mercantile Exchange" },
  { value: "other", label: "Other Movable Assets", section: "s.37", desc: "Vehicles, art, other assets" },
];

function getAssetLabel(type: CGTAssetType): string {
  return ASSET_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

function getPropertyLabel(type: PropertyType): string {
  switch (type) {
    case "open-plot": return "Open Plot";
    case "constructed": return "Constructed Property";
    case "flat": return "Flat / Apartment";
  }
}

export default function CapitalGainsTaxCalculatorPage() {
  const [assetType, setAssetType] = useState<CGTAssetType>("listed-securities");
  const [propertyType, setPropertyType] = useState<PropertyType>("open-plot");
  const [acquisitionDate, setAcquisitionDate] = useState("");
  const [disposalDate, setDisposalDate] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [filerStatus, setFilerStatus] = useState<FilerStatus>("filer");
  const [result, setResult] = useState<CGTResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const holdingDays = useMemo(() => {
    if (!acquisitionDate || !disposalDate) return 0;
    const d1 = new Date(acquisitionDate);
    const d2 = new Date(disposalDate);
    return Math.max(0, Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  }, [acquisitionDate, disposalDate]);

  const handleCalculate = () => {
    setResult(
      calculateCGT({
        assetType,
        propertyType: assetType === "immovable-property" ? propertyType : undefined,
        acquisitionDate,
        disposalDate,
        acquisitionCost,
        salePrice,
        filerStatus,
      })
    );
  };

  const handleReset = () => {
    setAssetType("listed-securities");
    setPropertyType("open-plot");
    setAcquisitionDate("");
    setDisposalDate("");
    setAcquisitionCost(0);
    setSalePrice(0);
    setFilerStatus("filer");
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getCGTBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Capital Gains Tax Calculator",
        date: new Date(),
        inputs: [
          { label: "Asset Type", value: getAssetLabel(result.assetType) },
          ...(result.propertyType ? [{ label: "Property Type", value: getPropertyLabel(result.propertyType) }] : []),
          { label: "Acquisition Date", value: acquisitionDate },
          { label: "Disposal Date", value: disposalDate },
          { label: "Acquisition Cost", value: formatPKR(result.acquisitionCost) },
          { label: "Sale Price", value: formatPKR(result.salePrice) },
          { label: "Filer Status", value: filerStatus === "filer" ? "Filer" : "Non-Filer" },
        ],
        results: [
          { label: "Capital Gain", value: formatPKR(result.capitalGain) },
          { label: "Holding Period", value: result.holdingPeriodLabel },
          { label: "Tax Rate", value: `${(result.applicableRate * 100).toFixed(1)}%` },
          { label: "CGT Payable", value: formatPKR(result.cgtAmount) },
          { label: "Net Proceeds", value: formatPKR(result.netProceeds) },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "Rates based on the Income Tax Ordinance 2001, Sections 37 and 37A, as amended by Finance Act 2025. Actual liability may differ. Consult a qualified tax advisor.",
      }
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-sm font-semibold uppercase tracking-wider text-[#84752F]">
          Tax Calculator
        </span>
        <h1 className="mt-2 text-3xl font-bold font-serif text-gray-900">
          Capital Gains Tax Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Calculate CGT on securities, immovable property, and other assets
          based on holding period, acquisition era, and filer status.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={(step: number) => {
          if (step === 1) return !!acquisitionDate && !!disposalDate && acquisitionCost > 0 && salePrice > 0;
          return true;
        }}
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            const noGain = result.capitalGain <= 0;
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="CGT Payable"
                  value={noGain ? "Rs. 0" : formatPKR(result.cgtAmount)}
                  subtitle={`${getAssetLabel(result.assetType)} — ${result.section}`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {noGain && (
                    <div className="mt-4 p-4 bg-[#059669]/10 border border-[#059669]/20 rounded-lg text-center">
                      <span className="text-sm font-semibold text-[#059669]">
                        No Tax — No Capital Gain
                      </span>
                    </div>
                  )}

                  {/* Stats grid */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Capital Gain</p>
                      <p className={`font-semibold ${result.capitalGain < 0 ? "text-red-600" : ""}`}>
                        {formatPKR(result.capitalGain)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Holding Period</p>
                      <p className="font-semibold">{result.holdingPeriodLabel}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Tax Rate</p>
                      <p className="font-semibold">{(result.applicableRate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Net Proceeds</p>
                      <p className="font-semibold">{formatPKR(result.netProceeds)}</p>
                    </div>
                  </div>

                  {/* Era info */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <strong>Regime:</strong> {result.acquisitionEra}
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis={`Income Tax Ordinance 2001, ${result.section}; Finance Act 2025.`}
                  />
                )}
              </div>
            );
          }

          // Step 0: Asset Type
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Select Asset Type</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the type of capital asset being disposed
                  </p>
                </div>

                <RadioGroup
                  value={assetType}
                  onValueChange={(v) => setAssetType(v as CGTAssetType)}
                  className="grid gap-3"
                >
                  {ASSET_TYPE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        assetType === opt.value
                          ? "border-[#059669] bg-[#059669]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{opt.section}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            );
          }

          // Step 1: Dates & Values
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Dates & Values</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter acquisition and disposal details
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Acquisition Date</Label>
                    <Input
                      type="date"
                      value={acquisitionDate}
                      onChange={(e) => setAcquisitionDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Disposal Date</Label>
                    <Input
                      type="date"
                      value={disposalDate}
                      onChange={(e) => setDisposalDate(e.target.value)}
                    />
                  </div>
                </div>

                {holdingDays > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    <span className="text-gray-500">Holding Period: </span>
                    <span className="font-semibold">
                      {Math.floor(holdingDays / 365)} year{Math.floor(holdingDays / 365) !== 1 ? "s" : ""},{" "}
                      {Math.floor((holdingDays % 365) / 30)} months ({holdingDays} days)
                    </span>
                  </div>
                )}

                <CurrencyInput
                  label="Cost of Acquisition"
                  value={acquisitionCost}
                  onChange={(v) => setAcquisitionCost(v)}
                />
                <CurrencyInput
                  label="Sale Price / Proceeds"
                  value={salePrice}
                  onChange={(v) => setSalePrice(v)}
                />

                {/* Property type (only for immovable property) */}
                {assetType === "immovable-property" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Property Type</Label>
                    <RadioGroup
                      value={propertyType}
                      onValueChange={(v) => setPropertyType(v as PropertyType)}
                      className="grid grid-cols-3 gap-2"
                    >
                      {(["open-plot", "constructed", "flat"] as const).map((pt) => (
                        <label
                          key={pt}
                          className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer text-sm transition-colors ${
                            propertyType === pt
                              ? "border-[#059669] bg-[#059669]/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <RadioGroupItem value={pt} />
                          <span className="font-medium">{getPropertyLabel(pt)}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Live gain preview */}
                {acquisitionCost > 0 && salePrice > 0 && (
                  <div className={`p-3 rounded-lg text-sm ${
                    salePrice > acquisitionCost
                      ? "bg-amber-50 border border-amber-200"
                      : "bg-[#059669]/5 border border-[#059669]/20"
                  }`}>
                    <span className="text-gray-600">Capital Gain: </span>
                    <span className={`font-semibold ${
                      salePrice > acquisitionCost ? "text-amber-700" : "text-[#059669]"
                    }`}>
                      {formatPKR(salePrice - acquisitionCost)}
                      {salePrice <= acquisitionCost && " (No gain — no tax)"}
                    </span>
                  </div>
                )}
              </div>
            );
          }

          // Step 2: Filer Status
          if (currentStep === 2) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Filer Status</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Your status on the Active Taxpayer List affects the applicable rate
                  </p>
                </div>

                <RadioGroup
                  value={filerStatus}
                  onValueChange={(v) => setFilerStatus(v as FilerStatus)}
                  className="grid grid-cols-2 gap-3"
                >
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      filerStatus === "filer"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="filer" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Filer</span>
                      <p className="text-xs text-gray-500 mt-0.5">On the Active Taxpayer List</p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      filerStatus === "non-filer"
                        ? "border-[#059669] bg-[#059669]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value="non-filer" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">Non-Filer</span>
                      <p className="text-xs text-gray-500 mt-0.5">Not on ATL — higher rates</p>
                    </div>
                  </label>
                </RadioGroup>

                {acquisitionDate && (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                    <strong>Acquisition Era:</strong>{" "}
                    {new Date(acquisitionDate) < new Date("2013-07-01")
                      ? "Before July 2013 — Securities exempt"
                      : new Date(acquisitionDate) < new Date("2022-07-01")
                        ? "Jul 2013 – Jun 2022 — Flat 12.5% for securities"
                        : new Date(acquisitionDate) < new Date("2024-07-01")
                          ? "Jul 2022 – Jun 2024 — Progressive rates by holding period"
                          : "On/after Jul 2024 — New regime, flat 15%"}
                  </div>
                )}
              </div>
            );
          }

          // Step 3: Review
          if (currentStep === 3) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating CGT
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Asset Type</span>
                    <span className="text-sm font-semibold">{getAssetLabel(assetType)}</span>
                  </div>
                  {assetType === "immovable-property" && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Property Type</span>
                      <span className="text-sm font-semibold">{getPropertyLabel(propertyType)}</span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Acquisition Date</span>
                    <span className="text-sm font-semibold">{acquisitionDate}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Disposal Date</span>
                    <span className="text-sm font-semibold">{disposalDate}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Holding Period</span>
                    <span className="text-sm font-semibold">
                      {Math.floor(holdingDays / 365)}y {Math.floor((holdingDays % 365) / 30)}m
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Acquisition Cost</span>
                    <span className="text-sm font-semibold">{formatPKR(acquisitionCost)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Sale Price</span>
                    <span className="text-sm font-semibold">{formatPKR(salePrice)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Capital Gain</span>
                    <span className={`text-sm font-semibold ${salePrice - acquisitionCost < 0 ? "text-red-600" : "text-[#059669]"}`}>
                      {formatPKR(salePrice - acquisitionCost)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Filer Status</span>
                    <span className="text-sm font-semibold">
                      {filerStatus === "filer" ? "Active (Filer)" : "Non-Filer"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute capital gains tax
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Capital Gains Tax in Pakistan"
        sources={[
          { label: "Securities", reference: "Income Tax Ordinance 2001, Section 37A" },
          { label: "Immovable Property", reference: "Income Tax Ordinance 2001, Section 37" },
          { label: "Latest Amendments", reference: "Finance Act 2025" },
        ]}
      >
        <h3>Overview</h3>
        <p>
          Capital gains tax (CGT) in Pakistan is levied on profits from the disposal of
          capital assets. The tax treatment differs significantly based on the type of
          asset (listed securities vs immovable property), the date of acquisition,
          and the holding period.
        </p>
        <h3>Listed Securities</h3>
        <p>
          Securities acquired before July 2013 are exempt. Those acquired between 2013-2022
          are taxed at a flat 12.5%. Securities acquired in the 2022-2024 era follow a
          progressive schedule decreasing from 15% to 0% based on holding period. From
          July 2025 onwards, all securities face a flat 15% rate regardless of holding period.
        </p>
        <h3>Immovable Property</h3>
        <p>
          Property acquired on or after July 1, 2024 falls under the new regime with a flat
          15% rate for filers. Property acquired before that date follows the old regime where
          rates decrease with longer holding periods, with potential full exemption after 4-6
          years depending on property type.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
