import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { language } = useLanguage();

  const navLinks = language === 'es' 
    ? ["Servicios", "Planes", "Reseñas", "FAQ"]
    : ["Services", "Pricing", "Reviews", "FAQ"];

  const anchorLinks = ["servicios", "planes", "resenas", "faq"];

  return (
    <footer className="relative z-10 w-full overflow-hidden border-t border-white/5 bg-[#050507]/20 backdrop-blur-sm">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-[-15%] w-[50%] h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(20,91,255,0.15)_0%,transparent_70%)] blur-[40px]" />
        <div className="absolute bottom-0 right-[-15%] w-[50%] h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(20,91,255,0.1)_0%,transparent_70%)] blur-[40px]" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16 text-center md:text-left">
          
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 sm:h-12 w-auto object-contain mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-1">
            <h4 className="font-heading text-white text-lg tracking-wide mb-6">
              {language === 'es' ? 'Navegación' : 'Navigation'}
            </h4>
            <ul className="space-y-4">
              {navLinks.map((item, i) => (
                <li key={item}>
                  <a 
                    href={anchorLinks[i] === "faq" ? "/faq" : `/#${anchorLinks[i]}`}
                    className="font-body text-[#CFCFD4]/70 hover:text-white hover:drop-shadow-[0_0_10px_rgba(20,91,255,0.6)] transition-all duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-1">
            <h4 className="font-heading text-white text-lg tracking-wide mb-6">Legal</h4>
            <ul className="space-y-4">
              <li>
                <a href="#" className="font-body text-[#CFCFD4]/70 hover:text-white transition-all duration-300 text-sm">
                  {language === 'es' ? 'Términos y Condiciones' : 'Terms and Conditions'}
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#CFCFD4]/70 hover:text-white transition-all duration-300 text-sm">
                  {language === 'es' ? 'Política de Privacidad' : 'Privacy Policy'}
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#CFCFD4]/70 hover:text-white transition-all duration-300 text-sm">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between pt-8 border-t border-white/5 relative gap-4 md:gap-0">
          {/* Logo on the bottom left side as strictly requested, for smaller branding on the dividing line */}
          <div className="flex items-center gap-4 mb-4 md:mb-0">
             <img src="/logo.png" alt="Company Logo Small" className="h-6 w-auto object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
             <span className="font-body text-[#CFCFD4]/40 text-xs">
                © {new Date().getFullYear()} {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
             </span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-body text-[#CFCFD4]/40 text-xs">
                Powered by
              </span>
              <span className="font-heading text-white text-xs drop-shadow-[0_0_8px_rgba(20,91,255,0.4)] md:mr-1">
                FJN Digital Media,
              </span>
            </div>
            <span className="font-body text-[#CFCFD4]/60 text-xs text-center md:text-left">
              {language === 'es' ? 'Diseño hecho por Francisco Noble.' : 'Designed by Francisco Noble.'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
