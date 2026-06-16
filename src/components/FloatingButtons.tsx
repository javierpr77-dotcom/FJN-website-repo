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
          whileHover={{ scale: 1.15, borderColor: "rgba(20, 91, 255, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center bg-[#050507]/80 border border-white/10 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.5),0_0_8px_rgba(20,91,255,0.1)] cursor-pointer text-white/70 hover:text-white transition-colors duration-300 group"
          title="Volver arriba"
          aria-label="Volver arriba"
        >
          {/* Ambient grow/breathe visual halo effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[#145BFF]/15 z-[-1]"
            animate={{
              scale: [1, 1.45, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <ChevronUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingButtons;
