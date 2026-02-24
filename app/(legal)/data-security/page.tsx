import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Security — QanoonAI",
  description: "Learn about QanoonAI's government-grade security measures for protecting legal data.",
};

export default function DataSecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Data Security</h1>
      <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">1. Our Security Commitment</h2>
          <p>
            QanoonAI handles sensitive legal data for Pakistan&apos;s judiciary, legal profession, and public. We implement government-grade security measures to protect the confidentiality, integrity, and availability of all data on our platform.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">2. Encryption</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>At Rest:</strong> All data is encrypted using AES-256 encryption. Database encryption keys are managed through a dedicated key management service with automatic rotation.</li>
            <li><strong>In Transit:</strong> All communications between your browser and our servers are protected by TLS 1.3. API communications between internal services also use encrypted channels.</li>
            <li><strong>Judicial Data:</strong> Judicial user data uses separate encryption keys stored in isolated key vaults, ensuring complete cryptographic separation from other user data.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">3. Access Controls</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Role-based access control (RBAC) enforced at the application, API, and database layers.</li>
            <li>Mandatory two-factor authentication (2FA) for all judicial accounts.</li>
            <li>Judicial identity verification through official email domain checks and administrative approval.</li>
            <li>Session management with automatic timeout and secure token handling (JWT with short-lived tokens).</li>
            <li>Strict separation: judicial tools and lawyer tools operate in isolated workspaces with no cross-access.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">4. Infrastructure Security</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Application hosted on enterprise-grade cloud infrastructure with 99.9% uptime SLA.</li>
            <li>Database hosted on Neon PostgreSQL with automated backups, point-in-time recovery, and geographic redundancy.</li>
            <li>Network security includes firewalls, DDoS protection, and intrusion detection systems.</li>
            <li>Regular security patches and vulnerability scanning across all infrastructure components.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">5. Audit &amp; Monitoring</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>All AI requests and document operations are logged with hash-chained immutable audit records.</li>
            <li>Audit logs are retained for 7-10 years in compliance with legal record-keeping requirements.</li>
            <li>Real-time monitoring for unauthorized access attempts and anomalous usage patterns.</li>
            <li>Regular security audits and penetration testing by qualified security professionals.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">6. AI &amp; Data Processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>AI processing uses Retrieval-Augmented Generation (RAG) — the AI retrieves from verified court judgments rather than generating information from scratch.</li>
            <li>Every AI-generated citation is verified against our database before being displayed to the user.</li>
            <li>User documents are processed in isolated sessions and are not used to train AI models.</li>
            <li>Embedding vectors are cached in encrypted Redis instances with automatic expiry.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">7. Compliance</h2>
          <p>
            Our security practices are designed to comply with Pakistan&apos;s Electronic Transactions Ordinance (2002), the Prevention of Electronic Crimes Act (2016), and applicable data protection regulations. We maintain documentation and controls appropriate for handling legal and judicial data.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">8. Incident Response</h2>
          <p>
            In the event of a security incident, we maintain a documented incident response plan that includes immediate containment, investigation, notification of affected users within 72 hours, and remediation. Critical security incidents involving judicial data trigger an escalated response protocol.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl text-gray-900 mb-3">9. Contact</h2>
          <p>
            To report a security vulnerability or for security-related inquiries, contact our security team at{" "}
            <a href="mailto:security@qanoonai.pk" className="text-[#A21CAF] hover:underline">
              security@qanoonai.pk
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
