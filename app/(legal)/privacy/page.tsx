import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — QanoonAI",
  description: "QanoonAI privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">1. Introduction</h2>
          <p>
            QanoonAI (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates QanoonAI.pk, an AI-powered legal intelligence platform serving Pakistan&apos;s legal ecosystem. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">2. Information We Collect</h2>
          <p className="mb-3">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, professional role (judge, lawyer, student, or citizen), bar council registration number (for lawyers), and court affiliation (for judges).</li>
            <li><strong>Usage Data:</strong> Documents you upload, queries you submit, AI-generated outputs, and calculator inputs.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and access timestamps.</li>
            <li><strong>Payment Data:</strong> Billing information processed through our payment provider (PayFast). We do not store full payment card details on our servers.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide, maintain, and improve our AI legal tools and services.</li>
            <li>To authenticate your identity and enforce role-based access controls.</li>
            <li>To process your queries through our RAG (Retrieval-Augmented Generation) pipeline.</li>
            <li>To generate immutable audit trails for compliance and security purposes.</li>
            <li>To communicate with you about your account, updates, and support requests.</li>
            <li>To comply with applicable Pakistani laws and regulations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">4. Data Isolation &amp; Security</h2>
          <p className="mb-3">
            We implement strict data isolation measures, particularly for judicial users:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Judicial data is stored in isolated database partitions with separate encryption keys.</li>
            <li>All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</li>
            <li>Mandatory two-factor authentication is enforced for judicial accounts.</li>
            <li>Audit logs are hash-chained and immutable, retained for 7-10 years.</li>
            <li>Lawyer tools and judicial tools operate in completely separate workspaces with no cross-access.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">5. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data only with: (a) service providers who assist in operating our platform (hosting, payment processing, AI model providers) under strict confidentiality agreements; (b) law enforcement or regulatory authorities when required by Pakistani law; (c) with your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">6. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. Usage data and audit logs are retained for 7-10 years in compliance with legal record-keeping requirements. You may request deletion of your account and associated data by contacting us, subject to legal retention obligations.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">7. Your Rights</h2>
          <p>
            Under applicable Pakistani law, including the Electronic Transactions Ordinance, you have the right to: access your personal data, request correction of inaccurate data, request deletion of your data (subject to legal retention requirements), and withdraw consent for data processing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">8. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@qanoonai.pk" className="text-[#A21CAF] hover:underline">
              privacy@qanoonai.pk
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
