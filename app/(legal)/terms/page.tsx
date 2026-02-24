import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — QanoonAI",
  description: "QanoonAI terms of service. Read our terms and conditions for using the platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using QanoonAI.pk (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform. These terms are governed by the laws of the Islamic Republic of Pakistan.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">2. Description of Service</h2>
          <p>
            QanoonAI is an AI-powered legal intelligence platform that provides research tools, document drafting assistance, case briefing, and legal calculators. The Platform uses Retrieval-Augmented Generation (RAG) technology drawing from 300,000+ Pakistani court judgments.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">3. Legal Disclaimer</h2>
          <p className="font-semibold mb-2">
            QanoonAI is NOT a law firm and does NOT provide legal advice.
          </p>
          <p>
            All AI-generated outputs — including briefs, drafts, research results, and summaries — are informational tools designed to assist qualified legal professionals. They do not constitute legal advice, legal opinions, or attorney-client privilege. All outputs must be reviewed, verified, and approved by a qualified legal professional before use in any legal proceeding.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">4. User Accounts &amp; Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Judges:</strong> Must verify judicial identity through official email domain and administrative approval. Access is restricted to judicial tools only.</li>
            <li><strong>Lawyers:</strong> Must provide valid bar council registration details. Access is restricted to lawyer tools only.</li>
            <li><strong>Students &amp; Citizens:</strong> May register with a valid email address for access to free-tier tools.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">5. Acceptable Use</h2>
          <p>
            You agree not to: misrepresent your professional role or qualifications; use the Platform to generate fraudulent legal documents; attempt to access tools or data designated for other user roles; reverse-engineer or scrape the Platform; or use the Platform in any manner that violates Pakistani law.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">6. Intellectual Property</h2>
          <p>
            The Platform, its design, code, and AI models are the intellectual property of QanoonAI. Court judgments in our database are public records. AI-generated outputs based on your inputs are provided for your use, but QanoonAI retains the right to use anonymized, aggregated data to improve the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">7. Limitation of Liability</h2>
          <p>
            QanoonAI shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Platform, including but not limited to reliance on AI-generated outputs. Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">8. Subscription &amp; Payments</h2>
          <p>
            Paid plans are billed monthly or annually as selected. Payments are processed through PayFast (credit/debit cards, JazzCash, Easypaisa, bank transfer). You may cancel at any time; access continues until the end of your billing period. Refunds are available within 7 days of initial purchase only.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">9. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account for violation of these Terms, misrepresentation of professional credentials, or any activity that compromises the integrity or security of the Platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">10. Governing Law &amp; Disputes</h2>
          <p>
            These Terms are governed by the laws of Pakistan. Any disputes shall be resolved through arbitration in Lahore, Pakistan, in accordance with the Arbitration Act 1940, before resorting to litigation.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">11. Contact</h2>
          <p>
            For questions about these Terms, contact us at{" "}
            <a href="mailto:legal@qanoonai.pk" className="text-[#A21CAF] hover:underline">
              legal@qanoonai.pk
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
