import Navbar from "@/components/Navbar";
import FAQSection from "@/components/FAQSection";
import FloatingButtons from "@/components/FloatingButtons";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const FAQ = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#030712]">
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
