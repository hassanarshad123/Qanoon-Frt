import { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Mail, MapPin, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — QanoonAI",
  description: "Get in touch with QanoonAI. We're here to help with questions about our legal intelligence platform.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg mb-12">
            Have a question about QanoonAI? We&apos;d love to hear from you.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#A21CAF]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">General Inquiries</h2>
                <a href="mailto:hello@qanoonai.pk" className="text-[#A21CAF] hover:underline">
                  hello@qanoonai.pk
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-[#A21CAF]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">Institutional &amp; Enterprise</h2>
                <p className="text-gray-600 text-sm mb-1">
                  For courts, law firms, and institutional onboarding inquiries.
                </p>
                <a href="mailto:enterprise@qanoonai.pk" className="text-[#A21CAF] hover:underline">
                  enterprise@qanoonai.pk
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#A21CAF]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#A21CAF]" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 mb-1">Location</h2>
                <p className="text-gray-600 text-sm">
                  Lahore, Pakistan
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 p-6 bg-gray-50 rounded-2xl">
            <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              For technical support or help with your account, visit our{" "}
              <a href="/#faq" className="text-[#A21CAF] hover:underline">FAQ section</a>{" "}
              or email us at{" "}
              <a href="mailto:support@qanoonai.pk" className="text-[#A21CAF] hover:underline">
                support@qanoonai.pk
              </a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
