import { motion } from "framer-motion";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Luis Rosa",
    title: "CEO",
    company: "Safety Pool Experts",
    quote: "Muy transparente, siempre está dispuesto, he logrado crecer mi compañía implementando sus métodos, altamente recomendado!",
    rating: 5,
    image: "/testimonials/luis-rosa.jpg",
    initials: "LR",
    isLogo: false
  },
  {
    name: "Ingrid D. Rodríguez",
    title: "LCSW",
    company: "Psicoterapeuta",
    quote: "Francisco, quiero agradecerte por la calidad de tu trabajo. Tu dedicación y conocimiento inspiran mucha confianza. Confío tenerte cerca durante mi evolución profesional.",
    rating: 5,
    image: "/testimonials/ingrid-rodriguez.jpg",
    initials: "IR",
    isLogo: false
  },
  {
    name: "Jonathan",
    title: "CEO",
    company: "Coqui Pay P.R",
    quote: "Gracias Francisco por su información y consejos. La reunión que tuvimos fue informativa y estamos implementando los consejos.",
    rating: 5,
    image: "/testimonials/coqui-pay.png",
    initials: "JP",
    isLogo: true
  }
];

const SocialProofSection = () => {
  return (
    <section id="resenas" className="pt-8 pb-24 md:pt-16 md:pb-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#145BFF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6 cursor-default"
          >
            <motion.div
              animate={{ 
                y: [0, -4, 0],
                boxShadow: [
                  "0 0 15px rgba(20,91,255,0.4), inset 0 0 8px rgba(20,91,255,0.2)",
                  "0 0 25px rgba(20,91,255,0.7), inset 0 0 12px rgba(20,91,255,0.3)",
                  "0 0 15px rgba(20,91,255,0.4), inset 0 0 8px rgba(20,91,255,0.2)"
                ]
              }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: 'rgba(20,91,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(20,91,255,0.8)',
              }}
            >
              <MessageSquareQuote className="w-4 h-4 text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(20,91,255,0.8)]" />
              <span className="text-white font-body text-xs md:text-sm tracking-[0.2em] uppercase font-medium drop-shadow-[0_0_8px_rgba(20,91,255,0.5)]">
                Casos de Éxito
              </span>
            </motion.div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-heading text-white leading-[1.1] tracking-tight mb-6 cursor-default"
            style={{ fontWeight: 200 }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              Resultados que
            </motion.span>{" "}
            <br className="hidden md:block" />
            <motion.span 
              animate={{ 
                backgroundPosition: ["0% 50%", "200% 50%"],
                y: [0, 4, 0]
              }}
              transition={{ 
                backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="inline-block bg-[linear-gradient(90deg,#145BFF,#FFFFFF,#145BFF)] bg-[length:200%_auto] bg-clip-text text-transparent italic drop-shadow-[0_0_15px_rgba(20,91,255,0.5)]"
              style={{ fontWeight: 300 }}
            >
              Hablan por Sí Solos
            </motion.span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="h-full"
            >
              <motion.div
                animate={{
                  y: [0, index === 0 ? -8 : index === 1 ? -12 : -7, 0],
                }}
                transition={{
                  y: {
                    duration: index === 0 ? 5.5 : index === 1 ? 7 : 4.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }
                }}
                whileHover={{ y: -16, scale: 1.02 }}
                className="border border-white/5 relative p-8 md:p-10 rounded-[22px] flex flex-col h-full overflow-hidden transition-all duration-500 group cursor-default"
                style={{
                  background: 'linear-gradient(135deg, rgba(13,18,32,0.15) 0%, rgba(5,5,7,0.25) 100%)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {/* Decorative Neon Top-Right Boundary Lines */}
                <div 
                  className="absolute top-0 right-0 w-3/5 h-[1px] pointer-events-none rounded-tr-[22px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(20,91,255,0.8) 50%, rgba(255,255,255,0.9) 100%)',
                    boxShadow: '0 0 10px rgba(20,91,255,0.8)',
                  }}
                ></div>
                <div 
                  className="absolute top-0 right-0 w-[1px] h-3/5 pointer-events-none rounded-tr-[22px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(20,91,255,0.8) 50%, transparent 100%)',
                    boxShadow: '0 0 10px rgba(20,91,255,0.8)',
                  }}
                ></div>
                {/* Corner Glow Accent */}
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8)_0%,rgba(20,91,255,0.4)_40%,transparent_70%)] blur-[4px]"></div>

                <Quote className="w-10 h-10 text-[#145BFF]/60 mb-6 relative z-10 transition-colors duration-500 group-hover:text-[#145BFF]" />
                
                <p className="text-[#CFCFD4]/90 font-body text-base md:text-lg leading-relaxed font-light italic mb-8 flex-grow relative z-10">
                  "{testimonial.quote}"
                </p>

                <div className="flex justify-start mb-6 gap-1 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#145BFF] fill-[#145BFF] drop-shadow-[0_0_5px_rgba(20,91,255,0.8)]" />
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10 relative z-10">
                  <Avatar className={`w-14 h-14 border-2 border-[#145BFF]/50 shadow-[0_0_10px_rgba(20,91,255,0.3)] group-hover:border-[#FFFFFF] transition-colors duration-300 ${testimonial.isLogo ? 'bg-white p-2' : ''}`}>
                    <AvatarImage 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className={`${testimonial.isLogo ? 'object-contain object-center' : 'object-cover object-center'}`}
                    />
                    <AvatarFallback className="bg-[#145BFF]/20 text-[#145BFF] font-heading font-bold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-lg font-heading text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-[#CFCFD4] transition-all duration-300">
                      {testimonial.name}
                    </h4>
                    <p className="text-[#145BFF] font-mono text-xs tracking-wider uppercase mt-1 drop-shadow-[0_0_5px_rgba(20,91,255,0.3)]">
                      {testimonial.title} <span className="text-white/30">|</span> <span className="text-[#CFCFD4]/80">{testimonial.company}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SocialProofSection;
