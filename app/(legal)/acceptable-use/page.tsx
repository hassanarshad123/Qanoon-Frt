import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — QanoonAI",
  description: "QanoonAI acceptable use policy. Understand the rules for using our legal intelligence platform.",
};

export default function AcceptableUsePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Acceptable Use Policy</h1>
      <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">1. Purpose</h2>
          <p>
            This Acceptable Use Policy governs how you may use QanoonAI.pk (&quot;the Platform&quot;). By using the Platform, you agree to comply with this policy. Violation may result in suspension or termination of your account.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">2. Permitted Use</h2>
          <p className="mb-3">The Platform is designed for lawful legal intelligence purposes, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Legal research using our database of Pakistani court judgments.</li>
            <li>AI-assisted drafting of legal documents for professional review.</li>
            <li>Case briefing and analysis for judicial and legal work.</li>
            <li>Legal calculations using our deterministic calculators.</li>
            <li>Educational use by law students for learning and research.</li>
            <li>General legal guidance for citizens seeking to understand their rights.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">3. Prohibited Activities</h2>
          <p className="mb-3">You must NOT:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Misrepresent your identity or role:</strong> Registering as a judge when you are not, or claiming bar council credentials you do not hold.</li>
            <li><strong>Generate fraudulent documents:</strong> Using AI outputs to create forged legal documents, fake court orders, or misleading legal instruments.</li>
            <li><strong>Present AI output as legal advice:</strong> Distributing AI-generated content to clients or the public as professional legal advice without proper review by a qualified legal professional.</li>
            <li><strong>Attempt cross-role access:</strong> Trying to access judicial tools as a lawyer, or lawyer tools as a citizen, or otherwise circumventing role-based access controls.</li>
            <li><strong>Scrape or bulk-extract data:</strong> Using automated tools, bots, or scripts to extract data from the Platform beyond normal usage.</li>
            <li><strong>Reverse-engineer the Platform:</strong> Attempting to decompile, disassemble, or reverse-engineer any part of the Platform, its AI models, or its RAG pipeline.</li>
            <li><strong>Interfere with security:</strong> Attempting to bypass authentication, probe for vulnerabilities, or interfere with the Platform&apos;s security measures.</li>
            <li><strong>Violate Pakistani law:</strong> Using the Platform for any purpose that violates the laws of Pakistan, including the Prevention of Electronic Crimes Act 2016.</li>
            <li><strong>Share account credentials:</strong> Sharing your login credentials or allowing others to use your account, especially for judicial accounts.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">4. AI Output Responsibility</h2>
          <p>
            While QanoonAI maintains a 99.9% citation accuracy SLA, all AI-generated outputs are tools to assist — not replace — professional legal judgment. You are solely responsible for reviewing, verifying, and approving all AI-generated content before use in any legal matter, filing, or proceeding.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">5. Rate Limits &amp; Fair Use</h2>
          <p>
            Each subscription tier has defined usage limits. Free-tier users are limited to 5 tool uses per day. Excessive usage that degrades the experience for other users may result in temporary throttling. Enterprise and institutional users should contact us for custom usage arrangements.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">6. Reporting Violations</h2>
          <p>
            If you become aware of any violation of this policy, please report it to{" "}
            <a href="mailto:abuse@qanoonai.pk" className="text-[#A21CAF] hover:underline">
              abuse@qanoonai.pk
            </a>. We investigate all reports and take appropriate action.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">7. Enforcement</h2>
          <p>
            Violations of this policy may result in: warning notifications, temporary suspension of access, permanent termination of your account, or referral to law enforcement authorities where applicable. We reserve the right to determine what constitutes a violation at our sole discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
