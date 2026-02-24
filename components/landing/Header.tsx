"use client";

import { Scale, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function getPortalHref() {
    if (!session?.user) return "/login";
    const role = session.user.role;
    if (!session.user.onboardingCompleted) return "/onboarding";
    if (role === "judge") return "/judges";
    if (role === "lawyer") return "/lawyers";
    if (role === "admin") return "/admin";
    return "/onboarding";
  }

  return (
    <header
      className={`w-full bg-white sticky top-0 z-50 transition-all duration-200 ${
        isScrolled ? "shadow-sm border-b border-gray-100" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#A21CAF]" />
          <span className="text-xl font-semibold text-gray-900 tracking-tight">
            QanoonAI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#platform"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Platform
          </a>
          <a
            href="#use-cases"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            For Judges
          </a>
          <a
            href="#use-cases"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            For Lawyers
          </a>
          <a
            href="#pricing"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <span className="text-sm text-gray-600">{session.user.name}</span>
              <Link
                href={getPortalHref()}
                className="bg-[#1f1f1f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all duration-200 hover:shadow-md"
              >
                Go to Portal
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Log in
              </Link>
              <button
                onClick={() => router.push("/signup")}
                className="bg-[#1f1f1f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all duration-200 hover:shadow-md"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-6 py-4 gap-4">
            <a href="#platform" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              Platform
            </a>
            <a href="#use-cases" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              For Judges
            </a>
            <a href="#use-cases" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              For Lawyers
            </a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              Pricing
            </a>
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
              {session?.user ? (
                <Link
                  href={getPortalHref()}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#1f1f1f] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors w-full text-center"
                >
                  Go to Portal
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
                    Log in
                  </Link>
                  <button
                    onClick={() => {
                      router.push("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-[#1f1f1f] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors w-full"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
