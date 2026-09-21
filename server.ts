import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import { createServer as createViteServer } from "vite";

interface ClickEvent {
  id: string;
  timestamp: number;
  buttonText: string;
  sectionId?: string;
  path: string;
}

interface VisitorSession {
  id: string;
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  isPR?: boolean;
  deviceType: 'Desktop' | 'Tablet' | 'Mobile';
  os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other';
  startTime: number;
  lastActiveTime?: number;
  durationSeconds: number;
  clicks: ClickEvent[];
  emphasizedAreas: Record<string, number>;
  isActive: boolean;
  screenWidth?: number;
  referrer?: string;
}

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
  deviceType?: 'Desktop' | 'Tablet' | 'Mobile';
  os?: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other';
}

// Storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "analytics_sessions.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn("Could not create data dir:", err);
    }
  }
}

let storedSessions: VisitorSession[] = [];
let storedLeads: LeadItem[] = [];

function loadFromDisk() {
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        storedSessions = parsed.filter(s => s && s.id && !String(s.id).startsWith('session-pr-organic') && !String(s.id).startsWith('seed-'));
      }
    }
    if (fs.existsSync(LEADS_FILE)) {
      const raw = fs.readFileSync(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        storedLeads = parsed.filter(l => l && l.id && !String(l.id).startsWith('seed-'));
      }
    }
  } catch (err) {
    console.warn("Failed to load data from disk:", err);
  }
}

let saveSessionTimeout: NodeJS.Timeout | null = null;
function persistSessionsToDisk() {
  if (saveSessionTimeout) clearTimeout(saveSessionTimeout);
  saveSessionTimeout = setTimeout(() => {
    try {
      ensureDataDir();
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(storedSessions.slice(0, 1000), null, 2), "utf-8");
    } catch (err) {
      console.warn("Failed to save sessions to disk:", err);
    }
  }, 300);
}

