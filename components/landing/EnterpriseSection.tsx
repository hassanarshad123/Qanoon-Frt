"use client";

import { Lock, CheckCircle, ShieldCheck, KeyRound, FileStack } from "lucide-react";
import { useRouter } from "next/navigation";

function SecurityIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 opacity-20">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="w-full h-full border border-gray-500 rounded-sm" />
        ))}
      </div>

      <div className="relative bg-[#3D2F3D] border border-gray-600 rounded-lg shadow-2xl mx-8 my-8 p-8">
        <div className="flex items-center justify-center">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-0 border-2 border-gray-500 rounded-lg" />
            <div className="absolute inset-2 border border-gray-600 rounded-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-20 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-6 border-2 border-[#A21CAF] rounded-t-full" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#A21CAF]/30 to-[#A21CAF]/50 rounded-md border border-[#A21CAF]/40">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#A21CAF] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-1/4 w-3 h-3 bg-[#84CC16] rounded-sm" />
      <div className="absolute top-8 right-8 w-3 h-3 bg-[#84CC16] rounded-sm opacity-60" />
      <div className="absolute top-1/3 left-4 w-3 h-3 bg-cyan-400 rounded-sm" />
      <div className="absolute bottom-1/4 right-4 w-3 h-3 bg-blue-400 rounded-sm" />
      <div className="absolute bottom-8 left-1/3 w-3 h-3 bg-[#A21CAF] rounded-sm" />
      <div className="absolute bottom-4 right-1/3 w-3 h-3 bg-[#A21CAF] rounded-sm opacity-50" />
    </div>
  );
}

const features = [
  {
    icon: CheckCircle,
    title: "99.9% Citation Accuracy",
    description:
      "AI never invents case laws. Every citation verified against our database of 300,000+ real Pakistani court judgments.",
  },
  {
    icon: ShieldCheck,
    title: "Complete Judicial Isolation",
    description:
      "Judge data is stored in separate databases with separate encryption keys. Zero access from lawyer tools.",
  },
  {
    icon: KeyRound,
    title: "Mandatory 2FA for Judges",
    description:
      "Judicial identity verification protocol with official email domain checks and admin approval.",
  },
  {
    icon: FileStack,
    title: "Immutable Audit Trails",
    description:
      "Every AI request logged with hash-chained immutable records. 7-10 year retention for legal compliance.",
  },
];

export default function EnterpriseSection() {
  const router = useRouter();
  return (
    <section id="enterprise" className="w-full bg-[#1F1520] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#A21CAF]/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#A21CAF]" />
            </div>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
            Government-Grade Security.
          </h2>
          <p className="mt-6 text-gray-400 text-lg max-w-xl mx-auto">
            From judicial isolation to encrypted audit trails, QanoonAI is built
            for the demands of Pakistan&apos;s legal system.
          </p>
          <div className="mt-8">
            <button onClick={() => router.push('/onboarding')} className="bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all duration-200 hover:shadow-lg">
              Request Institutional Access
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start mt-20">
          <div className="space-y-8">
            {features.slice(0, 2).map((feature, index) => (
              <div
                key={feature.title}
                className={`${index !== 0 ? "pt-8 border-t border-gray-700" : ""}`}
              >
                <feature.icon className="w-6 h-6 text-[#A21CAF] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <SecurityIllustration />
          </div>

          <div className="space-y-8">
            {features.slice(2, 4).map((feature, index) => (
              <div
                key={feature.title}
                className={`${index !== 0 ? "pt-8 border-t border-gray-700" : ""}`}
              >
                <feature.icon className="w-6 h-6 text-[#A21CAF] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-700">
          <p className="text-gray-500 text-sm mb-6">
            Built for Pakistan&apos;s legal infrastructure
          </p>
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <span className="text-lg font-semibold text-white">
              Supreme Court
            </span>
            <span className="text-lg font-semibold text-cyan-400">
              High Courts
            </span>
            <span className="text-lg font-semibold text-gray-400">
              Bar Councils
            </span>
            <span className="text-lg font-semibold text-gray-400">
              Law Firms
            </span>
            <span className="text-lg font-semibold text-[#A21CAF]">Public</span>
          </div>
        </div>
      </div>
    </section>
  );
}
