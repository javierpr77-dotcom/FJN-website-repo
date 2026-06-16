import { useState, useMemo } from "react";
import { Check, ArrowRight, Shield, Zap, Target, Crown, Sparkles, Briefcase, TrendingUp, Diamond, Plus, User, Mail, Phone, ArrowLeft, CheckCircle2, Puzzle } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

type Addon = { name: string; price: string };
type Plan = {
  id: string;
  name: string;
  titleIcon?: React.ReactNode;
  price: string;
  idealForBullets: React.ReactNode[];
  features: string[];
  notIncluded: string;
  popular: boolean;
  addons?: Addon[];
  badge?: string;
  icon?: React.ReactNode;
};

const PricingSection = () => {
  const { language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const toggleAddon = (addonName: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonName) 
        ? prev.filter(a => a !== addonName) 
        : [...prev, addonName]
    );
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      setSelectedPlan(null);
      setSelectedAddons([]);
      setTimeout(() => {
        setModalStep(1);
        setFormData({ name: '', email: '', phone: '' });
      }, 300); // Wait for exit animation
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send order to Netlify Forms in the background
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "pricing-order",
        plan: selectedPlan?.name || "",
        addons: selectedAddons.join(", ") || "Ninguno/None",
        total: `$${estimatedTotal.toLocaleString()} USD`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }).toString()
    })
      .then(() => console.log("Netlify pricing order submission successful"))
      .catch((error) => console.error("Netlify submission error:", error));

    // Send email notification via serverless Netlify function using Resend
    fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plan: selectedPlan?.name || "",
        addons: selectedAddons.join(", ") || "Ninguno/None",
        total: `$${estimatedTotal.toLocaleString()} USD`
      })
    })
      .then(response => {
        if (!response.ok) {
          console.error("Failed to send email notification for plan request");
        } else {
          console.log("Email notification for plan request sent successfully");
        }
      })
      .catch(error => console.error("Error calling send-email function:", error));

    setModalStep(3);
  };

  const basePrice = selectedPlan ? parseInt(selectedPlan.price.replace(/,/g, '')) : 0;
  const addonsTotal = selectedPlan?.addons
    ?.filter(a => selectedAddons.includes(a.name))
    .reduce((sum, a) => sum + parseInt(a.price.replace(/,/g, '')), 0) || 0;
  const estimatedTotal = basePrice + addonsTotal;

  /* 
   * ARCHIVED PLAN REFERENCE (for documentation purposes):
   * ID: "plan-starter" ("Starter")
   * Price: "500" USD
   * Ideal for clients starting from scratch with a very low budget.
   * Moved to archive to target premium, high-value conversion clients.
   */

  const plans: Plan[] = [
    {
      id: "plan-landing",
      name: language === 'es' ? "Premium Landing Page" : "Premium Landing Page",
      titleIcon: <Sparkles className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "1,200",
      idealForBullets: language === 'es' ? [
        <>Empresas y compañías que necesitan capturar leads calificados con un <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">embudo de alta conversión</span>.</>,
        <>Profesionales independientes que buscan automatizar la adquisición de prospectos mediante un <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">túnel de conversión élite</span>.</>,
        <>Marcas y proyectos que requieren una página única <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">ultra pulida, veloz y enfocada en resultados</span>.</>
      ] : [
        <>Businesses and companies that need to capture qualified leads with a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">high-converting funnel</span>.</>,
        <>Independent professionals looking to automate prospect acquisition using an <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">elite conversion tunnel</span>.</>,
        <>Brands and projects requiring an ultra-polished single page <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">focused strictly on results</span>.</>
      ],
      features: language === 'es' ? [
        "Landing page de una sola página premium",
        "Estructurada en un túnel de conversión estratégico",
        "Copywriting persuasivo y optimizado para leads",
        "Formulario inteligente de captura de prospectos directo",
        "Sección sobre tu negocio y propuesta de valor",
        "Sección de tus servicios, beneficios claves o soluciones",
        "Optimización de velocidad de carga ultra rápida de nivel élite",
        "Optimización de SEO técnico inicial",
        "Diseño 100% responsivo y adaptado para celulares"
      ] : [
        "Premium single-page landing page",
        "Structured as a strategic conversion tunnel",
        "Persuasive copywriting optimized for leads",
        "Direct intelligent lead capture form",
        "About your business & value proposition sections",
        "Services, core benefits or solutions modules",
        "Elite ultra-fast loading speed optimization",
        "Initial onpage technical SEO setup",
        "100% responsive design optimized for mobile"
      ],
      addons: language === 'es' ? [
        { name: "Sección adicional (layout moderno)", price: "150" },
        { name: "Página adicional estratégica / de soporte", price: "150" },
        { name: "Copywriting profesional persuasivo avanzado", price: "200" },
        { name: "Recepcionista AI / Agente IA conversacional avanzada", price: "380" },
        { name: "Sincronización directa con CRM comercial", price: "225" },
        { name: "Integración avanzada con plataforma de Email Marketing", price: "180" },
        { name: "Bilingüe manual (Español / Inglés)", price: "180" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Widget externo de programación / calendario / reserva", price: "185" },
        { name: "Galería premium (slider / carrusel)", price: "180" },
        { name: "Google Analytics tracking y eventos de conversión", price: "185" }
      ] : [
        { name: "Additional section (modern layout)", price: "150" },
        { name: "Additional strategic / support page", price: "150" },
        { name: "Advanced persuasive professional copywriting", price: "200" },
        { name: "AI Receptionist / Advanced Conversation Agent", price: "380" },
        { name: "Direct commercial CRM synchronization", price: "225" },
        { name: "Advanced setup with Email Marketing platform", price: "180" },
        { name: "Manual bilingual version (Spanish / English)", price: "180" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "External booking / calendar / reserve widget", price: "185" },
        { name: "Premium gallery (slider / carousel)", price: "180" },
        { name: "Google Analytics tracking & conversion events setup", price: "185" }
      ],
      notIncluded: language === 'es' ? "Este plan cubre un landing page funcional premium de una sola página. Secciones adicionales o integraciones de terceros avanzadas no incluidas en el plan base se cotizan según requerimientos." : "This plan covers a premium functional single-page landing page. Additional sections or advanced third-party integrations not included in the base plan are quoted depending on your requirements.",
      popular: false
    },
    {
      id: "plan-ecommerce",
      name: language === 'es' ? "E-commerce Personalizado" : "Custom E-commerce",
      titleIcon: <Diamond className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "1,800",
      idealForBullets: language === 'es' ? [
        <>Marcas y comercios que desean una <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">tienda online única y personalizada</span> sin usar plantillas de baja calidad.</>,
        <>Negocios enfocados en ofrecer una <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">experiencia de pago fluida</span> para multiplicar sus ventas en Puerto Rico y el mundo.</>,
        <>Emprendedores ambiciosos que buscan <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">escalar con pasarelas integradas</span> (Stripe, Paypal, ATH Móvil).</>
      ] : [
        <>Brands and merchants wanting a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">unique, customized online store</span> instead of standard lower-end templates.</>,
        <>Businesses focused on offering a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">seamless checkout experience</span> to scale sales locally and globally.</>,
        <>Ambitious entrepreneurs looking to <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">grow with integrated gateways</span> (Stripe, Paypal, ATH Movil).</>
      ],
      features: language === 'es' ? [
        "Tienda virtual personalizada con pasarela de pago (Stripe / PayPal / ATH Móvil)",
        "Catálogo premium con buscador, filtros y categorías estructuradas",
        "Panel de administración auto-gestionable para productos e inventario",
        "Estructura orientada a conversión y aumento del ticket promedio (CRO)",
        "Proceso de checkout rápido integrado para celulares",
        "Sistema automático de alertas de pedidos por correo",
        "Formulario de contacto de atención y soporte integrado",
        "Optimización de velocidad premium de alto rendimiento",
        "SEO técnico para indexación óptima de tus productos"
      ] : [
        "Custom online store with checkout gateways (Stripe / PayPal / ATH Movil)",
        "Premium catalog structure with search, filters & custom categories",
        "Self-manageable admin panel for tracking products & inventory",
        "CRO strategies optimized to increase average order value",
        "Fast-checkout checkout system fully optimized for mobile devices",
        "Automated order email alerts system built-in",
        "Direct integrated contact and customer support form",
        "High performance premium loading speed optimizations",
        "Technical SEO optimization to index and rank your products"
      ],
      addons: language === 'es' ? [
        { name: "Categoría de productos adicional estructurada", price: "150" },
        { name: "Copywriting persuasivo avanzado de productos", price: "250" },
        { name: "Agente IA avanzado de atención al cliente y soporte", price: "450" },
        { name: "Configuración de automatización para carritos abandonados", price: "225" },
        { name: "Integración avanzada con CRM comercial", price: "250" },
        { name: "Sistema avanzado de cupones, promociones y descuentos", price: "185" },
        { name: "Versión bilingüe manual (Español / Inglés)", price: "280" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Integración de píxeles publicitarios (Meta / TikTok Ads) para remarketing", price: "180" },
        { name: "Analítica avanzada de ecommerce con Google Analytics 4", price: "225" }
      ] : [
        { name: "Additional product category structure", price: "150" },
        { name: "Advanced persuasive product copywriting", price: "250" },
        { name: "AI Agent for support and item recommendation", price: "450" },
        { name: "Email Marketing setup / Abandoned cart flows", price: "225" },
        { name: "Advanced integration with sales CRM", price: "250" },
        { name: "Advanced coupon, discount and promos system", price: "185" },
        { name: "Manual bilingual version (Spanish / English)", price: "280" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "Ad pixels integration (Meta / TikTok Ads) for remarketing", price: "180" },
        { name: "E-commerce analytics events with Google Analytics 4", price: "225" }
      ],
      notIncluded: language === 'es' ? "No incluye carga masiva de inventario mayor a 100 productos (se cotiza de forma independiente), ni administración mensual posventa." : "Does not include bulk upload of more than 100 products (quoted independently), or ongoing post-sale store administration.",
      popular: false
    },
    {
      id: "plan-website",
      name: language === 'es' ? "Website Premium" : "Websites Premium",
      titleIcon: <Crown className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "2,500",
      idealForBullets: language === 'es' ? [
        <>Compañías y marcas corporativas con servicios múltiples que exigen un <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">website de nivel internacional</span>.</>,
        <>Empresas consolidadas en Puerto Rico y EE.UU. enfocadas en <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">liderar su categoría con máxima autoridad</span>.</>,
        <>Negocios listos para integrar flujos automatizados de interacción, <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">blog estratégico y automatizaciones de élite</span>.</>
      ] : [
        <>Corporate brands with multiple services demanding an <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">elite multi-page presence</span>.</>,
        <>Established companies focused on <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">leading their category with maximum authority</span>.</>,
        <>Businesses ready to integrate automated interaction flows, <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">strategic blogging and premium systems</span>.</>
      ],
      features: language === 'es' ? [
        "Website multipágina premium personalizada (hasta 10 páginas estratégicas)",
        "Estructura comercial completa optimizada para múltiples funnels y servicios",
        "Copywriting profesional y altamente persuasivo redactado a medida",
        "Secciones avanzadas de testimonios, prueba social, portafolio y autoridad",
        "Formularios de contacto inteligentes e interactivos",
        "SEO avanzado on-page completo para Puerto Rico y Estados Unidos",
        "Botón de chat de WhatsApp inteligente y personalizado integrado",
        "Optimización de rendimiento excepcional y velocidad de carga prémium",
        "Diseño 100% responsivo y adaptativo de máxima calidad"
      ] : [
        "Premium custom multi-page website (up to 10 strategic pages)",
        "Complete commercial structure optimized for multiple services & funnels",
        "Tailored professional and highly persuasive copywriting for all pages",
        "Advanced testimonials, social proof, portfolio & authority sections",
        "Intelligent multi-step interactive contact forms",
        "Advanced on-page SEO fully optimized for Puerto Rico and US markets",
        "Smart personalized WhatsApp communication chat widget",
        "Exceptional speed optimization and high-performance loading scales",
        "100% flawless custom responsive layout across all resolutions"
      ],
      addons: language === 'es' ? [
        { name: "Página adicional estructurada", price: "150" },
        { name: "Sección interactiva personalizada (layout avanzado)", price: "180" },
        { name: "Sistema completo de Blog corporativo estratégico", price: "450" },
        { name: "Asistente AI premium integrado con agendamiento y FAQs automatizadas", price: "550" },
        { name: "Sincronización automatizada con múltiples CRMs", price: "250" },
        { name: "Integración bilingüe e internacional avanzada", price: "280" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Analítica avanzada con Google Analytics 4 y Microsoft Clarity", price: "225" }
      ] : [
        { name: "Additional structured page", price: "150" },
        { name: "Custom interactive section (advanced layout)", price: "180" },
        { name: "Complete strategic corporate Blog system", price: "450" },
        { name: "Premium AI Assistant with integrated scheduling & auto-FAQs", price: "550" },
        { name: "Automated sync with sales CRMs", price: "250" },
        { name: "Advanced bilingual and international setup", price: "280" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "Advanced metrics with Google Analytics 4 and Microsoft Clarity", price: "225" }
      ],
      notIncluded: language === 'es' ? "No incluye integraciones de software a la medida complejo externo, ni pasarelas de pago de comercio electrónico transaccional (cubierto en el plan E-commerce)." : "Does not include complex enterprise custom software integration, or checkout billing gateways (covered fully in our Custom E-commerce plan).",
      popular: false
    }
  ];

  return (
    <section id="planes" className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden bg-transparent">
      
      {/* Animated radial gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,91,255,0.08) 0%, rgba(11,63,191,0.03) 40%, transparent 70%)',
          animation: 'pulseGlow 8s ease-in-out infinite'
        }}></div>
      </div>

      {/* Electric Blue Beams & Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Wide Spotlight Beam */}
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[200%] h-[150%] blur-[70px] opacity-90" 
          style={{
            background: 'conic-gradient(from 180deg at 50% 10%, transparent 0deg, rgba(20,91,255,0.05) 120deg, rgba(20,91,255,0.3) 160deg, rgba(20,91,255,0.6) 180deg, rgba(20,91,255,0.3) 200deg, rgba(20,91,255,0.05) 240deg, transparent 360deg)',
            animation: 'pulseGlow 10s ease-in-out infinite'
          }}
        />
        
        {/* Core Top Glow (Intensifies the source of the light) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[80%] bg-[radial-gradient(ellipse_at_top,rgba(20,91,255,0.5)_0%,rgba(11,63,191,0.15)_40%,transparent_70%)] blur-[50px]" />
      </div>

      {/* Section Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: 'rgba(20,91,255,0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(20,91,255,0.8)',
              boxShadow: '0 0 15px rgba(20,91,255,0.5), inset 0 0 8px rgba(20,91,255,0.2)'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#3B7BFF] animate-pulse drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
            <span className="text-white font-body text-xs tracking-[0.25em] uppercase font-medium drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              {language === 'es' ? 'Nuestros Planes' : 'Our Plans'}
            </span>
          </div>
          <h2 className="font-heading text-[#F2F2F4] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6" style={{ fontWeight: 200 }}>
            {language === 'es' ? 'Soluciones para' : 'Solutions for'}
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-[#145BFF] via-[#3B7BFF] to-[#0B3FBF] bg-clip-text text-transparent italic" style={{ fontWeight: 300 }}>
              {language === 'es' ? 'cada etapa de tu negocio' : 'every stage of your business'}
            </span>
          </h2>
          <p className="font-body text-[#CFCFD4]/70 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            {language === 'es' ? 'Escoge el plan que mejor se adapte a tus ' : 'Choose the plan that best fits your '}
            <motion.span
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #145BFF, #FFFFFF, #145BFF)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 12px rgba(20,91,255,0.7))"
              }}
              className="font-medium inline-block"
            >
              {language === 'es' ? 'objetivos comerciales' : 'business goals'}
            </motion.span>
            .
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 ${
                plan.id === "plan-2" 
                  ? "border-white/45 shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.28)]" 
                  : plan.popular 
                    ? "border-[#145BFF]/50 shadow-[0_0_40px_rgba(20,91,255,0.15)]" 
                    : "border-white/[0.08] hover:border-[#145BFF]/30 hover:shadow-[0_0_30px_rgba(20,91,255,0.1)]"
              }`}
              style={{
                background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                backdropFilter: 'blur(4px)',
                borderWidth: '1px',
                borderStyle: 'solid',
                animation: `fadeInUp 0.6s ease-out forwards ${index * 0.15}s`,
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#145BFF] to-[#0B3FBF] text-white text-[10px] font-body font-medium tracking-wider uppercase px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(20,91,255,0.4)] border border-white/20">
                    {language === 'es' ? 'Recomendado' : 'Recommended'}
                  </div>
                </div>
              )}

              {/* Top edge shine */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${plan.id === "plan-2" ? "via-white/70" : plan.popular ? "via-[#145BFF]" : "via-white/20"} to-transparent opacity-60`}></div>

              <div className="p-6 md:p-8 flex flex-col flex-grow">
                {/* Header */}
                {(plan.icon || plan.badge) && (
                  <div className="flex items-center gap-3 mb-6">
                    {plan.icon && (
                      <div className={`p-2.5 rounded-xl ${plan.popular ? 'bg-[#145BFF]/20 border-[#145BFF]/30' : 'bg-white/[0.03] border-white/[0.08]'} border`}>
                        {plan.icon}
                      </div>
                    )}
                    {plan.badge && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                        <span className="text-[#CFCFD4]/80 text-[11px] font-body font-light tracking-wide">{plan.badge}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Title & Price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="font-heading text-[#F2F2F4] text-2xl" style={{ fontWeight: 300 }}>
                      {plan.name}
                    </h3>
                    {plan.titleIcon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#CFCFD4]/50 text-[10px] font-body font-light tracking-[0.2em] uppercase mb-1">
                      {language === 'es' ? 'Precio base' : 'Base Price'}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#CFCFD4]/80 font-body text-base font-medium">
                        {language === 'es' ? 'Desde' : 'From'}
                      </span>
                      <span className="text-[#F2F2F4] font-heading text-4xl" style={{ fontWeight: 300 }}>
                        ${plan.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description / Ideal For */}
                <div className="mb-8 min-h-[100px]">
                  <h4 className="text-[#145BFF] text-xs font-body font-medium uppercase tracking-wider mb-3">
                    {language === 'es' ? '¿Para quién es este plan?' : 'Who is this plan for?'}
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.idealForBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-[#CFCFD4]/70 text-sm font-light leading-relaxed">
                        <span className="text-[#145BFF] mt-1.5 text-[6px]">●</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-8"></div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-grow">
                  <h4 className="text-[#F2F2F4] text-sm font-body font-medium mb-4">
                    {language === 'es' ? 'Incluye en el precio base:' : 'Included in base price:'}
                  </h4>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#145BFF] mt-0.5 flex-shrink-0" />
                      <span className="text-[#CFCFD4]/90 text-sm font-body font-light leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Add-ons Trigger */}
                {plan.addons && plan.addons.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setModalStep(1);
                    }}
                    className="group/addon flex items-center justify-center gap-2 w-full py-3 mb-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-[#145BFF]/10 hover:border-[#145BFF]/30 transition-all duration-300"
                  >
                    <Puzzle className="w-4 h-4 text-[#145BFF] group-hover/addon:animate-pulse" />
                    <span className="text-[#CFCFD4]/80 group-hover/addon:text-white text-xs font-body font-medium tracking-wide transition-colors">
                      {language === 'es' ? 'Explorar add-ons opcionales' : 'Explore optional add-ons'}
                    </span>
                  </button>
                )}

                {/* CTA Button */}
                {plan.popular ? (
                  <div className="relative w-full mt-auto group rounded-xl overflow-hidden p-[1px] shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-500 hover:-translate-y-0.5">
                    <span 
                      className="absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_35%,#ffffff_50%,transparent_65%,transparent_100%)] opacity-80 group-hover:opacity-100 transition-opacity duration-500" 
                      style={{ animation: 'spinSlow 4s linear infinite' }}
                    />
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setModalStep(2);
                      }}
                      className="relative w-full cursor-pointer py-3.5 rounded-xl font-heading text-white text-sm transition-all duration-500 bg-[#050507] hover:bg-white/[0.02]"
                      style={{ fontWeight: 400 }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {language === 'es' ? 'Solicitar este plan' : 'Request this plan'}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setModalStep(2);
                    }}
                    className="group w-full cursor-pointer py-3.5 rounded-xl font-heading text-white text-sm relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 mt-auto border border-[#145BFF]/50 shadow-[0_0_15px_rgba(20,91,255,0.25)] hover:shadow-[0_0_25px_rgba(20,91,255,0.5)] hover:border-[#145BFF]/90 bg-[#145BFF]/[0.02] hover:bg-[#145BFF]/[0.06]"
                    style={{ fontWeight: 400 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {language === 'es' ? 'Solicitar este plan' : 'Request this plan'}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Add-ons Modal */}
        <Dialog open={!!selectedPlan} onOpenChange={handleCloseModal}>
          <DialogContent 
            className="bg-[#050507]/95 backdrop-blur-xl border-white/[0.08] text-white max-w-md w-[95vw] rounded-3xl p-0 overflow-hidden shadow-[0_0_50px_rgba(20,91,255,0.15)]"
          >
            
            {/* STEP 1: ADD-ONS */}
            {modalStep === 1 && (
              <div className="p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
                <DialogHeader className="mb-6 text-left">
                  <DialogTitle className="font-heading text-2xl font-light text-[#F2F2F4]">
                    {language === 'es' ? 'Potencia tu plan' : 'Upgrade your plan'} <span className="text-[#145BFF] font-medium">{selectedPlan?.name}</span>
                  </DialogTitle>
                  <DialogDescription className="text-[#CFCFD4]/70 font-body text-sm mt-2">
                    {language === 'es' ? 'Selecciona las funcionalidades adicionales que necesitas. El costo se sumará a tu inversión estimada.' : 'Select the additional features you need. The cost will be added to your estimated investment.'}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedPlan?.addons?.map((addon, i) => {
                    const isSelected = selectedAddons.includes(addon.name);
                    return (
                      <div 
                        key={i} 
                        onClick={() => toggleAddon(addon.name)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'bg-[#145BFF]/10 border-[#145BFF]/50 shadow-[0_0_15px_rgba(20,91,255,0.1)]' 
                            : 'bg-white/[0.03] border-white/[0.05] hover:border-[#145BFF]/30 hover:bg-[#145BFF]/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center w-5 h-5 rounded-full border transition-colors ${
                            isSelected ? 'bg-[#145BFF] border-[#145BFF]' : 'border-white/20'
                          }`}>
                            {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-transparent" />}
                          </div>
                          <span className={`text-sm font-body transition-colors ${isSelected ? 'text-white font-medium' : 'text-[#CFCFD4]/90'}`}>
                            {addon.name}
                          </span>
                        </div>
                        <span className={`text-sm font-heading whitespace-nowrap ml-4 transition-colors ${isSelected ? 'text-[#145BFF] font-bold' : 'text-[#145BFF] font-medium'}`}>
                          +${addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-white/[0.08]">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-[#CFCFD4]/60 text-[10px] font-body uppercase tracking-wider mb-1">
                        {language === 'es' ? 'Inversión Estimada' : 'Estimated Investment'}
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-heading text-white font-light">${estimatedTotal.toLocaleString()}</span>
                        <span className="text-[#CFCFD4]/50 text-xs font-body">USD</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#CFCFD4]/60 text-xs font-body mb-1">
                        {language === 'es' ? 'Plan Base:' : 'Base Plan:'} ${basePrice.toLocaleString()}
                      </p>
                      <p className="text-[#145BFF] text-xs font-body font-medium">Add-ons: +${addonsTotal.toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setModalStep(2)}
                    className="w-full py-3.5 rounded-xl font-heading text-white text-sm relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(20,91,255,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, #145BFF 0%, #7C3AED 50%, #145BFF 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmerGradient 4s ease-in-out infinite',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {language === 'es' ? 'Continuar con esta selección' : 'Continue with this selection'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FORM & RECEIPT */}
            {modalStep === 2 && (
              <div className="p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500">
                <DialogHeader className="mb-6 text-left">
                  {selectedPlan?.addons && selectedPlan.addons.length > 0 && (
                    <button 
                      onClick={() => setModalStep(1)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#145BFF]/50 bg-[#145BFF]/[0.05] text-[#CFCFD4]/90 hover:text-white text-[11px] font-body mb-5 transition-all duration-300 shadow-[0_0_12px_rgba(20,91,255,0.25)] hover:shadow-[0_0_20px_rgba(20,91,255,0.5)] hover:border-[#145BFF]/80 hover:bg-[#145BFF]/10 w-fit"
                    >
                      <ArrowLeft className="w-3 h-3" /> {language === 'es' ? 'Volver a add-ons' : 'Back to add-ons'}
                    </button>
                  )}
                  <DialogTitle className="font-heading text-2xl font-light text-[#F2F2F4]">
                    {language === 'es' ? 'Completa tu' : 'Complete your'} <span className="text-[#145BFF] font-medium">{language === 'es' ? 'solicitud' : 'request'}</span>
                  </DialogTitle>
                  <DialogDescription className="text-[#CFCFD4]/70 font-body text-sm mt-2">
                    {language === 'es' ? 'Déjanos tus datos para enviarte el resumen y contactarte con los siguientes pasos.' : 'Leave us your details to send you the summary and contact you with the next steps.'}
                  </DialogDescription>
                </DialogHeader>

                {/* Receipt / Summary */}
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 mb-6">
                  <h4 className="text-sm font-body font-medium text-white mb-3">
                    {language === 'es' ? 'Resumen de tu selección' : 'Summary of your selection'}
                  </h4>
                  <div className="space-y-2 mb-3 pb-3 border-b border-white/[0.05]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#CFCFD4]/80 font-body">Plan {selectedPlan?.name}</span>
                      <span className="text-white font-heading">${basePrice.toLocaleString()}</span>
                    </div>
                    {selectedAddons.map(addonName => {
                      const addon = selectedPlan?.addons?.find(a => a.name === addonName);
                      return (
                        <div key={addonName} className="flex justify-between text-xs">
                          <span className="text-[#CFCFD4]/60 font-body pl-2">+ {addonName}</span>
                          <span className="text-[#CFCFD4]/80 font-heading">${addon?.price}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-body text-[#CFCFD4]/60 uppercase tracking-wider">
                      {language === 'es' ? 'Inversión Estimada' : 'Estimated Investment'}
                    </span>
                    <span className="text-lg font-heading text-[#145BFF] font-medium">${estimatedTotal.toLocaleString()} USD</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFCFD4]/40" />
                      <input required type="text" placeholder={language === 'es' ? 'Tu nombre completo' : 'Your full name'} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#CFCFD4]/40 focus:outline-none focus:border-[#145BFF]/50 focus:bg-[#145BFF]/[0.02] transition-all" />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFCFD4]/40" />
                      <input required type="tel" placeholder={language === 'es' ? 'Tu número de teléfono' : 'Your phone number'} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#CFCFD4]/40 focus:outline-none focus:border-[#145BFF]/50 focus:bg-[#145BFF]/[0.02] transition-all" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl font-heading text-white text-sm relative overflow-hidden transition-all duration-500 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(20,91,255,0.3)]"
                    style={{
                      background: 'linear-gradient(135deg, #145BFF 0%, #7C3AED 50%, #145BFF 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shimmerGradient 4s ease-in-out infinite',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {language === 'es' ? 'Enviar Solicitud' : 'Submit Request'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </form>
              </div>
            )}

            {/* STEP 3: SUCCESS */}
            {modalStep === 3 && (
              <div className="p-8 md:p-12 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-[#145BFF]/20 rounded-full flex items-center justify-center mb-6 border border-[#145BFF]/30">
                  <CheckCircle2 className="w-8 h-8 text-[#145BFF]" />
                 </div>
                <h3 className="font-heading text-2xl text-white mb-3">
                  {language === 'es' ? '¡Solicitud Recibida!' : 'Request Received!'}
                </h3>
                <p className="text-[#CFCFD4]/70 font-body text-sm mb-6 max-w-[280px]">
                  {language === 'es' ? 'Gracias ' : 'Thank you '} <span className="text-white font-medium">{formData.name.split(' ')[0]}</span>. {language === 'es' ? 'Hemos recibido tu selección de plan con los datos de contacto suministrados.' : 'We have received your plan selection with the contact details provided.'}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => handleCloseModal(false)}
                    className="w-full py-3 px-6 rounded-xl border border-white/10 text-[#CFCFD4]/70 hover:text-white font-body text-sm hover:bg-white/5 transition-colors"
                  >
                    {language === 'es' ? 'Cerrar ventana' : 'Close window'}
                  </button>
                </div>
              </div>
            )}

          </DialogContent>
        </Dialog>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmerGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.1; transform: scale(0.8); }
        }
        @keyframes space-drift {
          0% { transform: translate(0, 0); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(40px, -150px); opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(20, 91, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 91, 255, 0.5);
        }
      `}</style>
    </section>
  );
};

const scrollToContact = () => {
  if (window.innerWidth < 1024) {
    window.dispatchEvent(new CustomEvent("open-booking-modal"));
  } else {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
};

export default PricingSection;
