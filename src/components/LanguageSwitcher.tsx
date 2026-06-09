import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface LanguageSwitcherProps {
  variant?: 'floating' | 'nav';
}

const LanguageSwitcher = ({ variant = 'floating' }: LanguageSwitcherProps) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = (lang: 'es' | 'en') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const getFlagUrl = (lang: 'es' | 'en') => {
    return lang === 'es' ? 'https://flagcdn.com/w40/pr.png' : 'https://flagcdn.com/w40/us.png';
  };

  if (variant === 'nav') {
    return (
      <div className="relative font-body z-[100] sm:hidden">
        {/* Options Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9, originY: 0, originX: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-3 right-0 bg-[#050507]/40 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-[0_0_30px_rgba(20,91,255,0.4),inset_0_0_10px_rgba(20,91,255,0.1)] flex flex-col gap-1 w-[140px]"
            >
              <button
                onClick={() => toggleLanguage('es')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  language === 'es' ? 'bg-[#145BFF]/20 text-white border border-[#145BFF]/30' : 'text-[#CFCFD4]/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <img src={getFlagUrl('es')} alt="Español (PR)" className="w-5 h-auto rounded-[2px]" />
                <span>Español</span>
              </button>
              <button
                onClick={() => toggleLanguage('en')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-[#145BFF]/20 text-white border border-[#145BFF]/30' : 'text-[#CFCFD4]/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <img src={getFlagUrl('en')} alt="English (US)" className="w-5 h-auto rounded-[2px]" />
                <span>English</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Change language"
        >
          <Globe className="w-3 h-3 text-[#3B7BFF]/50" />
          <img 
            src={getFlagUrl(language)} 
            alt={language === 'es' ? "Español" : "English"} 
            className="w-4 h-auto rounded-[2px]"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-body">
      <div className="relative">
        {/* Options Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9, originY: 1, originX: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-3 bg-[#050507]/80 backdrop-blur-lg border border-white/15 rounded-2xl p-2 shadow-[0_0_30px_rgba(20,91,255,0.5),inset_0_0_15px_rgba(20,91,255,0.15)] flex flex-col gap-1.5 w-[140px]"
            >
              <button
                onClick={() => toggleLanguage('es')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  language === 'es' ? 'bg-[#145BFF]/25 text-white border border-[#145BFF]/40' : 'text-[#CFCFD4]/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <img src={getFlagUrl('es')} alt="Español (PR)" className="w-5 h-auto rounded-[2px]" />
                <span>Español</span>
              </button>
              <button
                onClick={() => toggleLanguage('en')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  language === 'en' ? 'bg-[#145BFF]/25 text-white border border-[#145BFF]/40' : 'text-[#CFCFD4]/70 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <img src={getFlagUrl('en')} alt="English (US)" className="w-5 h-auto rounded-[2px]" />
                <span>English</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center p-3 rounded-full bg-transparent border border-transparent transition-all duration-300 group active:scale-90 cursor-pointer"
          aria-label="Change language"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              y: [0, -4, 0]
            }}
            transition={{ 
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="text-[#3B7BFF] group-hover:text-[#00FFFF] transition-colors duration-300 flex items-center justify-center shrink-0"
          >
            <Globe className="w-5.5 h-5.5 filter drop-shadow-[0_0_8px_rgba(59,123,255,0.7)] group-hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.85)]" />
          </motion.div>
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
