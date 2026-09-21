import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  const isMobileMenuOpenRef = useRef(isMobileMenuOpen);
  const isHoveringRef = useRef(isHovering);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    isMobileMenuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const nextScrolled = currentScrollY > 20;

      setIsScrolled((prev) => {
        if (prev !== nextScrolled) return nextScrolled;
        return prev;
      });

      // When scrolling, it should appear
      setIsVisible((prev) => {
        if (prev !== true) return true;
        return prev;
      });

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (currentScrollY > 20 && !isMobileMenuOpenRef.current && window.innerWidth >= 768) {
        // When stop scrolling, it should disappear (Desktop only)
        scrollTimeoutRef.current = setTimeout(() => {
          if (!isHoveringRef.current && !isMobileMenuOpenRef.current) {
            setIsVisible(false);
          }
        }, 1500);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    setIsVisible((prev) => {
      if (prev !== true) return true;
      return prev;
    });
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (window.scrollY > 20 && !isMobileMenuOpenRef.current) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isHoveringRef.current && !isMobileMenuOpenRef.current) {
          setIsVisible(false);
        }
      }, 1500);
    }
  };

  const handleNavigation = (itemKey: string) => {
    setIsMobileMenuOpen(false);
    
    let sectionId = itemKey;
    if (itemKey === "resenas") sectionId = "resenas";
    if (itemKey === "consultas") sectionId = "contact";
    
    if (sectionId === "contact" && window.innerWidth < 1024) {
      window.dispatchEvent(new CustomEvent("open-booking-modal"));
      return;
    }

    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `/#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
      window.scrollTo(0, 0);
    } else {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showNavItems = isVisible || !isScrolled || isMobileMenuOpen;
  
  const menuItems = [
    { key: "servicios", label: t("nav.servicios", "Servicios") },
    { key: "portfolio", label: t("nav.portfolio", "Portafolio") },
    { key: "planes", label: t("nav.planes", "Planes") },
    { key: "resenas", label: t("nav.resenas", "Reseñas") },
    { key: "consultas", label: t("nav.consultas", "Consultas") }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        !isVisible && isScrolled && !isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Background Card */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled && showNavItems
            ? "bg-[#050507]/30 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      />
      
      {/* Header Content (Always Visible) */}
      <div className={`relative container mx-auto px-6 max-w-7xl flex items-center justify-between transition-all duration-500 ${
        isScrolled && showNavItems ? "py-4" : "py-6"
      }`}>
        {/* Logo */}
        <div className="flex items-center cursor-pointer relative z-10" onClick={handleLogoClick}>
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Menu - Centered (Servicios, Portafolio, Planes, Casos de éxito) */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3 absolute left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence>
            {showNavItems && menuItems.filter(item => item.key !== "consultas").map((item, index) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.35, delay: index * 0.08, ease: "easeOut" }
                }}
                exit={{ 
                  opacity: 0, 
                  y: -8,
                  transition: { duration: 0.2, delay: index * 0.05, ease: "easeIn" } 
                }}
                onClick={() => handleNavigation(item.key)}
                className={`group relative px-3.5 py-1.5 lg:px-4 lg:py-2 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center ${
                  item.key === "portfolio"
                    ? "border-white/25 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.18)] hover:shadow-[0_0_22px_rgba(255,255,255,0.25)]"
                    : "border-white/15 bg-white/[0.04] hover:bg-white/[0.09] hover:border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:shadow-[0_0_20px_rgba(20,91,255,0.25)]"
                } active:scale-95`}
              >
                {/* Subtle sheen highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                
                {item.key === "portfolio" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80 mr-2 animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                )}
                
                <span className="relative z-10 font-body text-xs lg:text-[13px] tracking-wider uppercase font-medium text-white/85 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop CTA (Far Right Corner - Consultas Tag) */}
        <div className="hidden md:flex items-center gap-5 relative z-10 ml-auto">
          <AnimatePresence>
            {showNavItems && (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.4, delay: 0.3 }
                }}
                exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                onClick={() => handleNavigation("consultas")}
                className="group relative px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl border border-[#145BFF]/35 bg-[#145BFF]/10 hover:bg-[#145BFF]/20 backdrop-blur-md shadow-[0_4px_16px_rgba(20,91,255,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_0_24px_rgba(20,91,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:border-[#145BFF]/60 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#145BFF]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#145BFF] animate-pulse drop-shadow-[0_0_6px_#145BFF]" />
                <span className="relative z-10 font-body text-xs lg:text-[13px] tracking-wider uppercase font-semibold text-white group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                  {language === 'es' ? 'Consultas' : 'Consultations'}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Toggle and CTA Button */}
        <div className="md:hidden flex items-center gap-1.5 relative z-10">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate(language === 'es' ? "/planes" : "/pricing");
            }}
            className="px-3.5 py-1.5 rounded-full border border-[#145BFF]/40 text-xs font-semibold tracking-wide text-white bg-[#145BFF]/20 backdrop-blur-md shadow-[0_0_12px_rgba(20,91,255,0.25)] hover:bg-[#145BFF]/30 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {language === 'es' ? 'Ver Planes' : 'Plans'}
          </button>
          <button
            className="text-white p-2 flex items-center justify-center shrink-0 active:scale-90 transition-transform cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, height: "auto", backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, height: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#050507]/95 backdrop-blur-2xl border-b border-white/15 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2.5 px-6 py-6 border-t border-white/10">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ 
                    duration: 0.35, 
                    delay: 0.1 + (index * 0.06), 
                    ease: "easeOut" 
                  }}
                  onClick={() => handleNavigation(item.key)}
                  className={`w-full px-4 py-3 rounded-xl border backdrop-blur-md flex items-center justify-between text-left transition-all duration-300 ${
                    item.key === "consultas"
                      ? "border-[#145BFF]/40 bg-[#145BFF]/15 text-white shadow-[0_4px_16px_rgba(20,91,255,0.2)]"
                      : "border-white/15 bg-white/[0.04] active:bg-white/[0.1] text-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  }`}
                >
                  <span className="font-body text-sm tracking-wider uppercase font-medium flex items-center gap-2">
                    {item.key === "consultas" && (
                      <span className="w-2 h-2 rounded-full bg-[#145BFF] animate-pulse drop-shadow-[0_0_6px_#145BFF]" />
                    )}
                    {item.key === "portfolio" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                    )}
                    {item.label}
                  </span>
                  <span className="text-white/40 text-xs font-mono">→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
