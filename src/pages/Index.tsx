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
