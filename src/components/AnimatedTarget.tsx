import { motion } from "framer-motion";

const AnimatedTarget = () => {
  return (
    <motion.div 
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className="relative w-12 h-12 md:w-16 md:h-16 pointer-events-none"
    >
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(20,91,255,0.5)] overflow-visible">
        <defs>
          <radialGradient id="glowWhite" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </radialGradient>
        </defs>

        {/* Animated Rings - Electric Blue / Cyan / White */}
        <motion.circle 
          cx="50" cy="50" r="34" 
          strokeWidth="4"
          fill="none"
          initial={{ stroke: "#145BFF" }}
          animate={{ stroke: ["#145BFF", "#00D4FF", "#FFFFFF", "#145BFF"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="drop-shadow-[0_0_6px_rgba(20,91,255,0.8)]"
        />

        <motion.circle 
          cx="50" cy="50" r="20" 
          strokeWidth="4"
          fill="none"
          initial={{ stroke: "#00D4FF" }}
          animate={{ stroke: ["#00D4FF", "#FFFFFF", "#145BFF", "#00D4FF"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
        />

        {/* Inner Bullseye - High Glow White/Cyan */}
        <motion.circle 
          cx="50" cy="50" r="6" 
          fill="url(#glowWhite)"
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.9, 1.3, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="drop-shadow-[0_0_8px_rgba(255,255,255,1)]"
        />
        
        {/* Animated Arrow - Parent Fly In */}
        <motion.g
          initial={{ x: 60, y: -60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 120, damping: 10 }}
        >
          {/* Child Arrow Motion: Thrusting "Entering and Exiting" */}
          <motion.g
            animate={{ x: [0, 8, 0], y: [0, -8, 0] }}
            transition={{ duration: 0.9, delay: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Arrow Shaft */}
            <line x1="85" y1="15" x2="54" y2="46" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" className="drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            
            {/* Arrow Head */}
            <polygon points="50,50 62,42 54,58" fill="#00D4FF" className="drop-shadow-[0_0_8px_rgba(0,212,255,1)]"/>
            <polygon points="50,50 58,45 53,53" fill="#FFFFFF" />

            {/* Arrow Feathers */}
            <line x1="85" y1="15" x2="90" y2="10" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(0,212,255,0.8)]" />
            <line x1="82" y1="18" x2="87" y2="13" stroke="#145BFF" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(20,91,255,0.8)]" />
            <line x1="88" y1="12" x2="93" y2="7" stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" className="drop-shadow-[0_0_4px_rgba(0,212,255,0.8)]" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default AnimatedTarget;
