import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { BrainCircuit, Sparkles, Zap, Target, Bot, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import AnimatedDashboard from "./AnimatedDashboard";

const BenefitsSection = () => {
  const { language } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const tabletContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: tabletContainerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const currentIdx = Math.min(4, Math.max(0, Math.floor(latest * 5)));
    if (currentIdx !== activeSlide) {
      setActiveSlide(currentIdx);
    }
  });

  const benefits = [
    {
      title: language === 'es' ? "Arquitectura de Conversión" : "Conversion Architecture",
      description: language === 'es' ? (
        <>Diseñamos flujos interactivos que de forma natural y sin fricciones guían a tus visitas hacia <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">decisiones directas</span> o cotizaciones instantáneas.</>
      ) : (
        <>We design interactive, friction-free layouts that naturally guide your visitors toward <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">direct actions</span> or instant quotes.</>
      ),
      bullets: language === 'es' ? [
        <>Estructuración por análisis de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">mapas de calor</span> reales.</>,
        <>Mapeo del túnel psicológico del <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">comprador</span>.</>,
        <>Túneles optimizados para el <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">ticket promedio</span>.</>
      ] : [
        <>Structured by actual <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">heat-map</span> insights.</>,
        <>User cognitive flow alignment for <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">conversion</span>.</>,
        <>Funnels optimized to drive <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">average order value</span>.</>
      ],
      icon: <BrainCircuit className="w-6 h-6" />,
      colSpan: "md:col-span-2",
      delay: 0.1,
    },
    {
      title: language === 'es' ? "Cero Plantillas. 100% Personificadas" : "Zero Templates. 100% Personalized",
      description: language === 'es' ? (
        <>Desarrollamos interfaces totalmente personalizadas escritas a mano. Evitamos constructores pesados como WordPress o Elementor para garantizar una robustez técnica incontestable.</>
      ) : (
        <>We develop fully personalized, clean-coded interfaces from scratch. We skip bloated builders like WordPress or Elementor to ensure uncompromising technical performance.</>
      ),
      bullets: language === 'es' ? [
        <>Diseño exclusivo adaptativo para <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">celulares</span>.</>,
        <>Velocidad de carga de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">milisegundos</span>.</>,
        <>Cero plantillas pre-fabricadas <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">comunes</span>.</>,
        <>Arquitectura modular <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">escalable</span>.</>,
        <>Identidad visual <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">distintiva</span>.</>,
      ] : [
        <>Clean adaptive layouts focused on <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">mobile UI</span>.</>,
        <>Loading speed measured in <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">milliseconds</span>.</>,
        <>Zero generic visual templates <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">reused</span>.</>,
        <>Clean structured modular <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">components</span>.</>,
        <>Distinctive brand visual <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">identities</span>.</>,
      ],
      icon: <Sparkles className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.2,
    },
    {
      title: language === 'es' ? "Desarrollo de Alto Rendimiento" : "High-Performance Buildout",
      bullets: language === 'es' ? [
        <>Lanzamientos rápidos y <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">optimizados</span>.</>,
        <>Auditorías rigurosas de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">usabilidad</span>.</>,
        <>Código óptimo libre de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">fricción</span> o caídas.</>
      ] : [
        <>Fast, highly optimized <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">systems</span>.</>,
        <>Rigorous functional interactive <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">checks</span>.</>,
        <>Flawless interfaces built to <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">last</span>.</>
      ],
      icon: <Zap className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.3,
    },
    {
      title: language === 'es' ? "SEO Técnico Avanzado" : "Advanced Technical SEO",
      bullets: language === 'es' ? [
        <>Indexación verificada en <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">Search Console</span>.</>,
        <>Estructura semántica anti-penalizaciones <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">AI</span>.</>,
        <>Sitemaps y marcado <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">Schema.org</span> nativos.</>
      ] : [
        <>Full crawl compliance on Google <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">Search Console</span>.</>,
        <>Schema semantic setups to stand out <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">on results</span>.</>,
        <>Configured Sitemap.xml and robots <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">assets</span>.</>
      ],
      icon: <Search className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.4,
    },
    {
      title: language === 'es' ? "Ecosistemas Auto-Sustentables" : "Self-Sustaining Ecosystems",
      bullets: language === 'es' ? [
        <>Formularios inteligentes y agenda <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">integrada</span>.</>,
        <>Captación autónoma sin mantenimiento <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">diario</span>.</>,
        <>Canal de ventas propio sin intermediar <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">comisiones</span>.</>
      ] : [
        <>Smart leads forms and direct booking <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">widgets</span>.</>,
        <>Autopilot prospects tracking with <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">zero fuss</span>.</>,
        <>Own direct transactional paths, bypass <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">extra costs</span>.</>
      ],
      icon: <Bot className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.5,
    }
  ];

  // Themes config for electric unique colors for each card
  const cardThemes = [
    {
      iconColor: "text-[#3B7BFF]",
      borderColor: "border-[#145BFF]/35",
      activeBorderColor: "border-[#145BFF]/70",
      glowColor: "rgba(20,91,255,0.8)",
      bulletsColor: "bg-[#145BFF]",
      titleAccentColor: "text-[#3B7BFF]",
      rawColor: "#3B7BFF"
    },
    {
      iconColor: "text-[#FF9D00]",
      borderColor: "border-[#FF9D00]/35",
      activeBorderColor: "border-[#FF9D00]/70",
      glowColor: "rgba(255,157,0,0.8)",
      bulletsColor: "bg-[#FF9D00]",
      titleAccentColor: "text-[#FF9D00]",
      rawColor: "#FF9D00"
    },
    {
      iconColor: "text-[#A855F7]",
      borderColor: "border-[#A855F7]/35",
      activeBorderColor: "border-[#A855F7]/70",
      glowColor: "rgba(168,85,247,0.8)",
      bulletsColor: "bg-[#A855F7]",
      titleAccentColor: "text-[#A855F7]",
      rawColor: "#A855F7"
    },
    {
      iconColor: "text-[#39FF14]",
      borderColor: "border-[#39FF14]/35",
      activeBorderColor: "border-[#39FF14]/70",
      glowColor: "rgba(57,255,20,0.8)",
      bulletsColor: "bg-[#39FF14]",
      titleAccentColor: "text-[#39FF14]",
      rawColor: "#39FF14"
    },
    {
      iconColor: "text-[#00D4FF]",
      borderColor: "border-[#00D4FF]/35",
      activeBorderColor: "border-[#00D4FF]/70",
      glowColor: "rgba(0,212,255,0.8)",
      bulletsColor: "bg-[#00D4FF]",
      titleAccentColor: "text-[#00D4FF]",
      rawColor: "#00D4FF"
    }
  ];

  return (
    <section id="beneficios" className="pt-6 pb-4 md:pt-8 md:pb-8 relative">
      <style>{`
        @media (min-width: 768px) {
          .float-anim-0 { animation: float-premium 7s ease-in-out infinite; }
          .float-anim-1 { animation: float-premium 8s ease-in-out infinite 1.5s; }
          .float-anim-2 { animation: float-premium 6.5s ease-in-out infinite 0.5s; }
          .float-anim-3 { animation: float-premium 7.5s ease-in-out infinite 2s; }
          .float-anim-4 { animation: float-premium 6s ease-in-out infinite 1s; }
        }
        @keyframes float-premium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#145BFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0B3FBF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(20,91,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(20,91,255,0.8)',
              boxShadow: '0 0 15px rgba(20,91,255,0.5), inset 0 0 8px rgba(20,91,255,0.2)'
            }}
          >
            <Target className="w-4 h-4 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
            <span className="text-white font-body text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
              {language === 'es' ? 'Ventaja Competitiva' : 'Competitive Advantage'}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight mb-6"
          >
            {language === 'es' ? 'Tecnología Exclusiva para' : 'Exclusive Technology to'} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#145BFF] to-[#FFFFFF] italic font-light drop-shadow-[0_0_15px_rgba(20,91,255,0.5)]">
              {language === 'es' ? 'Dominar tu Mercado' : 'Dominate Your Market'}
            </span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#CFCFD4] font-body text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed flex flex-col gap-3 md:gap-4"
          >
            <p className="text-center px-2">
              {language === 'es' ? 'Aceleramos tu negocio integrando ' : 'We accelerate your business by integrating '}
              <motion.span
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
                {language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence'}
              </motion.span>
              {language === 'es' ? '.\nLogramos en días una precisión que a tu competencia le toma semanas.' : '.\nWe achieve in days the precision that takes your competition weeks.'}
            </p>
          </motion.div>
        </div>

        {/* Mobile View - Standard Stack */}
        <div className="grid grid-cols-1 md:hidden gap-4">
          {benefits.map((benefit, index) => {
            const theme = cardThemes[index];
            return (
              <motion.div 
                key={index} 
                className="w-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 1.5 }}
              >
                <div
                  className={`group relative rounded-3xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                    backdropFilter: 'blur(4px)',
                    border: `1px solid ${theme.rawColor}15`,
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.rawColor}10 0%, transparent 100%)` }}></div>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.rawColor}60, transparent)` }}></div>
                  </div>

                  {/* Corner Neon Glows */}
                  <motion.div 
                    animate={{ 
                      backgroundColor: [theme.rawColor, "#FFFFFF", theme.rawColor],
                      opacity: [0.35, 0.12, 0.35],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                    className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                  />
                  <motion.div 
                    animate={{ 
                      backgroundColor: ["#FFFFFF", theme.rawColor, "#FFFFFF"],
                      opacity: [0.12, 0.35, 0.12],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                    className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                  />

                  <div className="relative z-10 h-full flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-350 shrink-0"
                        style={{
                          backgroundColor: `${theme.rawColor}15`,
                          border: `1px solid ${theme.rawColor}70`,
                          boxShadow: `0 0 14px ${theme.rawColor}50, inset 0 0 6px ${theme.rawColor}30`,
                          color: theme.rawColor
                        }}
                      >
                        {benefit.icon}
                      </div>
                      <h3 className="text-lg font-heading text-white tracking-tight">
                        {index === 1 ? (
                          language === 'es' ? (
                            <>
                              Cero plantillas.{" "}
                              <span 
                                className="block mt-0.5"
                                style={{
                                  color: theme.rawColor,
                                  textShadow: `0 0 10px ${theme.rawColor}CC`
                                }}
                              >
                                100% personificadas
                              </span>
                            </>
                          ) : (
                            <>
                              Zero templates.{" "}
                              <span 
                                className="block mt-0.5"
                                style={{
                                  color: theme.rawColor,
                                  textShadow: `0 0 10px ${theme.rawColor}CC`
                                }}
                              >
                                100% personalized
                              </span>
                            </>
                          )
                        ) : (
                          <>
                            {benefit.title.split(" ").slice(0, -1).join(" ")}{" "}
                            <span 
                              style={{
                                color: theme.rawColor,
                                textShadow: `0 0 10px ${theme.rawColor}CC`
                              }}
                            >
                              {benefit.title.split(" ").slice(-1)}
                            </span>
                          </>
                        )}
                      </h3>
                    </div>

                    <ul className="space-y-2.5">
                      {benefit.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-[#CFCFD4]/80 font-body text-xs leading-relaxed font-light">
                          <div 
                            className="mt-1.2 w-1.5 h-1.5 rounded-full shrink-0" 
                            style={{
                              backgroundColor: theme.rawColor,
                              boxShadow: `0 0 8px ${theme.rawColor}`
                            }}
                          ></div>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {index === 0 && (
                      <div className="w-full shrink-0 relative min-h-[220px] max-h-[280px] mt-4">
                        <AnimatedDashboard />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tablet View - Sticky Scroll Card Stacking entering from Right */}
        <div ref={tabletContainerRef} className="hidden md:block lg:hidden relative w-full max-w-[1040px] mx-auto z-20 py-2" style={{ height: "220vh" }}>
          {/* Sticky Container */}
          <div className="sticky top-[11vh] h-[545px] w-full flex flex-col justify-start items-center z-20 px-6">
            
            {/* Top Indicator Header */}
            <div className="w-full max-w-[850px] flex justify-between items-center mb-6 px-4 shrink-0">
              <span className="text-xs font-mono text-white/35 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#145BFF]"></span>
                {language === 'es' ? "Desliza hacia abajo para apilar las tarjetas" : "Scroll down to stack cards"}
              </span>
              <div className="flex gap-2">
                {benefits.map((_, i) => (
                  <div 
                    key={i} 
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === activeSlide ? "22px" : "6px",
                      backgroundColor: i === activeSlide ? cardThemes[i].rawColor : "rgba(255, 255, 255, 0.15)",
                      boxShadow: i === activeSlide ? `0 0 12px ${cardThemes[i].glowColor}` : "none"
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Stacking Cards Container */}
            <div className="w-full max-w-[850px] h-[480px] relative select-none">
              {benefits.map((benefit, index) => {
                const theme = cardThemes[index];
                
                // Helper to fetch custom tablet descriptions and bullet highlights inline
                const isEs = language === 'es';
                let description = "";
                let bullets: React.ReactNode[] = [];

                if (index === 0) {
                  description = isEs 
                    ? "Diseñamos flujos interactivos que de forma natural y sin fricciones guían a tus visitas."
                    : "We design interactive, friction-free layouts that naturally guide your visitors.";
                  bullets = isEs ? [
                    <>Diseño con <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>mapas de calor</span> reales.</>,
                    <>Flujos de <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>conversión</span> limpios directos.</>,
                    <>Túneles optimizados de <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>alto retorno</span>.</>
                  ] : [
                    <>Engineered with real-session <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>heatmap insights</span>.</>,
                    <>High-impact <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>conversion funnels</span> without noise.</>,
                    <>Maximum efficiency <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>acquisition systems</span>.</>
                  ];
                } else if (index === 1) {
                  description = isEs
                    ? "Desarrollamos interfaces de alto rendimiento escritas a mano bajo un código nativo e impecable."
                    : "Our engineers build fully bespoke high-performance layouts with uncompromised clean custom-written code.";
                  bullets = isEs ? [
                    <>Modelado adaptativo para <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>celulares</span>.</>,
                    <>Carga inteligente en <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>milisegundos</span>.</>,
                    <>Integraciones del sistema <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>ultra-livianas</span>.</>
                  ] : [
                    <>Bespoke <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>mobile-first</span> layout precision.</>,
                    <>Lightning-fast <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>render loadtimes</span>.</>,
                    <>Zero boilerplate code, only <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>pure core</span> setups.</>
                  ];
                } else if (index === 2) {
                  description = isEs
                    ? "Lanzamientos optimizados libres de fricción combinando agilidad y la máxima robustez técnica."
                    : "Frictionless deployment pipelines engineered to deliver international speed and operational standards.";
                  bullets = isEs ? [
                    <>Lanzamientos veloces de <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>software</span>.</>,
                    <>Auditorías de <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>usabilidad</span> rigurosas.</>,
                    <>Sistemas estables sin <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>fricciones</span>.</>
                  ] : [
                    <>Instant delivery pipeline with zero <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>latency</span>.</>,
                    <>Rigorous user accessibility audits <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>included</span>.</>,
                    <>Enterprise-grade server stability under <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>high load</span>.</>
                  ];
                } else if (index === 3) {
                  description = isEs
                    ? "Indexación semántica avanzada y estructura de datos optimizada para posicionar tu marca en Google."
                    : "Smart technical crawl architectures and structured markup designed to boost indexing and results.";
                  bullets = isEs ? [
                    <>Indexación verificada <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>Search Console</span>.</>,
                    <>Estructura semántica anti <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>Filtros AI</span>.</>,
                    <>Formatos Schema y datos <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>estructurados</span>.</>
                  ] : [
                    <>Verified crawling in <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>Search Console</span>.</>,
                    <>Anti-AI-penalty semantic <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>structures</span>.</>,
                    <>Built-in metadata <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>Schema setups</span>.</>
                  ];
                } else {
                  description = isEs
                    ? "Sistemas automáticos de captación listos para nutrir leads y agendar reuniones sin costes extra."
                    : "Automated leads generation forms and reservation booking flows running on autopilot with zero fees.";
                  bullets = isEs ? [
                    <>Agendas conectadas y widgets <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>directos</span>.</>,
                    <>Captura automatizada constante de <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>leads</span>.</>,
                    <>Canal directo propio sin <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>intermediarios</span>.</>
                  ] : [
                    <>Integrated booking <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>calendars</span>.</>,
                    <>Autopilot system leads <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>capturing</span>.</>,
                    <>Direct channel sales with <span className="text-white font-semibold" style={{ textShadow: "0 0 10px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,1)" }}>zero fees</span>.</>
                  ];
                }

                // Stacking calculations: cards sliding from the right one by one and stacking
                let cardX = "115%";
                let cardScale = 1;
                let cardY = 0;
                let cardOpacity = 0;
                let cardRotate = 0;
                let pointerEvents: "auto" | "none" = "none";

                if (index < activeSlide) {
                  // Stacked back cards (placed slightly behind, stacked vertically)
                  const depth = activeSlide - index;
                  cardX = "0%";
                  cardScale = Math.max(0.85, 1 - depth * 0.035);
                  cardY = -depth * 8;
                  cardOpacity = Math.max(0.2, 1 - depth * 0.22);
                  cardRotate = -depth * 1.5;
                  pointerEvents = "none";
                } else if (index === activeSlide) {
                  // Currently active card (fully centered, readable & clickable)
                  cardX = "0%";
                  cardScale = 1;
                  cardY = 0;
                  cardOpacity = 1;
                  cardRotate = 0;
                  pointerEvents = "auto";
                } else {
                  // Future cards waiting on the right side
                  cardX = "115%";
                  cardScale = 1.02;
                  cardY = 30;
                  cardOpacity = 0;
                  cardRotate = 4;
                  pointerEvents = "none";
                }

                return (
                  <motion.div
                    key={index}
                    animate={{
                      x: cardX,
                      scale: cardScale,
                      y: cardY,
                      opacity: cardOpacity,
                      rotate: cardRotate,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 90,
                      damping: 18,
                      mass: 0.95
                    }}
                    className="absolute inset-x-0 inset-y-0 rounded-3xl p-6 md:p-10 flex flex-col justify-between overflow-hidden border border-white/5 bg-[#050508] bg-gradient-to-br from-[#0a0d17] to-[#04060a] shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                    style={{
                      borderColor: index === activeSlide ? theme.activeBorderColor : theme.borderColor,
                      boxShadow: index === activeSlide 
                        ? `0 35px 80px rgba(0,0,0,0.9), 0 0 40px ${theme.glowColor.replace('0.8', '0.35')}`
                        : `0 20px 50px rgba(0,0,0,0.7)` ,
                      pointerEvents,
                      zIndex: index === activeSlide ? 30 : 20 - Math.abs(activeSlide - index)
                    }}
                  >
                    {/* Glowing Accent Layer */}
                    <div 
                      className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${theme.glowColor.replace('0.8', '0.08')} 0%, transparent 100%)`,
                        opacity: index === activeSlide ? 1 : 0
                      }}
                    />

                    <motion.div 
                      className="w-full h-full flex flex-row gap-8 items-stretch relative z-10"
                      animate={{ 
                        opacity: index === activeSlide ? 1 : 0,
                        filter: index === activeSlide ? "blur(0px)" : "blur(12px)"
                      }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      {/* Left Side Content */}
                      <div className="flex flex-col flex-1 justify-between h-full">
                        <div>
                          {/* Header Icon & Title */}
                          <div className="flex items-center gap-4 mb-5">
                            <div 
                              className={`w-12 h-12 rounded-2xl bg-[#080c18] border flex items-center justify-center shrink-0 transition-all duration-300 ${theme.iconColor}`}
                              style={{
                                borderColor: theme.glowColor.replace('0.8', '0.6'),
                                boxShadow: `0 0 16px ${theme.glowColor.replace('0.8', '0.45')}, inset 0 0 8px ${theme.glowColor.replace('0.8', '0.3')}`,
                                filter: `drop-shadow(0 0 10px ${theme.glowColor.replace('0.8', '0.5')})`
                              }}
                            >
                              {benefit.icon}
                            </div>
                            <h3 className="text-xl md:text-2xl font-heading font-semibold text-white tracking-tight leading-tight">
                              {benefit.title.split(" ").slice(0, -1).join(" ")}{" "}
                              <span 
                                className={theme.titleAccentColor}
                                style={{
                                  filter: `drop-shadow(0 0 10px ${theme.glowColor})`
                                }}
                              >
                                {benefit.title.split(" ").slice(-1)}
                              </span>
                            </h3>
                          </div>

                          {/* Shorter description */}
                          <p className="text-[#CFCFD4]/85 font-body text-sm md:text-base leading-relaxed mb-6 font-light">
                            {description}
                          </p>

                          {/* Bullets layout inside Active Card */}
                          <ul className="space-y-3.5 mt-2 font-light">
                            {bullets.map((bullet, i) => (
                              <li key={i} className="flex items-start gap-3.5 text-[#CFCFD4]/90 font-body text-sm md:text-base leading-relaxed">
                                <div 
                                  className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${theme.bulletsColor}`}
                                  style={{
                                    boxShadow: `0 0 8px ${theme.glowColor}`
                                  }}
                                ></div>
                                <span className="text-sm md:text-base">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <span className="text-[10px] font-mono tracking-wider text-white/35 uppercase">
                            {language === 'es' ? `Cualidad ${index + 1} de 5` : `Quality ${index + 1} of 5`}
                          </span>
                          <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-3 py-1 rounded-full font-medium tracking-wider">
                            Active Edge
                          </span>
                        </div>
                      </div>

                      {/* Interactive Right Graphic Sidebar tailored to Slide context */}
                      <div className="flex flex-col w-[260px] shrink-0 relative h-[320px] self-center justify-center">
                        {index === 0 && (
                          <div className="w-full h-full relative">
                            <AnimatedDashboard />
                          </div>
                        )}

                        {index === 1 && (
                          <div className="flex flex-col w-full h-[320px] self-center justify-center p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-black/60 to-[#0c0f1d]/40 backdrop-blur-md overflow-hidden relative">
                            {/* Mini Performance Dashboard */}
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Performance.tsx</span>
                              <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></div>
                            </div>
                            <div className="space-y-3.5 font-mono text-[11px] leading-normal">
                              <div className="text-white/35">{"// Zero build bloat:"}</div>
                              <div className="text-[#FF9D00] flex items-center justify-between bg-white/[0.02] p-2 rounded border border-white/5">
                                <span>Lighthouse:</span>
                                <span className="font-bold text-[#39FF14]" style={{ textShadow: "0 0 8px rgba(57,255,20,0.6)" }}>100 / 100</span>
                              </div>
                              <div className="text-white/70">{"import { FastRoute } from 'pure';" }</div>
                              <div className="text-white/80">{"const App = () => {"}</div>
                              <div className="text-[#3B7BFF] pl-3">{"return <OptimizeSpeed />;"}</div>
                              <div className="text-white/80">{"};"}</div>
                              <div className="text-white/30 pt-1">{"// Bundle size: 14KB"}</div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full bg-[#FF9D00]/10 blur-xl pointer-events-none"></div>
                          </div>
                        )}

                        {index === 2 && (
                          <div className="flex flex-col w-full h-[320px] self-center justify-center p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-black/60 to-[#0c0f1d]/40 backdrop-blur-md overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Speed Monitor</span>
                              <span className="text-[#A855F7] font-mono text-[10px] font-bold">OPTIMIZED</span>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-[11px] text-white/60 mb-1">
                                  <span>Time to First Byte</span>
                                  <span className="text-[#A855F7] font-bold font-mono">0.08s</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[#A855F7] h-full rounded-full w-[15%]" style={{ boxShadow: "0 0 10px #A855F7" }}></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[11px] text-white/60 mb-1">
                                  <span>Largest Contentful Paint</span>
                                  <span className="text-[#39FF14] font-bold font-mono">0.42s</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-[#39FF14] h-full rounded-full w-[20%]" style={{ boxShadow: "0 0 10px #39FF14" }}></div>
                                </div>
                              </div>
                              <div className="p-3 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 text-center mt-3">
                                <div className="text-[9px] font-mono text-white/40 tracking-wider">UX LATENCY GRADE</div>
                                <div className="text-lg font-heading font-black text-white tracking-widest drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" style={{ textShadow: "0 0 10px #A855F7" }}>A+ ULTRA</div>
                              </div>
                            </div>
                            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-[#A855F7]/10 blur-xl pointer-events-none"></div>
                          </div>
                        )}

                        {index === 3 && (
                          <div className="flex flex-col w-full h-[320px] self-center justify-center p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-black/60 to-[#0c0f1d]/40 backdrop-blur-md overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Google SERP</span>
                              <span className="text-[#39FF14] font-mono text-[10px] font-bold">RANK #1</span>
                            </div>
                            <div className="space-y-3.5">
                              <div className="space-y-1">
                                <div className="text-[9px] text-white/30 flex items-center gap-1 font-mono">
                                  <span>https://valiosa.com</span>
                                  <span>›</span>
                                  <span>conversiones</span>
                                </div>
                                <div className="text-[#3B7BFF] font-heading font-semibold text-xs hover:underline cursor-pointer">
                                  Arquitectura Web de Alta Conversión
                                </div>
                                <div className="text-white/60 text-[10px] leading-relaxed">
                                  Estructuras web de alto impacto optimizadas para buscadores Google, mapas de calor y velocidad ultra extrema...
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                <span className="text-[9px] font-mono text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/20 px-2 py-0.5 rounded">Semantic rich snippet</span>
                              </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#39FF14]/10 blur-xl pointer-events-none"></div>
                          </div>
                        )}

                        {index === 4 && (
                          <div className="flex flex-col w-full h-[320px] self-center justify-center p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-black/60 to-[#0c0f1d]/40 backdrop-blur-md overflow-hidden relative">
                            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Automation Engine</span>
                              <span className="text-[#00D4FF] font-mono text-[10px] font-bold">AUTOPILOT</span>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white/[0.02] transition-colors duration-200">
                                <div className="w-6 h-6 rounded bg-[#00D4FF]/15 border border-[#00D4FF]/25 flex items-center justify-center text-[#00D4FF] text-[10px] font-mono font-semibold">1</div>
                                <div className="flex-1">
                                  <div className="text-[11px] text-white/80 font-semibold leading-none">Formulario Enviado</div>
                                  <span className="text-[8px] text-white/40 font-mono">Conversión directa</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white/[0.02] transition-colors duration-200">
                                <div className="w-6 h-6 rounded bg-[#FF9D00]/15 border border-[#FF9D00]/25 flex items-center justify-center text-[#FF9D00] text-[10px] font-mono font-semibold">2</div>
                                <div className="flex-1">
                                  <div className="text-[11px] text-white/80 font-semibold leading-none">Google Calendar</div>
                                  <span className="text-[8px] text-white/40 font-mono">Reunión programada</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 p-1.5 rounded hover:bg-white/[0.02] transition-colors duration-200">
                                <div className="w-6 h-6 rounded bg-[#39FF14]/15 border border-[#39FF14]/25 flex items-center justify-center text-[#39FF14] text-[10px] font-mono font-semibold">3</div>
                                <div className="flex-1">
                                  <div className="text-[11px] text-white/80 font-semibold leading-none">Slack & Mail Triggered</div>
                                  <span className="text-[8px] text-white/40 font-mono">Notificación de Lead</span>
                                </div>
                              </div>
                            </div>
                            <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-[#00D4FF]/10 blur-xl pointer-events-none"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop View - Bento Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
          {benefits.map((benefit, index) => {
            const theme = cardThemes[index];
            return (
              <motion.div 
                key={index} 
                className={`${benefit.colSpan}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 1.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: benefit.delay, type: "spring", stiffness: 50 }}
                  className={`group relative rounded-3xl p-8 md:p-10 overflow-hidden h-full`}
                  style={{
                    background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.rawColor}10 0%, transparent 100%)` }}></div>
                    <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${theme.rawColor}60, transparent)` }}></div>
                  </div>

                  {/* Corner Neon Glows */}
                  <motion.div 
                    animate={{ 
                      backgroundColor: [theme.rawColor, "#FFFFFF", theme.rawColor],
                      opacity: [0.35, 0.12, 0.35],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                    className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                  />
                  <motion.div 
                    animate={{ 
                      backgroundColor: ["#FFFFFF", theme.rawColor, "#FFFFFF"],
                      opacity: [0.12, 0.35, 0.12],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                    className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
                  />

                  <div className="relative z-10 h-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <div className="flex flex-col flex-1">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: `${theme.rawColor}15`,
                          border: `1px solid ${theme.rawColor}70`,
                          boxShadow: `0 0 16px ${theme.rawColor}60, inset 0 0 8px ${theme.rawColor}30`,
                          color: theme.rawColor
                        }}
                      >
                        {benefit.icon}
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-heading text-white mb-4 tracking-tight transition-all duration-300">
                        {benefit.title.split(" ").slice(0, -1).join(" ")}{" "}
                        <span 
                          style={{
                            color: theme.rawColor,
                            textShadow: `0 0 12px ${theme.rawColor}80`
                          }}
                        >
                          {benefit.title.split(" ").slice(-1)}
                        </span>
                      </h3>
                      
                      {benefit.description && (
                        <p className={`hidden md:block ${index === 0 ? '' : 'lg:hidden'} text-[#CFCFD4]/70 font-body text-sm leading-relaxed mb-6 font-light`}>
                          {benefit.description}
                        </p>
                      )}
                      
                      <ul className={`space-y-3 mt-4 ${index === 0 ? 'lg:mt-auto' : 'md:mt-auto'}`}>
                        {benefit.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3 text-[#CFCFD4]/80 font-body text-sm md:text-base leading-relaxed font-light">
                            <div 
                              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                              style={{
                                backgroundColor: theme.rawColor,
                                boxShadow: `0 0 8px ${theme.rawColor}`
                              }}
                            ></div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {index === 0 && (
                      <div className="flex flex-col w-full lg:w-[42%] xl:w-[360px] shrink-0 relative min-h-[280px] max-h-[360px] mt-6 lg:mt-0 xl:ml-auto">
                        <AnimatedDashboard />
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default BenefitsSection;
