"use client";

import { Scale, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            href="#"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Platform
          </a>
          <a
            href="https://www.zensbots.site/judges"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            For Judges
          </a>
          <a
            href="https://www.zensbots.site/lawyers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            For Lawyers
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Log in
          </a>
          <button className="bg-[#1f1f1f] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-all duration-200 hover:shadow-md">
            Get Started
          </button>
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
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              Platform
            </a>
            <a href="https://www.zensbots.site/judges" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              For Judges
            </a>
            <a href="https://www.zensbots.site/lawyers" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              For Lawyers
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
              Pricing
            </a>
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2">
                Log in
              </a>
              <button className="bg-[#1f1f1f] text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-black transition-colors w-full">
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
