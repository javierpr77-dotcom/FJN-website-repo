import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Play, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Video,
  Globe, 
  Layers, 
  Sparkles, 
  Calendar, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Zap, 
  Target
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";

interface BulletItem {
  text: string;
  highlight: string;
}

interface AlternativeVideo {
  es: string;
  en: string;
  webm: string;
  websiteUrl?: string;
}

interface Project {
  id: string;
  title: { es: string; en: string };
  subtitle: { es: string; en: string };
  description: { es: string; en: string };
  bullets?: {
    es: BulletItem[];
    en: BulletItem[];
  };
  tags: string[];
  videoUrlWebm: string;
  videoUrlMp4: string;
  placeholderUrl: string;
  stats: {
    value: string;
    label: { es: string; en: string };
  };
  websiteUrl?: string;
  alternatives?: AlternativeVideo[];
}

const getTagIconInfo = (tag: string) => {
  const t = tag.toLowerCase();
  
  if (t.includes("servicio") || t.includes("web") || t.includes("ajnet") || t.includes("comercial")) {
    return {
      icon: <Globe className="w-4 h-4 text-blue-400 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(96,165,250,0.5)",
        boxShadow: "0 0 14px rgba(96,165,250,0.45), inset 0 0 6px rgba(96,165,250,0.25)",
        background: "rgba(96,165,250,0.12)",
      }
    };
  }
  if (t.includes("parallax") || t.includes("interactivo") || t.includes("transición") || t.includes("transicion") || t.includes("editorial")) {
    return {
      icon: <Layers className="w-4 h-4 text-indigo-350 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(129,140,248,0.5)",
        boxShadow: "0 0 14px rgba(129,140,248,0.45), inset 0 0 6px rgba(129,140,248,0.25)",
        background: "rgba(129,140,248,0.12)",
      }
    };
  }
  if (t.includes("cósmico") || t.includes("cosmico") || t.includes("boutique") || t.includes("exclusivo") || t.includes("persuasión") || t.includes("persuasion")) {
    return {
      icon: <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(251,191,36,0.5)",
        boxShadow: "0 0 14px rgba(251,191,36,0.45), inset 0 0 6px rgba(251,191,36,0.25)",
        background: "rgba(251,191,36,0.12)",
      }
    };
  }
  if (t.includes("agendamiento") || t.includes("calendario") || t.includes("cita") || t.includes("sincroniz")) {
    return {
      icon: <Calendar className="w-4 h-4 text-rose-350 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(251,113,133,0.5)",
        boxShadow: "0 0 14px rgba(251,113,133,0.45), inset 0 0 6px rgba(251,113,133,0.25)",
        background: "rgba(251,113,133,0.12)",
      }
    };
  }
  if (t.includes("tienda") || t.includes("e-commerce")) {
    return {
      icon: <ShoppingBag className="w-4 h-4 text-emerald-350 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(52,211,153,0.5)",
        boxShadow: "0 0 14px rgba(52,211,153,0.45), inset 0 0 6px rgba(52,211,153,0.25)",
        background: "rgba(52,211,153,0.12)",
      }
    };
  }
  if (t.includes("stripe") || t.includes("paypal") || t.includes("pago") || t.includes("tarjeta")) {
    return {
      icon: <CreditCard className="w-4 h-4 text-cyan-350 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(34,211,238,0.5)",
        boxShadow: "0 0 14px rgba(34,211,238,0.45), inset 0 0 6px rgba(34,211,238,0.25)",
        background: "rgba(34,211,238,0.12)",
      }
    };
  }
  if (t.includes("convers") || t.includes("conversión")) {
    return {
      icon: <TrendingUp className="w-4 h-4 text-teal-350 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(45,212,191,0.5)",
        boxShadow: "0 0 14px rgba(45,212,191,0.45), inset 0 0 6px rgba(45,212,191,0.25)",
        background: "rgba(45,212,191,0.12)",
      }
    };
  }
  if (t.includes("velocidad") || t.includes("rápida") || t.includes("rapida") || t.includes("veloz")) {
    return {
      icon: <Zap className="w-4 h-4 text-blue-400 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(20,91,255,0.6)",
        boxShadow: "0 0 14px rgba(20,91,255,0.55), inset 0 0 6px rgba(20,91,255,0.3)",
        background: "rgba(20,91,255,0.15)",
      }
    };
  }
  if (t.includes("campaña") || t.includes("optimización") || t.includes("optimizacion") || t.includes("ads") || t.includes("testing")) {
    return {
      icon: <Target className="w-4 h-4 text-purple-355 shrink-0" />,
      glowStyle: {
        borderColor: "rgba(192,132,252,0.5)",
        boxShadow: "0 0 14px rgba(192,132,252,0.45), inset 0 0 6px rgba(192,132,252,0.25)",
        background: "rgba(192,132,252,0.12)",
      }
    };
  }
  return {
    icon: <Sparkles className="w-4 h-4 text-purple-355 shrink-0" />,
    glowStyle: {
      borderColor: "rgba(192,132,252,0.5)",
      boxShadow: "0 0 14px rgba(192,132,252,0.45), inset 0 0 6px rgba(192,132,252,0.25)",
      background: "rgba(192,132,252,0.12)",
    }
  };
};


