import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 300;
      setShowScrollTop((prev) => {
        if (prev !== shouldShow) return shouldShow;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 15 }}
          whileHover={{ 
            scale: 1.05, 
            borderColor: "rgba(0, 212, 255, 0.8)", 
            boxShadow: "0 0 25px rgba(20, 91, 255, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2)" 
          }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[9999] w-9 h-9 sm:w-9.5 sm:h-9.5 md:w-9.5 md:h-9.5 rounded-full flex items-center justify-center border text-white hover:text-[#00D4FF] transition-all duration-300 group cursor-pointer"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(14px) saturate(200%)",
            WebkitBackdropFilter: "blur(14px) saturate(200%)",
            borderColor: "rgba(20, 91, 255, 0.45)",
            boxShadow: "0 0 15px rgba(20, 91, 255, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
          }}
          title="Volver arriba"
          aria-label="Volver arriba"
        >
          <ChevronUp className="w-5 h-5 text-white group-hover:text-[#00D4FF] transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingButtons;
