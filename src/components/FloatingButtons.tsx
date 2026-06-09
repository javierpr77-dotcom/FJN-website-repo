import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/17872102204?text=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios%20de%20marketing%20digital', '_blank');
  };

  return (
    <div className="fixed bottom-12 sm:bottom-6 right-6 z-[100] flex flex-col gap-4">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-transparent border-0 shadow-[0_0_15px_rgba(20,91,255,0.6),inset_0_0_8px_rgba(20,91,255,0.4)] hover:shadow-[0_0_25px_rgba(20,91,255,0.9),inset_0_0_12px_rgba(20,91,255,0.6)] hover:bg-[#145BFF]/5 backdrop-blur-sm hover:scale-110 transition-all duration-300 cursor-pointer animate-fade-in-up"
          title="Volver arriba"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-4 h-4 md:w-5 md:h-5 text-[#145BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
