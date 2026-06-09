import { motion } from "framer-motion";
import { UserSearch, LineChart, Layers, Rocket, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <motion.span 
    animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent font-bold drop-shadow-[0_0_10px_rgba(20,91,255,0.8)]"
  >
    {children}
  </motion.span>
);

const ProcessSection = () => {
  const { language } = useLanguage();

  const steps = [
    {
      title: language === 'es' ? "Inmersión y Empatía" : "Immersion and Empathy",
      bullets: language === 'es' ? [
        <>Entrevista profunda para entender tu <Highlight>visión</Highlight>.</>,
        <>Dotamos a tu marca de un <Highlight>aura</Highlight> única.</>,
        <>Diseñamos sistemas, no simples dibujos.</>
      ] : [
        <>Deep interview to understand your <Highlight>vision</Highlight>.</>,
        <>We give your brand a unique <Highlight>aura</Highlight>.</>,
        <>We design systems, not simple drawings.</>
      ],
      icon: <UserSearch className="w-6 h-6" />,
    },
    {
      title: language === 'es' ? "Inteligencia de Mercado" : "Market Intelligence",
      bullets: language === 'es' ? [
        <>Estudio profundo de tu mercado actual.</>,
        <>Análisis de lo que está en <Highlight>tendencia</Highlight>.</>,
        <>Decisiones basadas en datos reales.</>
      ] : [
        <>In-depth study of your current market.</>,
        <>Analysis of what is <Highlight>trending</Highlight>.</>,
        <>Decisions based on real data.</>
      ],
      icon: <LineChart className="w-6 h-6" />,
    },
    {
      title: language === 'es' ? "Arquitectura de Conversión" : "Conversion Architecture",
      bullets: language === 'es' ? [
        <>Diseño de un <Highlight>túnel</Highlight> de ventas milimétrico.</>,
        <>Estructura enfocada 100% en <Highlight>conversión</Highlight>.</>,
        <>Arquitectura premium y estratégica.</>
      ] : [
        <>Design of a millimeter sales <Highlight>funnel</Highlight>.</>,
        <>Structure focused 100% on <Highlight>conversion</Highlight>.</>,
        <>Premium and strategic architecture.</>
      ],
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: language === 'es' ? "Desarrollo y Lanzamiento" : "Development and Launch",
      bullets: language === 'es' ? [
        <>Integración de animaciones de <Highlight>prestigio</Highlight>.</>,
        <>Código limpio y de alto rendimiento.</>,
        <>Pruebas rigurosas de <Highlight>calidad</Highlight>.</>
      ] : [
        <>Integration of <Highlight>prestige</Highlight> animations.</>,
        <>Clean and high-performance code.</>,
        <>Rigorous <Highlight>quality</Highlight> testing.</>
      ],
      icon: <Rocket className="w-6 h-6" />,
    },
  ];

  return (
    <section id="proceso" className="block md:hidden pt-12 pb-12 relative overflow-hidden">
      {/* Breathing Background Glows (Electric Blue & White) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#145BFF]/30 to-[#FFFFFF]/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-[#FFFFFF]/15 to-[#145BFF]/20 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-32">
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
            <Cpu className="w-4 h-4 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
            <span className="text-white font-body text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
              {language === 'es' ? 'Metodología' : 'Methodology'}
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight mb-6"
          >
            {language === 'es' ? 'Ingeniería de' : 'Engineering of'} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#145BFF] to-[#FFFFFF] italic font-light drop-shadow-[0_0_15px_rgba(20,91,255,0.5)]">
              {language === 'es' ? 'Conversión' : 'Conversion'}
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#CFCFD4] font-body text-base md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            {language === 'es' ? 'No diseñamos dibujos ilustrativos. Construimos ' : 'We do not design illustrative drawings. We build '}
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
              {language === 'es' ? 'sistemas arquitectónicos' : 'architectural systems'}
            </motion.span> 
            {language === 'es' ? ' premium que trabajan para ti.' : ' premium that work for you.'}
          </motion.p>
        </div>

        {/* 3D Vertical Stepper */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Glow Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#145BFF]/80 to-transparent transform md:-translate-x-1/2 shadow-[0_0_15px_rgba(20,91,255,0.5)]"></div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-32 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Timeline Node */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="absolute left-8 md:left-1/2 w-14 h-14 rounded-full bg-[#0B0F19] border-2 border-[#145BFF] flex items-center justify-center transform -translate-x-1/2 shadow-[0_0_20px_rgba(20,91,255,0.6)] z-20"
                >
                  <div className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
                    {step.icon}
                  </div>
                </motion.div>

                {/* Empty space for the other side on desktop */}
                <div className="hidden md:block md:w-5/12"></div>

                {/* Card */}
                <motion.div 
                  initial={{ opacity: 0, x: isEven ? 50 : -50, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 40 }}
                  className="w-full md:w-5/12 pl-24 md:pl-0 z-10 perspective-1000"
                >
                  <div 
                    className="relative p-8 md:p-10 rounded-3xl overflow-hidden border border-white/5 group transition-transform duration-500 hover:-translate-y-2"
                    style={{
                      background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {/* Half-Card Glass Gradient (Top Half) */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#145BFF]/15 via-[#FFFFFF]/5 to-transparent pointer-events-none"></div>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-[#145BFF]/10 to-transparent"></div>
                    
                    <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
                      <span className="text-[#3B7BFF] font-mono text-xs md:text-sm mb-4 block font-medium tracking-[0.15em] drop-shadow-[0_0_5px_rgba(20,91,255,0.5)]">
                        0{index + 1} // FASE
                      </span>
                      <h3 className="text-2xl md:text-3xl font-heading text-white mb-5 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#CFCFD4] transition-all duration-300">
                        {step.title}
                      </h3>
                      <ul className="space-y-3">
                        {step.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3 text-[#CFCFD4]/90 font-body text-base md:text-lg leading-relaxed font-light">
                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#145BFF] shrink-0 shadow-[0_0_8px_rgba(20,91,255,0.8)]"></div>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>

              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
};

export default ProcessSection;