interface VideoPlayerProps {
  sources: string[];
  isMuted: boolean;
  isActive: boolean;
  onVideoRef: (el: HTMLVideoElement | null) => void;
  language: string;
}

const PortfolioVideoPlayer = ({ sources, isMuted, isActive, onVideoRef, language }: VideoPlayerProps) => {
  const [currentSourceIdx, setCurrentSourceIdx] = useState(0);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Reset index and error when sources change (such as switching tabs)
  useEffect(() => {
    setHasVideoError(false);
    setCurrentSourceIdx(0);
  }, [sources]);

  // Synchronize playing and pausing on active state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sources.length === 0 || hasVideoError) return;

    if (isActive) {
      const timer = setTimeout(() => {
        video.play().catch((err) => {
          console.warn("Autoplay check failed or user interaction required:", err);
        });
      }, 50);
      return () => clearTimeout(timer);
    } else {
      video.pause();
    }
  }, [isActive, sources, currentSourceIdx, hasVideoError]);

  if (sources.length === 0) {
    return (
      <div className="absolute inset-0 bg-[#050507] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 rounded-full border border-t-[#145BFF] border-white/20 animate-spin mb-4" />
      </div>
    );
  }

  const activeSource = sources[currentSourceIdx] || "";

  const handleVideoError = () => {
    console.warn(`Video source load failed: ${activeSource}`);
    if (currentSourceIdx < sources.length - 1) {
      console.log(`Advancing to next video fallback source: ${sources[currentSourceIdx + 1]}`);
      setCurrentSourceIdx((prev) => prev + 1);
    } else {
      console.error("All available video sources failed to load; invoking visual placeholder");
      setHasVideoError(true);
    }
  };

  return (
    <div className="w-full h-full bg-[#050507] relative select-none">
      {!hasVideoError && activeSource ? (
        <video
          key={activeSource}
          ref={(el) => {
            videoRef.current = el;
            onVideoRef(el);
          }}
          src={activeSource}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          playsInline
          muted={isMuted || !isActive}
          loop
          autoPlay={isActive}
          onContextMenu={(e) => e.preventDefault()}
          onError={handleVideoError}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div className="absolute inset-0 bg-[#050507]/95 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-4">
            <Video className="w-5 h-5 text-[#145BFF]" />
          </div>
          <span className="text-stone-300 font-heading text-sm font-light">
            {language === 'es' ? 'Previsualización del Proyecto' : 'Project Showreel'}
          </span>
        </div>
      )}
    </div>
  );
};

