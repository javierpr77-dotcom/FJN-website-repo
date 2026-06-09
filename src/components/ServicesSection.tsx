import { motion } from "framer-motion";
import ServiceCard from "./services/ServiceCard";
import { MonitorSmartphone, ShoppingCart, Building2, Home, Zap, TrendingUp, Crown, Settings, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const ServicesSection = () => {
  const { language } = useLanguage();

  const services = [
    {
      title: language === 'es' ? "Landing Pages de Alta Conversión" : "High-Conversion Landing Pages",
      description: language === 'es' ? (
        <>
          Diseñadas para transformar tráfico en <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">ventas inmediatas</span>. Eliminamos distracciones y guiamos a la acción.
        </>
      ) : (
        <>
          Designed to transform traffic into <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">immediate sales</span>. We eliminate distractions and guide to action.
        </>
      ),
      features: language === 'es' ? [
        "Copywriting persuasivo",
        <>Velocidad <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">extrema</span></>,
        "Embudos integrados"
      ] : [
        "Persuasive copywriting",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Extreme</span> speed</>,
        "Integrated funnels"
      ],
      icon: <MonitorSmartphone className="w-7 h-7" />,
      trustTag: language === 'es' ? "Optimizado para Conversión" : "Optimized for Conversion",
      trustIcon: <Zap className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "E-Commerce Premium" : "Premium E-Commerce",
      description: language === 'es' ? (
        <>
          Diseños <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">únicos y personalizados</span>. No usamos plantillas. Cero plantillas.
        </>
      ) : (
        <>
          <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">Unique and custom</span> designs. We do not use templates. Zero templates.
        </>
      ),
      features: language === 'es' ? [
        "Pagos integrados",
        <>Inventario <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">automatizado</span></>,
        "Recuperación de carritos"
      ] : [
        "Integrated payments",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Automated</span> inventory</>,
        "Cart recovery"
      ],
      icon: <ShoppingCart className="w-7 h-7" />,
      trustTag: language === 'es' ? "Maximización de ROI" : "ROI Maximization",
      trustIcon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "Webs Corporativas" : "Corporate Websites",
      description: language === 'es' ? (
        <>
          Posicionamiento que eleva el <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">prestigio de tu marca</span>. Transmite confianza desde el primer segundo.
        </>
      ) : (
        <>
          Positioning that elevates the <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">prestige of your brand</span>. Conveys trust from the first second.
        </>
      ),
      features: language === 'es' ? [
        "Diseño a medida",
        <>Arquitectura <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">SEO</span></>,
        "Integración CRM"
      ] : [
        "Custom design",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">SEO</span> Architecture</>,
        "CRM Integration"
      ],
      icon: <Building2 className="w-7 h-7" />,
      trustTag: language === 'es' ? "Posicionamiento Premium" : "Premium Positioning",
      trustIcon: <Crown className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "Plataformas de Reservas" : "Booking Platforms",
      description: language === 'es' ? (
        <>
          Sistemas para alojamientos que gestionan pagos <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">sin comisiones</span> de terceros.
        </>
      ) : (
        <>
          Systems for accommodations that manage payments <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">without commissions</span> from third parties.
        </>
      ),
      features: language === 'es' ? [
        "Calendarios sincronizados",
        <>Pagos <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">directos</span></>,
        "Panel intuitivo"
      ] : [
        "Synchronized calendars",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Direct</span> payments</>,
        "Intuitive panel"
      ],
      icon: <Home className="w-7 h-7" />,
      trustTag: language === 'es' ? "Automatización Total" : "Total Automation",
      trustIcon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <section id="servicios" className="pt-8 sm:pt-16 pb-6 md:pt-24 md:pb-8 relative bg-transparent">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Content */}
          <div className="lg:w-5/12 relative">
            <div className="sticky top-32">
              
              {/* Static, Highly Visible Orb tied to the Sticky Text */}
              <div 
                className="absolute top-0 left-0 transform -translate-x-1/4 -translate-y-1/4 w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full blur-[90px] pointer-events-none z-[-1]"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, rgba(20,91,255,0.4) 40%, transparent 70%)'
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div 
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
                  style={{
                    background: 'rgba(20,91,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(20,91,255,0.5)',
                    boxShadow: '0 0 20px rgba(20,91,255,0.4), inset 0 0 10px rgba(20,91,255,0.2)'
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B7BFF] animate-pulse drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                  <span className="text-white font-body text-xs tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                    {language === 'es' ? 'Nuestras Soluciones' : 'Our Solutions'}
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight mb-6 flex flex-wrap items-center justify-center lg:justify-start gap-x-3">
                  <span>{language === 'es' ? 'Ecosistemas Digitales de' : 'Digital Ecosystems of'}</span>
                  <motion.span 
                    className="italic font-light inline-block"
                    animate={{ 
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      backgroundImage: "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 15px rgba(20,91,255,0.8))"
                    }}
                  >
                    {language === 'es' ? 'Alto Rendimiento' : 'High Performance'}
                  </motion.span>
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  {/* Etiqueta Negativa Flotante */}
                  <motion.div 
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="flex justify-center items-center gap-3 px-5 py-3 rounded-full border border-red-500/20 bg-red-500/5 backdrop-blur-md"
                    style={{
                      boxShadow: 'inset 0 0 10px rgba(239,68,68,0.05), 0 0 15px rgba(239,68,68,0.05)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500/70" />
                      <span className="text-[#CFCFD4]/70 font-body text-sm md:text-base font-light tracking-wide line-through decoration-red-500/30">
                        {language === 'es' ? 'Carta Digital' : 'Digital Menu'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Etiqueta Positiva Neón Flotante */}
                  <motion.div 
                    animate={{ y: [4, -4, 4] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="flex justify-center items-center gap-3 px-5 py-3 rounded-full border border-[#145BFF]/50 bg-[#145BFF]/10 backdrop-blur-md relative overflow-hidden"
                    style={{
                      boxShadow: 'inset 0 0 15px rgba(20,91,255,0.2), 0 0 20px rgba(20,91,255,0.2)'
                    }}
                  >
                    {/* Brillo dinámico de fondo */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#145BFF]/30 to-transparent w-[200%]"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <CheckCircle2 className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                      <span className="text-white font-body text-sm md:text-base font-medium tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        {language === 'es' ? 'Más Clientes' : 'More Clients'}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Scrolling Cards */}
          <div className="lg:w-7/12">
            <div className="flex flex-col gap-8 md:gap-12">
              {services.map((service, index) => (
                <ServiceCard 
                  key={index}
                  index={index}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  icon={service.icon}
                  trustTag={service.trustTag}
                  trustIcon={service.trustIcon}
                />
              ))}
            </div>
          </div>

        </div>

        {/* CTA to plans */}
        <motion.div 
          className="mt-12 md:mt-16 flex justify-center w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.button
            type="button"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => {
              const target = document.getElementById('planes');
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative cursor-pointer w-full sm:w-auto rounded-3xl overflow-hidden transition-all duration-500 flex justify-center items-center"
          >
            {/* Base Glow */}
            <div className="absolute inset-0 rounded-3xl bg-[#145BFF]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div 
              className="relative z-10 flex items-center justify-center px-10 py-5 w-full h-full rounded-2xl bg-[#050507]/25 transition-all duration-500 group-hover:bg-[#050507]/40"
              style={{
                boxShadow: 'inset 0 0 15px rgba(20,91,255,0.2)'
              }}
            >
              <span className="relative text-white font-heading text-lg md:text-xl flex items-center gap-3 drop-shadow-[0_0_10px_rgba(20,91,255,0.8)]" style={{ fontWeight: 400, letterSpacing: '0.04em' }}>
                {language === 'es' ? 'Ver Planes' : 'View Plans'}
                <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1.5 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]" />
              </span>
            </div>

            {/* Edge Lighting Wrapper (Masks out the center) */}
            <div 
              className="absolute inset-0 z-20 rounded-2xl pointer-events-none p-[2px]"
              style={{
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            >
              <motion.div 
                className="absolute inset-[-150%]"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(59,123,255,0.8) 340deg, #FFFFFF 360deg)'
                }}
              />
            </div>
            
            {/* Ambient border */}
            <div className="absolute inset-0 z-0 rounded-2xl border border-[#145BFF]/30 pointer-events-none transition-colors duration-500 group-hover:border-[#145BFF]/50" />
            
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default ServicesSection;
