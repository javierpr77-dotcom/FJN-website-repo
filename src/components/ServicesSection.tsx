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
          <span className="hidden md:inline">
            Diseñadas sobre principios de psicología de consumo para capturar leads calificados en tiempo récord. Eliminamos menús innecesarios para concentrar al usuario en un único objetivo: <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">la conversión</span>.
          </span>
          <span className="inline md:hidden">
            Diseñadas bajo psicología de consumo para capturar prospectos calificados, eliminando lo innecesario para un único fin: <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">la conversión</span>.
          </span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">
            Engineered using consumer psychology principles to capture highly qualified leads in record time. We eliminate friction to focus the visitor on a single call-to-action: <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">conversion</span>.
          </span>
          <span className="inline md:hidden">
            Built using behavioral psychology to capture ideal leads with zero friction, focused purely on: <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">conversion</span>.
          </span>
        </>
      ),
      features: language === 'es' ? [
        "Copywriting de venta pura",
        <>Velocidad <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">extrema</span> ({"< 1s"})</>,
        "Túneles de lead directos"
      ] : [
        "High-conversion copywriting",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Ultra</span> speed ({"< 1s"})</>,
        "Direct lead capturing"
      ],
      icon: <MonitorSmartphone className="w-7 h-7" />,
      trustTag: language === 'es' ? "Tasa de Rebote Mínima" : "Minimal Bounce Rate",
      trustIcon: <Zap className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "E-Commerce Premium" : "Premium E-Commerce",
      description: language === 'es' ? (
        <>
          <span className="hidden md:inline">
            Sistemas de venta directa desarrollados a medida. Integramos pasarelas locales como <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">Stripe, PayPal y ATH Móvil</span> garantizando una experiencia de pago segura y sin comisiones abusivas de terceros.
          </span>
          <span className="inline md:hidden">
            Tiendas online optimizadas con pasarelas de pago directas como <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">Stripe y ATH Móvil</span> libres de comisiones abusivas.
          </span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">
            Custom-built direct sales architectures. We integrate localized gateways like <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">Stripe, PayPal, and ATH Movil</span> to ensure quick checkout flows without high intermediary fees.
          </span>
          <span className="inline md:hidden">
            Bespoke e-commerce with zero external fees, integrating gateways like <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">Stripe & ATH Movil</span>.
          </span>
        </>
      ),
      features: language === 'es' ? [
        "Checkout de un solo paso",
        <>Inventario <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">automatizado</span></>,
        "Recuperación activa de carritos"
      ] : [
        "One-step modern checkout",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Automated</span> inventory sync</>,
        "Active cart recovery systems"
      ],
      icon: <ShoppingCart className="w-7 h-7" />,
      trustTag: language === 'es' ? "Maximización de Margen" : "Margin Maximization",
      trustIcon: <TrendingUp className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "Webs Corporativas de Autoridad" : "Authority Corporate Websites",
      description: language === 'es' ? (
        <>
          <span className="hidden md:inline">
            Soluciones multi-página robustas y estructuradas con <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">SEO técnico integrado</span>. Diseñadas para consolidar la presencia comercial de firmas locales o consultoras de alto perfil.
          </span>
          <span className="inline md:hidden">
            Estructuras multi-página excepcionales con <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">SEO técnico integrado</span> para dominar búsquedas locales.
          </span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">
            Robust and well-structured multi-page solutions powered by <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">fully integrated technical SEO</span>. Designed to secure the search footprint for consulting firms and local enterprises.
          </span>
          <span className="inline md:hidden">
            Multi-page corporate platforms packing deep <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">technical SEO</span> to absolute rule local searches.
          </span>
        </>
      ),
      features: language === 'es' ? [
        "Estructura adaptable única",
        <>Arquitectura <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">SEO Semántica</span></>,
        "Sincronización directa con CRM"
      ] : [
        "Tailored adaptive layout",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">Semantic SEO</span> crawl structures</>,
        "Native CRM sync options"
      ],
      icon: <Building2 className="w-7 h-7" />,
      trustTag: language === 'es' ? "Posicionamiento en Google" : "Google Search Performance",
      trustIcon: <Crown className="w-4 h-4" />
    },
    {
      title: language === 'es' ? "Plataformas de Reserva Directa" : "Direct Booking Systems",
      description: language === 'es' ? (
        <>
          <span className="hidden md:inline">
            La solución perfecta para paradores, alquileres a corto plazo y clínicas en Puerto Rico. Automatiza citas y cobros de reservas de forma independiente, <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">reteniendo el 100% de tu margen de ganancia</span>.
          </span>
          <span className="inline md:hidden">
            Ideales para alquileres o clínicas de Puerto Rico. Automatiza citas libres de comisiones externas, <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">reteniendo el 100% de tu margen</span>.
          </span>
        </>
      ) : (
        <>
          <span className="hidden md:inline">
            The ideal engine for guest houses, rentals, and private clinics. Automate reservations and bookings independently on your own terms, <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">keeping 100% of your operational profit</span>.
          </span>
          <span className="inline md:hidden">
            Direct scheduler platforms for guest rentals and private clinics, <span className="text-[#3B7BFF] font-semibold drop-shadow-[0_0_15px_rgba(20,91,255,0.9)]">saving 100% of booking fees</span>.
          </span>
        </>
      ),
      features: language === 'es' ? [
        "Sincronización bidireccional",
        <>Cobros <span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">100% directos</span></>,
        "Notificaciones de texto automatizadas"
      ] : [
        "Two-way calendar sync",
        <><span className="text-[#3B7BFF] font-bold drop-shadow-[0_0_12px_rgba(59,123,255,0.8)]">100% Direct</span> payments</>,
        "Automated SMS/alert notices"
      ],
      icon: <Home className="w-7 h-7" />,
      trustTag: language === 'es' ? "Independencia Operativa" : "Operational Independence",
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
