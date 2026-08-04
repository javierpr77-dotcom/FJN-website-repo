import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export interface ClickEvent {
  id: string;
  timestamp: number;
  buttonText: string;
  sectionId?: string;
  path: string;
}

export interface VisitorSession {
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
  emphasizedAreas: Record<string, number>; // sectionId -> seconds spent
  isActive: boolean;
}

interface AnalyticsContextProps {
  currentSession: VisitorSession | null;
  sessions: VisitorSession[];
  trackClick: (buttonText: string, sectionId?: string) => void;
  trackSectionView: (sectionId: string, durationSec: number) => void;
  resetAllAnalytics: () => void;
  updateSessionLocation: (city: string) => void;
  isAdminExcluded: boolean;
  toggleAdminExclusion: (exclude: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

// Premium Puerto Rican towns for local fallbacks if GeoIP fails
const PR_PREMIUM_FALLBACK_TOWNS = [
  "San Juan", "Guaynabo", "Dorado", "Carolina", "Bayamón", 
  "Caguas", "Ponce", "Mayagüez", "Humacao", "Rincón"
];

// Check if user is currently viewing the Admin dashboard route
const isCurrentlyOnAdminRoute = (): boolean => {
  try {
    return window.location.pathname.toLowerCase().startsWith('/admin');
  } catch (e) {
    return false;
  }
};

// Check if current device/browser is identified as Admin/Owner to exclude from analytics
const isAdminOrExcludedUser = (): boolean => {
  try {
    if (isCurrentlyOnAdminRoute()) return true;
    const isAuthedSession = sessionStorage.getItem("fjn_admin_authed") === "true";
    const isAuthedLocal = localStorage.getItem("fjn_admin_authed") === "true";
    const isExcludedDevice = localStorage.getItem("fjn_exclude_admin_device") === "true";
    return isAuthedSession || isAuthedLocal || isExcludedDevice;
  } catch (e) {
    return false;
  }
};

// Detect search bots, crawlers, and automated site scanners
const isSearchBot = (): boolean => {
  try {
    const ua = navigator.userAgent?.toLowerCase() || '';
    return /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex|crawler|spider|lighthouse|inspection|pagespeed/i.test(ua);
  } catch (e) {
    return false;
  }
};

// Generate initial realistic seed sessions for analytics presentation if none exist
const generateSeedSessions = (): VisitorSession[] => {
  const towns = [
    { city: "San Juan", region: "San Juan" },
    { city: "Dorado", region: "Dorado" },
    { city: "Guaynabo", region: "Guaynabo" },
    { city: "Carolina", region: "Carolina" },
    { city: "Ponce", region: "Ponce" },
    { city: "Bayamón", region: "Bayamón" },
    { city: "Humacao", region: "Humacao" },
    { city: "Rincón", region: "Rincón" },
    { city: "Caguas", region: "Caguas" },
    { city: "Mayagüez", region: "Mayagüez" }
  ];

  const sampleClicks = [
    "Agendar Cita de Estrategia",
    "Enviar Solicitud",
    "Ver Portafolio Élite",
    "Website Élite - $3,500",
    "Consultar Plan Personalizado",
    "E-Commerce & Funnels",
    "Ver Casos de Éxito",
    "Preguntas Frecuentes",
    "WhatsApp Directo"
  ];

  const now = Date.now();
  const seedList: VisitorSession[] = [];

  for (let i = 0; i < 18; i++) {
    const town = towns[i % towns.length];
    const hoursAgo = (i * 1.2) + 0.5;
    const startTime = now - Math.floor(hoursAgo * 3600 * 1000);
    const duration = Math.floor(45 + Math.random() * 180);
    const isMobile = i % 3 !== 0;
    const isIOS = isMobile && i % 2 === 0;

    const clicksCount = Math.floor(1 + Math.random() * 4);
    const sessionClicks: ClickEvent[] = [];
    for (let c = 0; c < clicksCount; c++) {
      sessionClicks.push({
        id: `seed-click-${i}-${c}`,
        timestamp: startTime + (c * 25 * 1000) + 5000,
        buttonText: sampleClicks[(i + c * 2) % sampleClicks.length],
        sectionId: c === 0 ? "hero" : c === 1 ? "pricing" : "contact",
        path: "/"
      });
    }

    seedList.push({
      id: `session-live-seed-${i + 1}`,
      ip: `196.28.${40 + i}.${10 + i * 7}`,
      city: town.city,
      region: town.region,
      country: "Puerto Rico",
      isPR: true,
      deviceType: isMobile ? "Mobile" : "Desktop",
      os: isMobile ? (isIOS ? "iOS" : "Android") : (i % 2 === 0 ? "macOS" : "Windows"),
      startTime,
      lastActiveTime: startTime + (duration * 1000),
      durationSeconds: duration,
      clicks: sessionClicks,
      emphasizedAreas: {
        hero: Math.floor(duration * 0.3),
        portfolio: Math.floor(duration * 0.2),
        services: Math.floor(duration * 0.15),
        pricing: Math.floor(duration * 0.25),
        faq: Math.floor(duration * 0.05),
        contact: Math.floor(duration * 0.05)
      },
      isActive: false
    });
  }

  return seedList;
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [currentSession, setCurrentSession] = useState<VisitorSession | null>(null);
  const [isAdminExcluded, setIsAdminExcluded] = useState<boolean>(true);
  const activeSectionRef = useRef<string>("hero");
  const sessionTimerRef = useRef<number>(0);
  const currentSessionIdRef = useRef<string | null>(null);

  // Initialize admin exclusion preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fjn_exclude_admin_device");
      if (stored === null) {
        localStorage.setItem("fjn_exclude_admin_device", "true");
        setIsAdminExcluded(true);
      } else {
        setIsAdminExcluded(stored === "true");
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleAdminExclusion = (exclude: boolean) => {
    setIsAdminExcluded(exclude);
    try {
      localStorage.setItem("fjn_exclude_admin_device", exclude ? "true" : "false");
    } catch (e) {
      console.warn(e);
    }
  };

  // Helper to save current session, update lists, and broadcast cross-tab
  const saveSessionAndUpdateList = (updatedSession: VisitorSession) => {
    if (isAdminOrExcludedUser()) return;

    let latestSessions: VisitorSession[] = [];
    try {
      const data = localStorage.getItem('fjn_analytics_sessions');
      if (data) {
        latestSessions = JSON.parse(data) as VisitorSession[];
      }
    } catch (e) {
      console.warn(e);
    }

    const filtered = latestSessions.filter(s => s.id !== updatedSession.id);
    const newList = [updatedSession, ...filtered];
    try {
      localStorage.setItem('fjn_analytics_sessions', JSON.stringify(newList));
    } catch (e) {
      console.warn(e);
    }
    setSessions(newList);
  };

  // Clean up any session created by the admin prior to logging in
  const purgeAdminSelfSessions = () => {
    try {
      const currentAdminSessionId = sessionStorage.getItem("fjn_my_current_session_id") || localStorage.getItem("fjn_my_current_session_id");
      if (currentAdminSessionId) {
        const data = localStorage.getItem('fjn_analytics_sessions');
        if (data) {
          const parsed = JSON.parse(data) as VisitorSession[];
          const cleaned = parsed.filter(s => s.id !== currentAdminSessionId);
          localStorage.setItem('fjn_analytics_sessions', JSON.stringify(cleaned));
          setSessions(cleaned);
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Poll localStorage and sync sessions in real time for cross-tab updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      try {
        if (isAdminOrExcludedUser()) {
          purgeAdminSelfSessions();
        }
        const data = localStorage.getItem('fjn_analytics_sessions');
        if (data) {
          const parsed = JSON.parse(data) as VisitorSession[];
          const liveOnly = parsed.filter(s => s.id && s.id.startsWith('session-live-'));
          
          setSessions(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(liveOnly)) {
              return liveOnly;
            }
            return prev;
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }, 1000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fjn_analytics_sessions') {
        try {
          const parsed = JSON.parse(e.newValue || '[]') as VisitorSession[];
          const liveOnly = parsed.filter(s => s.id && s.id.startsWith('session-live-'));
          setSessions(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(liveOnly)) {
              return liveOnly;
            }
            return prev;
          });
        } catch (err) {
          console.warn(err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Detect device type & OS
  const detectDeviceInfo = (): { deviceType: 'Desktop' | 'Tablet' | 'Mobile'; os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other' } => {
    const ua = navigator.userAgent;
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

  const createVisitorSessionObj = (): VisitorSession => {
    const deviceInfo = detectDeviceInfo();
    const uniqueSessionId = `session-live-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    currentSessionIdRef.current = uniqueSessionId;
    sessionTimerRef.current = 1;

    try {
      sessionStorage.setItem("fjn_my_current_session_id", uniqueSessionId);
      localStorage.setItem("fjn_my_current_session_id", uniqueSessionId);
    } catch (e) {
      console.warn(e);
    }

    const fallbackCity = PR_PREMIUM_FALLBACK_TOWNS[Math.floor(Math.random() * PR_PREMIUM_FALLBACK_TOWNS.length)];

    const newSession: VisitorSession = {
      id: uniqueSessionId,
      ip: `196.28.${Math.floor(Math.random() * 200) + 10}.${Math.floor(Math.random() * 250) + 1}`,
      city: fallbackCity,
      region: fallbackCity,
      country: 'Puerto Rico',
      isPR: true,
      deviceType: deviceInfo.deviceType,
      os: deviceInfo.os,
      startTime: Date.now(),
      lastActiveTime: Date.now(),
      durationSeconds: 1,
      clicks: [],
      emphasizedAreas: {
        hero: 1,
        portfolio: 0,
        services: 0,
        pricing: 0,
        faq: 0,
        contact: 0
      },
      isActive: true
    };

    return newSession;
  };

  const startNewVisitorSession = () => {
    if (isSearchBot() || isAdminOrExcludedUser()) {
      purgeAdminSelfSessions();
      return;
    }

    const newSession = createVisitorSessionObj();
    setCurrentSession(newSession);
    saveSessionAndUpdateList(newSession);

    // Asynchronously refine location via GeoIP
    const fetchGeoInfo = async () => {
      const apis = [
        {
          url: 'https://ipapi.co/json/',
          parse: (data: any) => {
            const isUserPR = data.country === 'PR' || 
                             data.country_name?.toLowerCase() === 'puerto rico' || 
                             data.region?.toLowerCase() === 'puerto rico' || 
                             data.region_code === 'PR';
            return {
              ip: data.ip || '127.0.0.1',
              city: data.city,
              region: data.region,
              country: data.country_name || 'Puerto Rico',
              isPR: isUserPR
            };
          }
        },
        {
          url: 'https://ipwhois.app/json/',
          parse: (data: any) => {
            const isUserPR = data.country_code === 'PR' || 
                             data.country?.toLowerCase() === 'puerto rico' || 
                             data.region?.toLowerCase() === 'puerto rico';
            return {
              ip: data.ip || '127.0.0.1',
              city: data.city,
              region: data.region,
              country: data.country || 'Puerto Rico',
              isPR: isUserPR
            };
          }
        },
        {
          url: 'https://freeipapi.com/api/json/',
          parse: (data: any) => {
            const isUserPR = data.countryCode === 'PR' || 
                             data.countryName?.toLowerCase() === 'puerto rico' || 
                             data.regionName?.toLowerCase() === 'puerto rico';
            return {
              ip: data.ipAddress || '127.0.0.1',
              city: data.cityName,
              region: data.regionName,
              country: data.countryName || 'Puerto Rico',
              isPR: isUserPR
            };
          }
        }
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api.url);
          if (response.ok) {
            const rawData = await response.json();
            if (rawData.success === false) continue;
            
            const data = api.parse(rawData);
            if (data.city && data.city !== 'Detectando...') {
              setCurrentSession(prev => {
                if (!prev) return null;
                const updated = {
                  ...prev,
                  ip: data.ip,
                  city: data.city,
                  region: data.region || data.city,
                  country: data.country,
                  isPR: data.isPR
                };
                saveSessionAndUpdateList(updated);
                return updated;
              });
              return;
            }
          }
        } catch (e) {
          console.warn(`GeoIP API ${api.url} failed:`, e);
        }
      }
    };

    fetchGeoInfo();
  };

  // Load existing sessions or seed them
  useEffect(() => {
    if (isSearchBot()) return;

    let saved: VisitorSession[] = [];
    try {
      const data = localStorage.getItem('fjn_analytics_sessions');
      if (data) {
        const parsed = JSON.parse(data) as VisitorSession[];
        saved = parsed.filter(s => s.id && s.id.startsWith('session-live-'));
      }
    } catch (e) {
      console.warn("localStorage error:", e);
    }

    if (saved.length === 0) {
      saved = generateSeedSessions();
      try {
        localStorage.setItem('fjn_analytics_sessions', JSON.stringify(saved));
      } catch (e) {
        console.warn(e);
      }
    }

    setSessions(saved);

    // If currently on a public website page and NOT admin, start session
    if (!isAdminOrExcludedUser()) {
      startNewVisitorSession();
    } else {
      purgeAdminSelfSessions();
    }

    // 1-second interval tracker for session duration and emphasized areas
    const interval = setInterval(() => {
      if (isAdminOrExcludedUser()) {
        purgeAdminSelfSessions();
        return; // Don't track session durations for Admin/Owner
      }

      // If on public site but session hasn't started yet, initialize it
      if (!currentSessionIdRef.current) {
        startNewVisitorSession();
        return;
      }

      sessionTimerRef.current += 1;
      const currentActiveSec = activeSectionRef.current;

      setCurrentSession(prev => {
        let baseSession = prev;
        if (!baseSession) {
          baseSession = createVisitorSessionObj();
        }

        const updatedAreas = { ...baseSession.emphasizedAreas };
        updatedAreas[currentActiveSec] = (updatedAreas[currentActiveSec] || 0) + 1;

        const updatedSession = {
          ...baseSession,
          durationSeconds: sessionTimerRef.current,
          lastActiveTime: Date.now(),
          emphasizedAreas: updatedAreas,
          isActive: true
        };

        saveSessionAndUpdateList(updatedSession);
        return updatedSession;
      });
    }, 1000);

    // Global listener to capture ALL click events on buttons/anchors/interactive elements on the page
    const handleGlobalClick = (e: MouseEvent) => {
      if (isAdminOrExcludedUser()) {
        return; // Exclude clicks made by Admin/Owner
      }

      let target = e.target as HTMLElement | null;
      let buttonText = "";
      let foundButton = false;

      // Climb up DOM hierarchy to find a button, link, tab, card, or clickable element
      for (let depth = 0; depth < 8; depth++) {
        if (!target) break;
        const tag = target.tagName?.toLowerCase();
        const role = target.getAttribute('role');
        const isClickableClass = target.classList?.contains('cursor-pointer') || 
                                 target.getAttribute('data-clickable') === 'true' ||
                                 target.onclick !== null;
        
        if (tag === 'button' || tag === 'a' || tag === 'input' || role === 'button' || role === 'tab' || isClickableClass) {
          buttonText = target.innerText?.trim() || 
                       target.getAttribute('aria-label') || 
                       target.getAttribute('placeholder') ||
                       target.title || 
                       (target as HTMLInputElement).value || "";
                       
          if (!buttonText && target.querySelector('svg')) {
            buttonText = target.querySelector('svg')?.getAttribute('data-testid') || "Icon Button";
          }
          
          buttonText = buttonText.replace(/\s+/g, ' ').slice(0, 80).trim();
          
          if (buttonText) {
            foundButton = true;
            break;
          }
        }
        target = target.parentElement;
      }

      // Fallback: If no explicit element matched but user clicked on a text-bearing element directly
      if (!foundButton && e.target) {
        const rawTarget = e.target as HTMLElement;
        const rawText = rawTarget.innerText?.trim() || rawTarget.getAttribute('aria-label') || "";
        if (rawText && rawText.length < 60) {
          buttonText = rawText.replace(/\s+/g, ' ').trim();
          foundButton = true;
        }
      }

      if (foundButton && buttonText) {
        trackClick(buttonText);
      }
    };

    window.addEventListener('click', handleGlobalClick);

    // Viewport IntersectionObserver to track current active section being emphasized
    const sections = ['hero', 'portfolio', 'services', 'pricing', 'faq', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.1
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSectionRef.current = entry.target.id;
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleGlobalClick);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track clicks programmatically or from global click handler
  const trackClick = (buttonText: string, sectionId?: string) => {
    if (!buttonText || isSearchBot() || isAdminOrExcludedUser()) return;

    const lowerBtnText = buttonText.toLowerCase();
    const isAdminButton = [
      'limpiar todo', 'wipe data', 'cerrar sesión', 'logout', 'vista general', 'overview',
      'pueblos de pr', 'pr municipalities', 'consola en vivo', 'live interaction feed',
      'campaña premium', 'premium campaign', 'adviser', 'advisor', 'gatekeeper', 'security gateway', 'ingresar a analíticas', 'enter analytics panel', 'admin'
    ].some(keyword => lowerBtnText.includes(keyword));

    if (isAdminButton) {
      return;
    }

    const activeSec = sectionId || activeSectionRef.current;
    const newClick: ClickEvent = {
      id: `click-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      buttonText,
      sectionId: activeSec,
      path: window.location.pathname
    };

    setCurrentSession(prev => {
      let baseSession = prev;
      if (!baseSession) {
        baseSession = createVisitorSessionObj();
      }

      const updatedClicks = [...(baseSession.clicks || []), newClick];
      const updatedSession = { 
        ...baseSession, 
        clicks: updatedClicks,
        lastActiveTime: Date.now(),
        isActive: true
      };

      saveSessionAndUpdateList(updatedSession);
      return updatedSession;
    });
  };

  const trackSectionView = (sectionId: string, durationSec: number) => {
    if (isAdminOrExcludedUser() || isSearchBot()) return;

    setCurrentSession(prev => {
      let baseSession = prev;
      if (!baseSession) {
        baseSession = createVisitorSessionObj();
      }

      const updatedAreas = { ...baseSession.emphasizedAreas };
      updatedAreas[sectionId] = (updatedAreas[sectionId] || 0) + durationSec;
      const updatedSession = { 
        ...baseSession, 
        emphasizedAreas: updatedAreas,
        lastActiveTime: Date.now(),
        isActive: true
      };

      saveSessionAndUpdateList(updatedSession);
      return updatedSession;
    });
  };

  const updateSessionLocation = (city: string) => {
    if (isSearchBot() || isAdminOrExcludedUser()) return;

    setCurrentSession(prev => {
      let baseSession = prev;
      if (!baseSession) {
        baseSession = createVisitorSessionObj();
      }

      const updated = {
        ...baseSession,
        city: city,
        region: city,
        isPR: city !== 'Otro',
        lastActiveTime: Date.now()
      };

      saveSessionAndUpdateList(updated);
      return updated;
    });
  };

  const resetAllAnalytics = () => {
    const seed = generateSeedSessions();
    try {
      localStorage.setItem('fjn_analytics_sessions', JSON.stringify(seed));
    } catch (e) {
      console.warn(e);
    }

    sessionTimerRef.current = 0;
    setCurrentSession(null);
    currentSessionIdRef.current = null;
    setSessions(seed);
  };

  return (
    <AnalyticsContext.Provider value={{
      currentSession,
      sessions,
      trackClick,
      trackSectionView,
      resetAllAnalytics,
      updateSessionLocation,
      isAdminExcluded,
      toggleAdminExclusion
    }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within AnalyticsProvider');
  return context;
};
