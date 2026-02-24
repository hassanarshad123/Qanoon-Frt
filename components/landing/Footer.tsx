"use client";

import Link from "next/link";

const platformLinks = [
  { label: "Judicial Tools", href: "/#use-cases" },
  { label: "Lawyer Tools", href: "/#use-cases" },
  { label: "Legal Database", href: "/#how-it-works" },
  { label: "Calculators", href: "/#calculators" },
  { label: "Pricing", href: "/#pricing" },
];

const companyLinks = [
  { label: "About", href: "/#platform" },
  { label: "Contact", href: "/contact" },
  { label: "Support", href: "/#faq" },
];

// TODO: Replace with real social URLs when available
const socialLinks = [
  { label: "X/Twitter", href: "#" },
  { label: "LinkedIn", href: "#" },
];

const usersLinks: { label: string; href: string; secondLine?: string }[] = [
  { label: "Judges", href: "/onboarding" },
  { label: "Lawyers", href: "/onboarding" },
  { label: "Law Students", href: "/onboarding" },
  { label: "Citizens", href: "/onboarding" },
  { label: "Firms &", href: "/onboarding", secondLine: "Institutions" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Data Security", href: "/data-security" },
  { label: "Acceptable Use", href: "/acceptable-use" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} className="text-gray-300 hover:text-white text-sm transition-colors">
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className="text-gray-300 hover:text-white text-sm transition-colors">
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#2D1F2D] text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-64 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-sm">
              QanoonAI is Pakistan&apos;s first AI-powered legal intelligence platform — 44 tools built on 300,000+ court judgments for judges, lawyers, and citizens.
            </p>
            <p className="text-gray-500 text-sm">
              QanoonAI.pk &copy; 2026
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Social</h4>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Users</h4>
            <ul className="space-y-2">
              {usersLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>
                    {link.label}
                    {link.secondLine && (
                      <>
                        <br />
                        {link.secondLine}
                      </>
                    )}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 lg:ml-[33.333%]">
          <h4 className="font-medium mb-4 text-white">Legal</h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <div className="relative h-56">
          <svg
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-6xl"
            viewBox="0 0 800 200"
            style={{ transform: 'translateX(-50%) translateY(25%)' }}
          >
            <defs>
              <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <circle cx="4" cy="4" r="2" fill="#A21CAF" opacity="0.4" />
              </pattern>
              <mask id="textMask">
                <text
                  x="50%"
                  y="75%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="140"
                  fontFamily="serif"
                  fontWeight="400"
                  fill="white"
                >
                  qanoonai
                </text>
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotPattern)" mask="url(#textMask)" />
          </svg>

          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-[#A21CAF] rounded-sm opacity-60" />
          <div className="absolute bottom-1/3 left-[40%] w-2 h-2 bg-[#A21CAF] rounded-sm opacity-40" />
          <div className="absolute bottom-1/2 right-1/4 w-2 h-2 bg-[#A21CAF] rounded-sm opacity-50" />
          <div className="absolute bottom-1/4 right-[40%] w-2 h-2 bg-[#A21CAF] rounded-sm opacity-60" />
          <div className="absolute bottom-[60%] left-1/2 w-2 h-2 bg-[#A21CAF] rounded-sm opacity-40" />
          <div className="absolute bottom-[45%] right-[30%] w-2 h-2 bg-[#A21CAF] rounded-sm opacity-50" />
        </div>
      </div>
    </footer>
  );
}
