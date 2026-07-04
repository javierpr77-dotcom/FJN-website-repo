import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Lock, Unlock, Key, Cpu, TrendingUp, Activity, MapPin, 
  Smartphone, Laptop, MousePointer, Users, RefreshCw, Clock, 
  Compass, Eye, Target, DollarSign, Megaphone, Sparkles, 
  ArrowUpRight, BarChart2, Bell, Play, CheckCircle2, AlertTriangle, Phone
} from "lucide-react";
import { useAnalytics, VisitorSession } from "@/contexts/AnalyticsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from "recharts";

// Password required
const ADMIN_PASSWORD = "fjnEstilo82";

// Premium Towns marketing advisory data
const CAMPAIGN_ADVISORY = [
  {
    town: "Dorado",
    subsector: "Sabanera Dorado & Ritz Carlton Reserve",
    profile: "Expat Entrepreneurs (Act 20/22/60), Tech Founders, Luxury Hospitality, Private Doctors",
    bestServices: "Custom E-Commerce & Full Branding Retainers ($5k+)",
    metaInterests: ["Luxury real estate", "Yacht Charter", "Venture capital", "Sabanera Dorado", "E-commerce development"],
    recommendedBudget: "$35 - $60 / día",
    pitchEs: "Páginas web ultra-premium que proyectan el prestigio exclusivo de tu negocio. Hosting dedicado blindado y diseño SEO local.",
    pitchEn: "Ultra-premium bespoke digital experiences matching your business's exclusivity. Managed dedicated hosting and custom SEO.",
    potentialRate: "Muy Alto (💎💎💎💎💎)"
  },
  {
    town: "Guaynabo",
    subsector: "San Patricio, Caparra, Torrimar",
    profile: "Premium Law Firms, Real Estate Brokerages, Medical Specialists, Wealth Management, Boutique Clinics",
    bestServices: "High-End Corporate Landings & Appointment Funnels ($3k+)",
    metaInterests: ["Medical practice management", "Law practice", "Commercial Real Estate", "Guaynabo Puerto Rico"],
    recommendedBudget: "$25 - $40 / día",
    pitchEs: "Sistemas automáticos de reservas y landings corporativas para firmas profesionales. Convierte visitas frías en clientes de alto valor.",
    pitchEn: "High-converting corporate landers and appointment scheduling pipelines. Seamlessly turn web traffic into high-value clients.",
    potentialRate: "Alto (💎💎💎💎)"
  },
  {
    town: "San Juan",
    subsector: "Condado, Miramar, Ocean Park, Hato Rey",
    profile: "Fine Dining, Creative Agencies, High-Ticket Retail, Crypto Founders, Tourism Operators",
    bestServices: "Custom Portfolios & Interactive Booking Webapps ($4k+)",
    metaInterests: ["Fine dining", "Boutique hotel", "Art galleries", "Hato Rey financial district"],
    recommendedBudget: "$30 - $50 / día",
    pitchEs: "Diseño web cinematográfico interactivo que posiciona a tu negocio gastronómico o boutique por encima de la competencia.",
    pitchEn: "Cinematic interactive design that positions your boutique brand or fine dining concept at the absolute top of the market.",
    potentialRate: "Muy Alto (💎💎💎💎💎)"
  },
  {
    town: "Humacao",
    subsector: "Palmas del Mar Resort & Marina",
    profile: "Yacht Charters, Golf Cart Rentals, Luxury Vacation Rentals, Waterfront Dining, Real Estate Agents",
    bestServices: "Real-time Booking Engines & Premium E-Commerce ($4k+)",
    metaInterests: ["Palmas del Mar", "Yachting", "Golf courses", "Vacation home rental"],
    recommendedBudget: "$20 - $35 / día",
    pitchEs: "Plataformas de e-commerce personalizadas para reservas en Palmas del Mar. Controla tu inventario y cobra depósitos al instante.",
    pitchEn: "Bespoke booking engines and e-commerce portals for Palmas del Mar services. Control your inventory and capture deposits securely.",
    potentialRate: "Alto (💎💎💎💎)"
  },
  {
    town: "Rincón",
    subsector: "Puntas, Domes, Boutique Resorts",
    profile: "Boutique Surf Hotels, Wellness Retreats, Expat Restaurants, Wedding Planners",
    bestServices: "Full English/Spanish Multi-language Landing Pages ($2.5k+)",
    metaInterests: ["Surfing", "Yoga retreat", "Boutique hotel", "Wedding planning", "Rincón Puerto Rico"],
    recommendedBudget: "$15 - $25 / día",
    pitchEs: "Páginas web bilingües optimizadas para SEO internacional. Atrae turistas norteamericanos y locales en piloto automático.",
    pitchEn: "Dual-language landing pages optimized for global Google search. Attract premium international travelers and locals alike.",
    potentialRate: "Medio-Alto (💎💎💎)"
  },
  {
    town: "Ponce & Carolina",
    subsector: "Isla Verde (Carolina), Ponce Centro (Medical/Industrial)",
    profile: "Boutique Beachfront Hotels (Isla Verde), Major Manufacturing & Clinics (Ponce)",
    bestServices: "SEO Local Dominance & Multi-Page Portals ($3k+)",
    metaInterests: ["Isla Verde Carolina", "Medical tourism", "Ponce Puerto Rico", "Manufacturing engineering"],
    recommendedBudget: "$20 - $35 / día",
    pitchEs: "Dominio absoluto de Google Search en tu pueblo. Haz que te encuentren primero cuando busquen servicios premium.",
    pitchEn: "Absolute Local Google SEO dominance in your municipality. Be the undisputed first option when high-paying leads search.",
    potentialRate: "Alto (💎💎💎💎)"
  }
];

