import { ArrowDown, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import AnimatedTarget from "./AnimatedTarget";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => scrollToSection('contact');
  const scrollToPlanes = () => scrollToSection('planes');
  const scrollToReviews = () => scrollToSection('resenas');

  return (
    <section id="hero" className="relative flex flex-col justify-start lg:justify-center overflow-hidden pt-32 md:pt-36 lg:pt-32 pb-8 sm:pb-12 lg:pb-12 h-auto">

      {/* Cinematic Glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] pointer-events-none">
        <div 
          className="absolute inset-0 rounded-full opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(20,91,255,0.6) 0%, rgba(11,63,191,0.2) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animationDuration: '4s'
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-6 text-center max-w-5xl">
        
        {/* Badge */}
        <div className={`transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <motion.div 
            className="inline-flex items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-6 sm:mb-8 mx-auto"
            animate={{
              boxShadow: [
                '0 0 5px rgba(255,255,255,0.2), inset 0 0 2px rgba(255,255,255,0.05)',
                '0 0 15px rgba(255,255,255,0.5), inset 0 0 5px rgba(255,255,255,0.2)',
                '0 0 5px rgba(255,255,255,0.2), inset 0 0 2px rgba(255,255,255,0.05)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: 'rgba(255,255,255,0.01)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse drop-shadow-[0_0_3px_rgba(255,255,255,0.5)] shrink-0"></div>
            <span className="text-white/90 font-body text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-light drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
              {t("hero.badge")}
            </span>
          </motion.div>
        </div>

        {/* Headline - Disrupted Paradigm */}
        <div className={`transition-all duration-1000 delay-[400ms] ease-out flex flex-col items-center justify-center w-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="font-heading text-[#F2F2F4] text-[7.5vw] min-[400px]:text-[8vw] sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight mb-6 md:mb-8 px-1 w-full text-center max-w-[98%] lg:max-w-4xl mx-auto flex flex-col items-center" style={{ fontWeight: 200 }}>
            {/* Primera Línea (Tachada) */}
            <span className="relative inline-block text-white/40 mb-1 sm:mb-4 lg:whitespace-nowrap text-center whitespace-nowrap">
               {t("hero.title.part1")}
               <span className="absolute left-[0%] top-1/2 w-[100%] h-[3px] bg-red-600/90 -translate-y-1/2 -rotate-2 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"></span>
            </span>
            
            {/* Segunda Línea - Envuelve el Target Detrás de la S */}
            <span className="relative z-10 isolate italic mt-4 sm:mt-6 text-center block" style={{ fontWeight: 400 }}>
                {/* Sistema de Conversión - Con target atado a sí mismo */}
                <span className="relative inline-block">
                    <span className="absolute -top-5 -left-5 md:-top-6 md:-left-6 z-[-1] pointer-events-none">
                       <AnimatedTarget />
                    </span>
                    <span className="bg-gradient-to-r from-[#145BFF] via-[#3B7BFF] to-[#0B3FBF] bg-clip-text text-transparent">
                      {t("hero.title.part2")}
                    </span>
                </span>
                
                {/* De Clientes */}
                <span className="inline-block mt-0 ml-1 sm:ml-2 bg-gradient-to-r from-[#0B3FBF] to-[#052A85] sm:from-[#3B7BFF] sm:to-[#0B3FBF] bg-clip-text text-transparent">
                   {t("hero.title.part3")}
                </span>
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div className={`transition-all duration-1000 delay-[600ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-body text-[#CFCFD4] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-10 sm:mb-12 px-4 sm:px-0" style={{ fontWeight: 300 }}>
            {t("hero.subtitle.p1")} <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 10px rgba(20,91,255,0.6))"
              }}
              className="font-medium inline-block"
            >
              {t("hero.subtitle.highlight")}
            </motion.span>{t("hero.subtitle.p2")}
          </p>
        </div>

        {/* CTA Buttons - Glass Effect + Neon Electric Borders */}
        <div className={`transition-all duration-1000 delay-[800ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            
            {/* Secondary CTA - Animated Edge (Ver Planes) - Moved to first position */}
            <motion.button
              type="button"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              onClick={scrollToPlanes}
              className="group relative cursor-pointer w-full sm:w-auto rounded-2xl overflow-hidden transition-all duration-500 flex justify-center items-center"
            >
              <div 
                className="relative z-10 flex items-center justify-center px-8 py-4 w-full h-full rounded-2xl bg-[#050507]/25 transition-all duration-500 hover:bg-[#050507]/40"
                style={{
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.02)'
                }}
              >
                <span className="relative text-[#CFCFD4] group-hover:text-white transition-colors duration-300 font-heading text-base md:text-lg flex items-center gap-2" style={{ fontWeight: 300, letterSpacing: '0.04em' }}>
                  {t("hero.cta.secondary", "Ver Planes")}
                </span>
              </div>

              {/* Edge Lighting Wrapper */}
              <div 
                className="absolute inset-0 z-20 rounded-2xl pointer-events-none p-[2px]"
                style={{
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              >
                <motion.div 
                  className="absolute inset-[-100%]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(255,255,255,0.8) 340deg, #FFFFFF 360deg)'
                  }}
                />
              </div>
              <div className="absolute inset-0 z-0 rounded-2xl border border-white/5 pointer-events-none" />
            </motion.button>
            
            {/* Primary CTA - Glow (Agendar Asesoría) */}
            <motion.button
              type="button"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              onClick={scrollToContact}
              className="group relative cursor-pointer px-8 py-4 w-full sm:w-auto rounded-2xl font-heading text-white text-base md:text-lg transition-all duration-500 flex justify-center items-center"
              style={{
                fontWeight: 400,
                letterSpacing: '0.04em',
                background: 'linear-gradient(135deg, rgba(20,91,255,0.25) 0%, rgba(20,91,255,0.05) 100%)',
                border: '1px solid rgba(20,91,255,0.6)',
                boxShadow: '0 0 20px rgba(20,91,255,0.4), inset 0 0 15px rgba(20,91,255,0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 35px rgba(20,91,255,0.6), 0 0 60px rgba(20,91,255,0.3), inset 0 0 20px rgba(20,91,255,0.3)';
                e.currentTarget.style.borderColor = 'rgba(20,91,255,1)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(20,91,255,0.3) 0%, rgba(20,91,255,0.1) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(20,91,255,0.4), inset 0 0 15px rgba(20,91,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(20,91,255,0.6)';
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(20,91,255,0.25) 0%, rgba(20,91,255,0.05) 100%)';
              }}
            >
              <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                {t("hero.cta.primary", "Agendar Asesoría")}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 text-white" />
              </span>
            </motion.button>

          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`transition-all duration-1000 delay-[1000ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            <button
              onClick={scrollToReviews}
              className="flex items-center gap-2 group/trust cursor-pointer text-left focus:outline-none select-none hover:opacity-90 transition-all duration-300"
              title={language === 'es' ? "Ver reseñas de clientes satisfechos" : "View satisfied customer reviews"}
            >
              <div className="flex -space-x-2 py-1 transition-transform duration-300 group-hover/trust:scale-105 active:scale-95">
                <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="relative z-30">
                  <Avatar className="w-8 h-8 rounded-full border-2 border-[#050507] overflow-hidden transition-colors duration-300 group-hover/trust:border-[#145BFF]">
                    <AvatarImage src="/testimonials/luis-rosa.jpg" alt="Luis Rosa" className="object-cover" />
                    <AvatarFallback className="bg-[#145BFF]/20 text-[#145BFF] text-[10px] font-heading font-bold">LR</AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.3 }} className="relative z-20">
                  <Avatar className="w-8 h-8 rounded-full border-2 border-[#050507] overflow-hidden transition-colors duration-300 group-hover/trust:border-[#145BFF]">
                    <AvatarImage src="/testimonials/ingrid-rodriguez.jpg" alt="Ingrid Rodriguez" className="object-cover" />
                    <AvatarFallback className="bg-[#145BFF]/20 text-[#145BFF] text-[10px] font-heading font-bold">IR</AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.6 }} className="relative z-10">
                  <Avatar className="w-8 h-8 rounded-full border-2 border-[#050507] overflow-hidden bg-white p-[2px] transition-colors duration-300 group-hover/trust:border-[#145BFF]">
                    <AvatarImage src="/testimonials/coqui-pay.png" alt="Coqui Pay" className="object-contain" />
                    <AvatarFallback className="bg-transparent text-[#145BFF] text-[10px] font-heading font-bold">JP</AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>
              <span className="text-[#CFCFD4]/60 group-hover/trust:text-[#3B7BFF] text-xs font-body font-light transition-colors duration-300 underline-offset-4 group-hover/trust:underline">{t("hero.trust.satisfied", "Clientes satisfechos")}</span>
            </button>
            <div className="hidden sm:block w-px h-4 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-[#145BFF]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-[#CFCFD4]/60 text-xs font-body font-light ml-1">{t("hero.trust.reviews", "5.0 en reseñas")}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/10"></div>
            <span className="hidden sm:inline text-[#CFCFD4]/60 text-xs font-body font-light">{t("hero.trust.personalized", "100% personalizados")}</span>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className={`mt-12 md:mt-16 sm:mt-24 transition-all duration-1000 delay-[1200ms] ease-out ${isVisible ? 'opacity-100' : 'opacity-0'} hidden sm:flex justify-center`}>
          <div className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}>
            <div 
              className="w-4 h-7 rounded-full flex justify-center pt-1 transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'rgba(20,91,255,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(20,91,255,0.5)',
                boxShadow: '0 0 10px rgba(20,91,255,0.4), inset 0 0 5px rgba(20,91,255,0.2)'
              }}
            >
              <div className="w-1 h-1.5 rounded-full bg-[#145BFF] animate-bounce drop-shadow-[0_0_5px_rgba(20,91,255,0.9)]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
