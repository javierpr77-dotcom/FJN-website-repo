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
    
    // Determine proper router path based on itemKey and language
    let targetPath = "/" + itemKey;
    if (itemKey === "portfolio") {
      targetPath = language === "es" ? "/portafolio" : "/portfolio";
    } else if (itemKey === "planes") {
      targetPath = language === "es" ? "/planes" : "/pricing";
    } else if (itemKey === "resenas") {
      targetPath = language === "es" ? "/casos de éxito" : "/success stories";
    } else if (itemKey === "consultas") {
      targetPath = language === "es" ? "/consultas" : "/contact";
    } else if (itemKey === "servicios") {
      targetPath = language === "es" ? "/servicios" : "/services";
    }

    let decodedCurrentPath = "";
    try {
      decodedCurrentPath = decodeURIComponent(location.pathname);
    } catch (e) {
      decodedCurrentPath = location.pathname;
    }

    if (decodedCurrentPath === targetPath) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(targetPath);
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

        {/* Desktop Menu - Centered (Those Four Links) */}
        <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 z-10">
          <AnimatePresence>
            {showNavItems && menuItems.filter(item => item.key !== "consultas").map((item, index) => (
              <motion.button
                key={item.key}
                initial={{ opacity: 0, x: 20, y: 0 }}
                animate={item.key === "portfolio" ? {
                  opacity: [0.95, 1, 0.95],
                  x: 0,
                  y: [0, -3.5, 0],
                  scale: [1, 1.05, 1],
                  filter: [
                    "drop-shadow(0 0 4px rgba(255,255,255,0.7)) drop-shadow(0 0 2px rgba(255,255,255,0.5))",
                    "drop-shadow(0 0 18px rgba(255,255,255,1)) drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 2px rgba(255,255,255,0.8))",
                    "drop-shadow(0 0 4px rgba(255,255,255,0.7)) drop-shadow(0 0 2px rgba(255,255,255,0.5))"
                  ],
                  backgroundPosition: ["0% 50%", "200% 50%"],
                  transition: {
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    filter: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                    x: { duration: 0.4, delay: index * 0.1, ease: "easeOut" },
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.3 },
                    backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                  }
                } : { 
                  opacity: 1, 
                  x: 0,
                  y: [0, -3.5, 0],
                  backgroundPosition: ["0% 50%", "200% 50%"],
                  transition: {
                    opacity: { duration: 0.4, delay: index * 0.1, ease: "easeOut" },
                    x: { duration: 0.4, delay: index * 0.1, ease: "easeOut" },
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.3 },
                    backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  x: -15,
                  transition: { 
                    duration: 0.3, 
                    delay: index * 0.08, 
                    ease: "easeIn"
                  } 
                }}
                onClick={() => handleNavigation(item.key)}
                className="font-body text-sm tracking-wide font-medium hover:scale-105 inline-block cursor-pointer transition-all duration-300"
                style={{
                  backgroundImage: item.key === "portfolio"
                    ? "linear-gradient(90deg, #FFFFFF, #F8FAFC, #FFFFFF)"
                    : "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: item.key === "portfolio" 
                    ? "drop-shadow(0 0 4px rgba(255,255,255,0.7)) drop-shadow(0 0 2px rgba(255,255,255,0.5))" 
                    : "drop-shadow(0 0 10px rgba(20,91,255,0.8))"
                }}
              >
                {item.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop CTA (Far Right Corner - Consultation Button) */}
        <div className="hidden md:flex items-center gap-5 relative z-10 ml-auto">
          <AnimatePresence>
            {showNavItems && (
              <motion.button
                initial={{ opacity: 0, x: 10, y: 0 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  y: [0, -3.5, 0]
                }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ 
                  opacity: { duration: 0.4 },
                  x: { duration: 0.4 },
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }
                }}
                onClick={() => handleNavigation("consultas")}
                className="font-body text-sm tracking-wide font-medium hover:scale-105 inline-block cursor-pointer transition-all duration-300"
                style={{
                  backgroundImage: "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(20,91,255,0.8))"
                }}
              >
                {language === 'es' ? 'Consulta' : 'Consultation'}
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
            <div className="flex flex-col px-6 py-6 border-t border-white/5">
              {menuItems.map((item, index) => (
                <div key={item.key} className={index !== menuItems.length - 1 ? 'border-b border-white/10' : ''}>
                  <motion.button
                    initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -10, filter: "blur(2px)", transition: { duration: 0.2, delay: 0 } }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.2 + (index * 0.1), 
                      ease: [0.22, 1, 0.36, 1] 
                    }}
                    onClick={() => handleNavigation(item.key)}
                    className="w-full text-left font-body text-lg py-4 font-medium transition-all duration-300"
                    style={{
                      backgroundImage: item.key === "portfolio"
                        ? "linear-gradient(90deg, #FFFFFF, #F8FAFC, #FFFFFF)"
                        : "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    <motion.span
                      animate={item.key === "portfolio" ? {
                        backgroundPosition: ["0% 50%", "200% 50%"],
                        scale: [1, 1.02, 1],
                      } : { 
                        backgroundPosition: ["0% 50%", "200% 50%"],
                      }}
                      transition={item.key === "portfolio" ? { 
                        scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                        backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
                      } : {
                        duration: 8, 
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-full inline-block"
                      style={{
                        backgroundImage: "inherit",
                        backgroundSize: "inherit",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        filter: item.key === 'portfolio' 
                          ? "drop-shadow(0 0 16px rgba(255,255,255,1)) drop-shadow(0 0 4px rgba(255,255,255,0.8))" 
                          : "drop-shadow(0 0 8px rgba(20,91,255,0.6))"
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
