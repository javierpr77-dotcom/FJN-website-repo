import { motion } from "framer-motion";
import { Zap, TrendingUp, Crown, Settings } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: React.ReactNode;
  features: (string | React.ReactNode)[];
  icon: React.ReactNode;
  index: number;
  trustTag: string;
  trustIcon: React.ReactNode;
}

const ServiceCard = ({ title, description, features, icon, index, trustTag, trustIcon }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotateX: 15, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 80, 
        damping: 20 
      }}
      className="group relative rounded-3xl p-6 md:p-10 overflow-hidden sticky"
      style={{
        top: `calc(6.25rem + ${index * 1.2}rem)`, // Balanced top clearance and bottom visibility
        zIndex: index * 10, // Ensures proper stacking order
        transformOrigin: "top center",
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        backdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Hover Neon Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#145BFF]/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#145BFF]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#145BFF]/20 to-transparent"></div>
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-[#145BFF]/50 to-transparent"></div>
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-[#145BFF]/20 to-transparent"></div>
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#145BFF]/10 border border-[#145BFF]/20 flex items-center justify-center mb-6 md:mb-8 text-[#145BFF] group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        
        <h3 className="text-2xl md:text-3xl font-heading text-white mb-3 md:mb-4 tracking-tight">
          {title}
        </h3>
        
        <p className="text-[#CFCFD4] font-body text-sm md:text-lg leading-relaxed mb-6 md:mb-8 font-light">
          {description}
        </p>

        <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1.5 md:mt-2 w-1.5 h-1.5 rounded-full bg-[#145BFF] shrink-0"></div>
              <span className="text-[#CFCFD4]/80 font-body text-sm md:text-base">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/5">
          <div 
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(12px)',
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(rgba(5,5,7,1), rgba(5,5,7,1)), linear-gradient(90deg, #145BFF, #FFFFFF)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              boxShadow: '0 0 15px rgba(20,91,255,0.3), inset 0 0 10px rgba(255,255,255,0.05)'
            }}
          >
            <div className="text-[#3B7BFF] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
              {trustIcon}
            </div>
            <span className="text-white font-body text-xs uppercase tracking-[0.15em] font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {trustTag}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
