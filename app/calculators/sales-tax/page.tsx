"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CurrencyInput } from "@/components/calculators/shared/currency-input";
import { CalculatorWizard } from "@/components/calculators/shared/calculator-wizard";
import { CalculatorResult } from "@/components/calculators/shared/calculator-result";
import { CalculatorBreakdown } from "@/components/calculators/shared/calculator-breakdown";
import { PrintableReport } from "@/components/calculators/shared/printable-report";
import { LearnMoreSection } from "@/components/calculators/shared/learn-more-section";
import { calculateSalesTax, getSalesTaxBreakdown } from "@/lib/calculators/sales-tax";
import { PROVINCE_LABELS } from "@/lib/calculators/data/sales-tax-rates";
import { formatPKR } from "@/lib/calculators/constants";
import type {
  SalesTaxInput,
  SalesTaxResult,
  SalesTaxType,
  WizardStep,
  PrintReportData,
} from "@/lib/calculators/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS: WizardStep[] = [
  { id: "type", label: "Type" },
  { id: "amount", label: "Amount" },
  { id: "review", label: "Review" },
];

const TAX_TYPE_OPTIONS: { value: SalesTaxType; label: string; rate: string }[] = [
  { value: "goods-standard", label: "Goods (Standard Rate)", rate: "18%" },
  { value: "goods-reduced", label: "Goods (Reduced Rate)", rate: "10%" },
  { value: "services-federal", label: "Services (Federal)", rate: "16%" },
  { value: "services-provincial", label: "Services (Provincial)", rate: "Varies" },
];

function getTypeLabel(type: SalesTaxType): string {
  const option = TAX_TYPE_OPTIONS.find((o) => o.value === type);
  return option ? option.label : type;
}

function getRateLabel(type: SalesTaxType, province?: string): string {
  switch (type) {
    case "goods-standard":
      return "18%";
    case "goods-reduced":
      return "10%";
    case "services-federal":
      return "16%";
    case "services-provincial":
      if (province && province in PROVINCE_LABELS) {
        const rateMap: Record<string, string> = {
          punjab: "16%",
          sindh: "13%",
          kpk: "15%",
          balochistan: "15%",
          islamabad: "16%",
        };
        return rateMap[province] ?? "16%";
      }
      return "16%";
    default:
      return "18%";
  }
}