const Admin = () => {
  const { currentSession, sessions, resetAllAnalytics } = useAnalytics();
  const { language } = useLanguage();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [activeTab, setActiveTab] = useState<'overview' | 'towns' | 'live' | 'marketing'>('overview');

  // Load auth state
  useEffect(() => {
    const isAuthedSession = sessionStorage.getItem("fjn_admin_authed");
    const isAuthedLocal = localStorage.getItem("fjn_admin_authed");
    if (isAuthedSession === "true" || isAuthedLocal === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem("fjn_admin_authed", "true");
      localStorage.setItem("fjn_admin_authed", "true");
      localStorage.setItem("fjn_is_admin_device", "true");
      triggerToast("Acceso Concedido. Consola Cuántica FJN en línea.");
    } else {
      setAuthError(true);
      setPassword("");
      // Vibrating or sound simulation
      setTimeout(() => setAuthError(false), 800);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("fjn_admin_authed");
    localStorage.removeItem("fjn_admin_authed");
  };

  const triggerToast = (msg: string) => {
    setNotificationMsg(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleReset = () => {
    if (window.confirm(language === 'es' ? '¿Estás seguro de que deseas borrar todos los datos de analíticas recopilados?' : 'Are you sure you want to clear all collected visitor analytical data?')) {
      resetAllAnalytics();
      triggerToast("Datos de analítica reiniciados correctamente.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020204] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 font-sans selection:bg-[#145BFF]/30">
        {/* Futuristic Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#145bff08_1px,transparent_1px),linear-gradient(to_bottom,#145bff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
        
        {/* Animated Background Laser lines */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#145BFF]/80 to-transparent blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent blur-sm" />
        
        <div className="absolute w-[500px] h-[500px] bg-[#145BFF]/5 rounded-full blur-[120px] top-1/4 left-1/4 pointer-events-none" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] bottom-1/4 right-1/4 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative"
        >
          {/* Outer glowing border container */}
          <div className={`p-8 rounded-2xl bg-black/60 backdrop-blur-xl border ${authError ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.25)]' : 'border-white/10 shadow-[0_0_40px_rgba(20,91,255,0.15)]'} transition-all duration-300 relative overflow-hidden`}>
            
            {/* Cyberpunk scanning line */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-[#145BFF]/40 animate-[shimmer_3s_infinite_linear]" 
                 style={{ 
                   animation: 'scanLine 4s infinite linear',
                   background: 'linear-gradient(to right, transparent, rgba(20,91,255,0.8), transparent)' 
                 }} 
            />

            <style>{`
              @keyframes scanLine {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
              }
            `}</style>

            {/* Header Lock Icon */}
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-4 relative group">
                <div className="absolute inset-0 rounded-full bg-[#145BFF]/10 blur-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <AnimatePresence mode="wait">
                  {authError ? (
                    <motion.div
                      key="lock-err"
                      initial={{ scale: 0.8, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0.8 }}
                      className="text-red-500"
                    >
                      <AlertTriangle className="w-8 h-8 animate-pulse" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lock-normal"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="text-[#00D4FF]"
                    >
                      <Lock className="w-7 h-7 drop-shadow-[0_0_8px_#00d4ff]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                FJN Security Gateway
              </h2>
              <p className="font-body text-xs text-white/50 mt-1 uppercase tracking-widest font-mono">
                {language === 'es' ? 'Acceso Privado Exclusivo' : 'Exclusive Private Access'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="font-body text-[10px] text-white/40 uppercase tracking-widest font-mono ml-1 block">
                  {language === 'es' ? 'Clave de Desencriptación' : 'Decryption Security Key'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/30">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 font-mono text-sm focus:outline-none focus:border-[#145BFF] focus:shadow-[0_0_20px_rgba(20,91,255,0.4)] focus:ring-0 transition-all duration-300"
                  />
                </div>
              </div>

              {authError && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 font-mono text-center"
                >
                  {language === 'es' ? 'ACCESO DENEGADO: CLAVE INCORRECTA' : 'ACCESS DENIED: INVALID KEY'}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#145BFF] to-purple-600 hover:from-[#3b7bff] hover:to-purple-500 text-white font-heading font-medium py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(20,91,255,0.4)] hover:shadow-[0_0_30px_rgba(20,91,255,0.7)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Unlock className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                <span>{language === 'es' ? 'Ingresar a Analíticas' : 'Enter Analytics Panel'}</span>
              </button>
            </form>
          </div>

          {/* Footer Back Link */}
          <div className="mt-8 text-center relative z-10">
            <Link 
              to="/" 
              className="text-white/40 hover:text-white transition-colors duration-300 text-xs font-mono tracking-wider flex items-center justify-center gap-1.5"
            >
              ← {language === 'es' ? 'Volver al Sitio Principal' : 'Back to Main Website'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- COMPILING ANALYTICS CALCULATIONS ---
  const totalVisits = sessions.length;
  
  // Calculate active live users (visited in the last 1.5 minutes)
  const oneMinuteAgo = Date.now() - (90 * 1000);
  const activeSessions = sessions.filter(s => s.startTime > oneMinuteAgo || s.isActive);
  const liveUsers = activeSessions.length;

  // Order sessions oldest first to get deterministic numbering
  const sortedSessionsOldestFirst = [...sessions].sort((a, b) => a.startTime - b.startTime);

  const getSessionUserNumber = (sessionId: string) => {
    const idx = sortedSessionsOldestFirst.findIndex(s => s.id === sessionId);
    return idx !== -1 ? idx + 1 : 1;
  };

  // Bounce Rate calculation: 0 clicks and duration < 12 seconds
  const bouncedSessionsCount = sessions.filter(s => (s.clicks?.length || 0) === 0 && s.durationSeconds < 12).length;
  const siteBounceRate = sessions.length > 0 
    ? Math.round((bouncedSessionsCount / sessions.length) * 100) 
    : 0;

  // Town breakdowns
  const townCounts: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.city) {
      townCounts[s.city] = (townCounts[s.city] || 0) + 1;
    }
  });

  const townData = Object.entries(townCounts).map(([city, count]) => ({
    name: city,
    count,
    percentage: parseFloat(((count / (totalVisits || 1)) * 100).toFixed(1))
  })).sort((a, b) => b.count - a.count);

  // Device type counts
  let desktopCount = 0;
  let tabletCount = 0;
  let mobileCount = 0;
  sessions.forEach(s => {
    if (s.deviceType === 'Desktop') desktopCount++;
    else if (s.deviceType === 'Tablet') tabletCount++;
    else if (s.deviceType === 'Mobile') mobileCount++;
  });

  const deviceData = [
    { name: 'Desktop', value: desktopCount, color: '#145BFF' },
    { name: 'Tablet', value: tabletCount, color: '#F59E0B' },
    { name: 'Mobile', value: mobileCount, color: '#A855F7' }
  ].filter(d => d.value > 0);

  // OS breakdown (especially iPhone vs Android)
  let iosCount = 0;
  let androidCount = 0;
  let desktopOSCount = 0;
  sessions.forEach(s => {
    if (s.os === 'iOS') iosCount++;
    else if (s.os === 'Android') androidCount++;
    else desktopOSCount++;
  });

  const mobileBrandData = [
    { name: 'iPhone (iOS)', value: iosCount, color: '#00D4FF' },
    { name: 'Android', value: androidCount, color: '#34D399' }
  ];

  // Areas Emphasized (Accumulated seconds per section)
  const sectionVisits: Record<string, number> = {
    hero: 0,
    portfolio: 0,
    services: 0,
    pricing: 0,
    faq: 0,
    contact: 0
  };

  sessions.forEach(s => {
    if (s.emphasizedAreas) {
      Object.entries(s.emphasizedAreas).forEach(([sec, val]) => {
        sectionVisits[sec] = (sectionVisits[sec] || 0) + val;
      });
    }
  });

  const sectionData = Object.entries(sectionVisits).map(([sec, seconds]) => {
    let displayName = sec.toUpperCase();
    if (sec === 'hero') displayName = language === 'es' ? 'Inicio (Hero)' : 'Hero';
    else if (sec === 'portfolio') displayName = language === 'es' ? 'Portafolio' : 'Portfolio';
    else if (sec === 'services') displayName = language === 'es' ? 'Servicios' : 'Services';
    else if (sec === 'pricing') displayName = language === 'es' ? 'Planes' : 'Pricing';
    else if (sec === 'faq') displayName = 'FAQ';
    else if (sec === 'contact') displayName = language === 'es' ? 'Contacto / Agendar' : 'Contact / Booking';

    return {
      name: displayName,
      seconds,
      minutes: parseFloat((seconds / 60).toFixed(1))
    };
  });

  // General click categories for the Conversion Chart
  const clickTallies: Record<string, number> = {
    "Agendar Cita / Booking": 0,
    "Enviar Solicitud / Send Request": 0,
    "Ver Portafolio / Portfolio View": 0,
    "Other Actions": 0
  };

  // Detailed click breakdown by actual exact button name/label clicked
  const exactButtonClickCounts: Record<string, number> = {};

  sessions.forEach(s => {
    s.clicks?.forEach(c => {
      const txt = c.buttonText;
      if (!txt) return;

      const lowerTxt = txt.toLowerCase();
      // Filter out any clicks on admin dashboard controls or navigation links
      const isAdminButton = [
        'limpiar todo', 'wipe data', 'cerrar sesión', 'logout', 'vista general', 'overview',
        'pueblos de pr', 'pr municipalities', 'consola en vivo', 'live interaction feed',
        'campaña premium', 'premium campaign', 'adviser', 'advisor', 'gatekeeper', 'security gateway', 'ingresar a analíticas', 'enter analytics panel', 'admin'
      ].some(keyword => lowerTxt.includes(keyword));

      if (isAdminButton) {
        return;
      }

      exactButtonClickCounts[txt] = (exactButtonClickCounts[txt] || 0) + 1;
      
      if (lowerTxt.includes('agendar') || lowerTxt.includes('cita') || lowerTxt.includes('book') || lowerTxt.includes('calendario')) {
        clickTallies["Agendar Cita / Booking"]++;
      } else if (lowerTxt.includes('enviar') || lowerTxt.includes('solicitud') || lowerTxt.includes('submit') || lowerTxt.includes('enviar solicitud')) {
        clickTallies["Enviar Solicitud / Send Request"]++;
      } else if (lowerTxt.includes('portafolio') || lowerTxt.includes('portfolio') || lowerTxt.includes('ver portfolio') || lowerTxt.includes('proyectos')) {
        clickTallies["Ver Portafolio / Portfolio View"]++;
      } else {
        clickTallies["Other Actions"]++;
      }
    });
  });

  const clickChartData = Object.entries(clickTallies).map(([name, count]) => ({ name, count }));

  const detailedButtonClickList = Object.entries(exactButtonClickCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Extract recent actions list with user identification numbers
  const recentActions: { session: VisitorSession; userNumber: number; text: string; time: number }[] = [];
  sessions.slice(0, 15).forEach(s => {
    const userNumber = getSessionUserNumber(s.id);
    s.clicks?.forEach(c => {
      const lowerTxt = c.buttonText?.toLowerCase() || '';
      const isAdminButton = [
        'limpiar todo', 'wipe data', 'cerrar sesión', 'logout', 'vista general', 'overview',
        'pueblos de pr', 'pr municipalities', 'consola en vivo', 'live interaction feed',
        'campaña premium', 'premium campaign', 'adviser', 'advisor', 'gatekeeper', 'security gateway', 'ingresar a analíticas', 'enter analytics panel', 'admin'
      ].some(keyword => lowerTxt.includes(keyword));

      if (!isAdminButton) {
        recentActions.push({
          session: s,
          userNumber,
          text: language === 'es' ? `Clickeó el botón "${c.buttonText}"` : `Clicked button "${c.buttonText}"`,
          time: c.timestamp
        });
      }
    });
    recentActions.push({
      session: s,
      userNumber,
      text: language === 'es' 
        ? `Ingresó al sitio y enfocó la sección "${Object.keys(s.emphasizedAreas).find(key => s.emphasizedAreas[key] === Math.max(...Object.values(s.emphasizedAreas))) || 'hero'}"` 
        : `Entered site and focused on section "${Object.keys(s.emphasizedAreas).find(key => s.emphasizedAreas[key] === Math.max(...Object.values(s.emphasizedAreas))) || 'hero'}"`,
      time: s.startTime
    });
  });
  recentActions.sort((a, b) => b.time - a.time);

  return (
    <div className="min-h-screen bg-[#030307] text-white font-sans selection:bg-[#145BFF]/30 pb-20 overflow-x-hidden">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl border border-cyan-500/30 text-white text-xs sm:text-sm font-mono px-6 py-3.5 rounded-full shadow-[0_0_30px_rgba(0,212,255,0.3)] flex items-center gap-2.5 max-w-[90vw]"
          >
            <Activity className="w-4 h-4 text-[#00D4FF] animate-pulse" />
            <span>{notificationMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cybernetic Grid & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#145bff04_1px,transparent_1px),linear-gradient(to_bottom,#145bff04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_60%,transparent_100%)] pointer-events-none h-full w-full" />
      <div className="absolute top-[-100px] left-[-200px] w-[600px] h-[600px] bg-[#145BFF]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[300px] right-[-200px] w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Dashboard Top Navigation */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md relative z-30">
        <div className="container mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-1.5 bg-[#145BFF]/10 border border-[#145BFF]/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(20,91,255,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#00D4FF] uppercase tracking-widest font-mono">
                {language === 'es' ? 'CONSOLA PREMIUM ACTIVA' : 'PREMIUM CONSOLE ACTIVE'}
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            <button 
              onClick={handleReset}
              className="bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-white text-xs font-mono px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] group cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-400 group-hover:rotate-180 transition-transform duration-700" />
              {language === 'es' ? 'Limpiar Todo' : 'Wipe Data'}
            </button>

            <button 
              onClick={handleLogout}
              className="bg-[#145BFF] hover:bg-[#3b7bff] text-white text-xs font-heading font-medium px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(20,91,255,0.3)] transition-all duration-300 cursor-pointer"
            >
              {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 pt-10 relative z-20">
        
        {/* Dashboard Introduction Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              FJN Analytics Control Center
              <Sparkles className="w-6 h-6 text-[#00D4FF] animate-pulse" />
            </h1>
            <p className="font-body text-white/50 text-sm mt-2">
              {language === 'es' 
                ? 'Monitoreo en tiempo real de visitas, dispositivos y geolocalización local en Puerto Rico para conversiones de alta gama.' 
                : 'Real-time tracking of visitor traffic, devices, and local Puerto Rican geolocations for high-end digital agency assets.'}
            </p>
          </div>
          
          {/* Live Visitor Indicator */}
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
            <div className="relative w-12 h-12 flex items-center justify-center bg-cyan-500/5 border border-cyan-500/10 rounded-full">
              <span className="absolute inset-0 bg-cyan-400/10 rounded-full animate-ping" />
              <Activity className="w-5 h-5 text-[#00D4FF] animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-white/40">
                {language === 'es' ? 'Visitantes Activos (Live)' : 'Live Active Visitors'}
              </p>
              <p className="text-2xl font-bold text-white font-mono drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]">
                {liveUsers} <span className="text-xs text-green-400 font-light font-sans ml-1">online</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Primary Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-1.5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Users className="w-12 h-12 text-[#145BFF]" />
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{language === 'es' ? 'Tráfico Total' : 'Total Traffic'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">{totalVisits}</span>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 self-start px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Activity className="w-3 h-3 text-[#00D4FF]" />
              {language === 'es' ? `Rebote: ${siteBounceRate}%` : `Bounce: ${siteBounceRate}%`}
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-1.5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <MousePointer className="w-12 h-12 text-purple-500" />
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{language === 'es' ? 'Clics en Botones' : 'Button Clicks'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {sessions.reduce((acc, s) => {
                const nonAdminClicks = s.clicks?.filter(c => {
                  const lowerTxt = c.buttonText?.toLowerCase() || '';
                  return ![
                    'limpiar todo', 'wipe data', 'cerrar sesión', 'logout', 'vista general', 'overview',
                    'pueblos de pr', 'pr municipalities', 'consola en vivo', 'live interaction feed',
                    'campaña premium', 'premium campaign', 'adviser', 'advisor', 'gatekeeper', 'security gateway', 'ingresar a analíticas', 'enter analytics panel', 'admin'
                  ].some(keyword => lowerTxt.includes(keyword));
                }) || [];
                return acc + nonAdminClicks.length;
              }, 0)}
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 self-start px-1.5 py-0.5 rounded">
              Interacción activa
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-1.5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <MapPin className="w-12 h-12 text-amber-500" />
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{language === 'es' ? 'Pueblos de P.R.' : 'P.R. Towns'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {townData.filter(t => t.name !== 'Detectando...').length}
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 self-start px-1.5 py-0.5 rounded">
              Tráfico geolocalizado
            </span>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-1.5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Clock className="w-12 h-12 text-green-500" />
            </div>
            <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">{language === 'es' ? 'Tiempos Promedio' : 'Average Session'}</span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {Math.floor(sessions.reduce((acc, s) => acc + s.durationSeconds, 0) / (totalVisits || 1))}s
            </span>
            <span className="text-[10px] text-green-400 bg-green-500/10 self-start px-1.5 py-0.5 rounded">
              Estadía del cliente
            </span>
          </motion.div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-white/5 mb-8 gap-4 overflow-x-auto pb-px">
          {[
            { id: 'overview', label: language === 'es' ? 'Vista General' : 'Overview', icon: BarChart2 },
            { id: 'towns', label: language === 'es' ? 'Pueblos de PR' : 'PR Municipalities', icon: MapPin },
            { id: 'live', label: language === 'es' ? 'Consola en Vivo' : 'Live Interaction Feed', icon: Activity },
            { id: 'marketing', label: language === 'es' ? 'Campaña Premium (Target)' : 'Premium Campaign Target Advisor', icon: Megaphone }
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 font-heading text-sm font-medium border-b-2 transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected 
                    ? 'border-[#145BFF] text-white drop-shadow-[0_0_12px_rgba(20,91,255,0.4)]' 
                    : 'border-transparent text-white/50 hover:text-white/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-[#00D4FF]' : 'text-white/40'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- TABS RENDERING --- */}
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* High-End Bento Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recharts Conversion Clicks */}
                <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
                      {language === 'es' ? 'Conversión de Objetivos (Clics en Botones)' : 'Goal Conversion Breakdown'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' ? 'Haga clic en los botones clave como Enviar Solicitud y Agendar Cita.' : 'Click events intercepted from key landing pages.'}
                    </p>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clickChartData}>
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#090a0f', borderColor: '#ffffff10', borderRadius: '12px' }}
                          labelStyle={{ color: '#ffffff50', fontFamily: 'monospace' }}
                        />
                        <Bar dataKey="count" fill="url(#bluePurpleGradient)" radius={[8, 8, 0, 0]}>
                          {clickChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#00D4FF' : index === 1 ? '#A855F7' : '#145BFF'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device breakdown & High-End OS Smartphone */}
                <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-purple-400" />
                      {language === 'es' ? 'Dispositivos y Teléfonos Celulares' : 'Devices & Smartphones'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' ? 'Detalle de hardware y marcas móviles (iOS vs Android).' : 'Detailed breakdown of customer entry devices.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 items-center flex-1">
                    {/* Device Pie Chart */}
                    <div className="h-[180px] relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={deviceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {deviceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#090a0f', borderColor: '#ffffff10' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[10px] text-white/40 font-mono uppercase">{language === 'es' ? 'Móvil' : 'Mobile'}</span>
                        <span className="text-lg font-bold font-mono">
                          {parseFloat(((mobileCount / (totalVisits || 1)) * 100).toFixed(0))}%
                        </span>
                      </div>
                    </div>

                    {/* Smartphone Platform Data */}
                    <div className="space-y-4">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-white/30 border-b border-white/5 pb-1">
                        {language === 'es' ? 'Móviles por Plataforma' : 'Mobile Operating System'}
                      </p>
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
                            <span>iPhone (iOS)</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">{iosCount}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#00D4FF] h-full" style={{ width: `${(iosCount / ((iosCount + androidCount) || 1)) * 100}%` }} />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shadow-[0_0_8px_#34d399]" />
                            <span>Android</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">{androidCount}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#34D399] h-full" style={{ width: `${(androidCount / ((iosCount + androidCount) || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Device Legend bottom */}
                  <div className="flex justify-between items-center text-[10px] font-mono text-white/40 pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-[#145BFF]" /> {language === 'es' ? 'Escritorio' : 'Desktop'}: {desktopCount}</span>
                    <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-[#A855F7]" /> {language === 'es' ? 'Móvil' : 'Mobile'}: {mobileCount}</span>
                    <span className="flex items-center gap-1.5"><Laptop className="w-3.5 h-3.5 text-[#F59E0B]" /> Tablet: {tabletCount}</span>
                  </div>
                </div>
              </div>

              {/* Section Heatmap heatmap tracking */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Areas Emphasized */}
                <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-amber-400" />
                      {language === 'es' ? 'Secciones Más Enfatizadas (Retención en Segundos)' : 'Most Emphasized Landing Page Sections'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' ? 'Tiempo total acumulado que los visitantes pasaron mirando cada sección.' : 'Accumulated viewport focus time measured in minutes.'}
                    </p>
                  </div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectionData}>
                        <defs>
                          <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} />
                        <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#090a0f', borderColor: '#ffffff10' }} />
                        <Area type="monotone" dataKey="minutes" stroke="#F59E0B" fillOpacity={1} fill="url(#areaGlow)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Conversion Rates & Analytics summary list */}
                <div className="lg:col-span-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-5 justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-400" />
                      {language === 'es' ? 'Tasa de Conversión' : 'Campaign Conversion Rate'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' ? 'Porcentaje de visitas que completan metas.' : 'High-Ticket action completion ratios.'}
                    </p>
                  </div>

                  <div className="flex-grow flex flex-col justify-center gap-6">
                    {/* Circle conversion rating */}
                    <div className="flex items-center justify-around">
                      <div className="text-center">
                        <p className="text-4xl font-mono font-bold text-green-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]">
                          {parseFloat((((clickTallies["Agendar Cita / Booking"] + clickTallies["Enviar Solicitud / Send Request"]) / (totalVisits || 1)) * 100).toFixed(1))}%
                        </p>
                        <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-2">
                          {language === 'es' ? 'Conversión Total' : 'Total Goals met'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-mono font-bold text-cyan-400 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]">
                          {parseFloat(((clickTallies["Agendar Cita / Booking"] / (totalVisits || 1)) * 100).toFixed(1))}%
                        </p>
                        <p className="text-[10px] text-white/40 uppercase font-mono tracking-widest mt-2">
                          {language === 'es' ? 'Tasa de Citas' : 'Booking rate'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">{language === 'es' ? 'Citas Agendadas' : 'Booked Appointments'}</span>
                        <span className="font-mono text-green-400 font-bold">+{clickTallies["Agendar Cita / Booking"]}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">{language === 'es' ? 'Formularios Enviados' : 'Form Inquiries'}</span>
                        <span className="font-mono text-purple-400 font-bold">+{clickTallies["Enviar Solicitud / Send Request"]}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">{language === 'es' ? 'Interés en Portafolio' : 'Portfolio Engagements'}</span>
                        <span className="font-mono text-[#00D4FF] font-bold">+{clickTallies["Ver Portafolio / Portfolio View"]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#10b981]/5 border border-[#10b981]/15 rounded-xl p-3 flex gap-2 items-start mt-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                      {language === 'es' 
                        ? "Tu nicho de mercado en San Juan y Dorado prefiere mayormente reservar citas directas en iPhones."
                        : "Your high-ticket demographic in Dorado prefers booking direct consultation calendar spots via iOS."}
                    </p>
                  </div>
                </div>

              </div>

              {/* BUTTON CLICKS DETAILED ANALYSIS & LIVE ACTIVE USERS PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
                
                {/* 1. Button Click Names Section */}
                <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <MousePointer className="w-5 h-5 text-purple-400" />
                      {language === 'es' ? 'Análisis de Clics por Nombre de Botón' : 'Button Click Engagement Analysis'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' 
                        ? 'Identifica exactamente qué botones con nombre reciben la mayor interacción.' 
                        : 'Tracks exact button labels clicked by real visitors.'}
                    </p>
                  </div>

                  <div className="flex-1 space-y-4 max-h-[320px] overflow-y-auto pr-1">
                    {detailedButtonClickList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <MousePointer className="w-8 h-8 text-white/10 mb-2" />
                        <p className="text-xs text-white/40">{language === 'es' ? 'Aún no se han registrado clics en botones.' : 'No button clicks registered yet.'}</p>
                      </div>
                    ) : (
                      detailedButtonClickList.map((btn, idx) => {
                        const maxCount = Math.max(...detailedButtonClickList.map(b => b.count)) || 1;
                        const percent = Math.round((btn.count / maxCount) * 100);
                        return (
                          <div key={idx} className="bg-white/[0.01] border border-white/5 p-3 rounded-xl flex flex-col gap-1.5 hover:border-white/15 transition-all">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-medium text-white/90 font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {btn.name}
                              </span>
                              <span className="font-mono text-[#00D4FF] font-bold">
                                {btn.count} {btn.count === 1 ? (language === 'es' ? 'clic' : 'click') : (language === 'es' ? 'clics' : 'clicks')}
                              </span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mt-1">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-[#00D4FF] h-full transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 2. Live Active Users Identifiers Section */}
                <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-emerald-400 animate-pulse" />
                        {language === 'es' ? 'Identificación de Visitantes Activos (Live)' : 'Live Active Visitor Identification'}
                      </h3>
                      <p className="text-xs text-white/40 mt-1">
                        {language === 'es' 
                          ? 'Identificación secuencial por ID de cada usuario activo real, su pueblo, dispositivo y tasa de rebote.' 
                          : 'Deterministic user sequential mapping tracking town, exact mobile hardware, and real-time bounce.'}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">
                      Live
                    </span>
                  </div>

                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 font-mono uppercase text-[10px] tracking-wider">
                          <th className="pb-3 pl-1 font-normal">{language === 'es' ? 'Identificador' : 'Identifier'}</th>
                          <th className="pb-3 font-normal">{language === 'es' ? 'Pueblo' : 'Town'}</th>
                          <th className="pb-3 font-normal">{language === 'es' ? 'Dispositivo / OS' : 'Device / OS'}</th>
                          <th className="pb-3 font-normal">{language === 'es' ? 'Tiempo Activo' : 'Active Time'}</th>
                          <th className="pb-3 text-right pr-1 font-normal">{language === 'es' ? 'Estado de Rebote' : 'Bounce Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeSessions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-white/30 font-mono text-[11px]">
                              {language === 'es' ? 'No hay visitantes activos en este momento.' : 'No active visitors online right now.'}
                            </td>
                          </tr>
                        ) : (
                          activeSessions.map((session, idx) => {
                            const userNum = getSessionUserNumber(session.id);
                            
                            // Bounce Status Calculation
                            const clickCount = session.clicks?.length || 0;
                            const isBounced = clickCount === 0 && session.durationSeconds < 12;
                            const isReading = clickCount === 0 && session.durationSeconds >= 12;
                            const isConverted = clickCount > 0;

                            // Platform Detail
                            let deviceDetail = "";
                            if (session.deviceType === 'Desktop') {
                              deviceDetail = `${language === 'es' ? 'Escritorio' : 'Desktop'} (${session.os || 'OS'})`;
                            } else if (session.deviceType === 'Tablet') {
                              deviceDetail = `Tablet (${session.os || 'OS'})`;
                            } else {
                              // Mobile
                              if (session.os === 'iOS') {
                                deviceDetail = "Celular (iPhone / iOS)";
                              } else if (session.os === 'Android') {
                                deviceDetail = "Celular (Android)";
                              } else {
                                deviceDetail = `Celular (${session.os || 'Móvil'})`;
                              }
                            }

                            return (
                              <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-3.5 pl-1 font-mono font-bold text-white flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] shrink-0" />
                                  {language === 'es' ? 'Usuario' : 'User'} {userNum}
                                </td>
                                <td className="py-3.5 text-white/80 font-medium">
                                  📍 {session.city || (language === 'es' ? 'Detectando...' : 'Tracking...')}
                                </td>
                                <td className="py-3.5 text-white/70 font-mono text-[11px]">
                                  {deviceDetail}
                                </td>
                                <td className="py-3.5 font-mono text-[#00D4FF] font-medium">
                                  ⏱️ {session.durationSeconds}s
                                </td>
                                <td className="py-3.5 text-right pr-1">
                                  {isConverted && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded font-mono font-semibold">
                                      💎 {language === 'es' ? 'Conversión (0% Rebote)' : 'Converted (0% Bounce)'}
                                    </span>
                                  )}
                                  {isReading && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono font-semibold">
                                      ⚡ {language === 'es' ? 'Atento (50% Rebote)' : 'Engaged (50% Bounce)'}
                                    </span>
                                  )}
                                  {isBounced && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded font-mono font-semibold animate-pulse">
                                      🛑 {language === 'es' ? 'Rebote (100%)' : 'Bounce (100%)'}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* MUNICIPALITIES TAB */}
          {activeTab === 'towns' && (
            <motion.div
              key="towns-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Puerto Rico Towns Data Table */}
                <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-400 animate-bounce" />
                        {language === 'es' ? 'Pueblos de Origen Detectados (Automático)' : 'Visitor Municipalities'}
                      </h3>
                      <p className="text-xs text-white/40 mt-1">
                        {language === 'es' ? 'Origen de las visitas detectado por IP Geolocation API.' : 'Exact municipality tracked when user enters the platform.'}
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white">
                      P.R. Geo IP
                    </span>
                  </div>

                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {townData.length === 0 ? (
                      <p className="text-center text-white/40 font-mono py-8 text-xs">
                        Esperando tráfico de visitantes...
                      </p>
                    ) : (
                      townData.map((town, idx) => {
                        const isPremium = ["Dorado", "Guaynabo", "San Juan", "Humacao", "Rincón"].includes(town.name);
                        
                        // Extract associated users for this town
                        const townSessions = sessions.filter(s => s.city === town.name);
                        const userLabels = townSessions.slice(0, 6).map(ts => {
                          const uNum = getSessionUserNumber(ts.id);
                          const osLabel = ts.os === 'iOS' ? 'iPhone' : ts.os === 'Android' ? 'Android' : ts.os || 'PC';
                          return `${language === 'es' ? 'Usuario' : 'User'} ${uNum} (${osLabel})`;
                        });

                        return (
                          <div key={town.name} className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 transition-colors duration-300">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 font-bold text-white">
                                <span className="font-mono text-xs text-white/30">#0{idx+1}</span>
                                <span>{town.name}</span>
                                {isPremium && (
                                  <span className="text-[9px] bg-[#145BFF]/10 text-[#00D4FF] border border-[#145BFF]/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider scale-95">
                                    💎 Premium Target
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 font-mono text-xs">
                                <span className="text-white/40">({town.count} {town.count === 1 ? (language === 'es' ? 'visita' : 'visit') : (language === 'es' ? 'visitas' : 'visits')})</span>
                                <span className="text-[#00D4FF] font-bold">{town.percentage}%</span>
                              </div>
                            </div>
                            
                            {/* Graphic progress indicator bar */}
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
                              <div 
                                className={`h-full rounded-full ${isPremium ? 'bg-gradient-to-r from-[#145BFF] to-purple-600' : 'bg-[#CFCFD4]/30'}`} 
                                style={{ width: `${town.percentage}%` }} 
                              />
                            </div>

                            {/* User list belonging to this town */}
                            {userLabels.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                                <span className="text-white/35 font-mono self-center mr-1">
                                  {language === 'es' ? 'Visitantes:' : 'Visitors:'}
                                </span>
                                {userLabels.map((lbl, uIdx) => (
                                  <span key={uIdx} className="bg-white/5 text-white/60 border border-white/5 px-1.5 py-0.5 rounded font-mono text-[9px]">
                                    {lbl}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Local Town Target Marketing Visual Advisor card */}
                <div className="lg:col-span-6 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-xl flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      {language === 'es' ? 'Análisis de Densidad de Compra Premium' : 'Premium Purchasing Power Map'}
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                      {language === 'es' ? 'Por qué Dorado, Guaynabo y San Juan son indispensables para lanzar campañas.' : 'Targeting criteria for local Facebook/Meta campaign launch.'}
                    </p>
                  </div>

                  {/* Visual Map / Graphic Radar representation */}
                  <div className="h-[220px] w-full mt-2 flex items-center justify-center relative">
                    {/* Animated visual telemetry rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border border-white/5 rounded-full animate-ping duration-3000" />
                      <div className="w-32 h-32 border border-white/5 rounded-full animate-pulse" />
                    </div>
                    
                    <div className="space-y-4 w-full px-4 relative z-10">
                      <div className="p-3 bg-[#145BFF]/5 border border-[#145BFF]/10 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-white">💎 Sabanera Dorado (Luxury)</span>
                        <span className="font-mono text-[#00D4FF]">Ticket Medio: $5,000+</span>
                      </div>
                      <div className="p-3 bg-[#A855F7]/5 border border-[#A855F7]/10 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-white">💼 San Patricio/Caparra (Corporate)</span>
                        <span className="font-mono text-[#A855F7]">Ticket Medio: $3,500+</span>
                      </div>
                      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between text-xs">
                        <span className="font-bold text-white">🌴 Condado & Palmas (Hospitality)</span>
                        <span className="font-mono text-amber-400">Ticket Medio: $4,000+</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl mt-2 text-xs leading-relaxed text-white/70">
                    <p className="font-bold text-white mb-1.5 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#00D4FF]" />
                      {language === 'es' ? 'Consejo de Conversión en P.R.' : 'Local PR Conversion Blueprint'}
                    </p>
                    {language === 'es' 
                      ? "Casi el 80% del capital premium local en servicios de software se concentra en Dorado, San Juan y Guaynabo. Dominar el posicionamiento en buscadores para estas tres ciudades garantiza cotizaciones cerradas de alto margen."
                      : "Over 80% of local high-ticket digital service capital flows through Dorado, San Juan, and Guaynabo. Geo-targeting your digital ads specifically to these premium ZIP codes ensures high profit retainers."}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* LIVE TERMINAL FEED TAB */}
          {activeTab === 'live' && (
            <motion.div
              key="live-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Retro-futuristic Glass terminal logs */}
              <div className="bg-[#030307]/80 border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent" />
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00D4FF] animate-ping" />
                    <h3 className="font-heading text-lg font-bold text-white font-mono uppercase tracking-widest">
                      Live Telemetry Terminal
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    REALTIME_STREAM_v1.0.4_ONLINE
                  </span>
                </div>

                <div className="font-mono text-xs space-y-3.5 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {recentActions.length === 0 ? (
                    <p className="text-center text-white/30 py-12 animate-pulse">
                      &gt;_ WAITING FOR SIGNAL INPUTS... SCRAPE PAGE CLICKS LIVE
                    </p>
                  ) : (
                    recentActions.map((act, i) => {
                      const isSim = act.session.id.includes('sim');
                      const isContact = act.text.toLowerCase().includes('solicitud') || act.text.toLowerCase().includes('cita');
                      return (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={`act-${i}`} 
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
                            isContact 
                              ? 'bg-[#10b981]/5 border-[#10b981]/20 hover:border-[#10b981]/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                              : isSim 
                                ? 'bg-purple-500/[0.03] border-purple-500/10 hover:border-purple-500/20' 
                                : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                          }`}
                        >
                          <span className="text-white/30 text-[10px] shrink-0 pt-0.5">
                            [{new Date(act.time).toLocaleTimeString()}]
                          </span>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-cyan-400 font-bold uppercase shrink-0 font-mono">
                                &gt;_ {language === 'es' ? 'usuario' : 'user'}_{act.userNumber}
                              </span>
                              
                              <span className="text-white/40 font-light text-[11px] shrink-0 font-mono">
                                ({act.session.deviceType === 'Mobile' ? (act.session.os === 'iOS' ? 'iPhone' : act.session.os === 'Android' ? 'Android' : 'Mobile') : act.session.deviceType} / {act.session.os})
                              </span>

                              <span className="text-amber-400 bg-amber-500/5 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ml-auto">
                                📍 {act.session.city || 'Puerto Rico'}
                              </span>
                            </div>
                            
                            <p className={`text-xs ${isContact ? 'text-green-400 font-bold' : 'text-white/80'}`}>
                              {act.text}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* PREMIUM CAMPAIGN TARGET ADVISOR TAB */}
          {activeTab === 'marketing' && (
            <motion.div
              key="marketing-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Marketing introduction card */}
              <div className="bg-gradient-to-r from-purple-900/20 to-[#145BFF]/10 border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-cyan-400" />
                    {language === 'es' ? 'Planificador de Campaña FJN Digital Media' : 'FJN Digital Campaign Planner'}
                  </h3>
                  <p className="text-sm text-white/70 max-w-2xl">
                    {language === 'es' 
                      ? 'Nuestros servicios premium (Landings $1.5k+, Hosting $100+/mes, E-commerce $4k+) necesitan clientes con liquidez. Abajo encontrarás la ficha técnica exacta de configuración para Meta (Facebook/Instagram) y Google Ads dirigida a los pueblos más ricos de Puerto Rico.' 
                      : 'High-ticket agency deliverables require affluent clients. Below is the technical advertising breakdown to configure campaigns specifically targeting Puerto Rico\'s wealthiest geographic pockets.'}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center shrink-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">{language === 'es' ? 'Mercado Objetivo' : 'Core Audience'}</p>
                  <p className="text-2xl font-bold text-green-400 font-mono drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">High Net Worth</p>
                </div>
              </div>

              {/* Grid of advisory towns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAMPAIGN_ADVISORY.map((adv, idx) => (
                  <motion.div
                    whileHover={{ scale: 1.01, y: -3 }}
                    key={adv.town}
                    className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between gap-5 transition-all duration-300 relative group"
                  >
                    {/* Glowing highlight tag number */}
                    <div className="absolute top-4 right-4 text-xs font-mono text-white/20 font-bold select-none group-hover:text-cyan-400/40 transition-colors">
                      TARGET_0{idx+1}
                    </div>

                    <div className="space-y-4">
                      {/* Name of town */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4.5 h-4.5 text-cyan-400" />
                          <h4 className="font-heading text-xl font-bold text-white">{adv.town}</h4>
                        </div>
                        <p className="text-xs text-purple-400 font-semibold mt-1">{adv.subsector}</p>
                      </div>

                      {/* Demographics */}
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wider">{language === 'es' ? 'Perfil del Cliente' : 'Demographics Profile'}</span>
                          <span className="text-white/90 leading-relaxed font-sans">{adv.profile}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wider">{language === 'es' ? 'Servicios Recomendados' : 'Top Services to Pitch'}</span>
                          <span className="text-green-400 font-bold">{adv.bestServices}</span>
                        </div>
                        <div className="pt-2">
                          <span className="text-white/40 block font-mono uppercase text-[9px] tracking-wider">{language === 'es' ? 'Intereses de Segmentación' : 'Ad Interests (Meta)'}</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {adv.metaInterests.map(interest => (
                              <span key={interest} className="bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded text-[10px] font-mono">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Campaign parameters */}
                    <div className="pt-4 border-t border-white/5 space-y-3.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider">{language === 'es' ? 'Presupuesto Ads' : 'Recommended Ads Budget'}</span>
                        <span className="font-mono text-white font-bold">{adv.recommendedBudget}</span>
                      </div>

                      <div>
                        <span className="text-white/40 block font-mono text-[9px] uppercase tracking-wider mb-1">{language === 'es' ? 'Propuesta / Copia Ganadora' : 'Winning Pitch Copy'}</span>
                        <p className="text-white/80 italic leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/5">
                          "{language === 'es' ? adv.pitchEs : adv.pitchEn}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-1.5">
                        <span className="text-white/40 font-mono text-[9px] uppercase tracking-wider">{language === 'es' ? 'Poder Adquisitivo' : 'Purchasing Power'}</span>
                        <span className="font-mono font-bold text-cyan-400">{adv.potentialRate}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* SVG definitions for gradient fills inside Recharts */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <linearGradient id="bluePurpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Admin;
