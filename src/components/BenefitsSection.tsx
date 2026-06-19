import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Zap, Target, Bot, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

import AnimatedDashboard from "./AnimatedDashboard";

const BenefitsSection = () => {
  const { language } = useLanguage();

  const benefits = [
    {
      title: language === 'es' ? "Arquitectura de Conversión" : "Conversion Architecture",
      description: language === 'es' ? (
        <>Cada píxel está estructurado para capturar el interés del usuario. Diseñamos sistemas interactivos que reducen la fricción cognitiva para guiar sistemáticamente a los visitantes hacia <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">la toma de decisiones directas</span> o cotizaciones instantáneas.</>
      ) : (
        <>Every pixel is structured to secure the user's attention. We design interactive systems that minimize cognitive friction to guide visitors toward <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">direct decision-making</span> or instant quotes.</>
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
      title: language === 'es' ? "Cero Plantillas. Código Puro" : "Zero Templates. Pure Code",
      description: language === 'es' ? (
        <>Desarrollamos interfaces totalmente personalizadas escritas a mano. Evitamos constructores pesados como WordPress o Elementor para garantizar una robustez técnica incontestable.</>
      ) : (
        <>We develop fully personalized, clean-coded interfaces from scratch. We skip bloated builders like WordPress or Elementor to ensure uncompromising technical performance.</>
      ),
      bullets: language === 'es' ? [
        <>Diseño exclusivo adaptativo para <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">celulares</span>.</>,
        <>Velocidad de carga de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">milisegundos</span>.</>,
        <>Cero plantillas pre-fabricadas <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">comunes</span>.</>,
        <>Arquitectura modular <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">maternal</span>.</>,
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

  return (
    <section id="beneficios" className="pt-6 pb-4 md:pt-8 md:pb-8 relative overflow-hidden">
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#145BFF]/10 to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#145BFF]/50 to-transparent"></div>
              </div>

              {/* Corner Neon Glows */}
              <motion.div 
                animate={{ 
                  backgroundColor: ["#145BFF", "#FFFFFF", "#145BFF"],
                  opacity: [0.4, 0.15, 0.4],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
              />
              <motion.div 
                animate={{ 
                  backgroundColor: ["#FFFFFF", "#145BFF", "#FFFFFF"],
                  opacity: [0.15, 0.4, 0.15],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 }}
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none"
              />

              <div className="relative z-10 h-full flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex flex-col flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-[#145BFF]/10 border border-[#145BFF]/20 flex items-center justify-center mb-6 text-[#3B7BFF] group-hover:scale-110 group-hover:text-white group-hover:bg-[#145BFF]/30 transition-all duration-500">
                    {benefit.icon}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-heading text-white mb-4 tracking-tight transition-all duration-300">
                    {benefit.title.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="text-[#145BFF] drop-shadow-[0_0_12px_rgba(20,91,255,0.9)]">
                      {benefit.title.split(" ").slice(-1)}
                    </span>
                  </h3>
                  
                  {benefit.description && (
                    <p className={`hidden md:block ${index === 0 ? '' : 'lg:hidden'} text-[#CFCFD4]/70 font-body text-sm leading-relaxed mb-6 font-light`}>
                      {benefit.description}
                    </p>
                  )}
                  
                  <ul className="space-y-3 mt-4 md:mt-auto">
                    {benefit.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3 text-[#CFCFD4]/80 font-body text-sm md:text-base leading-relaxed font-light">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#145BFF] shrink-0 shadow-[0_0_8px_rgba(20,91,255,0.8)]"></div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {index === 0 && (
                  <div className="flex flex-col w-full md:w-[45%] lg:w-[40%] xl:w-[360px] shrink-0 relative min-h-[280px] max-h-[360px] mt-6 md:mt-0 xl:ml-auto">
                    <AnimatedDashboard />
                  </div>
                )}
              </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BenefitsSection;
