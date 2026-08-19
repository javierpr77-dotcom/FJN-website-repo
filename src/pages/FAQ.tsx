import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { useEffect } from "react";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#030712]">
      <SEO 
        title="Preguntas Frecuentes | FJN Digital" 
        description="Respuestas detalladas sobre nuestro proceso de desarrollo web estratégico, e-commerce, hospedaje de alta velocidad y optimización de conversión en Puerto Rico."
        url="https://fjndigitalmedia.com/faq"
      />
      <Navbar />
      <div className="relative z-10 w-full pt-12 lg:pt-20">
        <FAQSection />
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default FAQ;
