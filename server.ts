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

// Storage setup
const DATA_DIR = path.join(process.cwd(), "data");
const SESSIONS_FILE = path.join(DATA_DIR, "analytics_sessions.json");

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

function loadSessionsFromDisk() {
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, "utf-8");
      storedSessions = JSON.parse(raw);
      if (!Array.isArray(storedSessions)) {
        storedSessions = [];
      }
    }
  } catch (err) {
    console.warn("Failed to load sessions from disk:", err);
    storedSessions = [];
  }
}

let saveTimeout: NodeJS.Timeout | null = null;
function persistSessionsToDisk() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      ensureDataDir();
      fs.writeFileSync(SESSIONS_FILE, JSON.stringify(storedSessions.slice(0, 1000), null, 2), "utf-8");
    } catch (err) {
      console.warn("Failed to save sessions to disk:", err);
    }
  }, 500);
}

loadSessionsFromDisk();

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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 FJN Server running on http://localhost:${PORT}`);
  });
}

startServer();
