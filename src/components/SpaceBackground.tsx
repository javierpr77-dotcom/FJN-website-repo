import { useMemo } from 'react';

const SpaceBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2.5 + 0.5, // 0.5px to 3px (tiny stars to small dust)
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * -30, // Start at different times
      opacity: Math.random() * 0.7 + 0.1, // 0.1 to 0.8
      isStar: Math.random() > 0.4 // 60% twinkling stars, 40% drifting space dust
    }));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0% { opacity: 0.1; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
            100% { opacity: 0.1; transform: scale(0.8); }
          }
          @keyframes space-drift {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-150px) translateX(50px) scale(0.5); opacity: 0; }
          }
        `}
      </style>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050507]">
        {/* Core Global Gradient */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 150% 100% at 50% 0%, rgba(20,91,255,0.06) 0%, rgba(11,63,191,0.02) 40%, transparent 70%)',
        }}></div>

        {/* Electric Blue Beams (subtle global top light) */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[200%] h-[150%] blur-[100px] opacity-40 mix-blend-screen" 
          style={{
            background: 'conic-gradient(from 180deg at 50% 10%, transparent 0deg, rgba(20,91,255,0.03) 120deg, rgba(20,91,255,0.1) 160deg, rgba(20,91,255,0.2) 180deg, rgba(20,91,255,0.1) 200deg, rgba(20,91,255,0.03) 240deg, transparent 360deg)',
          }}
        />

        {/* Deep Space Particles / Starfield */}
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
              boxShadow: p.isStar ? '0 0 8px 2px rgba(255,255,255,0.5)' : '0 0 16px 4px rgba(20,91,255,0.6)',
              animation: p.isStar 
                ? `twinkle ${p.duration}s ease-in-out infinite alternate`
                : `space-drift ${p.duration * 2}s linear infinite`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
      </div>
    </>
  );
};

export default SpaceBackground;
