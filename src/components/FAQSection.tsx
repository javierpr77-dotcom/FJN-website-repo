import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const { language } = useLanguage();

  const faqs = language === 'es' ? [
    {
      question: "¿Por qué mi página de internet no aparece en Google al buscar mis servicios en Puerto Rico?",
      answer: "La falta de visibilidad orgánica local ocurre porque la mayoría de las páginas web carecen de optimización técnica de velocidad e indexación estructurada JSON-LD. En FJN Digital Media implementamos microdatos schema geolocalizados para Puerto Rico, optimizamos la velocidad de respuesta (TTFB) a menos de 200ms en el borde CDN de Netlify y creamos clústeres semánticos de contenido de alta autoridad. Así garantizamos que tu negocio escale orgánicamente y aparezca número uno en las búsquedas tradicionales de Google y en resúmenes generativos de Inteligencia Artificial."
    },
    {
      question: "¿Qué diferencia real hay entre un website barato con plantillas prediseñadas y un desarrollo a la medida de FJN Digital Media?",
      answer: "Las plantillas de WordPress baratas o constructores visuales pesados poseen código basura, lentitud e inestabilidad extrema, lo que penaliza severamente el posicionamiento en buscadores. Nosotros codificamos sistemas web limpios desde cero utilizando React y Vite, logrando puntajes superiores al 98% en Pagespeed y cargas instantáneas. Esto elimina fugas de tráfico, genera seguridad de nivel bancario y consolida embudos de venta con tasas de conversión reales superiores al 30%."
    },
    {
      question: "¿Cómo posicionar mi negocio número uno en las búsquedas locales de Google y respuestas de Inteligencia Artificial (AIO) en Puerto Rico?",
      answer: "Dominar el mercado local hoy exige una combinación de SEO local geo-destinado, micro-datos JSON-LD y optimización para búsquedas de voz (AEO). Estructuramos tu sitio web para alimentar de forma directa los resúmenes de inteligencia artificial de Google AI Overviews y Gemini con respuestas directas de alto valor factual. Esta estrategia de optimización avanzada (GEO) aumenta la CTR (click-through rate) orgánica en un 55% y asegura la máxima visibilidad en San Juan, Ponce, Mayagüez y todo Puerto Rico."
    },
    {
      question: "¿Cómo puedo conseguir clientes ideales de forma automática y aumentar las llamadas y mensajes a mi negocio?",
      answer: "Para automatizar la captación de leads premium, diseñamos funnels de conversión automatizados combinados con landing pages de alto impacto táctico. En lugar de un catálogo digital estático, implementamos formularios asincrónicos, llamadas a la acción (CTA) persistentes e integraciones directas a bases de datos y WhatsApp. Esto reduce el costo de adquisición de leads (CPA) en un 45% y canaliza propuestas comerciales listas para cerrar."
    },
    {
      question: "¿Por qué las campañas de mis anuncios de Google o Facebook Ads fracasan al llegar a mi página web?",
      answer: "Enviar anuncios de pago a una página lenta y confusa es quemar el presupuesto publicitario. Una campaña de mercadeo exitosa requiere landing pages de alto impacto diseñadas con psicología del consumidor y velocidad extrema. Alineamos el mensaje comercial del anuncio con la arquitectura interna de la página web, reduciendo inmediatamente el porcentaje de rebote y maximizando drásticamente la tasa de conversión por clic."
    },
    {
      question: "¿Si mi negocio contrata un sistema web avanzado, podré editar el contenido fácilmente en el futuro?",
      answer: "Totalmente. Aunque la ingeniería interna es de nivel corporativo, su administración es sumamente amigable. Integramos sistemas de gestión de contenido (CMS) simplificados y personalizados en la nube para que tu equipo pueda actualizar textos, portafolio, servicios o fotografías en segundos sin el riesgo de alterar o romper el código fuente."
    }
  ] : [
    {
      question: "Why is my business website super slow, and why doesn't it show up on Google in Puerto Rico?",
      answer: "Slow loading is usually caused by unoptimized assets, bloated templates, and poor hosting infrastructure. Since slow sites have high bounce rates, Google penalizes them severely. FJN Digital Media crafts custom React setups served close to the user on Netlify's global edge network, bringing loading speeds below 1.2 seconds to satisfy search crawlers and secure top listings."
    },
    {
      question: "What is the difference between cheap template-based websites and a professional conversion system?",
      answer: "Cheap visual editors or generic templates offer no distinct branding or conversion tactics, leading to conversion rates of less than 2%. FJN Digital Media develops bespoke high-performance structures from scratch. By combining modern typography, fluid UX, and psychological sales triggers, we lift core conversion rates above 30%."
    },
    {
      question: "How can my business rank first on Google Local Pack and AI Overviews in Puerto Rico?",
      answer: "Ranking first requires an advanced blend of geo-targeted local SEO, structured JSON-LD schemas, and content optimized for Generative Engine Optimization (GEO). We model your website structure to serve Gemini and Google AI Overviews directly with authoritative factual data. This advanced architecture elevates organic click-through rates by up to 55%."
    },
    {
      question: "How can I acquire high-quality warm sales leads and automate client calls for my local business?",
      answer: "We design strategic lead generation sales funnels coupled with high-converting custom landing pages. Instead of a passive virtual flyer, we embed interactive, lightning-fast form captures and seamless routing to instant messenger channels, cutting lead acquisition costs (CPA) by 45% and funneling inquiries directly to your sales team."
    },
    {
      question: "Why do my paid Meta and Google ad campaigns fail once users click through to my website?",
      answer: "Driving paid traffic to a sluggish website is an expensive mistake. High-converting campaigns must route to single-focus landing pages tailored down to the millimeter with consumer psychology. We synchronize your ad messaging with our responsive layouts, reducing bounce rates and maximizing return on ad spend."
    },
    {
      question: "If we implement a custom advanced web system, will my team be able to edit content without breaking code?",
      answer: "Absolutely. While the core under-the-hood engineering is high-performance React and Vite, the administrative panel is incredibly simple. We deploy localized, custom cloud CMS solutions, allowing your marketing team to edit services, text, and portfolio galleries in seconds without touching a single line of code."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="min-h-screen pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden bg-[#030712]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Radial Gradients Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(20,91,255,0.5)_0%,transparent_60%)] blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.6, 1],
            opacity: [0.5, 0.9, 0.5],
            x: [0, -100, 50, 0],
            y: [0, 100, -50, 0],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-30%] right-[-20%] w-[90%] h-[90%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35)_0%,transparent_60%)] blur-[120px]"
        />
        {/* Extra electric core */}
        <motion.div 
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.4, 1],
            x: [0, 50, -50, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(20,91,255,0.7)_0%,transparent_50%)] blur-[80px]"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32">
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
                <HelpCircle className="w-4 h-4 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
                <span className="text-white font-body text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
                  {language === 'es' ? 'Resolución de Problemas' : 'Problem Solving'}
                </span>
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight mb-6"
              >
                {language === 'es' ? 'Respuestas a los ' : 'Answers to Market '} <br />
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent italic font-light drop-shadow-[0_0_15px_rgba(20,91,255,0.5)]"
                >
                  {language === 'es' ? 'Dolores del Mercado' : 'Pain Points'}
                </motion.span>
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#CFCFD4] font-body text-lg font-light leading-relaxed mb-10"
              >
                {language === 'es' 
                  ? 'Entendemos por qué la mayoría de los sitios web fallan. Descubre cómo nuestra ingeniería web estratégica transforma cuellos de botella en ' 
                  : 'We understand why most websites fail. Discover how our strategic web engineering transforms bottlenecks into '}
                <motion.span 
                  animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent font-medium drop-shadow-[0_0_10px_rgba(20,91,255,0.6)]"
                >
                  {language === 'es' ? 'túneles de conversión de alto rendimiento' : 'high-performance conversion tunnels'}
                </motion.span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link 
                  to="/"
                  onClick={() => window.scrollTo(0, 0)}
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 font-body font-medium text-white transition-all duration-500 rounded-full overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(20,91,255,0.8)',
                    boxShadow: '0 0 15px rgba(20,91,255,0.4), inset 0 0 10px rgba(20,91,255,0.2)'
                  }}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#145BFF]/0 via-[#145BFF]/20 to-[#145BFF]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Column: FAQs Accordion */}
          <div className="lg:col-span-7">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem 
                    value={`item-${index}`}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 md:px-8 overflow-hidden backdrop-blur-md transition-all duration-500 hover:bg-white/[0.04] hover:border-[#145BFF]/30 data-[state=open]:border-[#145BFF]/50 data-[state=open]:bg-gradient-to-br data-[state=open]:from-[#145BFF]/10 data-[state=open]:to-transparent data-[state=open]:shadow-[0_0_30px_rgba(20,91,255,0.15)]"
                  >
                    <AccordionTrigger className="text-left text-lg md:text-xl font-heading text-white hover:no-underline py-6 md:py-8 group">
                      <span className="group-hover:text-[#145BFF] transition-colors duration-300 pr-4 leading-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#CFCFD4]/90 font-body text-base md:text-lg font-light leading-relaxed pb-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;
