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

const STORAGE_KEY = 'fjn_leads_store_real_v4';

export class LeadsManager {
  // Pure real leads only - zero dummy data
  static getLeads(): LeadItem[] {
    try {
      // Clean legacy dummy stores if present
      localStorage.removeItem('fjn_leads_store');
      
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any remnant seed leads with dummy IDs or names
        return parsed.filter(l => 
          l && 
          l.id && 
          !l.id.startsWith('lead-seed') &&
          !l.name?.toLowerCase().includes('carlos rivera - médico') &&
          !l.name?.toLowerCase().includes('mariana ortiz')
        );
      }
      return [];
    } catch (e) {
      console.warn("Error reading leads store from localStorage", e);
      return [];
    }
  }

  // Fetch real leads from central server
  static async fetchLeadsFromServer(): Promise<LeadItem[]> {
    try {
      const endpoints = ['/api/leads', '/.netlify/functions/leads'];
      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint, {
            headers: { 'Cache-Control': 'no-cache' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.leads)) {
              const serverLeads: LeadItem[] = data.leads.filter((l: any) => 
                l && 
                l.id && 
                !l.id.startsWith('lead-seed') &&
                !l.name?.toLowerCase().includes('carlos rivera - médico') &&
                !l.name?.toLowerCase().includes('mariana ortiz')
              );

              // Merge with any offline local leads
              const localLeads = this.getLeads();
              const mergedMap = new Map<string, LeadItem>();
              
              // Server leads take priority
              serverLeads.forEach(l => mergedMap.set(l.id, l));
              // Add local leads if not in server yet
              localLeads.forEach(l => {
                if (!mergedMap.has(l.id)) {
                  mergedMap.set(l.id, l);
                  // Push to server in background
                  this.syncLeadToServer(l);
                }
              });

              const merged = Array.from(mergedMap.values()).sort((a, b) => b.createdAt - a.createdAt);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: merged }));
              return merged;
            }
          }
        } catch (e) {
          // Try next endpoint
        }
      }
    } catch (err) {
      console.warn("Failed to fetch leads from server:", err);
    }
    return this.getLeads();
  }

  private static async syncLeadToServer(lead: LeadItem) {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
    } catch {
      // Ignore background sync errors
    }
  }

  static saveLead(leadData: Omit<LeadItem, 'id' | 'createdAt' | 'status'> & { status?: LeadItem['status'] }): LeadItem {
    const existing = this.getLeads();
    const newLead: LeadItem = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      status: leadData.status || 'new',
    };

    const updated = [newLead, ...existing];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('fjn_lead_added', { detail: newLead }));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: updated }));
    } catch (e) {
      console.error("Error saving lead to localStorage", e);
    }

    // Persist to central server immediately
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(err => {
      console.warn("Could not save lead to /api/leads, trying fallback...", err);
      fetch('/.netlify/functions/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead)
      }).catch(e => console.error("Central lead sync failed:", e));
    });

    return newLead;
  }

  static updateLeadStatus(id: string, status: LeadItem['status']): boolean {
    const existing = this.getLeads();
    const index = existing.findIndex(l => l.id === id);
    if (index === -1) return false;

    existing[index].status = status;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: existing }));
    } catch (e) {
      console.error("Error updating lead status", e);
      return false;
    }

    // Sync status with server
    fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(e => console.warn("Could not update lead status on server:", e));

    return true;
  }

  static updateLeadNotes(id: string, notes: string): boolean {
    const existing = this.getLeads();
    const index = existing.findIndex(l => l.id === id);
    if (index === -1) return false;

    existing[index].notes = notes;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: existing }));
    } catch (e) {
      console.error("Error updating lead notes", e);
      return false;
    }

    fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    }).catch(e => console.warn("Could not update lead notes on server:", e));

    return true;
  }

  static deleteLead(id: string): boolean {
    const existing = this.getLeads();
    const filtered = existing.filter(l => l.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: filtered }));
    } catch (e) {
      console.error("Error deleting lead", e);
      return false;
    }

    fetch(`/api/leads/${id}`, {
      method: 'DELETE'
    }).catch(e => console.warn("Could not delete lead on server:", e));

    return true;
  }

  static clearAllLeads(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('fjn_leads_store');
      window.dispatchEvent(new CustomEvent('fjn_leads_updated', { detail: [] }));
    } catch (e) {
      console.error("Error clearing leads", e);
    }

    fetch('/api/leads/clear', {
      method: 'POST'
    }).catch(e => console.warn("Could not clear leads on server:", e));
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