const PortfolioSection = () => {
  const { language } = useLanguage();
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const renderBulletWithNeon = (text: string, highlight: string) => {
    if (!highlight) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span 
              key={i} 
              className="text-[#00F3FF] drop-shadow-[0_0_12px_rgba(0,243,255,0.95)] font-semibold transition-all duration-300"
            >
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const projects: Project[] = useMemo(() => [
    {
      id: "servicios-personificadas",
      title: { es: "Páginas de Servicios Personificadas", en: "Personalized Service Websites" },
      subtitle: { es: "Trabajos Destacados // Frimium", en: "Featured Works // Frimium" },
      description: { es: "", en: "" },
      bullets: {
        es: [
          { text: "Diseño inmersivo con transiciones ultra fluidas", highlight: "ultra fluidas" },
          { text: "Carga instantánea optimizada para conversión", highlight: "Carga instantánea" },
          { text: "Selector dinámico de planes integrado", highlight: "Selector dinámico" }
        ],
        en: [
          { text: "Immersive layout with fluid web animations", highlight: "fluid" },
          { text: "Instant landing speed optimization", highlight: "Instant" },
          { text: "Dynamic active pricing plan selectors", highlight: "Dynamic" }
        ]
      },
      tags: ["Servicios Web", "Efecto Parallax", "Animación Cósmica", "Agendamiento Activo"],
      videoUrlWebm: "/portfolio-servicios-personificadas.webm",
      videoUrlMp4: "/portfolio-servicios-personificadas.webm",
      placeholderUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      stats: {
        value: "100%",
        label: { es: "Fidelización de Clientes", en: "User Experience Rating" }
      },
      alternatives: [
        {
          es: "Demo 1",
          en: "Demo 1",
          webm: "/portfolio-servicios-personificadas.webm",
          websiteUrl: "ajjnetpr.com"
        },
        {
          es: "Demo 2",
          en: "Demo 2",
          webm: "/portfolio-servicios-personificadas1.webm.webm.webm"
        }
      ]
    },
    {
      id: "tiendas",
      title: { es: "Tiendas Online", en: "Online Stores" },
      subtitle: { es: "Trabajos Destacados // Frimium", en: "Featured Works // Frimium" },
      description: { es: "", en: "" },
      bullets: {
        es: [
          { text: "Checkout de alta velocidad sin fricción", highlight: "sin fricción" },
          { text: "Tarjetas y pasarelas de pago globales", highlight: "globales" },
          { text: "Panel intuitivo de control autogestionable", highlight: "autogestionable" }
        ],
        en: [
          { text: "Frictionless checkout paths in three steps", highlight: "Frictionless" },
          { text: "Global secure payment gateways integration", highlight: "gateways" },
          { text: "Simple custom self-managed portal system", highlight: "self-managed" }
        ]
      },
      tags: ["Tienda Online", "Stripe & PayPal Pasarelas", "Conversión Elevada", "Panel de Control Simple"],
      videoUrlWebm: "/portfolio-tiendas.webm.webm",
      videoUrlMp4: "/portfolio-tiendas.webm.webm",
      placeholderUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      stats: {
        value: "3x",
        label: { es: "Retorno de Inversión Promedio", en: "Average Return on Investment" }
      }
    },
    {
      id: "landings",
      title: { es: "Landing Pages Premium", en: "Premium Landing Pages" },
      subtitle: { es: "Trabajos Destacados // Frimium", en: "Featured Works // Frimium" },
      description: { es: "", en: "" },
      bullets: {
        es: [
          { text: "Carga rápida, Diseño premium", highlight: "Carga rápida" },
          { text: "Arquitectura persuasiva de conversión directa", highlight: "conversión directa" },
          { text: "Optimización SEO avanzada lista para pauta", highlight: "Optimización SEO" }
        ],
        en: [
          { text: "Fast load, Premium design", highlight: "Fast load" },
          { text: "Direct clinical conversion design flow", highlight: "conversion" },
          { text: "Advanced traffic strategy SEO setup", highlight: "SEO" }
        ]
      },
      tags: ["Alta Conversión", "Persuasión Clínica", "Optimización Integral", "A/B Testing Ready"],
      videoUrlWebm: "/portfolio-landings.webm",
      videoUrlMp4: "/portfolio-landings.webm.mp4",
      placeholderUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      stats: {
        value: "< 0.9s",
        label: { es: "Velocidad de Carga Crítica", en: "Critical Loading Speed" }
      },
      websiteUrl: "tubodaalamedida.com"
    }
  ], []);

  const flatItems = useMemo(() => {
    const items: { projectIndex: number; videoIndex: number }[] = [];
    projects.forEach((proj, projIdx) => {
      if (proj.alternatives && proj.alternatives.length > 0) {
        proj.alternatives.forEach((_, altIdx) => {
          items.push({ projectIndex: projIdx, videoIndex: altIdx });
        });
      } else {
        items.push({ projectIndex: projIdx, videoIndex: 0 });
      }
    });
    return items;
  }, [projects]);

  const [currentFlatIndex, setCurrentFlatIndex] = useState(0);

  const activeIndex = flatItems[currentFlatIndex]?.projectIndex ?? 0;
  const activeVideoIndex = flatItems[currentFlatIndex]?.videoIndex ?? 0;

  const handleNext = () => {
    setCurrentFlatIndex((prev) => (prev + 1) % flatItems.length);
  };

  const handlePrev = () => {
    setCurrentFlatIndex((prev) => (prev - 1 + flatItems.length) % flatItems.length);
  };

  return (
    <section id="portfolio" className="pt-6 pb-8 md:pt-10 md:pb-12 relative bg-transparent overflow-hidden">
      {/* Background radial soft ambient lights */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full blur-[150px] pointer-events-none z-[-1] opacity-80"
        style={{
          background: 'radial-gradient(circle at center, rgba(20,91,255,0.15) 0%, rgba(79,132,255,0.04) 50%, transparent 75%)'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(20,91,255,0.08) 0%, rgba(20,91,255,0.03) 100%)',
              border: '1px solid rgba(20,91,255,0.2)',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#145BFF] animate-pulse drop-shadow-[0_0_5px_rgba(20,91,255,0.8)]" />
            <span className="text-[#F2F2F4] font-body text-xs tracking-widest uppercase font-semibold">
              {language === 'es' ? 'Portafolio' : 'Portfolio'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-heading text-[#F2F2F4] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 tracking-tight font-extralight"
          >
            {language === 'es' ? 'Trabajos' : 'Featured'}{' '}
            <span className="bg-gradient-to-r from-[#145BFF] via-[#4F84FF] to-[#145BFF] bg-clip-text text-transparent italic font-light">
              {language === 'es' ? 'Destacados' : 'Works'}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#CFCFD4] font-body text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            {/* Desktop version */}
            <span className="hidden sm:inline">
              {language === 'es' ? (
                <>
                  Diseñamos experiencias digitales de{" "}
                  <span className="font-semibold bg-gradient-to-r from-[#145BFF] via-[#7DD3FC] to-[#00FFFF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(20,91,255,0.55)]">
                    alto impacto
                  </span>{" "}
                  que capturan la atención desde el primer instante y convierten visitas en clientes leales.
                </>
              ) : (
                <>
                  We build{" "}
                  <span className="font-semibold bg-gradient-to-r from-[#145BFF] via-[#7DD3FC] to-[#00FFFF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(20,91,255,0.55)]">
                    high-performance
                  </span>{" "}
                  digital experiences designed to capture attention instantly and turn traffic into loyal customers.
                </>
              )}
            </span>
            {/* Mobile version */}
            <span className="sm:hidden">
              {language === 'es' ? (
                <>
                  Diseñamos experiencias digitales de{" "}
                  <span className="font-semibold bg-gradient-to-r from-[#145BFF] via-[#7DD3FC] to-[#00FFFF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(20,91,255,0.55)]">
                    alto impacto
                  </span>{" "}
                  que convierten visitas en clientes.
                </>
              ) : (
                <>
                  We build{" "}
                  <span className="font-semibold bg-gradient-to-r from-[#145BFF] via-[#7DD3FC] to-[#00FFFF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(20,91,255,0.55)]">
                    high-performance
                  </span>{" "}
                  digital experiences that turn traffic into customers.
                </>
              )}
            </span>
          </motion.p>
        </div>

        {/* Outer Grid: Visual Card & Specs Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Card details */}
          <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-tight ${
                    projects[activeIndex].id === "landings"
                      ? "bg-gradient-to-r from-sky-400 via-blue-200 to-white bg-clip-text text-transparent font-semibold shadow-sm drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                      : projects[activeIndex].id === "servicios-personificadas"
                      ? "bg-gradient-to-r from-[#145BFF] via-[#7DD3FC] to-white bg-clip-text text-transparent font-semibold drop-shadow-[0_0_12px_rgba(20,91,255,0.3)]"
                      : projects[activeIndex].id === "tiendas"
                      ? "bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-white bg-clip-text text-transparent font-semibold drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      : "text-white"
                  }`}>
                    {language === 'es' ? projects[activeIndex].title.es : projects[activeIndex].title.en}
                  </h3>
                </div>

                {projects[activeIndex].bullets && (
                  <ul className="space-y-4 pt-1">
                    {(language === 'es' ? projects[activeIndex].bullets.es : projects[activeIndex].bullets.en).map((bullet, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + 0.1 }}
                        className="flex items-start gap-3.5 text-[#CFCFD4] font-body text-base leading-relaxed font-light transition-all duration-300"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#145BFF] shrink-0 mt-0.5" />
                        <span className="relative z-10">{renderBulletWithNeon(bullet.text, bullet.highlight)}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {/* Tags with futuristic vertical staggered floating effect */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {projects[activeIndex].tags.map((tag, i) => {
                    const info = getTagIconInfo(tag);
                    return (
                      <motion.div 
                        key={i}
                        animate={{
                          y: [0, -6, 0]
                        }}
                        transition={{
                          duration: 3 + i * 0.15,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                        className="group/tag relative flex items-center justify-center w-9 h-9 rounded-full border text-slate-300 backdrop-blur-md transition-all duration-300 select-none cursor-help"
                        style={info.glowStyle}
                      >
                        {info.icon}
                        {/* Premium tooltip on hover */}
                        <span className="absolute bottom-full mb-2 scale-0 group-hover/tag:scale-100 transition-all duration-200 origin-bottom bg-black/90 text-white text-[10px] uppercase font-mono tracking-wider px-2 py-1 rounded border border-white/10 pointer-events-none whitespace-nowrap z-50 shadow-md">
                          {tag}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Card Stacking */}
          <div className="lg:col-span-8 relative w-full aspect-[16/10] sm:aspect-[16/9.5] md:aspect-[16/9.2] lg:aspect-[16/9] flex items-center justify-center order-1 lg:order-2 overflow-visible">
            
            {/* The Interactive Carousel Frame containing the 3D overlapping stack with expanded max-width */}
            <div className="relative w-full h-full max-w-3xl lg:max-w-4xl flex items-center justify-center overflow-visible">

              {/* Stack items render */}
              {projects.map((project, idx) => {
                // Calculate position relative to active element
                let offset = idx - activeIndex;
                if (offset < 0) {
                  offset += projects.length; // cycle back
                }
                
                // Only render active card + next 2 for pristine visual depth stack
                const isTop = offset === 0;
                const isUnder1 = offset === 1;
                const isUnder2 = offset === 2;
                const isVisible = isTop || isUnder1 || isUnder2;

                if (!isVisible) return null;

                return (
                  <motion.div
                    key={project.id}
                    animate={{
                      scale: isTop ? 1 : isUnder1 ? 0.94 : 0.88,
                      y: isTop ? 0 : isUnder1 ? 25 : 50,
                      zIndex: isTop ? 10 : isUnder1 ? 9 : 8,
                      opacity: isTop ? 1 : isUnder1 ? 0.7 : 0.35,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    onClick={() => {
                      if (!isTop) {
                        const targetFlatIdx = flatItems.findIndex(item => item.projectIndex === idx);
                        if (targetFlatIdx !== -1) {
                          setCurrentFlatIndex(targetFlatIdx);
                        }
                      }
                    }}
                    className={`absolute w-full aspect-[16/9] rounded-[1.5rem] md:rounded-[2.2rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.15)] backdrop-blur-md ${
                      isTop ? "cursor-default" : "cursor-pointer hover:border-white/20"
                    }`}
                  >
                    {/* Extreme premium glowing neon aura behind the active video player */}
                    {isTop && (
                      <div className="absolute inset-4 bg-[#145BFF]/15 rounded-[1.5rem] md:rounded-[2.2rem] blur-[35px] pointer-events-none z-[-1] animate-pulse duration-3000" />
                    )}

                    {/* Corner high-gloss gradient edge lighting */}
                    <div 
                      className="absolute inset-0 z-20 pointer-events-none p-[1.5px] rounded-[1.5rem] md:rounded-[2.2rem]"
                      style={{
                        background: isTop 
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(20,91,255,0.4) 50%, rgba(255,255,255,0.02) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                    />

                    {/* Active URL tag overlay - Centered perfectly, integrated FLUSH with the video border for a custom integrated browser frame design */}
                    {(() => {
                      if (!isTop) return null;
                      const activeUrl = project.alternatives && project.alternatives.length > 0
                        ? project.alternatives[activeVideoIndex]?.websiteUrl
                        : project.websiteUrl;
                      
                      if (!activeUrl) return null;

                      return (
                        <motion.a 
                          key={`url-badge-${project.id}-${activeUrl}`}
                          initial={{ opacity: 0, y: -20, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, x: "-50%" }}
                          exit={{ opacity: 0, y: -20, x: "-50%" }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          href={`https://${activeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-0 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-b-2xl border-x border-b border-white/10 bg-[#050507]/90 hover:bg-[#145BFF]/20 active:scale-95 backdrop-blur-md text-white/95 text-xs sm:text-sm font-mono select-none transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer group"
                          title={language === 'es' ? "Visitar sitio web" : "Visit website"}
                        >
                          <Globe className="w-3.5 h-3.5 text-[#145BFF] group-hover:rotate-12 transition-transform duration-300" />
                          <span className="font-light tracking-wide">{activeUrl}</span>
                        </motion.a>
                      );
                    })()}

                    {/* Outer card dim layer if underneath */}
                    {!isTop && (
                      <div className="absolute inset-x-0 inset-y-0 z-10 bg-[#050507]/45 backdrop-blur-[1.5px] hover:bg-[#050507]/20 transition-all duration-300" />
                    )}

                    {/* Interactive Video Block */}
                    <PortfolioVideoPlayer
                      sources={
                        project.alternatives && project.alternatives.length > 0
                          ? [
                              project.alternatives[isTop ? activeVideoIndex : 0].webm,
                              project.placeholderUrl,
                              "https://vjs.zencdn.net/v/oceans.mp4"
                            ]
                          : [project.videoUrlWebm, project.videoUrlMp4, project.placeholderUrl, "https://vjs.zencdn.net/v/oceans.mp4"]
                      }
                      isMuted={true}
                      isActive={isTop}
                      onVideoRef={(el) => {
                        videoRefs.current[idx] = el;
                      }}
                      language={language}
                    />
                  </motion.div>
                );
              })}

              {/* Handheld Navigating Controllers positioned on sides with glassy look */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-1 sm:px-2 md:-px-5 z-40 pointer-events-none">
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(20,91,255,0.25)", borderColor: "rgba(20,91,255,0.7)" }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-black/55 border border-[#145BFF]/50 text-white backdrop-blur-md flex items-center justify-center pointer-events-auto transition-colors duration-300 shadow-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5.5 md:h-5.5 text-white filter drop-shadow-[0_0_4px_rgba(20,91,255,1)]" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(20,91,255,0.25)", borderColor: "rgba(20,91,255,0.7)" }}
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="w-8 h-8 md:w-11 md:h-11 rounded-full bg-black/55 border border-[#145BFF]/50 text-white backdrop-blur-md flex items-center justify-center pointer-events-auto transition-colors duration-300 shadow-lg cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 md:w-5.5 md:h-5.5 text-white filter drop-shadow-[0_0_4px_rgba(20,91,255,1)]" />
                </motion.button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PortfolioSection;
