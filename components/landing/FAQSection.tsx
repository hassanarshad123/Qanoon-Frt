"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Is QanoonAI legal advice?",
    answer:
      "No. QanoonAI is a legal intelligence tool that helps legal professionals work more efficiently. It provides information, research, and drafting assistance — but all outputs should be reviewed by a qualified legal professional. Every AI-generated document includes appropriate disclaimers.",
  },
  {
    question: "How accurate is the AI?",
    answer:
      "QanoonAI maintains a 99.9% citation accuracy SLA. Our AI never invents case laws — every citation is verified against our database of 300,000+ real Pakistani court judgments in real-time before being displayed. If information isn't available, the AI explicitly says so instead of guessing.",
  },
  {
    question: "How are judicial tools kept neutral?",
    answer:
      "Judicial tools operate in a completely isolated workspace — separate database, separate encryption keys, separate audit logs. AI prompts for judicial tools are strictly neutral with zero advocacy language. Judges cannot access lawyer drafting tools, and lawyers cannot access judicial tools. A legal consultant reviews all judicial tool outputs.",
  },
  {
    question: "What courts are covered in the database?",
    answer:
      "Our database includes 300,000+ judgments from the Supreme Court of Pakistan, all five High Courts (Lahore, Sindh, Islamabad, Peshawar, Balochistan), Federal Shariat Court, and various tribunals. We update daily with new judgments.",
  },
  {
    question: "Can I use QanoonAI in Urdu?",
    answer:
      "Yes. The entire platform is available in both English and Urdu with legal terminology preservation. The interface supports right-to-left (RTL) layout for Urdu. Legal reasoning is processed in English (where AI performs best) and translated with legal-grade accuracy.",
  },
  {
    question: "Is my data secure?",
    answer:
      "QanoonAI uses government-grade security: AES-256 encryption at rest, TLS 1.3 in transit, mandatory 2FA for judicial users, immutable audit logs, and complete judicial data isolation. We comply with Pakistan's Electronic Transactions Ordinance.",
  },
  {
    question: "How do the calculators work?",
    answer:
      "All 17 calculators are 100% deterministic — no AI involved. They use validated formulas from Pakistani law (Limitation Act, Court Fees Act, Income Tax Ordinance, Islamic inheritance rules, etc.). Identical inputs always produce identical outputs. Every formula has been verified by a legal consultant.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-gray-900 text-lg pr-8 group-hover:text-[#A21CAF] transition-colors">
          {question}
        </span>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-[#A21CAF] border-[#A21CAF] rotate-180"
              : "group-hover:border-[#A21CAF]"
          }`}
        >
          {isOpen ? (
            <Minus className="w-4 h-4 text-white" />
          ) : (
            <Plus className="w-4 h-4 text-gray-500 group-hover:text-[#A21CAF]" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed pr-16">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="w-4 h-4 text-[#84752F]" />
            <span className="text-[#84752F] text-sm font-medium uppercase tracking-wide">
              FAQ
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight">
            Common Questions
          </h2>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
