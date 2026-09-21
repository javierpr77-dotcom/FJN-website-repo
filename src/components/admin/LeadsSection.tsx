import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Phone, MessageSquare, Calendar, MapPin, Sparkles, 
  CheckCircle2, Clock, AlertTriangle, Trash2, Download, 
  Plus, Search, Send, Check, ShoppingBag, 
  ShieldCheck, RefreshCw, X, MessageCircle, Smartphone, Monitor
} from "lucide-react";
import { LeadsManager, LeadItem } from "@/services/LeadsManager";

interface LeadsSectionProps {
  language: 'es' | 'en';
}

export const LeadsSection = ({ language }: LeadsSectionProps) => {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'new' | 'consultation' | 'plan_order' | 'archived'>('all');
  const [isTestEmailLoading, setIsTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
    details?: any;
  } | null>(null);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    name: "",
    phone: "",
    email: "",
    town: "San Juan",
    type: "consultation" as 'consultation' | 'plan_order',
    goal: "",
    plan: "Premium Landing Page",
    total: "$1,800 USD"
  });

  const loadLeads = async () => {
    setIsRefreshing(true);
    try {
      const serverLeads = await LeadsManager.fetchLeadsFromServer();
      setLeads(serverLeads);
    } catch (e) {
      setLeads(LeadsManager.getLeads());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeads();
    const handleUpdate = () => {
      setLeads(LeadsManager.getLeads());
    };
    window.addEventListener('fjn_leads_updated', handleUpdate);
    window.addEventListener('fjn_lead_added', handleUpdate);

    // Periodic live sync with central server for cross-device visibility
    const interval = setInterval(() => {
      LeadsManager.fetchLeadsFromServer();
    }, 3500);

    return () => {
      clearInterval(interval);
      window.removeEventListener('fjn_leads_updated', handleUpdate);
      window.removeEventListener('fjn_lead_added', handleUpdate);
    };
  }, []);

  const handleStatusChange = (id: string, newStatus: LeadItem['status']) => {
    LeadsManager.updateLeadStatus(id, newStatus);
  };

  const handleNotesChange = (id: string, notes: string) => {
    LeadsManager.updateLeadNotes(id, notes);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(language === 'es' ? '¿Eliminar este registro de solicitud permanentemente?' : 'Delete this lead record permanently?')) {
      LeadsManager.deleteLead(id);
    }
  };

  const handleClearAll = () => {
    if (window.confirm(language === 'es' ? '¿Estás seguro de que deseas vaciar todas las solicitudes? Esta acción no se puede deshacer.' : 'Are you sure you want to clear all lead entries? This action cannot be undone.')) {
      LeadsManager.clearAllLeads();
      setLeads([]);
    }
  };

  const handleAddManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    LeadsManager.saveLead({
      name: manualForm.name.trim(),
      phone: manualForm.phone.trim(),
      email: manualForm.email.trim(),
      town: manualForm.town,
      type: manualForm.type,
      goal: manualForm.goal.trim() || 'Ingresado manualmente por el administrador',
      plan: manualForm.type === 'plan_order' ? manualForm.plan : undefined,
      total: manualForm.type === 'plan_order' ? manualForm.total : undefined,
      source: 'Ingreso Manual (Admin)'
    });
    setIsManualModalOpen(false);
    setManualForm({
      name: "",
      phone: "",
      email: "",
      town: "San Juan",
      type: "consultation",
      goal: "",
      plan: "Premium Landing Page",
      total: "$1,800 USD"
    });
  };

  const handleRunEmailDiagnostic = async () => {
    setIsTestEmailLoading(true);
    setTestEmailResult(null);
    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          name: "Prueba Técnica de Diagnóstico",
          phone: "787-000-0000",
          email: "negociospr82@gmail.com",
          goal: "Verificación de tubería de notificaciones y logística de entrega.",
          town: "San Juan"
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setTestEmailResult({
          success: true,
          message: language === 'es' 
            ? "Email de prueba despachado con éxito mediante Resend API." 
            : "Test email dispatched successfully via Resend API.",
          timestamp: new Date().toLocaleTimeString(),
          details: resData
        });
      } else {
        setTestEmailResult({
          success: false,
          message: resData.message || resData.warning || (language === 'es' ? "Respuesta de servidor recibida." : "Server response received."),
          timestamp: new Date().toLocaleTimeString(),
          details: resData
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: language === 'es' 
          ? `Alerta de conectividad: La función serverless no respondió directamente en el entorno actual (${err.message}). Los datos están 100% resguardados localmente.` 
          : `Connectivity alert: Serverless function unreachable (${err.message}). Data safely stored locally.`,
        timestamp: new Date().toLocaleTimeString(),
        details: err.message
      });
    } finally {
      setIsTestEmailLoading(false);
    }
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      (l.name && l.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.phone && l.phone.includes(searchTerm)) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.town && l.town.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.plan && l.plan.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'new') return l.status === 'new';
    if (filterType === 'consultation') return l.type === 'consultation';
    if (filterType === 'plan_order') return l.type === 'plan_order';
    if (filterType === 'archived') return l.status === 'archived';
    return true; // 'all'
  });

  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted' || l.status === 'scheduled').length;
  const closedCount = leads.filter(l => l.status === 'closed').length;
  const mobileLeadsCount = leads.filter(l => l.deviceType === 'Mobile' || l.os === 'iOS' || l.os === 'Android').length;
  const desktopLeadsCount = leads.filter(l => l.deviceType === 'Desktop' || l.os === 'macOS' || l.os === 'Windows').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      {/* 1. TOP METRICS PIPELINE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ShoppingBag className="w-12 h-12 text-[#145BFF]" />
          </div>
          <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest block">
            {language === 'es' ? 'Total Solicitudes' : 'Total Leads'}
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1 block">
            {leads.length}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">
            {language === 'es' ? 'Guardadas en bóveda' : 'Vault preserved'}
          </span>
        </div>

        <div className="bg-white/[0.02] border border-amber-500/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Clock className="w-12 h-12 text-amber-500" />
          </div>
          <span className="text-[10px] text-amber-400/70 font-mono uppercase tracking-widest block">
            {language === 'es' ? 'Nuevas / Por Atender' : 'New / Unattended'}
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1 block">
            {newCount}
          </span>
          <span className="text-[10px] text-amber-400/90 font-mono mt-1 block">
            {newCount > 0 ? (language === 'es' ? '⚡ Atención requerida' : '⚡ Action required') : (language === 'es' ? 'Al día' : 'Up to date')}
          </span>
        </div>

        <div className="bg-white/[0.02] border border-blue-500/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
          <span className="text-[10px] text-blue-400/70 font-mono uppercase tracking-widest block">
            {language === 'es' ? 'En Negociación' : 'In Discussion'}
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 mt-1 block">
            {contactedCount}
          </span>
          <span className="text-[10px] text-blue-300 font-mono mt-1 block">
            {language === 'es' ? 'Contactados / Agendados' : 'Contacted / Scheduled'}
          </span>
        </div>

        <div className="bg-white/[0.02] border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <span className="text-[10px] text-emerald-400/70 font-mono uppercase tracking-widest block">
            {language === 'es' ? 'Cerrados / Ganados' : 'Closed / Won'}
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1 block">
            {closedCount}
          </span>
          <span className="text-[10px] text-emerald-300 font-mono mt-1 block">
            {language === 'es' ? 'Proyectos confirmados' : 'Confirmed projects'}
          </span>
        </div>
      </div>

      {/* Dispositivos de Origen de Leads */}
      <div className="bg-white/[0.015] border border-white/5 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/40 uppercase tracking-wider text-[10px]">Auditoría de Dispositivos (Leads Reales):</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Móvil (iPhone / Android): <strong className="text-white font-bold">{mobileLeadsCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-300">
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span>Computadora (Laptop / PC): <strong className="text-white font-bold">{desktopLeadsCount}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. LOGISTICS & DELIVERY DIAGNOSTIC CARD */}
      <div className="bg-gradient-to-br from-[#0B1528] to-[#040812] border border-[#145BFF]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(20,91,255,0.15)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#145BFF]/20 border border-[#145BFF]/40 flex items-center justify-center shrink-0 text-[#00D4FF]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-white">
                  {language === 'es' ? 'Logística de Envíos & Notificaciones' : 'Lead Delivery & Notification Logistics'}
                </h3>
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  MULTI-CANAL ACTIVO
                </span>
              </div>
              <p className="text-white/60 font-body text-xs mt-1 max-w-2xl leading-relaxed">
                {language === 'es' 
                  ? 'Cada solicitud de la página web se procesa por 4 capas de seguridad simultáneas: Guardado en Bóveda Local, Netlify Forms Crawler, Notificación por Email Serverless y Confirmación directa por WhatsApp.'
                  : 'Every lead is processed across 4 fail-safe layers: Local Vault Storage, Netlify Forms Crawler, Serverless Email Dispatch, and Direct WhatsApp Quick Confirmation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleRunEmailDiagnostic}
              disabled={isTestEmailLoading}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-[#145BFF] hover:bg-[#3B7BFF] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,91,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestEmailLoading ? 'animate-spin' : ''}`} />
              <span>{isTestEmailLoading ? (language === 'es' ? 'Probando...' : 'Testing...') : (language === 'es' ? 'Probar Envío de Diagnóstico' : 'Run Delivery Test')}</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Status Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Destinatarios</p>
              <p className="text-xs font-mono text-white font-medium truncate max-w-[170px]" title="negociospr82@gmail.com, javierpr77@gmail.com">
                negociospr82@gmail.com
              </p>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Bóveda Local</p>
              <p className="text-xs font-mono text-emerald-400 font-medium">
                100% Anti-Pérdida Activa
              </p>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#145BFF]/10 border border-[#145BFF]/20 flex items-center justify-center text-[#00D4FF] shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">WhatsApp Link</p>
              <p className="text-xs font-mono text-white font-medium">
                1-Clic Directo Habilitado
              </p>
            </div>
          </div>

          <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">Netlify Function</p>
              <p className="text-xs font-mono text-purple-300 font-medium">
                send-email.js
              </p>
            </div>
          </div>
        </div>

        {/* Live Diagnostic Output Report */}
        {testEmailResult && (
          <div className={`mt-5 p-4 rounded-xl border text-xs font-mono ${
            testEmailResult.success 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                {testEmailResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {testEmailResult.success ? 'REPORTE DE DIAGNÓSTICO: ENVÍO VERIFICADO' : 'REPORTE DE DIAGNÓSTICO: INFORMACIÓN DEL SISTEMA'}
              </span>
              <span className="text-[10px] opacity-70">{testEmailResult.timestamp}</span>
            </div>
            <p className="leading-relaxed">{testEmailResult.message}</p>
            {testEmailResult.details && (
              <pre className="mt-2 p-2.5 bg-black/60 rounded-lg text-[10px] overflow-x-auto text-white/80 border border-white/5">
                {JSON.stringify(testEmailResult.details, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* 3. TOOLBAR (SEARCH, FILTERS, EXPORT & MANUAL ENTRY) */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder={language === 'es' ? "Buscar por nombre, teléfono, pueblo, plan..." : "Search by name, phone, town, plan..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-body text-white placeholder:text-white/30 focus:outline-none focus:border-[#145BFF]"
            />
          </div>

          {/* Filter tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {[
              { id: 'all', label: language === 'es' ? 'Todas' : 'All' },
              { id: 'new', label: language === 'es' ? 'Nuevas' : 'New' },
              { id: 'consultation', label: language === 'es' ? 'Asesorías' : 'Calls' },
              { id: 'plan_order', label: language === 'es' ? 'Planes' : 'Orders' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  filterType === f.id
                    ? 'bg-[#145BFF] text-white font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
          <button
            onClick={loadLeads}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-[#00D4FF]/20 border border-white/10 hover:border-[#00D4FF]/30 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sincronizar con el servidor"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#00D4FF] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{language === 'es' ? 'Sincronizar' : 'Sync'}</span>
          </button>

          <button
            onClick={() => LeadsManager.exportToCSV()}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Exportar a CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSV</span>
          </button>

          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/70 hover:text-red-400 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Vaciar todas las solicitudes"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>{language === 'es' ? 'Vaciar' : 'Clear'}</span>
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Registrar Solicitud' : 'New Lead'}</span>
          </button>
        </div>
      </div>

      {/* 4. LEADS LIST / CARDS */}
      <div className="space-y-4">
        {filteredLeads.length === 0 ? (
          <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h4 className="font-heading text-lg text-white font-medium">
              {language === 'es' ? 'No se encontraron solicitudes' : 'No requests found'}
            </h4>
            <p className="text-white/40 font-body text-xs mt-1 max-w-sm mx-auto">
              {searchTerm 
                ? (language === 'es' ? 'Intenta modificar el término de búsqueda.' : 'Try adjusting your search terms.')
                : (language === 'es' ? 'Las solicitudes recibidas en la web aparecerán aquí en tiempo real.' : 'Incoming leads will appear here in real-time.')}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const cleanPhone = (lead.phone || "").replace(/[^0-9]/g, "");
            const waGreeting = lead.type === 'plan_order'
              ? `Hola ${lead.name || ''}, un placer saludarte de FJN Digital Media. Recibimos tu solicitud para el ${lead.plan || 'Plan Web'}. ¿En qué momento tendrías unos minutos para afinar los detalles?`
              : `Hola ${lead.name || ''}, te saluda Francisco de FJN Digital Media. Recibimos tu solicitud de asesoría para tu negocio en ${lead.town || 'Puerto Rico'}. ¿Cuándo te es más cómodo conversar?`;
            
            const waUrl = cleanPhone ? `https://wa.me/${cleanPhone.length === 10 ? '1' + cleanPhone : cleanPhone}?text=${encodeURIComponent(waGreeting)}` : null;

            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/[0.02] border rounded-2xl p-5 md:p-6 backdrop-blur-md relative transition-all ${
                  lead.status === 'new'
                    ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Lead Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      lead.type === 'plan_order' 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-[#145BFF]/20 text-cyan-300 border border-[#145BFF]/30'
                    }`}>
                      {lead.type === 'plan_order' ? '🛍️ Orden de Plan' : '⚡ Asesoría Web'}
                    </span>

                    <span className="text-xs font-mono text-white/40">
                      {new Date(lead.createdAt).toLocaleString('es-PR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>

                    {(lead.deviceType || lead.os) && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-cyan-300">
                        {lead.deviceType === 'Mobile' ? (
                          <Smartphone className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Monitor className="w-3 h-3 text-cyan-400" />
                        )}
                        <span>
                          {lead.os === 'iOS' ? 'iPhone (iOS)' : 
                           lead.os === 'Android' ? 'Android' : 
                           lead.os === 'macOS' ? 'Mac (Laptop/Desktop)' : 
                           lead.os === 'Windows' ? 'Windows (PC)' : 
                           `${lead.deviceType || 'Dispositivo'} (${lead.os || 'Web'})`}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Estado:</span>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                      className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border bg-black/60 focus:outline-none cursor-pointer ${
                        lead.status === 'new' ? 'text-amber-400 border-amber-500/50' :
                        lead.status === 'contacted' ? 'text-blue-400 border-blue-500/50' :
                        lead.status === 'scheduled' ? 'text-cyan-400 border-cyan-500/50' :
                        lead.status === 'closed' ? 'text-emerald-400 border-emerald-500/50' :
                        'text-white/40 border-white/10'
                      }`}
                    >
                      <option value="new">🟢 Nueva</option>
                      <option value="contacted">🟡 Contactado</option>
                      <option value="scheduled">🔵 Agendado</option>
                      <option value="closed">🟣 Cerrado (Ganado)</option>
                      <option value="archived">⚪ Archivado</option>
                    </select>
                  </div>
                </div>

                {/* Lead Body Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-5">
                  {/* Column 1: Client Info */}
                  <div className="space-y-2">
                    <h4 className="font-heading text-lg font-bold text-white">{lead.name}</h4>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                      <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <a href={`tel:${lead.phone}`} className="hover:text-cyan-300 transition-colors font-bold">
                        {lead.phone}
                      </a>
                    </div>

                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                        <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="hover:text-purple-300 transition-colors truncate">
                          {lead.email}
                        </a>
                      </div>
                    )}

                    {lead.town && (
                      <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{lead.town}</span>
                      </div>
                    )}

                    {(lead.deviceType || lead.os) && (
                      <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300/80 pt-1">
                        {lead.deviceType === 'Mobile' ? (
                          <Smartphone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                        <span>Dispositivo: <strong className="text-white font-bold">{lead.os === 'iOS' ? 'iPhone (iOS)' : lead.os === 'Android' ? 'Android' : lead.os === 'macOS' ? 'Laptop / Mac' : lead.os === 'Windows' ? 'Laptop / PC (Windows)' : (lead.deviceType || 'Web')}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Column 2: Order / Request Details */}
                  <div className="space-y-2 bg-white/[0.01] p-3.5 rounded-xl border border-white/5">
                    {lead.type === 'plan_order' ? (
                      <>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Plan Seleccionado:</p>
                        <p className="text-sm font-heading font-bold text-white">{lead.plan}</p>
                        {lead.addons && lead.addons !== 'Ninguno/None' && (
                          <p className="text-xs text-white/60 font-body">
                            <strong className="text-white/40 font-mono">Addons:</strong> {lead.addons}
                          </p>
                        )}
                        <p className="text-xs font-mono font-bold text-cyan-400 pt-1">
                          Inversión: {lead.total}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Objetivo / Mensaje:</p>
                        <p className="text-xs text-white/80 font-body leading-relaxed">{lead.goal || 'Sin mensaje'}</p>
                        {lead.date && lead.date !== 'No seleccionada' && (
                          <div className="pt-2 flex items-center gap-2 text-xs font-mono text-cyan-300">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{lead.date} - {lead.time}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Column 3: Internal Notes & Quick Actions */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mb-1">Notas Internas (Admin):</p>
                      <textarea
                        defaultValue={lead.notes || ""}
                        onBlur={(e) => handleNotesChange(lead.id, e.target.value)}
                        placeholder={language === 'es' ? "Añadir notas de seguimiento..." : "Add follow-up notes..."}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs font-body text-white placeholder:text-white/20 focus:outline-none focus:border-[#145BFF] resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {waUrl && (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      )}

                      <a
                        href={`tel:${lead.phone}`}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center justify-center transition-all"
                        title="Llamar"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      </a>

                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-white/40 hover:text-red-400 text-xs font-mono transition-all cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* 5. MODAL FOR MANUAL LEAD ENTRY */}
      <AnimatePresence>
        {isManualModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0D14] border border-white/15 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-heading text-xl font-bold text-white mb-1">
                {language === 'es' ? 'Registrar Solicitud Manual' : 'Register Manual Lead'}
              </h3>
              <p className="text-white/50 text-xs font-body mb-6">
                {language === 'es' ? 'Guarda prospectos recibidos por teléfono, Instagram o en persona.' : 'Record leads from phone calls, Instagram DM or meetings.'}
              </p>

              <form onSubmit={handleAddManualLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Tipo</label>
                    <select
                      value={manualForm.type}
                      onChange={(e) => setManualForm({...manualForm, type: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                    >
                      <option value="consultation">Asesoría / Consulta</option>
                      <option value="plan_order">Orden de Plan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Pueblo</label>
                    <input
                      type="text"
                      required
                      value={manualForm.town}
                      onChange={(e) => setManualForm({...manualForm, town: e.target.value})}
                      placeholder="Ej. Guaynabo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={manualForm.phone}
                      onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                      placeholder="+1 787..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Email (Opcional)</label>
                    <input
                      type="email"
                      value={manualForm.email}
                      onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                      placeholder="correo@..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                    />
                  </div>
                </div>

                {manualForm.type === 'plan_order' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Plan</label>
                      <input
                        type="text"
                        value={manualForm.plan}
                        onChange={(e) => setManualForm({...manualForm, plan: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Inversión Estimada</label>
                      <input
                        type="text"
                        value={manualForm.total}
                        onChange={(e) => setManualForm({...manualForm, total: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-body text-white focus:outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-mono text-white/50 uppercase block mb-1">Proyecto / Necesidad</label>
                    <textarea
                      rows={3}
                      value={manualForm.goal}
                      onChange={(e) => setManualForm({...manualForm, goal: e.target.value})}
                      placeholder="Detalles sobre lo que busca el cliente..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-body text-white focus:outline-none resize-none"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsManualModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white text-xs font-mono"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#145BFF] hover:bg-[#3B7BFF] text-white text-xs font-mono font-bold shadow-[0_0_15px_rgba(20,91,255,0.4)]"
                  >
                    Guardar Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
