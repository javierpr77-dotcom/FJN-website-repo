import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import BenefitsSection from "@/components/BenefitsSection";
import ProcessSection from "@/components/ProcessSection";
import SocialProofSection from "@/components/SocialProofSection";
import PricingSection from "@/components/PricingSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    let targetId = "";

    if (path === "/portfolio" || path === "/portafolio") {
      targetId = "portfolio";
    } else if (path === "/planes" || path === "/pricing") {
      targetId = "planes";
    }

    if (targetId) {
      const scrollWithRetry = (attempts = 0) => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        } else if (attempts < 10) {
          setTimeout(() => scrollWithRetry(attempts + 1), 100);
        }
      };

      const timer = setTimeout(() => {
        scrollWithRetry();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen relative">
      <SEO />
      <AnimatedBackground />
      <Navbar />
      <div className="relative z-20">
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <BenefitsSection />
        <ProcessSection />
        <SocialProofSection />
        <PricingSection />
        <ContactForm />
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Index;
