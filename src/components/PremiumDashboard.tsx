import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";

const PremiumDashboard = () => {
  // Bar heights for the chart
  const bars = [35, 55, 45, 75, 60, 85, 100];
  
  return (
    <div className="w-full h-full min-h-[220px] bg-[#0A0F1C]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
      {/* Animated Glow Orbs inside the dashboard */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-40 h-40 bg-fuchsia-500/20 blur-[40px] rounded-full pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 blur-[40px] rounded-full pointer-events-none" 
      />

      {/* Top Bar Navigation/Action */}
      <div className="relative flex justify-between items-center pb-3 border-b border-white/10 z-10">
         <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 shadow-[0_0_5px_rgba(248,113,113,0.5)]"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-[0_0_5px_rgba(52,211,153,0.5)]"></div>
         </div>
         <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></div>
           <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_2px_#34d399]">Live</span>
         </div>
      </div>

      {/* Metrics Row */}
      <div className="relative grid grid-cols-2 gap-3 z-10">
         <motion.div 
           whileHover={{ y: -2 }}
           className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden group/card shadow-inner"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider font-medium">Conv. Rate</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-xl sm:text-2xl font-heading font-bold text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">8.4%</span>
              <span className="text-[10px] text-emerald-400 font-medium mb-1 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">+2.1%</span>
            </div>
         </motion.div>

         <motion.div 
           whileHover={{ y: -2 }}
           className="bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden group/card shadow-inner"
         >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-wider font-medium">Growth</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-xl sm:text-2xl font-heading font-bold text-white drop-shadow-[0_0_8px_rgba(217,70,239,0.4)]">3.2x</span>
              <span className="text-[10px] text-emerald-400 font-medium mb-1 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">+1.5x</span>
            </div>
         </motion.div>
      </div>

      {/* Chart Area */}
      <div className="relative flex-1 bg-white/[0.01] border border-white/5 rounded-xl p-3 sm:p-4 flex items-end justify-between gap-1.5 sm:gap-3 mt-1 z-10 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
         {/* Chart grid lines */}
         <div className="absolute inset-0 flex flex-col justify-between py-4 sm:py-5 pointer-events-none">
           {[1, 2, 3].map((_, i) => (
             <div key={i} className="w-full h-px bg-white/[0.02]" />
           ))}
         </div>
         
         {bars.map((height, i) => (
           <div key={i} className="w-full relative h-[120px] sm:h-full flex items-end justify-center group/bar">
             {/* Floating value tooltip on hover */}
             <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded shadow-xl pointer-events-none z-20"
             >
               {height}k
             </motion.div>
             
             {/* The Bar */}
             <motion.div 
               className="w-full lg:w-4/5 rounded-t-sm relative overflow-hidden"
               style={{
                 background: `linear-gradient(to top, rgba(59, 130, 246, 0.4), rgba(236, 72, 153, 0.9))`
               }}
               initial={{ height: 0 }}
               animate={{ height: `${height}%` }}
               transition={{ 
                 duration: 1.5, 
                 delay: i * 0.1, 
                 ease: "easeOut"
               }}
             >
               {/* Inner Shimmer Effect */}
               <motion.div 
                 animate={{ y: ['100%', '-100%'] }}
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-t from-transparent via-white/40 to-transparent"
               />
             </motion.div>
             
             {/* Bar base glowing line */}
             <div className="absolute bottom-0 w-full h-[2px] bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
           </div>
         ))}
      </div>
    </div>
  );
}

export default PremiumDashboard;