export default function SalesTaxCalculatorPage() {
  const [taxType, setTaxType] = useState<SalesTaxType>("goods-standard");
  const [province, setProvince] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(true);
  const [amount, setAmount] = useState(0);
  const [priceIncludesTax, setPriceIncludesTax] = useState(false);
  const [result, setResult] = useState<SalesTaxResult | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const handleCalculate = () => {
    const input: SalesTaxInput = {
      type: taxType,
      amount,
      priceIncludesTax,
      isRegistered,
      ...(taxType === "services-provincial" && province ? { province } : {}),
    };
    setResult(calculateSalesTax(input));
  };

  const handleReset = () => {
    setTaxType("goods-standard");
    setProvince("");
    setIsRegistered(true);
    setAmount(0);
    setPriceIncludesTax(false);
    setResult(null);
    setShowBreakdown(false);
  };

  const breakdownSteps = result ? getSalesTaxBreakdown(result) : [];

  const printData: PrintReportData | null = result
    ? {
        calculatorName: "Sales Tax Calculator",
        date: new Date(),
        inputs: [
          { label: "Tax Type", value: getTypeLabel(result.type) },
          ...(result.type === "services-provincial" && province
            ? [{ label: "Province", value: PROVINCE_LABELS[province] ?? province }]
            : []),
          { label: "Buyer Registered", value: isRegistered ? "Yes" : "No" },
          { label: "Value of Supply", value: formatPKR(amount) },
          { label: "Price Includes Tax", value: priceIncludesTax ? "Yes" : "No" },
        ],
        results: [
          { label: "Tax-Exclusive Price", value: formatPKR(result.taxExclusivePrice) },
          { label: `Sales Tax (${(result.salesTaxRate * 100).toFixed(0)}%)`, value: formatPKR(result.salesTaxAmount) },
          ...(result.extraTaxForUnregistered > 0
            ? [{ label: "Extra Tax (Unregistered)", value: formatPKR(result.extraTaxForUnregistered) }]
            : []),
          ...(result.furtherTax > 0
            ? [{ label: "Further Tax (Unregistered)", value: formatPKR(result.furtherTax) }]
            : []),
          { label: "Total Tax", value: formatPKR(result.totalTax) },
          { label: "Total Inclusive Price", value: formatPKR(result.totalInclusivePrice) },
        ],
        breakdown: breakdownSteps,
        disclaimer:
          "This calculator provides an estimate based on the Sales Tax Act 1990 and prevailing provincial tax rates. Actual tax liability may vary based on exemptions, zero-rated status, and SRO notifications. Consult a qualified tax advisor for specific rulings.",
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
          Sales Tax Calculator
        </h1>
        <p className="mt-2 text-gray-500">
          Compute GST on goods and services at standard 18% or reduced rates.
          Supports provincial service taxes and reverse calculation from
          tax-inclusive prices.
        </p>
      </div>

      {/* Wizard */}
      <CalculatorWizard
        steps={STEPS}
        onCalculate={handleCalculate}
        onReset={handleReset}
        isComplete={result !== null}
        canProceed={
          taxType === "services-provincial" ? province !== "" : amount > 0 || true
        }
      >
        {(currentStep) => {
          if (currentStep === -1 && result) {
            return (
              <div className="space-y-6">
                <CalculatorResult
                  label="Total Sales Tax"
                  value={formatPKR(result.totalTax)}
                  subtitle={`${(result.salesTaxRate * 100).toFixed(0)}% on ${getTypeLabel(result.type)}`}
                  showBreakdown={showBreakdown}
                  onToggleBreakdown={() => setShowBreakdown(!showBreakdown)}
                  onPrint={() => window.print()}
                  onReset={handleReset}
                >
                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Tax-Exclusive Price</p>
                      <p className="font-semibold">{formatPKR(result.taxExclusivePrice)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Sales Tax</p>
                      <p className="font-semibold">{formatPKR(result.salesTaxAmount)}</p>
                    </div>
                    {result.extraTaxForUnregistered > 0 && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Extra Tax (3%)</p>
                        <p className="font-semibold text-amber-600">
                          {formatPKR(result.extraTaxForUnregistered)}
                        </p>
                      </div>
                    )}
                    {result.furtherTax > 0 && (
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Further Tax (3%)</p>
                        <p className="font-semibold text-amber-600">
                          {formatPKR(result.furtherTax)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Total inclusive price highlight */}
                  <div className="mt-4 p-4 bg-[#059669]/5 rounded-lg border border-[#059669]/20 text-center">
                    <p className="text-sm text-gray-600">Total Inclusive Price</p>
                    <p className="text-2xl font-bold text-[#059669]">
                      {formatPKR(result.totalInclusivePrice)}
                    </p>
                  </div>
                </CalculatorResult>

                {showBreakdown && (
                  <CalculatorBreakdown
                    open={showBreakdown}
                    onOpenChange={setShowBreakdown}
                    steps={breakdownSteps}
                    legalBasis="Sales Tax Act 1990; Provincial sales tax on services statutes (Punjab, Sindh, KPK, Balochistan); Finance Act amendments."
                  />
                )}
              </div>
            );
          }

          // Step 0: Tax Type Selection
          if (currentStep === 0) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Select Tax Type</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Choose the category of goods or services for the applicable sales
                    tax rate
                  </p>
                </div>

                <RadioGroup
                  value={taxType}
                  onValueChange={(value) => {
                    setTaxType(value as SalesTaxType);
                    if (value !== "services-provincial") {
                      setProvince("");
                    }
                  }}
                  className="grid gap-3"
                >
                  {TAX_TYPE_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        taxType === option.value
                          ? "border-[#059669] bg-[#059669]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={option.value} />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-[#059669]">
                        {option.rate}
                      </span>
                    </label>
                  ))}
                </RadioGroup>

                {/* Province dropdown for provincial services */}
                {taxType === "services-provincial" && (
                  <div className="space-y-2 pl-1">
                    <Label className="text-sm font-medium">Select Province</Label>
                    <Select value={province} onValueChange={setProvince}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a province..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PROVINCE_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Buyer registration status */}
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="is-registered"
                    checked={isRegistered}
                    onCheckedChange={(checked) =>
                      setIsRegistered(checked === true)
                    }
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="is-registered"
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      Is buyer registered?
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Unregistered buyers are subject to an additional 3% extra tax
                      and 3% further tax
                    </p>
                  </div>
                </div>

                {/* Info box showing applicable rate */}
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">Applicable Rate: </span>
                  <span className="font-semibold">
                    {getRateLabel(taxType, province)}
                    {!isRegistered && " + 3% extra tax + 3% further tax"}
                  </span>
                </div>
              </div>
            );
          }

          // Step 1: Amount Entry
          if (currentStep === 1) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Enter Value of Supply</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter the value of goods or services being supplied
                  </p>
                </div>

                <CurrencyInput
                  label="Value of Supply"
                  value={amount}
                  onChange={(v) => setAmount(v)}
                />

                {/* Price includes tax toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <label
                      htmlFor="price-includes-tax"
                      className="text-sm font-medium text-gray-900 cursor-pointer"
                    >
                      Price includes tax
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Enable this if the entered amount already includes sales tax
                      (reverse calculation)
                    </p>
                  </div>
                  <Switch
                    id="price-includes-tax"
                    checked={priceIncludesTax}
                    onCheckedChange={setPriceIncludesTax}
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  <span className="text-gray-500">
                    {priceIncludesTax ? "Tax-inclusive amount: " : "Tax-exclusive amount: "}
                  </span>
                  <span className="font-semibold">{formatPKR(amount)}</span>
                </div>
              </div>
            );
          }

          // Step 2: Review
          if (currentStep === 2) {
            return (
              <div className="space-y-5">
                <div>
                  <Label className="text-base font-medium">Review & Calculate</Label>
                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your entries before calculating sales tax
                  </p>
                </div>
                <div className="border rounded-lg divide-y">
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Tax Type</span>
                    <span className="text-sm font-semibold">{getTypeLabel(taxType)}</span>
                  </div>
                  {taxType === "services-provincial" && province && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Province</span>
                      <span className="text-sm font-semibold">
                        {PROVINCE_LABELS[province] ?? province}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Applicable Rate</span>
                    <span className="text-sm font-semibold text-[#059669]">
                      {getRateLabel(taxType, province)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Buyer Registered</span>
                    <span className="text-sm font-semibold">
                      {isRegistered ? "Yes" : "No"}
                    </span>
                  </div>
                  {!isRegistered && (
                    <div className="flex justify-between p-3">
                      <span className="text-sm text-gray-600">Additional Taxes</span>
                      <span className="text-sm font-semibold text-amber-600">
                        +3% extra + 3% further
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Value of Supply</span>
                    <span className="text-sm font-semibold">{formatPKR(amount)}</span>
                  </div>
                  <div className="flex justify-between p-3">
                    <span className="text-sm text-gray-600">Price Includes Tax</span>
                    <span className="text-sm font-semibold">
                      {priceIncludesTax ? "Yes (reverse calculation)" : "No"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Click &ldquo;Calculate&rdquo; to compute the sales tax and total
                  inclusive price
                </p>
              </div>
            );
          }

          return null;
        }}
      </CalculatorWizard>

      {/* Learn More */}
      <LearnMoreSection
        title="Sales Tax in Pakistan"
        sources={[
          { label: "Primary Legislation", reference: "Sales Tax Act 1990" },
          { label: "Federal Tax Authority", reference: "Federal Board of Revenue (FBR)" },
          { label: "Provincial Authorities", reference: "Punjab Revenue Authority, Sindh Revenue Board, KPRA, BRA" },
        ]}
      >
        <h3>The Sales Tax Act 1990</h3>
        <p>
          The Sales Tax Act 1990 is the primary legislation governing the levy and
          collection of sales tax (General Sales Tax or GST) on goods in Pakistan. It
          was enacted to replace the earlier sales tax regime and introduced a
          value-added tax (VAT) system at the manufacturing and import stages. The Act
          empowers the Federal Board of Revenue (FBR) to collect sales tax on goods
          produced, manufactured, or imported into Pakistan, while sales tax on
          services falls under provincial jurisdiction following the 18th Constitutional
          Amendment of 2010.
        </p>

        <h3>Standard GST Rate of 18%</h3>
        <p>
          The standard rate of General Sales Tax on goods in Pakistan is 18%, applied to
          the value of supply at each stage of the production and distribution chain.
          Registered persons can claim input tax credit for the sales tax paid on their
          purchases, ensuring that the tax burden ultimately falls on the final consumer.
          Certain essential goods are subject to a reduced rate of 10%, as notified by
          the government through Statutory Regulatory Orders (SROs) from time to time.
        </p>

        <h3>Provincial Service Taxes</h3>
        <p>
          Following the 18th Constitutional Amendment, the power to levy sales tax on
          services was devolved to the provinces. Each province has established its own
          revenue authority and enacted separate legislation:
        </p>
        <ul>
          <li>
            <strong>Punjab:</strong> Punjab Sales Tax on Services Act 2012 &mdash;
            standard rate of 16%, administered by the Punjab Revenue Authority (PRA)
          </li>
          <li>
            <strong>Sindh:</strong> Sindh Sales Tax on Services Act 2011 &mdash;
            standard rate of 13%, administered by the Sindh Revenue Board (SRB)
          </li>
          <li>
            <strong>Khyber Pakhtunkhwa:</strong> KPK Finance Act 2013 &mdash;
            standard rate of 15%, administered by the KPK Revenue Authority (KPRA)
          </li>
          <li>
            <strong>Balochistan:</strong> Balochistan Sales Tax on Services Act 2015
            &mdash; standard rate of 15%, administered by the Balochistan Revenue
            Authority (BRA)
          </li>
          <li>
            <strong>Islamabad Capital Territory:</strong> Federal services in ICT are
            taxed at 16% under federal legislation, administered by the FBR
          </li>
        </ul>

        <h3>Input Tax Credit</h3>
        <p>
          One of the core features of Pakistan&apos;s sales tax system is the input tax
          credit mechanism. A registered person who has paid sales tax on the purchase of
          goods or services used in the course of taxable supplies can claim a credit for
          the tax paid (input tax) against the tax collected on their own sales (output
          tax). The net difference is remitted to the government. This mechanism ensures
          tax is levied on value addition at each stage, rather than cascading through
          the supply chain. To claim input tax credit, proper tax invoices must be
          maintained and the supplier must be registered with the FBR or relevant
          provincial authority.
        </p>

        <h3>Zero-Rated Supplies</h3>
        <p>
          Certain categories of supplies are zero-rated under the Sales Tax Act 1990,
          meaning they are taxable at 0%. This is distinct from exempt supplies: while
          exempt supplies do not attract sales tax and the supplier cannot claim input
          tax credit, zero-rated supplies allow the registered supplier to claim full
          input tax credit on their purchases. Key zero-rated categories include:
        </p>
        <ul>
          <li>Exports of goods and services from Pakistan</li>
          <li>Supplies to diplomats, diplomatic missions, and privileged organizations</li>
          <li>Supplies to Export Processing Zones (EPZs) and Special Economic Zones (SEZs)</li>
          <li>Certain IT and IT-enabled services as notified by the government</li>
        </ul>

        <h3>Extra Tax and Further Tax</h3>
        <p>
          When a registered person makes a taxable supply to an unregistered buyer, two
          additional levies apply under the Sales Tax Act 1990. The extra tax at 3% is
          charged under Section 3(1A) to discourage purchases by persons who have not
          obtained sales tax registration. The further tax at 3% is charged under
          Section 3(1B) on supplies made to persons who are not on the active taxpayer
          list. Together, these provisions create a significant incentive for businesses
          to obtain and maintain their sales tax registration, as unregistered buyers
          effectively bear a combined additional burden of 6% over and above the
          standard sales tax rate.
        </p>
      </LearnMoreSection>

      {/* Print Report */}
      {printData && <PrintableReport data={printData} />}
    </div>
  );
}
