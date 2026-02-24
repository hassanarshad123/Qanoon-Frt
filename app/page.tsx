import Header from "@/components/landing/Header";
import AnnouncementBanner from "@/components/landing/AnnouncementBanner";
import HeroSection from "@/components/landing/HeroSection";
import HeroVisual from "@/components/landing/HeroVisual";
import StatsSection from "@/components/landing/StatsSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import ProductSection from "@/components/landing/ProductSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import CalculatorShowcase from "@/components/landing/CalculatorShowcase";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import EnterpriseSection from "@/components/landing/EnterpriseSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <AnnouncementBanner />
      <Header />
      <HeroSection />
      <HeroVisual />
      <StatsSection />
      <BeforeAfterSection />
      <ProductSection />
      <UseCasesSection />
      <CalculatorShowcase />
      <HowItWorksSection />
      <PricingSection />
      <EnterpriseSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
