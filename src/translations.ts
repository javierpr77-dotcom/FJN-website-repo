export type Language = 'es' | 'en';

export const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.servicios": { es: "Servicios", en: "Services" },
  "nav.planes": { es: "Planes", en: "Pricing" },
  "nav.resenas": { es: "Casos de éxitos", en: "Success Stories" },
  "nav.consultas": { es: "Consultas", en: "Consultations" },
  "nav.contacto": { es: "Contacto", en: "Contact" },
  
  // Hero
  "hero.badge": { es: "Sistemas de Conversión", en: "Conversion Systems" },
  "hero.title.part1": { es: "Pagar por páginas bonitas.", en: "Paying for pretty websites." },
  "hero.title.part2": { es: "Sistema de Conversión", en: "Conversion System" },
  "hero.title.part3": { es: "De Clientes.", en: "Of Clients." },
  "hero.subtitle.p1": { es: "Desarrollamos websites estratégicos que", en: "We develop strategic websites that" },
  "hero.subtitle.highlight": { es: "transforman visitantes en clientes", en: "transform visitors into clients" },
  "hero.subtitle.p2": { es: ". Sin plantillas genéricas ni excusas, solo resultados.", en: ". No generic templates or excuses, only results." },
  "hero.cta.primary": { es: "Agendar Asesoría", en: "Schedule Consultation" },
  "hero.cta.secondary": { es: "Ver Planes", en: "View Plans" },
  "hero.trust.satisfied": { es: "Clientes satisfechos", en: "Satisfied clients" },
  "hero.trust.reviews": { es: "5.0 en reseñas", en: "5.0 in reviews" },
  "hero.trust.personalized": { es: "100% personalizados", en: "100% personalized" },
};
