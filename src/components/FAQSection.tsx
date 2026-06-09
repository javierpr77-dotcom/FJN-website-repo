import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const FAQSection = () => {
  const { language } = useLanguage();

  const faqs = language === 'es' ? [
    {
      question: "¿Por qué mi página web recibe tráfico pero no me genera ventas o leads?",
      answer: "Este es el problema principal de tener un 'brochure digital'. Tu tráfico llega, pero la fricción visual y la falta de un embudo de ventas los ahuyenta. Nosotros no diseñamos páginas web estáticas; construimos Sistemas de Conversión. Aplicamos ingeniería y psicología del consumidor para guiar a ese tráfico hacia un cierre seguro."
    },
    {
      question: "¿Qué diferencia a su agencia de otras opciones de diseño web más baratas?",
      answer: "El mercado está lleno de agencias que cobran por instalar plantillas genéricas. Pagar por una 'página bonita' que no vende es el modelo antiguo. Nuestra metodología Premium se centra en el Retorno de Inversión (ROI). Desarrollamos un diseño web de alto rendimiento, código a medida y embudos que tu competencia no puede igualar."
    },
    {
      question: "¿Incluyen posicionamiento SEO dentro de la arquitectura web?",
      answer: "Absolutamente. Un diseño de lujo no sirve de nada si Google no puede encontrarlo. Construimos tu sistema con SEO Técnico Avanzado desde la raíz. Optimizamos tiempos de carga en milisegundos, estructuramos meta-etiquetas y aplicamos arquitectura de información semántica para posicionarte orgánicamente y dominar a tu competencia local."
    },
    {
      question: "¿Por qué las campañas de mis anuncios (Meta/Google Ads) fracasan al llegar a mi web?",
      answer: "Enviar tráfico de anuncios costosos a una página web deficiente es quemar dinero. Una campaña exitosa requiere una Landing Page diseñada milimétricamente para convertir ese clic pago en cliente. Alineamos el lenguaje de tus campañas con la arquitectura de la web para bajar tus costos de adquisición de clientes (CAC) dramáticamente."
    },
    {
      question: "¿Si contrato un ecosistema avanzado, mi equipo podrá editar el contenido después?",
      answer: "Sí. Aunque la ingeniería por detrás es avanzada, diseñamos la interfaz administrativa con extrema simplicidad. Integramos Sistemas de Gestión de Contenidos (CMS) de lujo para que tú o tu equipo puedan modificar textos, servicios o productos sin tocar o romper el código fuente."
    },
    {
      question: "¿En cuánto tiempo podré lanzar mi nuevo Sistema de Conversión?",
      answer: "Depende de la envergadura y complejidad corporativa, pero nuestra ejecución gracias a la Inteligencia Artificial nos permite reducir los típicos tiempos de agencia. Lo que a otros les toma semanas o meses, nosotros lo podemos desplegar en una fracción del tiempo con el doble de precisión. Una vez sepamos tus requerimientos, cerramos un cronograma exacto."
    }
  ] : [
    {
      question: "Why does my website get traffic but not generate sales or leads?",
      answer: "This is the main problem of having a 'digital brochure'. Your traffic arrives, but visual friction and the lack of a sales funnel drives them away. We don't design static web pages; we build Conversion Systems. We apply engineering and consumer psychology to guide that traffic towards a secure close."
    },
    {
      question: "What differentiates your agency from cheaper web design options?",
      answer: "The market is full of agencies that charge to install generic templates. Paying for a 'pretty page' that doesn't sell is the old model. Our Premium methodology focuses on Return on Investment (ROI). We develop high-performance web design, custom code, and funnels that your competition cannot match."
    },
    {
      question: "Do you include SEO positioning within the web architecture?",
      answer: "Absolutely. A luxury design is useless if Google can't find it. We build your system with Advanced Technical SEO from the root. We optimize load times in milliseconds, structure meta-tags, and apply semantic information architecture to position you organically and dominate your local competition."
    },
    {
      question: "Why do my ad campaigns (Meta/Google Ads) fail when reaching my website?",
      answer: "Sending expensive ad traffic to a poor website is burning money. A successful campaign requires a Landing Page designed down to the millimeter to convert that paid click into a client. We align the language of your campaigns with the web architecture to dramatically lower your customer acquisition costs (CAC)."
    },
    {
      question: "If I hire an advanced ecosystem, will my team be able to edit the content later?",
      answer: "Yes. Although the backend engineering is advanced, we design the administrative interface with extreme simplicity. We integrate luxury Content Management Systems (CMS) so that you or your team can modify texts, services, or products without touching or breaking the source code."
    },
    {
      question: "How soon will I be able to launch my new Conversion System?",
      answer: "It depends on the scope and corporate complexity, but our execution powered by Artificial Intelligence allows us to reduce typical agency timelines. What takes others weeks or months, we can deploy in a fraction of the time with double the precision. Once we know your requirements, we close an exact schedule."
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
