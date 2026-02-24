"use client";

import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  Proportions,
  Clock,
  HandCoins,
  Receipt,
  ReceiptText,
  TrendingUp,
  ShoppingCart,
  Package,
  AlertTriangle,
  Scale,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

const calculators: {
  icon: LucideIcon;
  name: string;
  basis: string;
  href: string;
  active: boolean;
}[] = [
  {
    icon: Proportions,
    name: "Inheritance Calculator",
    basis: "Muslim Personal Law (Shariat) Application Act 1962",
    href: "/calculators/inheritance",
    active: true,
  },
  {
    icon: Clock,
    name: "Limitation Period Calculator",
    basis: "Limitation Act 1908",
    href: "/calculators/limitation",
    active: true,
  },
  {
    icon: HandCoins,
    name: "Zakat Calculator",
    basis: "Zakat & Ushr Ordinance 1980",
    href: "/calculators/zakat",
    active: true,
  },
  {
    icon: Receipt,
    name: "Income Tax Calculator",
    basis: "Income Tax Ordinance 2001",
    href: "/calculators/income-tax",
    active: true,
  },
  {
    icon: ReceiptText,
    name: "Withholding Tax Calculator",
    basis: "Income Tax Ordinance 2001",
    href: "/calculators/withholding-tax",
    active: true,
  },
  {
    icon: TrendingUp,
    name: "Capital Gains Tax",
    basis: "Income Tax Ordinance 2001",
    href: "/calculators/capital-gains-tax",
    active: true,
  },
  {
    icon: ShoppingCart,
    name: "Sales Tax Calculator",
    basis: "Sales Tax Act 1990",
    href: "/calculators/sales-tax",
    active: true,
  },
  {
    icon: Package,
    name: "Customs Duty Calculator",
    basis: "Customs Act 1969",
    href: "/calculators/customs-duty",
    active: true,
  },
  {
    icon: AlertTriangle,
    name: "Tax Penalties Calculator",
    basis: "Income Tax Ordinance 2001",
    href: "/calculators/tax-penalties",
    active: true,
  },
  {
    icon: Scale,
    name: "Damages Calculator",
    basis: "Civil Procedure Code & Case Law",
    href: "/calculators/damages",
    active: true,
  },
  {
    icon: CalendarDays,
    name: "Iddat Period Calculator",
    basis: "Muslim Family Laws Ordinance 1961",
    href: "/calculators/iddat",
    active: true,
  },
];

export default function CalculatorShowcase() {
  return (
    <section id="calculators" className="w-full bg-white py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Calculator className="w-4 h-4 text-[#84752F]" />
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              Calculators
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            11 Legal Calculators. Zero Guesswork.
          </h2>
          <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
            No AI involved. Pure math based on Pakistani law. Every formula
            sourced from statute. Identical inputs always produce identical
            outputs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {calculators.map((calc, index) => {
            const card = (
              <div
                key={index}
                className={`group bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 ${
                  calc.active
                    ? "hover:border-[#059669]/30 hover:shadow-lg hover:shadow-[#059669]/5 hover:-translate-y-1 cursor-pointer"
                    : "opacity-60 cursor-default"
                }`}
              >
                <calc.icon className="w-6 h-6 text-[#059669] mb-3" />
                <h3
                  className={`font-semibold text-gray-900 text-sm mb-1 transition-colors ${
                    calc.active ? "group-hover:text-[#059669]" : ""
                  }`}
                >
                  {calc.name}
                </h3>
                <p className="text-xs text-gray-500">{calc.basis}</p>
                {!calc.active && (
                  <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider font-medium">
                    Coming Soon
                  </p>
                )}
              </div>
            );

            if (calc.active) {
              return (
                <Link key={index} href={calc.href}>
                  {card}
                </Link>
              );
            }
            return card;
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/calculators"
            className="group bg-[#059669] hover:bg-[#047857] text-white px-8 py-4 rounded-xl text-base font-medium inline-flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#059669]/25"
          >
            Try Calculators Free
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
