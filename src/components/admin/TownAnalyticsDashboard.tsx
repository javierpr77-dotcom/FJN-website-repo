import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  ArrowUpRight, 
  Filter, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Eye,
  ShoppingBag,
  RefreshCw,
  X
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { VisitorSession } from "@/contexts/AnalyticsContext";
import { LeadItem, LeadsManager } from "@/services/LeadsManager";

const ALL_78_PR_TOWNS = [
  "Adjuntas", "Aguada", "Aguadilla", "Aguas Buenas", "Aibonito", "Añasco", "Arecibo", "Arroyo", "Barceloneta", "Barranquitas",
  "Bayamón", "Cabo Rojo", "Caguas", "Camuy", "Canóvanas", "Carolina", "Cataño", "Cayey", "Ceiba", "Ciales",
  "Cidra", "Coamo", "Comerío", "Corozal", "Culebra", "Dorado", "Fajardo", "Florida", "Guánica", "Guayama",
  "Guayanilla", "Guaynabo", "Gurabo", "Hatillo", "Hormigueros", "Humacao", "Isabela", "Jayuya", "Juana Díaz", "Juncos",
  "Lajas", "Lares", "Las Marías", "Las Piedras", "Loíza", "Luquillo", "Manatí", "Maricao", "Maunabo", "Mayagüez",
  "Moca", "Morovis", "Naguabo", "Naranjito", "Orocovis", "Patillas", "Peñuelas", "Ponce", "Quebradillas", "Rincón",
  "Río Grande", "Sabana Grande", "Salinas", "San Germán", "San Juan", "San Lorenzo", "San Sebastián", "Santa Isabel", "Toa Alta", "Toa Baja",
  "Trujillo Alto", "Utuado", "Vega Alta", "Vega Baja", "Vieques", "Villalba", "Yabucoa", "Yauco"
];

const PRIME_ZONES = ["Dorado", "Guaynabo", "San Juan", "Humacao", "Rincón"];

const REGIONS: Record<string, { labelEs: string; labelEn: string; towns: string[] }> = {
  prime: {
    labelEs: "Zonas Prime & Alto Valor",
    labelEn: "Prime & High-Ticket Hubs",
    towns: PRIME_ZONES
  },
  metro: {
    labelEs: "Área Metro",
    labelEn: "Metro Area",
    towns: ["San Juan", "Guaynabo", "Bayamón", "Carolina", "Cataño", "Trujillo Alto", "Toa Baja", "Toa Alta"]
  },
  norte: {
    labelEs: "Costa Norte",
    labelEn: "North Coast",
    towns: ["Dorado", "Vega Alta", "Vega Baja", "Manatí", "Barceloneta", "Florida", "Arecibo", "Hatillo", "Camuy", "Quebradillas"]
  },
  sur: {
    labelEs: "Región Sur",
    labelEn: "Southern Region",
    towns: ["Ponce", "Juana Díaz", "Coamo", "Santa Isabel", "Salinas", "Guayama", "Arroyo", "Patillas", "Peñuelas", "Guayanilla", "Guánica", "Yauco"]
  },
  este: {
    labelEs: "Región Este",
    labelEn: "Eastern Region",
    towns: ["Humacao", "Caguas", "Gurabo", "Juncos", "San Lorenzo", "Fajardo", "Luquillo", "Río Grande", "Ceiba", "Naguabo", "Las Piedras", "Yabucoa", "Maunabo", "Vieques", "Culebra"]
  },
  oeste: {
    labelEs: "Porta del Sol (Oeste)",
    labelEn: "West Coast",
    towns: ["Mayagüez", "Aguadilla", "Rincón", "Cabo Rojo", "Isabela", "Aguada", "Moca", "Añasco", "San Germán", "Hormigueros", "Lajas", "San Sebastián", "Sabana Grande"]
  },
  montana: {
    labelEs: "Centro & Cordillera",
    labelEn: "Central Mountain",
    towns: ["Aibonito", "Cayey", "Cidra", "Barranquitas", "Orocovis", "Corozal", "Naranjito", "Comerío", "Aguas Buenas", "Morovis", "Ciales", "Jayuya", "Utuado", "Lares", "Adjuntas", "Maricao", "Las Marías", "Villalba"]
  }
};