function persistLeadsToDisk() {
  try {
    ensureDataDir();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(storedLeads, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save leads to disk:", err);
  }
}

loadFromDisk();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  // Helper to extract clean IP address
  const extractClientIp = (req: express.Request): string => {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    const realIp = req.headers["x-real-ip"];
    if (typeof realIp === "string") {
      return realIp.trim();
    }
    return req.socket.remoteAddress || "127.0.0.1";
  };

  // Helper to parse device info from User-Agent
  const parseReqDevice = (req: express.Request): { deviceType: 'Desktop' | 'Tablet' | 'Mobile'; os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other' } => {
    const ua = req.headers["user-agent"] || "";
    let deviceType: 'Desktop' | 'Tablet' | 'Mobile' = 'Desktop';
    let os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other' = 'Other';

    if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
      if (/iPad|tablet/i.test(ua)) {
        deviceType = 'Tablet';
      } else {
        deviceType = 'Mobile';
      }
    }

    if (/iPhone|iPad|iPod/i.test(ua)) {
      os = 'iOS';
    } else if (/Android/i.test(ua)) {
      os = 'Android';
    } else if (/Windows/i.test(ua)) {
      os = 'Windows';
    } else if (/Macintosh|Mac Intel/i.test(ua)) {
      os = 'macOS';
    } else if (/Linux/i.test(ua)) {
      os = 'Linux';
    }

    return { deviceType, os };
  };

  // --- ANALYTICS API ENDPOINTS ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now(), totalSessions: storedSessions.length });
  });

  // Get all visitor sessions
  app.get("/api/analytics/sessions", (req, res) => {
    // Sort newest first
    const sorted = [...storedSessions].sort((a, b) => b.startTime - a.startTime);
    res.json({ success: true, sessions: sorted });
  });

  // Track or initialize a session
  app.post("/api/analytics/track", (req, res) => {
    try {
      const body = req.body || {};
      const clientIp = extractClientIp(req);
      const sessionId = body.id || `session-live-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const existingIndex = storedSessions.findIndex(s => s.id === sessionId);

      const sessionObj: VisitorSession = {
        id: sessionId,
        ip: body.ip || clientIp,
        city: body.city || "San Juan",
        region: body.region || body.city || "San Juan",
        country: body.country || "Puerto Rico",
        isPR: body.isPR !== undefined ? body.isPR : true,
        deviceType: body.deviceType || "Mobile",
        os: body.os || "iOS",
        startTime: Number(body.startTime) || Date.now(),
        lastActiveTime: Date.now(),
        durationSeconds: Number(body.durationSeconds) || 1,
        clicks: Array.isArray(body.clicks) ? body.clicks : [],
        emphasizedAreas: body.emphasizedAreas || { hero: 1 },
        isActive: true,
        screenWidth: body.screenWidth,
        referrer: body.referrer
      };

      if (existingIndex >= 0) {
        storedSessions[existingIndex] = {
          ...storedSessions[existingIndex],
          ...sessionObj,
          // Merge clicks
          clicks: body.clicks && body.clicks.length ? body.clicks : storedSessions[existingIndex].clicks,
          // Merge emphasized areas
          emphasizedAreas: { ...storedSessions[existingIndex].emphasizedAreas, ...sessionObj.emphasizedAreas }
        };
      } else {
        storedSessions.unshift(sessionObj);
      }

      // Cap stored sessions to prevent memory leaks
      if (storedSessions.length > 2000) {
        storedSessions = storedSessions.slice(0, 2000);
      }

      persistSessionsToDisk();
      res.json({ success: true, session: sessionObj });
    } catch (err: any) {
      console.error("Error tracking session:", err);
      res.status(500).json({ error: err.message || "Failed to record session" });
    }
  });

  // Session ping / keepalive / duration update
  app.post("/api/analytics/ping", (req, res) => {
    try {
      const { id, durationSeconds, activeSection, emphasizedAreas } = req.body || {};
      if (!id) {
        return res.status(400).json({ error: "Missing session ID" });
      }

      const session = storedSessions.find(s => s.id === id);
      if (session) {
        session.durationSeconds = Number(durationSeconds) || (session.durationSeconds + 1);
        session.lastActiveTime = Date.now();
        session.isActive = true;

        if (emphasizedAreas && typeof emphasizedAreas === "object") {
          session.emphasizedAreas = { ...session.emphasizedAreas, ...emphasizedAreas };
        } else if (activeSection) {
          session.emphasizedAreas[activeSection] = (session.emphasizedAreas[activeSection] || 0) + 1;
        }

        persistSessionsToDisk();
        return res.json({ success: true });
      } else {
        // If session didn't exist, create it from ping payload
        const clientIp = extractClientIp(req);
        const newSession: VisitorSession = {
          id,
          ip: clientIp,
          city: "San Juan",
          region: "San Juan",
          country: "Puerto Rico",
          isPR: true,
          deviceType: "Mobile",
          os: "iOS",
          startTime: Date.now() - ((Number(durationSeconds) || 1) * 1000),
          lastActiveTime: Date.now(),
          durationSeconds: Number(durationSeconds) || 1,
          clicks: [],
          emphasizedAreas: emphasizedAreas || { [activeSection || "hero"]: 1 },
          isActive: true
        };
        storedSessions.unshift(newSession);
        persistSessionsToDisk();
        return res.json({ success: true, created: true });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Record a button click
  app.post("/api/analytics/click", (req, res) => {
    try {
      const { sessionId, click } = req.body || {};
      if (!sessionId || !click) {
        return res.status(400).json({ error: "Missing sessionId or click data" });
      }

      let session = storedSessions.find(s => s.id === sessionId);
      if (!session) {
        const clientIp = extractClientIp(req);
        session = {
          id: sessionId,
          ip: clientIp,
          city: "San Juan",
          region: "San Juan",
          country: "Puerto Rico",
          isPR: true,
          deviceType: "Mobile",
          os: "iOS",
          startTime: Date.now() - 5000,
          lastActiveTime: Date.now(),
          durationSeconds: 5,
          clicks: [],
          emphasizedAreas: { hero: 5 },
          isActive: true
        };
        storedSessions.unshift(session);
      }

      session.clicks = session.clicks || [];
      const alreadyHasClick = session.clicks.some(c => c.id === click.id);
      if (!alreadyHasClick) {
        session.clicks.push(click);
      }
      session.lastActiveTime = Date.now();
      session.isActive = true;

      persistSessionsToDisk();
      res.json({ success: true, totalClicks: session.clicks.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Wipe / reset all analytics
  app.post("/api/analytics/clear", (req, res) => {
    storedSessions = [];
    persistSessionsToDisk();
    res.json({ success: true, message: "All analytics wiped clean" });
  });

  // --- LEADS & ORDERS API ENDPOINTS ---

  // Get all real leads
  app.get("/api/leads", (req, res) => {
    const sorted = [...storedLeads].sort((a, b) => b.createdAt - a.createdAt);
    res.json({ success: true, leads: sorted });
  });

  // Create a new lead or plan order
  app.post("/api/leads", (req, res) => {
    try {
      const data = req.body || {};
      if (!data.name || !data.phone) {
        return res.status(400).json({ error: "Name and phone are required" });
      }

      const clientDevice = parseReqDevice(req);

      const newLead: LeadItem = {
        id: data.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: data.type || (data.plan ? "plan_order" : "consultation"),
        createdAt: Number(data.createdAt) || Date.now(),
        name: String(data.name).trim(),
        phone: String(data.phone).trim(),
        email: String(data.email || "").trim(),
        goal: data.goal ? String(data.goal).trim() : undefined,
        town: data.town ? String(data.town).trim() : "Puerto Rico",
        date: data.date,
        time: data.time,
        plan: data.plan,
        addons: data.addons,
        total: data.total,
        status: data.status || "new",
        notes: data.notes,
        source: data.source || (data.plan ? "Cotizador de Planes" : "Formulario de Asesoría Web"),
        deviceType: data.deviceType || clientDevice.deviceType,
        os: data.os || clientDevice.os
      };

      // Check if already exists by id
      const existingIdx = storedLeads.findIndex(l => l.id === newLead.id);
      if (existingIdx >= 0) {
        storedLeads[existingIdx] = { ...storedLeads[existingIdx], ...newLead };
      } else {
        storedLeads.unshift(newLead);
      }

      persistLeadsToDisk();
      console.log(`[Lead Saved] New lead registered: ${newLead.name} (${newLead.plan || newLead.type})`);
      res.json({ success: true, lead: newLead });
    } catch (err: any) {
      console.error("Error saving lead:", err);
      res.status(500).json({ error: err.message || "Failed to save lead" });
    }
  });

  // Update a lead (status, notes)
  app.patch("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body || {};
      const lead = storedLeads.find(l => l.id === id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }

      if (status) lead.status = status;
      if (notes !== undefined) lead.notes = notes;

      persistLeadsToDisk();
      res.json({ success: true, lead });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a lead
  app.delete("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      storedLeads = storedLeads.filter(l => l.id !== id);
      persistLeadsToDisk();
      res.json({ success: true, message: "Lead deleted" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Clear all leads
  app.post("/api/leads/clear", (req, res) => {
    storedLeads = [];
    persistLeadsToDisk();
    res.json({ success: true, message: "All leads cleared" });
  });

  // --- RESEND EMAIL NOTIFICATIONS HANDLER ---
  // Serves both /.netlify/functions/send-email and /api/send-email for seamless cross-environment delivery
  const handleSendEmail = async (req: express.Request, res: express.Response) => {
    try {
      const data = req.body || {};
      const { name, phone, email, goal, town, date, time, plan, addons, total, action } = data;
      const resendApiKey = process.env.RESEND_API_KEY;

      const recipientEmails = (process.env.ADMIN_EMAIL || process.env.NOTIFICATION_EMAIL || "negociospr82@gmail.com, javierpr77@gmail.com")
        .split(",")
        .map(e => e.trim());

      const isDiagnosticTest = action === "test";
      const isPlanOrder = !!plan;

      // Automatically register lead into storedLeads if it's a real lead or plan order
      let savedLead: LeadItem | null = null;
      if (!isDiagnosticTest && (name || phone)) {
        const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const clientDevice = parseReqDevice(req);
        savedLead = {
          id: leadId,
          type: isPlanOrder ? "plan_order" : "consultation",
          createdAt: Date.now(),
          name: String(name || "Cliente").trim(),
          phone: String(phone || "").trim(),
          email: String(email || "").trim(),
          goal: goal ? String(goal).trim() : undefined,
          town: town || "Puerto Rico",
          date,
          time,
          plan,
          addons,
          total,
          status: "new",
          source: isPlanOrder ? "Cotizador de Planes" : "Formulario de Asesoría Web",
          deviceType: data.deviceType || clientDevice.deviceType,
          os: data.os || clientDevice.os
        };
        // Avoid duplicate if already tracked, but enrich deviceType and os if missing
        const existingLead = storedLeads.find(l => l.name === savedLead!.name && l.phone === savedLead!.phone && (Date.now() - l.createdAt < 60000));
        if (existingLead) {
          if (!existingLead.deviceType || !existingLead.os) {
            existingLead.deviceType = existingLead.deviceType || savedLead.deviceType;
            existingLead.os = existingLead.os || savedLead.os;
            persistLeadsToDisk();
          }
        } else {
          storedLeads.unshift(savedLead);
          persistLeadsToDisk();
          console.log(`[Auto-Lead Recorded via Email Handler] ${savedLead.name} - ${savedLead.plan || savedLead.type}`);
        }
      }

      if (!resendApiKey) {
        console.warn("[Resend Warning] RESEND_API_KEY is not defined in environment");
        return res.json({
          success: false,
          warning: "RESEND_API_KEY_MISSING",
          message: "Lead guardado en el servidor, pero falta RESEND_API_KEY.",
          lead: savedLead
        });
      }

      const subject = isDiagnosticTest
        ? `🧪 [TEST DIAGNÓSTICO] Verificación de Sistema FJN Digital - ${new Date().toLocaleTimeString()}`
        : isPlanOrder
          ? `🛍️ Solicitud de Plan: ${plan} - ${name || 'Cliente'}`
          : `⚡ Nuevo Lead / Asesoría: ${name || 'Cliente'} (${town || 'Puerto Rico'})`;

      const cleanPhone = (phone || "").replace(/[^0-9]/g, "");
      const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

      let emailHtml = "";
      if (isDiagnosticTest) {
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="color: #3b7bff; margin: 0; font-size: 22px;">🧪 Verificación de Envío Exitosa</h2>
              <p style="margin: 6px 0 0 0; color: #cfcfd4; font-size: 13px;">FJN Digital Media Logistics Control</p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; color: #1e293b; line-height: 1.5;">Este es un mensaje de prueba generado desde tu panel de <strong>FJN Digital Media</strong>.</p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin: 16px 0;">
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;"><strong>Destinatarios:</strong> ${recipientEmails.join(", ")}</p>
                <p style="margin: 0; font-size: 13px; color: #16a34a;"><strong>Estado:</strong> Conectividad con Resend 100% Operativa ✅</p>
              </div>
            </div>
          </div>
        `;
      } else if (isPlanOrder) {
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; box-shadow: 0 8px 30px rgba(20,91,255,0.12); background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="color: #3b7bff; margin: 0; font-size: 24px; padding-bottom: 8px;">🛍️ Solicitud de Plan Recibida</h2>
              <p style="margin: 0; color: #cfcfd4; font-size: 14px;">Has recibido una solicitud para el plan <strong>${plan}</strong></p>
            </div>
            <div style="padding: 24px 0;">
              <h3 style="color: #145bff; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; margin-top: 0; font-size: 16px;">Detalles del Prospecto</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 10px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Nombre:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Teléfono:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;"><a href="tel:${phone}" style="color: #145bff; text-decoration: none; font-weight: bold;">${phone}</a></td>
                </tr>
                ${email ? `
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Email:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;"><a href="mailto:${email}" style="color: #145bff; text-decoration: none;">${email}</a></td>
                </tr>` : ''}
                ${town ? `
                <tr>
                  <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-size: 14px;">Pueblo:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 14px;">${town}</td>
                </tr>` : ''}
              </table>
              <h3 style="color: #145bff; border-bottom: 2px solid #f3f4f6; padding-bottom: 6px; margin-top: 0; font-size: 16px;">Resumen de la Inversión</h3>
              <div style="background-color: #0d1220; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; color: white; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Plan Seleccionado:</td>
                    <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold; font-size: 15px;">${plan}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94a3b8; font-size: 14px;">Add-ons Opcionales:</td>
                    <td style="padding: 6px 0; text-align: right; color: #e2e8f0; font-size: 13px;">${addons || 'Ninguno'}</td>
                  </tr>
                  <tr style="border-top: 1px solid #334155;">
                    <td style="padding: 12px 0 0 0; color: #3b7bff; font-weight: bold; font-size: 16px;">Inversión Estimada:</td>
                    <td style="padding: 12px 0 0 0; text-align: right; color: #3b7bff; font-weight: bold; font-size: 20px;">${total || ''}</td>
                  </tr>
                </table>
              </div>
              ${waUrl ? `
              <div style="text-align: center; margin-top: 16px;">
                <a href="${waUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">💬 Chatear con el cliente por WhatsApp</a>
              </div>` : ''}
            </div>
          </div>
        `;
      } else {
        emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #145bff; border-radius: 16px; box-shadow: 0 8px 30px rgba(20,91,255,0.12); background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #0d1220 0%, #050507 100%); padding: 24px; text-align: center; border-radius: 12px 12px 0 0; color: white;">
              <h2 style="color: #3b7bff; margin: 0; font-size: 24px; padding-bottom: 8px;">⚡ Nuevo Lead / Asesoría</h2>
              <p style="margin: 0; color: #cfcfd4; font-size: 14px;">Has recibido una nueva solicitud de consulta estratégica</p>
            </div>
            <div style="padding: 24px 0;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; width: 140px; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Nombre:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px; font-weight: bold;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Teléfono:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="tel:${phone}" style="color: #145bff; text-decoration: none; font-weight: bold;">${phone}</a></td>
                </tr>
                ${email ? `
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Email:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;"><a href="mailto:${email}" style="color: #145bff; text-decoration: none;">${email}</a></td>
                </tr>` : ''}
                ${town ? `
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Pueblo:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${town}</td>
                </tr>` : ''}
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Objetivo / Proyecto:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${goal || 'No especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Fecha Deseada:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${date || 'No seleccionada'}</td>
                </tr>
                <tr style="background-color: #f9fafb;">
                  <td style="padding: 12px; font-weight: bold; border-bottom: 1px solid #e5e7eb; color: #4b5563;">Hora Deseada:</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #111827; font-size: 15px;">${time || 'No seleccionada'}</td>
                </tr>
              </table>
              ${waUrl ? `
              <div style="text-align: center; margin-top: 16px;">
                <a href="${waUrl}" style="background-color: #25D366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block; font-size: 14px;">💬 Contactar al cliente por WhatsApp</a>
              </div>` : ''}
            </div>
          </div>
        `;
      }

      // Send to recipient emails
      const results = [];
      for (const recipient of recipientEmails) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
              from: "FJN Digital Media <onboarding@resend.dev>",
              to: recipient,
              subject,
              html: emailHtml
            })
          });
          const resJson = await emailResponse.json();
          results.push({ recipient, ok: emailResponse.ok, data: resJson });
          if (emailResponse.ok) {
            console.log(`[Resend OK] Email delivered to ${recipient} (ID: ${resJson.id})`);
          } else {
            console.warn(`[Resend Error] Failed for ${recipient}:`, resJson);
          }
        } catch (sendErr: any) {
          console.error(`[Resend Exception] Error sending to ${recipient}:`, sendErr);
          results.push({ recipient, ok: false, error: sendErr.message });
        }
      }

      res.json({
        success: results.some(r => r.ok),
        results,
        lead: savedLead
      });
    } catch (err: any) {
      console.error("Error in handleSendEmail:", err);
      res.status(500).json({ error: err.message || "Failed to process email" });
    }
  };

  app.post("/.netlify/functions/send-email", handleSendEmail);
  app.post("/api/send-email", handleSendEmail);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FJN Server running on http://localhost:${PORT}`);
  });
}

startServer();
