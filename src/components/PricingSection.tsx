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

    setModalStep(3);
  };

  const basePrice = selectedPlan ? parseInt(selectedPlan.price.replace(/,/g, '')) : 0;
  const addonsTotal = selectedPlan?.addons
    ?.filter(a => selectedAddons.includes(a.name))
    .reduce((sum, a) => sum + parseInt(a.price.replace(/,/g, '')), 0) || 0;
  const estimatedTotal = basePrice + addonsTotal;

  const plans: Plan[] = [
    {
      id: "plan-1",
      name: "Starter",
      titleIcon: <Sparkles className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "500",
      idealForBullets: language === 'es' ? [
        <>Emprendedores que comienzan desde <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">cero</span>.</>,
        <>Negocios buscando presencia seria con baja <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">inversión</span>.</>,
        <>Marcas que necesitan validar antes de <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">escalar</span>.</>
      ] : [
        <>Entrepreneurs starting from <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">scratch</span>.</>,
        <>Businesses looking for serious presence with low <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">investment</span>.</>,
        <>Brands that need to validate before <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">scaling</span>.</>
      ],
      features: language === 'es' ? [
        "1 landing page de una sola página",
        "diseño moderno básico responsive",
        "hero principal con llamado a la acción",
        "sección sobre el negocio",
        "sección de servicios o beneficios",
        "formulario de contacto",
        "1 revisión incluida"
      ] : [
        "1 single-page landing page",
        "basic modern responsive design",
        "main hero with call to action",
        "about the business section",
        "services or benefits section",
        "contact form",
        "1 revision included"
      ],
      addons: language === 'es' ? [
        { name: "Sección adicional", price: "75" },
        { name: "Página adicional", price: "150" },
        { name: "Botón de WhatsApp", price: "85" },
        { name: "Copywriting profesional", price: "200" },
        { name: "Formulario avanzado con más campos / lógica básica", price: "100" },
        { name: "Recepcionista AI", price: "275" },
        { name: "Configuración con plataforma de email marketing", price: "180" },
        { name: "Integración con CRM", price: "225" },
        { name: "Versión bilingüe manual (español / inglés)", price: "180" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Widget externo de booking / calendario / reserva", price: "185" },
        { name: "Galería premium más desarrollada", price: "150" },
        { name: "Sección de testimonios / prueba social más robusta", price: "125" },
        { name: "Integración de Google Maps / Waze", price: "85" },
        { name: "Automatización simple de leads / respuesta inicial", price: "180" },
        { name: "Integración de Google Analytics (análisis de data y métricas)", price: "100" }
      ] : [
        { name: "Additional section", price: "75" },
        { name: "Additional page", price: "150" },
        { name: "WhatsApp button", price: "85" },
        { name: "Professional copywriting", price: "200" },
        { name: "Advanced form with more fields / basic logic", price: "100" },
        { name: "AI Receptionist", price: "275" },
        { name: "Setup with email marketing platform", price: "180" },
        { name: "CRM Integration", price: "225" },
        { name: "Manual bilingual version (Spanish / English)", price: "180" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "External booking / calendar widget", price: "185" },
        { name: "Premium developed gallery", price: "150" },
        { name: "More robust testimonials / social proof section", price: "125" },
        { name: "Google Maps / Waze integration", price: "85" },
        { name: "Simple lead automation / initial response", price: "180" },
        { name: "Google Analytics integration (data analysis and metrics)", price: "100" }
      ],
      notIncluded: language === 'es' ? "Este plan cubre una base funcional y profesional. Toda integración, funcionalidad o configuración adicional no incluida en el plan base se cotiza aparte según complejidad." : "This plan covers a functional and professional base. Any additional integration, functionality or setup not included in the base plan is quoted separately based on complexity.",
      popular: false
    },
    {
      id: "plan-2",
      name: "Business Pro",
      titleIcon: <Briefcase className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "800",
      idealForBullets: language === 'es' ? [
        <>Negocios locales y freelancers con <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">experiencia</span>.</>,
        <>Empresas que necesitan una web más <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">firme</span>.</>,
        <>Marcas buscando mejor <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">posicionamiento</span>.</>
      ] : [
        <>Local businesses and experienced <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">freelancers</span>.</>,
        <>Companies that need a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">firmer</span> website.</>,
        <>Brands looking for better <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">positioning</span>.</>
      ],
      features: language === 'es' ? [
        "website de hasta 3 páginas",
        "diseño personificado, moderno y profesional",
        "estructura estratégica de conversión",
        "copywriting básico",
        "formulario de contacto y/o botón de WhatsApp",
        "sección de servicios más desarrollada",
        "bloque de confianza o prueba social",
        "SEO básico"
      ] : [
        "website of up to 3 pages",
        "personalized, modern and professional design",
        "strategic conversion structure",
        "basic copywriting",
        "contact form and/or WhatsApp button",
        "more developed services section",
        "trust block or social proof section",
        "basic SEO"
      ],
      addons: language === 'es' ? [
        { name: "Sección adicional (layout moderno)", price: "150" },
        { name: "Página adicional estratégica / personificada", price: "150" },
        { name: "Copywriting profesional (persuasivo)", price: "200" },
        { name: "Formulario avanzado (branding)", price: "145" },
        { name: "Recepcionista AI (modelo avanzado / automatizaciones)", price: "380" },
        { name: "Configuración con plataforma de email marketing", price: "180" },
        { name: "Integración con CRM", price: "225" },
        { name: "Versión bilingüe manual (español / inglés)", price: "180" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Widget externo de booking / calendario / reserva", price: "185" },
        { name: "Galería premium (slider / carrusel)", price: "180" },
        { name: "Sección de testimonios / prueba social (diseño moderno)", price: "185" },
        { name: "Integración de Google Maps / Waze", price: "85" },
        { name: "Automatización de leads / respuesta inicial", price: "180" },
        { name: "Integración de blog", price: "350" },
        { name: "Integración de Google Analytics, eventos clave y reportes detallados", price: "185" }
      ] : [
        { name: "Additional section (modern layout)", price: "150" },
        { name: "Additional strategic / personalized page", price: "150" },
        { name: "Professional copywriting (persuasive)", price: "200" },
        { name: "Advanced form (branding)", price: "145" },
        { name: "AI Receptionist (advanced model / automations)", price: "380" },
        { name: "Setup with email marketing platform", price: "180" },
        { name: "CRM Integration", price: "225" },
        { name: "Manual bilingual version (Spanish / English)", price: "180" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "External booking / calendar widget", price: "185" },
        { name: "Premium gallery (slider / carousel)", price: "180" },
        { name: "Testimonies / social proof section (modern design)", price: "185" },
        { name: "Google Maps / Waze integration", price: "85" },
        { name: "Lead automation / initial response", price: "180" },
        { name: "Blog integration", price: "350" },
        { name: "Google Analytics integration, key events and detailed reports", price: "185" }
      ],
      notIncluded: language === 'es' ? "No incluye CRM, email marketing, automatizaciones complejas, versión bilingüe manual ni ecommerce." : "Does not include CRM, email marketing, complex automations, manual bilingual version, or ecommerce.",
      popular: true
    },
    {
      id: "plan-3",
      name: "Growth Premium",
      titleIcon: <TrendingUp className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "1,200",
      idealForBullets: language === 'es' ? [
        <>Empresas estructuradas con múltiples <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">servicios</span>.</>,
        <>Proyectos y marcas con enfoque <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">premium</span>.</>,
        <>Negocios listos para aumentar su <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">conversión</span>.</>
      ] : [
        <>Structured companies with multiple <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">services</span>.</>,
        <>Projects and brands with a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">premium</span> focus.</>,
        <>Businesses ready to increase their <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">conversion</span>.</>
      ],
      features: language === 'es' ? [
        "website de hasta 5 páginas",
        "diseño premium, moderno y profesional",
        "estructura orientada a conversión y autoridad",
        "organización avanzada de servicios o soluciones",
        "copywriting avanzado",
        "sección de autoridad, confianza o portafolio",
        "formularios y CTA estratégicos",
        "SEO avanzado",
        "WhatsApp Chatbot integrado"
      ] : [
        "website of up to 5 pages",
        "premium, modern and professional design",
        "structure oriented to conversion and authority",
        "advanced organization of services or solutions",
        "advanced copywriting",
        "authority, trust or portfolio section",
        "strategic forms and CTA",
        "advanced SEO",
        "Integrated WhatsApp Chatbot"
      ],
      addons: language === 'es' ? [
        { name: "Sección adicional (layout premium / conversión)", price: "150" },
        { name: "Página adicional estratégica / personificada", price: "150" },
        { name: "Copywriting profesional (persuasivo)", price: "200" },
        { name: "Formulario avanzado (branding)", price: "145" },
        { name: "Recepcionista AI (5 automatizaciones avanzadas)", price: "550" },
        { name: "Configuración con plataforma de email marketing", price: "180" },
        { name: "Integración con CRM", price: "225" },
        { name: "Versión bilingüe manual (español / inglés)", price: "180" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Widget externo de booking / calendario / reserva", price: "185" },
        { name: "Galería premium (slider / carrusel)", price: "180" },
        { name: "Sección de testimonios / prueba social (diseño moderno)", price: "185" },
        { name: "Integración de Google Maps / Waze", price: "85" },
        { name: "Automatización de leads / respuesta inicial", price: "180" },
        { name: "Integración de Google Analytics, eventos clave y reportes detallados", price: "185" },
        { name: "Integración de blog estratégico", price: "450" }
      ] : [
        { name: "Additional section (premium layout / conversion)", price: "150" },
        { name: "Additional strategic / personalized page", price: "150" },
        { name: "Professional copywriting (persuasive)", price: "200" },
        { name: "Advanced form (branding)", price: "145" },
        { name: "AI Receptionist (5 advanced automations)", price: "550" },
        { name: "Setup with email marketing platform", price: "180" },
        { name: "CRM Integration", price: "225" },
        { name: "Manual bilingual version (Spanish / English)", price: "180" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "External booking / calendar widget", price: "185" },
        { name: "Premium gallery (slider / carousel)", price: "180" },
        { name: "Testimonies / social proof section (modern design)", price: "185" },
        { name: "Google Maps / Waze integration", price: "85" },
        { name: "Lead automation / initial response", price: "180" },
        { name: "Google Analytics integration, key events and detailed reports", price: "185" },
        { name: "Strategic blog integration", price: "450" }
      ],
      notIncluded: language === 'es' ? "No incluye CRM completo ni automatizaciones avanzadas, email marketing avanzado ni agentes IA especializados." : "Does not include full CRM, advanced automations, advanced email marketing, or specialized AI agents.",
      popular: false
    },
    {
      id: "plan-4",
      name: "Elite Signature",
      titleIcon: <Crown className="w-6 h-6 text-[#145BFF] drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]" style={{ animation: 'floatIcon 3s ease-in-out infinite' }} />,
      price: "1,500",
      idealForBullets: language === 'es' ? [
        <>Marcas premium, negocios consolidados y proyectos que necesitan una <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">presencia digital de alto nivel</span>.</>,
        <>Más <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">exclusiva</span>, más <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">impactante</span> y mejor estructurada.</>,
        <>Para posicionarse con <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">más autoridad</span>.</>
      ] : [
        <>Premium brands, established businesses and projects that need a <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">high-level digital presence</span>.</>,
        <>More <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">exclusive</span>, more <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">impactful</span> and better structured.</>,
        <>To position yourself with <span className="text-[#3B7BFF] font-medium drop-shadow-[0_0_8px_rgba(59,123,255,0.8)]">more authority</span>.</>
      ],
      features: language === 'es' ? [
        "website de hasta 7 páginas",
        "diseño premium elevado, elegante y más exclusivo",
        "estructura comercial de alto impacto",
        "experiencia visual más inmersiva y refinada",
        "copywriting profesional y persuasivo",
        "secciones de autoridad, portafolio y confianza más robustas",
        "CTA y rutas de conversión más trabajadas",
        "SEO Pro",
        "WhatsApp Chatbot integrado"
      ] : [
        "website of up to 7 pages",
        "elevated premium design, elegant and more exclusive",
        "high-impact commercial structure",
        "more immersive and refined visual experience",
        "professional and persuasive copywriting",
        "more robust authority, portfolio and trust sections",
        "better crafted CTAs and conversion routes",
        "Pro SEO",
        "Integrated WhatsApp Chatbot"
      ],
      addons: language === 'es' ? [
        { name: "Sección adicional (layout premium / conversión)", price: "150" },
        { name: "Página adicional estratégica / personificada", price: "150" },
        { name: "Formulario avanzado (branding)", price: "145" },
        { name: "Recepcionista AI (5 automatizaciones avanzadas)", price: "550" },
        { name: "Configuración con plataforma de email marketing", price: "180" },
        { name: "Integración con CRM", price: "225" },
        { name: "Versión bilingüe manual (español / inglés)", price: "180" },
        { name: "Auto-identificador / selector de idioma AI", price: "300" },
        { name: "Widget externo de booking / calendario / reserva", price: "185" },
        { name: "Galería premium (slider / carrusel)", price: "180" },
        { name: "Sección de testimonios / prueba social (diseño moderno)", price: "185" },
        { name: "Integración de Google Maps / Waze", price: "85" },
        { name: "Automatización de leads / respuesta inicial", price: "180" },
        { name: "Integración de Google Analytics, reportes detallados y Microsoft Clarity", price: "225" },
        { name: "Integración de blog estratégico", price: "450" }
      ] : [
        { name: "Additional section (premium layout / conversion)", price: "150" },
        { name: "Additional strategic / personalized page", price: "150" },
        { name: "Advanced form (branding)", price: "145" },
        { name: "AI Receptionist (5 advanced automations)", price: "550" },
        { name: "Setup with email marketing platform", price: "180" },
        { name: "CRM Integration", price: "225" },
        { name: "Manual bilingual version (Spanish / English)", price: "180" },
        { name: "AI Auto-identifier / language selector", price: "300" },
        { name: "External booking / calendar widget", price: "185" },
        { name: "Premium gallery (slider / carousel)", price: "180" },
        { name: "Testimonies / social proof section (modern design)", price: "185" },
        { name: "Google Maps / Waze integration", price: "85" },
        { name: "Lead automation / initial response", price: "180" },
        { name: "Google Analytics integration, detailed reports and Microsoft Clarity", price: "225" },
        { name: "Strategic blog integration", price: "450" }
      ],
      notIncluded: language === 'es' ? "Cualquier desarrollo externo que requiera integración de terceros (SaaS de terceros) debe cotizarse previamente." : "Any external development requiring third-party integration (third-party SaaS) must be quoted in advance.",
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div 
              key={plan.id}
              className={`relative flex flex-col rounded-3xl transition-all duration-500 hover:-translate-y-2 ${plan.popular ? 'border-[#145BFF]/50 shadow-[0_0_40px_rgba(20,91,255,0.15)]' : 'border-white/[0.08] hover:border-[#145BFF]/30 hover:shadow-[0_0_30px_rgba(20,91,255,0.1)]'}`}
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
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${plan.popular ? 'via-[#145BFF]' : 'via-white/20'} to-transparent opacity-50`}></div>

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
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFCFD4]/40" />
                      <input required type="email" placeholder={language === 'es' ? 'Tu correo electrónico' : 'Your email'} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#CFCFD4]/40 focus:outline-none focus:border-[#145BFF]/50 focus:bg-[#145BFF]/[0.02] transition-all" />
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
                  {language === 'es' ? 'Gracias ' : 'Thank you '} <span className="text-white font-medium">{formData.name.split(' ')[0]}</span>. {language === 'es' ? 'Hemos recibido tu selección del plan ' : 'We have received your selection for the '} <span className="text-white font-medium">{selectedPlan?.name}</span>. {language === 'es' ? 'Tu solicitud ya fue registrada y la recibimos por correo.' : 'Your request has been registered and received by email.'}
                </p>
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => {
                      const planMessage = language === 'es'
                        ? `¡Hola! Acabo de solicitar el Plan *${selectedPlan?.name}* con los siguientes add-ons: ${selectedAddons.join(', ') || 'Ninguno'}. Mi inversión estimada es de $${estimatedTotal.toLocaleString()} USD.%0A%0A*Mi Nombre:* ${formData.name}%0A*Mi Teléfono:* ${formData.phone}%0A*Mi Email:* ${formData.email}`
                        : `Hello! I just requested the *${selectedPlan?.name}* Plan with the following add-ons: ${selectedAddons.join(', ') || 'None'}. My estimated investment is $${estimatedTotal.toLocaleString()} USD.%0A%0A*My Name:* ${formData.name}%0A*My Phone:* ${formData.phone}%0A*My Email:* ${formData.email}`;
                      window.open(`https://wa.me/17872102204?text=${planMessage}`, '_blank');
                    }}
                    className="w-full py-3 px-6 rounded-xl font-body text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.042-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.266 3.504 5.28 3.501 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.595-1.013-5.035-2.855-6.877C16.638 2.155 14.191 1.157 12 1.157c-5.438 0-9.863 4.372-9.866 9.731-.001 1.714.457 3.39 1.32 4.894L2.435 21.03l5.212-1.365zM17.06 14.37c-.277-.139-1.64-.81-1.895-.903-.255-.093-.44-.139-.626.139-.186.278-.718.903-.88 1.088-.163.186-.325.208-.602.069-.277-.139-1.17-.431-2.228-1.374-.823-.734-1.38-1.64-1.54-1.92-.163-.277-.018-.427.12-.566.125-.125.277-.324.416-.486.14-.162.186-.278.277-.463.093-.186.046-.347-.023-.486-.069-.139-.626-1.505-.856-2.061-.225-.541-.472-.467-.626-.467-.146-.006-.314-.006-.482-.006-.168 0-.442.063-.673.314-.23.25-.88.861-.88 2.099 0 1.238.9 2.432 1.002 2.571.102.14 1.772 2.706 4.293 3.792.6.258 1.068.413 1.432.529.602.191 1.15.164 1.583.1.482-.072 1.64-.67 1.871-1.318.23-.65.23-1.205.162-1.318-.069-.115-.254-.185-.531-.324z"/>
                    </svg>
                    {language === 'es' ? 'Iniciar Chat en WhatsApp' : 'Start Chat on WhatsApp'}
                  </button>
                  <button
                    onClick={() => handleCloseModal(false)}
                    className="w-full py-3 px-6 rounded-xl border border-white/10 text-[#CFCFD4]/70 hover:text-white font-body text-sm hover:bg-white/5 transition-colors"
                  >
                    {language === 'es' ? 'Cerrar' : 'Close'}
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
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
};

export default PricingSection;
