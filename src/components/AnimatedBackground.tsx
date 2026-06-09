import { useMemo } from "react";

const AnimatedBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5, // 0.5px to 3px
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * -30, 
      opacity: Math.random() * 0.7 + 0.1, 
      isStar: Math.random() > 0.4 
    }));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes twinkle-global {
            0% { opacity: 0.1; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.1; transform: scale(0.8); }
          }
          @keyframes drift-global {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-150px) translateX(50px) scale(0.5); opacity: 0; }
          }
        `}
      </style>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Base Background - FJN Deep Black to Navy */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 20%, #0D1220 0%, #050507 60%, #050507 100%)'
        }}></div>
        
        {/* Ambient Glow Orbs - FJN Palette Only */}
        <div className="absolute inset-0">
          {/* Large Cobalt Orb - Top Left */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full animate-float-slow -top-20 -left-40 opacity-40"
            style={{
              background: 'radial-gradient(circle, rgba(11,63,191,0.5) 0%, rgba(11,63,191,0.15) 40%, transparent 70%)'
            }}
          ></div>
          
          {/* Electric Blue Orb - Center Right */}
          <div 
            className="absolute w-[400px] h-[400px] rounded-full animate-float-medium top-1/3 -right-20 opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(20,91,255,0.45) 0%, rgba(20,91,255,0.1) 45%, transparent 70%)'
            }}
          ></div>
          
          {/* Small Electric Blue - Bottom Left */}
          <div 
            className="absolute w-[300px] h-[300px] rounded-full animate-float-fast bottom-1/4 left-1/4 opacity-25"
            style={{
              background: 'radial-gradient(circle, rgba(20,91,255,0.4) 0%, rgba(11,63,191,0.15) 50%, transparent 70%)'
            }}
          ></div>

          {/* Subtle Cobalt Accent - Bottom Right */}
          <div 
            className="absolute w-[250px] h-[250px] rounded-full animate-float-slow bottom-10 right-1/4 opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(11,63,191,0.5) 0%, rgba(20,91,255,0.1) 50%, transparent 70%)',
              animationDelay: '3s'
            }}
          ></div>
        </div>

        {/* Deep Space Particles / Starfield Extracted to Global Level */}
        <div className="absolute inset-0 z-10">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
                boxShadow: p.isStar ? '0 0 4px 1px rgba(255,255,255,0.4)' : '0 0 12px 3px rgba(20,91,255,0.8)',
                animation: p.isStar 
                  ? `twinkle-global ${p.duration}s ease-in-out infinite alternate`
                  : `drift-global ${p.duration * 2}s linear infinite`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
        
        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03] z-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundSize: '128px 128px'
        }}></div>

        {/* Subtle top-to-bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050507]/40 z-30"></div>
      </div>
    </>
  );
};

export default AnimatedBackground;
