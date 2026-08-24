export interface LeadItem {
  id: string;
  type: 'consultation' | 'plan_order';
  createdAt: number;
  name: string;
  phone: string;
  email: string;
  goal?: string;
  town?: string;
  date?: string;
  time?: string;
  plan?: string;
  addons?: string;
  total?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'closed' | 'archived';
  notes?: string;
  source?: string;
}

const STORAGE_KEY = 'fjn_leads_store';

// Seed sample leads for immediate verification if empty
const INITIAL_SEED_LEADS: LeadItem[] = [
  {
    id: 'lead-seed-1',
    type: 'consultation',
    createdAt: Date.now() - (1000 * 60 * 45), // 45 mins ago
    name: 'Carlos Rivera - Médico Especialista',
    phone: '+1 787 555 3829',
    email: 'carlos.rivera@clinicapr.com',
    goal: 'Necesito un sistema de reservas y citas automatizadas para mi clínica en Guaynabo y optimizar el posicionamiento local.',
    town: 'Guaynabo',
    date: 'Mañana',
    time: '02:30 PM',
    status: 'new',
    source: 'Formulario de Asesoría Web'
  },
  {
    id: 'lead-seed-2',
    type: 'plan_order',
    createdAt: Date.now() - (1000 * 60 * 180), // 3 hours ago
    name: 'Mariana Ortiz - Boutique & Resort',
    phone: '+1 787 444 8921',
    email: 'mariana@villasdorado.com',
    goal: 'Solicitud para desarrollo de plataforma de alojamiento y reservas directas tipo Airbnb.',
    town: 'Dorado',
    plan: 'Alojamiento Elegance (tipo Airbnb)',
    addons: 'Booking personalizado, Sincronización iCal, Pasarela de cobro directa (Stripe / ATH Móvil)',
    total: '$5,750 USD',
    status: 'contacted',
    notes: 'Contactada por WhatsApp. En espera de llamada de seguimiento.',
    source: 'Cotizador de Planes'
  }
];

export class LeadsManager {
  static getLeads(): LeadItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_LEADS));
        return INITIAL_SEED_LEADS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return INITIAL_SEED_LEADS;
    } catch (e) {
      console.warn("Error reading leads store from localStorage", e);
      return INITIAL_SEED_LEADS;
    }
  }

  static saveLead(leadData: Omit<LeadItem, 'id' | 'createdAt' | 'status'> & { status?: LeadItem['status'] }): LeadItem {
    const existing = this.getLeads();
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
      status: leadData.status || 'new',
    };

    const updated = [newLead, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('fjn_lead_added', { detail: newLead }));
    } catch (e) {
      console.error("Error saving lead to localStorage", e);
    }
    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadItem['status']): boolean {
    const existing = this.getLeads();
    const index = existing.findIndex(l => l.id === id);
    if (index === -1) return false;

    existing[index].status = status;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated'));
      return true;
    } catch (e) {
      console.error("Error updating lead status", e);
      return false;
    }
  }

  static updateLeadNotes(id: string, notes: string): boolean {
    const existing = this.getLeads();
    const index = existing.findIndex(l => l.id === id);
    if (index === -1) return false;

    existing[index].notes = notes;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated'));
      return true;
    } catch (e) {
      console.error("Error updating lead notes", e);
      return false;
    }
  }

  static deleteLead(id: string): boolean {
    const existing = this.getLeads();
    const filtered = existing.filter(l => l.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated'));
      return true;
    } catch (e) {
      console.error("Error deleting lead", e);
      return false;
    }
  }

  static clearAllLeads(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('fjn_leads_updated'));
    } catch (e) {
      console.error("Error clearing leads", e);
    }
  }

  static exportToCSV(): void {
    const leads = this.getLeads();
    if (leads.length === 0) return;

    const headers = ['ID', 'Fecha', 'Tipo', 'Nombre', 'Teléfono', 'Email', 'Pueblo', 'Plan', 'Total', 'Fecha/Hora Deseada', 'Objetivo / Mensaje', 'Estado', 'Notas'];
    const rows = leads.map(l => [
      l.id,
      new Date(l.createdAt).toLocaleString('es-PR'),
      l.type === 'consultation' ? 'Asesoría' : 'Orden de Plan',
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.town || ''}"`,
      `"${l.plan || ''}"`,
      `"${l.total || ''}"`,
      `"${(l.date || '')} ${(l.time || '')}"`.trim(),
      `"${(l.goal || '').replace(/"/g, '""')}"`,
      l.status,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fjn_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
