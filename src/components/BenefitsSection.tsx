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
        <>Cada píxel está diseñado para vender. Utilizamos <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">psicología cognitiva y datos heurísticos</span> para estructurar recorridos que transforman a simples visitantes en <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">clientes de alto valor</span>, eliminando cualquier fricción en el proceso.</>
      ) : (
        <>Every pixel is designed to sell. We use <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">cognitive psychology and heuristic data</span> to structure journeys that transform simple visitors into <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">high-value clients</span>, eliminating any friction in the process.</>
      ),
      bullets: language === 'es' ? [
        <>Auditoría de competencia con <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">agentes</span> de IA.</>,
        <>Mapeo exacto de puntos de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">dolor</span>.</>,
        <>Túneles de ventas de alta <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">conversión</span>.</>
      ] : [
        <>Competitor audit with AI <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">agents</span>.</>,
        <>Exact mapping of pain <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">points</span>.</>,
        <>High-converting sales <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">funnels</span>.</>
      ],
      icon: <BrainCircuit className="w-6 h-6" />,
      colSpan: "md:col-span-2",
      delay: 0.1,
    },
    {
      title: language === 'es' ? "Cero Plantillas. 100% Personalizado" : "Zero Templates. 100% Personalized",
      description: language === 'es' ? (
        <>Cada diseño se concibe desde cero para reflejar la identidad única de tu marca, garantizando una estética incomparable y enfocada plenamente en conversiones.</>
      ) : (
        <>Every design is crafted from scratch to reflect your brand's unique identity, ensuring an unmatched aesthetic fully focused on conversions.</>
      ),
      bullets: language === 'es' ? [
        <>Branding 100% <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">personalizado</span>.</>,
        <>Animaciones de alto <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">prestigio</span>.</>,
        <>Cero plantillas, código <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">único</span>.</>,
        <>Arquitectura modular e <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">inmersiva</span>.</>,
        <>Identidad visual <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">inconfundible</span>.</>,
      ] : [
        <>100% custom <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">branding</span>.</>,
        <>High-prestige <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">animations</span>.</>,
        <>Zero templates, unique <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">code</span>.</>,
        <>Modular and immersive <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">architecture</span>.</>,
        <>Unmistakable visual <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">identity</span>.</>,
      ],
      icon: <Sparkles className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.2,
    },
    {
      title: language === 'es' ? "Desarrollo Acelerado" : "Accelerated Development",
      bullets: language === 'es' ? [
        <>Tiempos reducidos de 7 a 4 <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">días</span>.</>,
        <>Auditoría de código en tiempo <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">real</span>.</>,
        <>Despliegue impecable sin <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">errores</span>.</>
      ] : [
        <>Time reduced from 7 to 4 <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">days</span>.</>,
        <>Real-time code <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">auditing</span>.</>,
        <>Flawless deployment without <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">errors</span>.</>
      ],
      icon: <Zap className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.3,
    },
    {
      title: language === 'es' ? "SEO Hiper-Personalizado" : "Hyper-Personalized SEO",
      bullets: language === 'es' ? [
        <>Posicionamiento semántico <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">avanzado</span>.</>,
        <>Dirigido a tu cliente <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">ideal</span>.</>,
        <>Tráfico listo para <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">comprar</span>.</>
      ] : [
        <>Advanced semantic <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">positioning</span>.</>,
        <>Targeted to your ideal <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">client</span>.</>,
        <>Traffic ready to <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">buy</span>.</>
      ],
      icon: <Search className="w-6 h-6" />,
      colSpan: "md:col-span-1",
      delay: 0.4,
    },
    {
      title: language === 'es' ? "Ecosistemas Vivos" : "Living Ecosystems",
      bullets: language === 'es' ? [
        <>Agentes IA trabajando <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">24/7</span>.</>,
        <>Cualificación automática de <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">leads</span>.</>,
        <>Servicio premium <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">ininterrumpido</span>.</>
      ] : [
        <>AI agents working <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">24/7</span>.</>,
        <>Automatic qualification of <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">leads</span>.</>,
        <>Uninterrupted premium <span className="text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">service</span>.</>
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
