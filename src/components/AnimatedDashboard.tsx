import { motion } from "framer-motion";
import { Activity, TrendingUp, Bot, ArrowUpRight, Cpu, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const AnimatedDashboard = () => {
  const { language } = useLanguage();
  const [conversion, setConversion] = useState(59.3);
  const [agents, setAgents] = useState(11);
  const [leads, setLeads] = useState(1284);

  useEffect(() => {
    const interval = setInterval(() => {
      setConversion((prev) => +(prev + (Math.random() * 1.5 - 0.2)).toFixed(1));
      setAgents((prev) => Math.max(8, prev + Math.floor(Math.random() * 3 - 1)));
      setLeads((prev) => prev + Math.floor(Math.random() * 4));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col shadow-[0_0_30px_rgba(20,91,255,0.2)] overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#145BFF]/30 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#A855F7]/30 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-[#F59E0B]/20 blur-[50px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 relative z-10 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
        </div>
        <div className="text-[8px] xs:text-[9.5px] sm:text-[10px] uppercase font-mono tracking-normal xs:tracking-widest text-[#00D4FF] font-medium flex items-center gap-1 xs:gap-1.5 shrink-0 whitespace-nowrap">
          <Cpu className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-[#00D4FF] shrink-0" />
          {language === 'es' ? 'Núcleo de I.A.' : 'A.I. Core'}
        </div>
      </div>

      {/* Grid Layout (Top 2 Metrics) */}
      <div className="grid grid-cols-2 gap-2 xs:gap-3 relative z-10 shrink-0">
        {/* Metric 1: Conversion */}
        <motion.div
          className="bg-white/[0.03] rounded-xl p-2 sm:p-3 flex flex-col justify-between border border-white/5 relative overflow-hidden backdrop-blur-md hover:bg-white/[0.06] transition-colors"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-1 sm:gap-2 text-white/60 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00D4FF] shrink-0" />
            <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-medium uppercase tracking-wider text-white/80 shrink-0 truncate">
              {language === 'es' ? 'Conversión' : 'Conversion'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-end gap-1 sm:gap-1.5 w-full">
            <motion.span
              key={conversion}
              initial={{ opacity: 0.5, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(0,212,255,0.8)] font-mono leading-none shrink-0"
            >
              {conversion}%
            </motion.span>
            <div className="flex items-center text-[7.5px] xs:text-[8.5px] sm:text-[9px] text-green-400 font-medium mb-0.5 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)] bg-green-400/10 px-1 py-0.5 rounded shrink-0 select-none">
               <ArrowUpRight className="w-2.5 h-2.5 mr-0.5 shrink-0" />
               3.2%
            </div>
          </div>
          
          {/* Animated Graph lines */}
          <div className="mt-2.5 flex items-end gap-1 h-6">
            {[40, 25, 50, 45, 75, 60, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#145BFF] to-[#00D4FF] rounded-t-sm shadow-[0_0_8px_rgba(0,212,255,0.6)]"
                initial={{ height: "10%" }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                  delay: i * 0.15
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Metric 2: Agent Activity */}
        <motion.div
          className="bg-white/[0.03] rounded-xl p-2 sm:p-3 flex flex-col justify-between border border-white/5 relative overflow-hidden backdrop-blur-md hover:bg-white/[0.06] transition-colors"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center gap-1 sm:gap-2 text-white/60 mb-1.5">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A855F7] shrink-0" />
            <span className="text-[8.5px] xs:text-[9.5px] sm:text-[10px] font-medium uppercase tracking-wider text-white/80 shrink-0 truncate">
              {language === 'es' ? 'Agentes' : 'Agents'}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <motion.span
              key={agents}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-[0_0_12px_rgba(168,85,247,0.8)] font-mono leading-none shrink-0"
            >
              {agents}
            </motion.span>
            <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 mb-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400/80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
            </span>
          </div>

          {/* Radar / Node visual */}
          <div className="mt-1 relative w-full h-8 flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute w-10 h-10 flex items-center justify-center"
             >
                <div className="w-full h-full border border-purple-500/30 rounded-full border-dashed animate-[spin_10s_linear_infinite_reverse]" />
                <div className="absolute w-2 h-2 bg-[#A855F7] rounded-full top-0 shadow-[0_0_10px_rgba(168,85,247,1)] animate-pulse" />
                <div className="absolute w-1.5 h-1.5 bg-[#00D4FF] rounded-full bottom-1 right-1 shadow-[0_0_10px_rgba(0,212,255,1)] animate-pulse" style={{ animationDelay: '0.3s'}} />
                <div className="absolute w-1.5 h-1.5 bg-white rounded-full top-2 left-0 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '0.7s'}} />
             </motion.div>
          </div>
        </motion.div>
      </div>

      {/* New Metric: Leads Funnel */}
      <motion.div
        className="bg-white/[0.03] rounded-xl flex items-stretch justify-between border border-white/5 relative overflow-hidden backdrop-blur-md mt-3 flex-grow hover:bg-white/[0.06] transition-colors z-10 min-h-[60px]"
        whileHover={{ y: -2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#F59E0B]/5 to-transparent pointer-events-none" />
        
        <div className="flex flex-col justify-center h-full p-2 sm:p-2.5 z-10 w-[45%] border-r border-white/5">
          <div className="flex items-center gap-1.5 text-white/60 mb-1">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F59E0B] shrink-0" />
            <span className="text-[8px] xs:text-[9px] font-medium uppercase tracking-wider text-white/80 truncate">
              {language === 'es' ? 'Túnel Leads' : 'Leads Funnel'}
            </span>
          </div>
          <motion.span
            key={leads}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-white drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] font-mono"
          >
            +{leads.toLocaleString()}
          </motion.span>
        </div>

        {/* Animated Funnel Flow */}
        <div className="flex-1 relative flex flex-col justify-center gap-1.5 px-3 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-l from-[#F59E0B]/10 to-transparent pointer-events-none" />
           {/* Flow lines */}
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-full h-1.5 bg-white/5 rounded-full relative overflow-hidden">
               <motion.div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-[#FCD34D] to-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                  initial={{ width: "0%", x: "-100%" }}
                  animate={{ 
                    width: ["0%", "50%", "100%", "0%"],
                    x: ["-100%", "0%", "100%", "200%"]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    ease: "linear", 
                    delay: i * 0.7 
                  }}
               />
             </div>
           ))}
        </div>
      </motion.div>

      {/* Footer bar */}
      <div className="bg-white/[0.02] rounded-lg p-2.5 flex items-center justify-between border border-white/5 relative overflow-hidden z-10 mt-3 shrink-0">
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#145BFF]/10 to-transparent -translate-x-[100%] animate-[shimmer_2.5s_infinite]" />
         <div className="flex items-center gap-2">
           <Activity className="w-3 h-3 text-[#145BFF] animate-pulse" />
           <span className="text-[9px] text-[#CFCFD4]/70 uppercase tracking-widest font-mono shrink-0">
             {language === 'es' ? 'Análisis en tiempo real' : 'Real-time analysis'}
           </span>
         </div>
         <div className="flex gap-1 h-3 flex-end items-end ml-2 lg:ml-0 overflow-hidden">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               className="w-[3px] bg-[#145BFF] rounded-full shadow-[0_0_5px_rgba(20,91,255,0.6)] shrink-0"
               animate={{ 
                 height: ["20%", `${Math.random() * 80 + 20}%`, "20%"]
               }}
               transition={{
                 duration: 1 + Math.random(),
                 repeat: Infinity,
                 ease: "easeInOut"
               }}
             />
           ))}
         </div>
      </div>
    </div>
  );
};

export default AnimatedDashboard;