interface TownAnalyticsDashboardProps {
  sessions: VisitorSession[];
  language: 'es' | 'en';
}

export const TownAnalyticsDashboard = ({ sessions, language }: TownAnalyticsDashboardProps) => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'conversions' | 'traffic' | 'rate' | 'revenue'>('conversions');
  const [selectedTownDetail, setSelectedTownDetail] = useState<string | null>(null);
  const [lastLivePing, setLastLivePing] = useState<Date>(new Date());
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);

  // Sync leads from central server and localStorage
  const refreshLeads = async () => {
    setIsLiveRefreshing(true);
    try {
      const serverLeads = await LeadsManager.fetchLeadsFromServer();
      setLeads(serverLeads);
    } catch {
      setLeads(LeadsManager.getLeads());
    } finally {
      setIsLiveRefreshing(false);
      setLastLivePing(new Date());
    }
  };

  useEffect(() => {
    refreshLeads();
    const interval = setInterval(refreshLeads, 4000);
    window.addEventListener('fjn_leads_updated', refreshLeads);
    window.addEventListener('fjn_lead_added', refreshLeads);
    return () => {
      clearInterval(interval);
      window.removeEventListener('fjn_leads_updated', refreshLeads);
      window.removeEventListener('fjn_lead_added', refreshLeads);
    };
  }, []);

  // Parse dollar value helper
  const parseDollarAmount = (val?: string): number => {
    if (!val) return 0;
    const clean = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Compile town stats combining sessions + leads
  const townStatsMap = useMemo(() => {
    const map: Record<string, {
      name: string;
      visits: number;
      activeNow: number;
      conversions: number;
      consultations: number;
      orders: number;
      revenue: number;
      conversionRate: number;
      iosCount: number;
      androidCount: number;
      desktopCount: number;
      leads: LeadItem[];
      latestActivity: number;
    }> = {};

    // Initialize all 78 towns
    ALL_78_PR_TOWNS.forEach(town => {
      map[town] = {
        name: town,
        visits: 0,
        activeNow: 0,
        conversions: 0,
        consultations: 0,
        orders: 0,
        revenue: 0,
        conversionRate: 0,
        iosCount: 0,
        androidCount: 0,
        desktopCount: 0,
        leads: [],
        latestActivity: 0
      };
    });

    const now = Date.now();
    const recentActiveThreshold = now - (5 * 60 * 1000); // 5 minutes

    // 1. Process visitor sessions
    sessions.forEach(s => {
      const city = s.city || "";
      // Match with known towns or fallback
      const matchTown = ALL_78_PR_TOWNS.find(t => t.toLowerCase() === city.toLowerCase());
      if (matchTown && map[matchTown]) {
        map[matchTown].visits++;
        if (s.startTime > map[matchTown].latestActivity) {
          map[matchTown].latestActivity = s.startTime;
        }
        if (s.isActive || (s.lastActiveTime && s.lastActiveTime > recentActiveThreshold)) {
          map[matchTown].activeNow++;
        }
        if (s.os === 'iOS') map[matchTown].iosCount++;
        else if (s.os === 'Android') map[matchTown].androidCount++;
        else map[matchTown].desktopCount++;
      }
    });

    // 2. Process real conversions / leads
    leads.forEach(l => {
      const town = l.town || "";
      const matchTown = ALL_78_PR_TOWNS.find(t => t.toLowerCase() === town.toLowerCase());
      if (matchTown && map[matchTown]) {
        map[matchTown].conversions++;
        map[matchTown].leads.push(l);
        if (l.type === 'consultation') {
          map[matchTown].consultations++;
        } else {
          map[matchTown].orders++;
        }
        const amount = parseDollarAmount(l.total);
        map[matchTown].revenue += amount;
        if (l.createdAt > map[matchTown].latestActivity) {
          map[matchTown].latestActivity = l.createdAt;
        }
      }
    });

    // 3. Calculate conversion rates
    Object.values(map).forEach(item => {
      if (item.visits > 0) {
        item.conversionRate = parseFloat(((item.conversions / item.visits) * 100).toFixed(1));
      } else if (item.conversions > 0) {
        item.conversionRate = 100.0;
      }
    });

    return map;
  }, [sessions, leads]);

  // Filtered & Sorted Town list
  const filteredTownsList = useMemo(() => {
    let list = Object.values(townStatsMap);

    // Filter by Region
    if (selectedRegion !== "all" && REGIONS[selectedRegion]) {
      const allowedTowns = new Set(REGIONS[selectedRegion].towns);
      list = list.filter(t => allowedTowns.has(t.name));
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(t => t.name.toLowerCase().includes(q));
    }

    // Sort list
    list.sort((a, b) => {
      if (sortBy === 'conversions') {
        if (b.conversions !== a.conversions) return b.conversions - a.conversions;
        return b.visits - a.visits;
      }
      if (sortBy === 'traffic') {
        if (b.visits !== a.visits) return b.visits - a.visits;
        return b.conversions - a.conversions;
      }
      if (sortBy === 'rate') {
        if (b.conversionRate !== a.conversionRate) return b.conversionRate - a.conversionRate;
        return b.conversions - a.conversions;
      }
      if (sortBy === 'revenue') {
        if (b.revenue !== a.revenue) return b.revenue - a.revenue;
        return b.conversions - a.conversions;
      }
      return 0;
    });

    return list;
  }, [townStatsMap, selectedRegion, searchTerm, sortBy]);

  // Aggregate Top KPIs
  const kpis = useMemo(() => {
    const allStats = Object.values(townStatsMap);
    const activeTownsWithTraffic = allStats.filter(t => t.visits > 0).length;
    const townsWithConversions = allStats.filter(t => t.conversions > 0).length;
    const totalPRVisits = allStats.reduce((acc, t) => acc + t.visits, 0);
    const totalPRConversions = allStats.reduce((acc, t) => acc + t.conversions, 0);
    const totalPRRevenue = allStats.reduce((acc, t) => acc + t.revenue, 0);
    const globalConversionRate = totalPRVisits > 0 
      ? ((totalPRConversions / totalPRVisits) * 100).toFixed(1) 
      : (totalPRConversions > 0 ? "100.0" : "0.0");

    // Leader in conversions
    const topConversionTown = [...allStats].sort((a, b) => b.conversions - a.conversions)[0];
    // Leader in revenue
    const topRevenueTown = [...allStats].sort((a, b) => b.revenue - a.revenue)[0];

    return {
      activeTownsWithTraffic,
      townsWithConversions,
      totalPRVisits,
      totalPRConversions,
      totalPRRevenue,
      globalConversionRate,
      topConversionTown: topConversionTown && topConversionTown.conversions > 0 ? topConversionTown.name : "N/A",
      topRevenueTown: topRevenueTown && topRevenueTown.revenue > 0 ? topRevenueTown.name : "N/A"
    };
  }, [townStatsMap]);

  // Chart data: Top 10 Active Towns
  const chartData = useMemo(() => {
    const active = Object.values(townStatsMap)
      .filter(t => t.visits > 0 || t.conversions > 0)
      .sort((a, b) => (b.conversions * 10 + b.visits) - (a.conversions * 10 + a.visits))
      .slice(0, 8);

    if (active.length === 0) {
      // Default placeholder preview towns
      return [
        { name: "San Juan", visitas: 12, conversiones: 2, ingresos: 7000 },
        { name: "Guaynabo", visitas: 9, conversiones: 1, ingresos: 3500 },
        { name: "Bayamón", visitas: 8, conversiones: 1, ingresos: 1800 },
        { name: "Dorado", visitas: 7, conversiones: 1, ingresos: 5000 },
        { name: "Carolina", visitas: 6, conversiones: 0, ingresos: 0 },
        { name: "Caguas", visitas: 5, conversiones: 0, ingresos: 0 },
        { name: "Humacao", visitas: 4, conversiones: 0, ingresos: 0 },
        { name: "Ponce", visitas: 3, conversiones: 0, ingresos: 0 }
      ];
    }

    return active.map(t => ({
      name: t.name,
      visitas: t.visits,
      conversiones: t.conversions,
      ingresos: t.revenue
    }));
  }, [townStatsMap]);

  // Detail town data when clicked
  const selectedTownData = useMemo(() => {
    if (!selectedTownDetail) return null;
    return townStatsMap[selectedTownDetail] || null;
  }, [selectedTownDetail, townStatsMap]);

  return (
    <div className="space-y-8">
      {/* Real-time Telemetry Live Header */}
      <div className="bg-gradient-to-r from-[#145BFF]/10 via-[#00D4FF]/10 to-transparent border border-[#145BFF]/30 p-5 sm:p-6 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(20,91,255,0.15)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#145BFF]/20 border border-[#145BFF]/40 flex items-center justify-center text-[#00D4FF]">
              <MapPin className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {language === 'es' ? 'Monitoreo de Tráfico & Conversiones por Pueblo' : 'Traffic & Conversions Dashboard by Town'}
                </h2>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{language === 'es' ? 'EN VIVO' : 'LIVE'}</span>
                </span>
              </div>
              <p className="text-xs text-white/60 mt-1 font-body">
                {language === 'es' 
                  ? `Sincronización en tiempo real de los 78 municipios de Puerto Rico con geolocalización de IPs y formularios cerrados.`
                  : `Real-time synchronization across all 78 municipalities in Puerto Rico with IP geolocation and captured leads.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshLeads}
              disabled={isLiveRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/15 hover:border-[#145BFF]/40 text-xs font-mono text-white/80 hover:text-white transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00D4FF] ${isLiveRefreshing ? 'animate-spin' : ''}`} />
              <span>{language === 'es' ? 'Actualizar' : 'Refresh'}</span>
            </button>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-white/50 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#145BFF]" />
              <span>{lastLivePing.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversions in PR */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-[#145BFF]/40 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-12 h-12 text-[#00D4FF]" />
          </div>
          <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest block mb-1">
            {language === 'es' ? 'Conversiones en P.R.' : 'P.R. Conversions'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
              {kpis.totalPRConversions}
            </span>
            <span className="text-xs font-mono text-[#00D4FF]">
              {language === 'es' ? 'Leads & Órdenes' : 'Leads & Orders'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/60 pt-2 border-t border-white/5">
            <span>{language === 'es' ? 'Pueblos cerrados:' : 'Active towns:'}</span>
            <span className="text-white font-semibold">{kpis.townsWithConversions} / 78</span>
          </div>
        </div>

        {/* Global Conversion Rate in PR */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-12 h-12 text-emerald-400" />
          </div>
          <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest block mb-1">
            {language === 'es' ? 'Tasa de Conversión PR' : 'PR Conversion Rate'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-emerald-400 tracking-tight">
              {kpis.globalConversionRate}%
            </span>
            <span className="text-xs font-mono text-white/40">
              avg
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/60 pt-2 border-t border-white/5">
            <span>{language === 'es' ? 'Tráfico evaluado:' : 'Total sessions:'}</span>
            <span className="text-white font-semibold">{kpis.totalPRVisits} visitas</span>
          </div>
        </div>

        {/* Estimated Pipeline Value in PR */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Sparkles className="w-12 h-12 text-amber-400" />
          </div>
          <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest block mb-1">
            {language === 'es' ? 'Pipeline Local Total' : 'Local PR Pipeline'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-amber-300 tracking-tight">
              ${kpis.totalPRRevenue.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-amber-400/70">
              USD
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/60 pt-2 border-t border-white/5">
            <span>{language === 'es' ? 'Pueblo Top Valor:' : 'Top Value Town:'}</span>
            <span className="text-white font-semibold">{kpis.topRevenueTown}</span>
          </div>
        </div>

        {/* Coverage Across 78 Towns */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <MapPin className="w-12 h-12 text-purple-400" />
          </div>
          <span className="text-[10px] text-white/50 font-mono uppercase tracking-widest block mb-1">
            {language === 'es' ? 'Cobertura Geográfica' : 'Island Coverage'}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-white tracking-tight">
              {kpis.activeTownsWithTraffic}
              <span className="text-lg text-white/40 font-normal"> / 78</span>
            </span>
            <span className="text-xs font-mono text-purple-400">
              {((kpis.activeTownsWithTraffic / 78) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-white/60 pt-2 border-t border-white/5">
            <span>{language === 'es' ? 'Líder en Tráfico:' : 'Traffic Leader:'}</span>
            <span className="text-white font-semibold">{kpis.topConversionTown}</span>
          </div>
        </div>
      </div>

      {/* Chart Section: Tráfico vs. Conversiones por Pueblo */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
              {language === 'es' ? 'Comparativa de Tráfico vs. Conversiones por Municipio' : 'Traffic vs. Conversions by Municipality'}
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              {language === 'es' 
                ? 'Monitorea qué municipios generan visitas frías y cuáles cierran en consultas y órdenes directas.' 
                : 'Identify which towns drive high interest and convert into high-ticket contracts.'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-3 h-3 rounded-sm bg-[#145BFF]" />
              {language === 'es' ? 'Visitas (Tráfico)' : 'Visits (Traffic)'}
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="w-3 h-3 rounded-sm bg-[#00D4FF]" />
              {language === 'es' ? 'Conversiones (Leads)' : 'Conversions (Leads)'}
            </span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" stroke="#ffffff40" fontSize={11} tickLine={false} />
              <YAxis stroke="#ffffff40" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#080c1a', 
                  borderColor: '#145BFF40', 
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  color: '#fff'
                }} 
              />
              <Bar dataKey="visitas" fill="#145BFF" radius={[6, 6, 0, 0]} barSize={22} name={language === 'es' ? "Visitas" : "Visits"} />
              <Bar dataKey="conversiones" fill="#00D4FF" radius={[6, 6, 0, 0]} barSize={22} name={language === 'es' ? "Conversiones" : "Conversions"} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Stream: Últimas Conversiones por Municipio */}
      {leads.length > 0 && (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              {language === 'es' ? 'Flujo en Vivo de Conversiones Geográficas' : 'Live Geographic Conversion Feed'}
            </h3>
            <span className="text-[11px] font-mono text-white/40">
              {leads.length} {language === 'es' ? 'registros en base central' : 'records in database'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {leads.slice(0, 6).map((lead) => (
              <div 
                key={lead.id}
                onClick={() => lead.town && setSelectedTownDetail(lead.town)}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#145BFF]/30 hover:bg-white/[0.04] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-[#145BFF]/20 text-[#3B7BFF] border border-[#145BFF]/30">
                    {lead.town || 'Puerto Rico'}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="mb-2">
                  <h4 className="font-heading text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">
                    {lead.name}
                  </h4>
                  <p className="text-xs text-white/60 font-body truncate">
                    {lead.plan || lead.goal || (lead.type === 'consultation' ? 'Consulta de Estrategia' : 'Orden')}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5 text-white/50">
                  <span className="text-emerald-400 font-bold">{lead.total || 'Consultoría'}</span>
                  <span className="flex items-center gap-1 text-[10px] text-white/40 group-hover:text-white transition-colors">
                    {language === 'es' ? 'Ver pueblo' : 'Inspect town'} →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table: Monitoreo Detallado de los 78 Pueblos */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        {/* Controls: Region Tabs + Search + Sorter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Search Town */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'es' ? "Buscar pueblo (ej: Dorado, San Juan)..." : "Search town..."}
              className="w-full bg-white/[0.04] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder:text-white/35 focus:outline-none focus:border-[#145BFF]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sorter Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-mono text-white/40 flex-shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              {language === 'es' ? 'Ordenar:' : 'Sort:'}
            </span>
            <button
              onClick={() => setSortBy('conversions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                sortBy === 'conversions' ? 'bg-[#145BFF] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Mayor Conversión' : 'Conversions'}
            </button>
            <button
              onClick={() => setSortBy('traffic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                sortBy === 'traffic' ? 'bg-[#145BFF] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Mayor Tráfico' : 'Traffic'}
            </button>
            <button
              onClick={() => setSortBy('rate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                sortBy === 'rate' ? 'bg-[#145BFF] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Tasa % Cierre' : 'Win Rate %'}
            </button>
            <button
              onClick={() => setSortBy('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-shrink-0 ${
                sortBy === 'revenue' ? 'bg-[#145BFF] text-white' : 'bg-white/5 text-white/60 hover:text-white'
              }`}
            >
              {language === 'es' ? 'Pipeline ($)' : 'Revenue ($)'}
            </button>
          </div>
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-white/5">
          <button
            onClick={() => setSelectedRegion("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex-shrink-0 border ${
              selectedRegion === "all"
                ? "border-[#145BFF] bg-[#145BFF]/20 text-white shadow-[0_0_12px_rgba(20,91,255,0.3)]"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {language === 'es' ? "Todos (78)" : "All (78)"}
          </button>
          {Object.entries(REGIONS).map(([key, reg]) => (
            <button
              key={key}
              onClick={() => setSelectedRegion(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex-shrink-0 border ${
                selectedRegion === key
                  ? "border-[#145BFF] bg-[#145BFF]/20 text-white shadow-[0_0_12px_rgba(20,91,255,0.3)]"
                  : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {language === 'es' ? reg.labelEs : reg.labelEn}
            </button>
          ))}
        </div>

        {/* Table Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-body">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase font-mono tracking-wider text-[11px]">
                <th className="pb-3 pl-3">{language === 'es' ? 'Municipio' : 'Municipality'}</th>
                <th className="pb-3 text-center">{language === 'es' ? 'Estado' : 'Status'}</th>
                <th className="pb-3 text-right">{language === 'es' ? 'Visitas' : 'Visits'}</th>
                <th className="pb-3 text-right">{language === 'es' ? 'Conversiones' : 'Conversions'}</th>
                <th className="pb-3 text-right">{language === 'es' ? 'Tasa Cierre' : 'Conv. Rate'}</th>
                <th className="pb-3 text-right">{language === 'es' ? 'Pipeline ($)' : 'Pipeline'}</th>
                <th className="pb-3 text-center">{language === 'es' ? 'Dispositivos' : 'Devices'}</th>
                <th className="pb-3 pr-3 text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTownsList.map((town) => {
                const isPrime = PRIME_ZONES.includes(town.name);
                const hasLive = town.activeNow > 0;
                const hasConversions = town.conversions > 0;

                return (
                  <tr 
                    key={town.name}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    {/* Town name & Badge */}
                    <td className="py-3.5 pl-3">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm">
                          {town.name}
                        </span>
                        {isPrime && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#145BFF]/15 text-[#00D4FF] border border-[#145BFF]/30">
                            💎 Prime
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Live Pulse status */}
                    <td className="py-3.5 text-center font-mono">
                      {hasLive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {town.activeNow} {language === 'es' ? 'activo(s)' : 'live'}
                        </span>
                      ) : (
                        <span className="text-white/30 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Visits / Traffic */}
                    <td className="py-3.5 text-right font-mono text-white/80">
                      <span className="font-semibold text-white">{town.visits}</span>
                      <span className="text-[10px] text-white/40 block">
                        {((town.visits / (kpis.totalPRVisits || 1)) * 100).toFixed(0)}% total
                      </span>
                    </td>

                    {/* Conversions Count */}
                    <td className="py-3.5 text-right font-mono">
                      {hasConversions ? (
                        <span className="px-2 py-0.5 rounded-md bg-[#00D4FF]/10 text-[#00D4FF] font-bold border border-[#00D4FF]/30">
                          {town.conversions} {town.conversions === 1 ? 'lead' : 'leads'}
                        </span>
                      ) : (
                        <span className="text-white/30">0</span>
                      )}
                    </td>

                    {/* Conversion Rate */}
                    <td className="py-3.5 text-right font-mono">
                      <span className={`font-bold ${
                        town.conversionRate > 20 
                          ? 'text-emerald-400' 
                          : town.conversionRate > 0 
                          ? 'text-[#00D4FF]' 
                          : 'text-white/40'
                      }`}>
                        {town.conversionRate}%
                      </span>
                    </td>

                    {/* Revenue Value */}
                    <td className="py-3.5 text-right font-mono">
                      {town.revenue > 0 ? (
                        <span className="text-amber-300 font-bold">
                          ${town.revenue.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-white/30">$0</span>
                      )}
                    </td>

                    {/* Devices Breakdown */}
                    <td className="py-3.5 text-center font-mono text-[10px] text-white/50">
                      <div className="flex items-center justify-center gap-2">
                        {town.iosCount > 0 && <span title="iPhone">📱 {town.iosCount}</span>}
                        {town.androidCount > 0 && <span title="Android">🤖 {town.androidCount}</span>}
                        {town.desktopCount > 0 && <span title="Desktop">💻 {town.desktopCount}</span>}
                        {town.visits === 0 && <span className="text-white/20">-</span>}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 pr-3 text-right">
                      <button
                        onClick={() => setSelectedTownDetail(town.name)}
                        className="px-2.5 py-1 rounded-lg border border-white/10 hover:border-[#145BFF]/50 bg-white/[0.02] hover:bg-[#145BFF]/10 text-white/70 hover:text-white font-mono text-[11px] transition-all"
                      >
                        {language === 'es' ? 'Ver Ficha' : 'Details'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Town Detail Modal */}
      <AnimatePresence>
        {selectedTownData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#080c1a] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(20,91,255,0.2)] max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTownDetail(null)}
                className="absolute top-5 right-5 text-white/50 hover:text-white text-sm p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#145BFF] animate-pulse shadow-[0_0_8px_#145BFF]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#3B7BFF]">
                  {language === 'es' ? 'Expediente Geográfico Municipal' : 'Municipality Geographic File'}
                </span>
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
                {selectedTownData.name}, Puerto Rico
              </h3>

              {/* Metrics Summary Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 mb-6">
                <div className="text-center">
                  <span className="text-[10px] font-mono text-white/50 uppercase block">
                    {language === 'es' ? 'Visitas Registradas' : 'Total Visits'}
                  </span>
                  <span className="font-heading text-xl font-bold text-white">
                    {selectedTownData.visits}
                  </span>
                </div>
                <div className="text-center border-x border-white/10">
                  <span className="text-[10px] font-mono text-white/50 uppercase block">
                    {language === 'es' ? 'Conversiones Cerradas' : 'Conversions'}
                  </span>
                  <span className="font-heading text-xl font-bold text-[#00D4FF]">
                    {selectedTownData.conversions}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-white/50 uppercase block">
                    {language === 'es' ? 'Pipeline Monetario' : 'Revenue Pipeline'}
                  </span>
                  <span className="font-heading text-xl font-bold text-amber-300">
                    ${selectedTownData.revenue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Real Leads originating from this town */}
              <div>
                <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  {language === 'es' ? `Clientes / Leads Captados en ${selectedTownData.name} (${selectedTownData.leads.length})` : `Leads from ${selectedTownData.name}`}
                </h4>

                {selectedTownData.leads.length === 0 ? (
                  <div className="p-6 rounded-xl bg-white/[0.01] border border-white/5 text-center text-white/40 text-xs font-mono">
                    {language === 'es' 
                      ? 'No hay solicitudes registradas aún para este pueblo. Se recomienda activar campaña de Meta/Google Ads segmentada.' 
                      : 'No captured leads for this town yet.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedTownData.leads.map(lead => (
                      <div key={lead.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-white text-sm">
                            {lead.name}
                          </span>
                          <span className="text-emerald-400 font-mono font-bold text-xs">
                            {lead.total || 'Consulta'}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 font-body">
                          {lead.plan || lead.goal || 'Contacto de consulta'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-white/50 border-t border-white/5">
                          {lead.phone && (
                            <a 
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1 text-emerald-400 hover:underline"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>{lead.phone}</span>
                            </a>
                          )}
                          {lead.email && (
                            <a 
                              href={`mailto:${lead.email}`} 
                              className="flex items-center gap-1 hover:text-white"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{lead.email}</span>
                            </a>
                          )}
                          <span className="text-white/30 ml-auto">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setSelectedTownDetail(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-all"
                >
                  {language === 'es' ? "Cerrar" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
