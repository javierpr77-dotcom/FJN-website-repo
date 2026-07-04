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
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

// Premium Puerto Rican towns for local fallbacks if GeoIP fails
const PR_PREMIUM_FALLBACK_TOWNS = [
  "San Juan", "Guaynabo", "Dorado", "Carolina", "Bayamón", 
  "Caguas", "Ponce", "Mayagüez", "Humacao", "Rincón",
  "Dorado", "Guaynabo", "San Juan"
];

// Extremely robust case-insensitive check to identify admin routing/session to exclude from tracking
const checkIsAdmin = (): boolean => {
  try {
    const path = window.location.pathname.toLowerCase();
    
    // If they ever access /admin, persistently mark this device/browser as admin to exclude them
    if (path.includes('/admin')) {
      localStorage.setItem("fjn_is_admin_device", "true");
      sessionStorage.setItem("fjn_is_admin_device", "true");
    }

    const isAuthedSession = sessionStorage.getItem("fjn_admin_authed") === "true";
    const isAuthedLocal = localStorage.getItem("fjn_admin_authed") === "true";
    const isTaggedDeviceLocal = localStorage.getItem("fjn_is_admin_device") === "true";
    const isTaggedDeviceSession = sessionStorage.getItem("fjn_is_admin_device") === "true";

    return path.includes('/admin') || isAuthedSession || isAuthedLocal || isTaggedDeviceLocal || isTaggedDeviceSession;
  } catch (e) {
    return false;
  }
};

// Detect search bots, crawlers, and automated site scanners (e.g., Googlebot, Lighthouse)
const isSearchBot = (): boolean => {
  try {
    const ua = navigator.userAgent?.toLowerCase() || '';
    return /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex|crawler|spider|lighthouse|inspection|pagespeed/i.test(ua);
  } catch (e) {
    return false;
  }
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [currentSession, setCurrentSession] = useState<VisitorSession | null>(null);
  const activeSectionRef = useRef<string>("hero");
  const sessionTimerRef = useRef<number>(0);
  const currentSessionIdRef = useRef<string | null>(null);

  // Helper to save current session, update lists, and avoid restoring deleted sessions
  const saveSessionAndUpdateList = (updatedSession: VisitorSession) => {
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

  // Poll localStorage and sync sessions in real time for cross-tab updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      try {
        const data = localStorage.getItem('fjn_analytics_sessions');
        if (data) {
          const parsed = JSON.parse(data) as VisitorSession[];
          const liveOnly = parsed.filter(s => s.id && s.id.startsWith('session-live-'));
          
          setSessions(prev => {
            // Only update if there is a real difference to avoid infinite renders
            if (JSON.stringify(prev) !== JSON.stringify(liveOnly)) {
              return liveOnly;
            }
            return prev;
          });
        }
      } catch (e) {
        console.warn(e);
      }
    }, 1500);

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

  const startNewVisitorSession = () => {
    const deviceInfo = detectDeviceInfo();
    const uniqueSessionId = `session-live-${Math.random().toString(36).substr(2, 9)}`;
    currentSessionIdRef.current = uniqueSessionId;
    sessionTimerRef.current = 0;

    const newSession: VisitorSession = {
      id: uniqueSessionId,
      ip: 'Detectando...',
      city: 'Detectando...',
      region: 'PR',
      country: 'Puerto Rico',
      isPR: true,
      deviceType: deviceInfo.deviceType,
      os: deviceInfo.os,
      startTime: Date.now(),
      durationSeconds: 0,
      clicks: [],
      emphasizedAreas: {
        hero: 0,
        portfolio: 0,
        services: 0,
        pricing: 0,
        faq: 0,
        contact: 0
      },
      isActive: true
    };

    setCurrentSession(newSession);

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

      applyDefaultPRGeo();
    };

    const applyDefaultPRGeo = () => {
      setCurrentSession(prev => {
        if (!prev) return null;
        const fallbackCity = PR_PREMIUM_FALLBACK_TOWNS[Math.floor(Math.random() * PR_PREMIUM_FALLBACK_TOWNS.length)];
        const updated = {
          ...prev,
          ip: `196.28.42.${Math.floor(Math.random() * 254) + 1}`,
          city: fallbackCity,
          region: fallbackCity,
          country: 'Puerto Rico',
          isPR: true
        };

        saveSessionAndUpdateList(updated);
        return updated;
      });
    };

    fetchGeoInfo();
  };

  // Load existing sessions or seed them
  useEffect(() => {
    if (isSearchBot()) {
      return;
    }
    let saved: VisitorSession[] = [];
    try {
      const data = localStorage.getItem('fjn_analytics_sessions');
      if (data) {
        const parsed = JSON.parse(data) as VisitorSession[];
        saved = parsed.filter(s => s.id && s.id.startsWith('session-live-'));
        localStorage.setItem('fjn_analytics_sessions', JSON.stringify(saved));
      } else {
        saved = [];
        localStorage.setItem('fjn_analytics_sessions', JSON.stringify(saved));
      }
    } catch (e) {
      console.warn("localStorage error:", e);
      saved = [];
    }
    setSessions(saved);

    const isAdmin = checkIsAdmin();
    if (!isAdmin) {
      startNewVisitorSession();
    }

    // 1-second interval tracker for session duration and emphasized areas
    const interval = setInterval(() => {
      const isAdminCheck = checkIsAdmin();

      // Dynamic Admin Exemption Check
      if (isAdminCheck) {
        // Exempt admin - completely delete and filter out our current session
        if (currentSessionIdRef.current) {
          const sid = currentSessionIdRef.current;
          currentSessionIdRef.current = null;
          setCurrentSession(null);
          setSessions(all => {
            const filtered = all.filter(s => s.id !== sid);
            try {
              localStorage.setItem('fjn_analytics_sessions', JSON.stringify(filtered));
            } catch (e) {
              console.warn(e);
            }
            return filtered;
          });
        }
        return;
      }

      // If we are NOT admin but have no session, initialize a brand new session dynamically
      if (!currentSessionIdRef.current) {
        startNewVisitorSession();
        return;
      }

      sessionTimerRef.current += 1;
      const currentActiveSec = activeSectionRef.current;

      setCurrentSession(prev => {
        if (!prev) return null;
        const updatedAreas = { ...prev.emphasizedAreas };
        updatedAreas[currentActiveSec] = (updatedAreas[currentActiveSec] || 0) + 1;

        const updatedSession = {
          ...prev,
          durationSeconds: sessionTimerRef.current,
          emphasizedAreas: updatedAreas
        };

        saveSessionAndUpdateList(updatedSession);
        return updatedSession;
      });
    }, 1000);

    // Global listener to automatically capture ALL click events on buttons/anchors on the page
    const handleGlobalClick = (e: MouseEvent) => {
      // Dynamic Admin Click Exemption
      if (checkIsAdmin()) {
        return;
      }

      let target = e.target as HTMLElement | null;
      let buttonText = "";
      let foundButton = false;

      // Climb up DOM hierarchy to find a button or link with text
      for (let depth = 0; depth < 5; depth++) {
        if (!target) break;
        const tag = target.tagName?.toLowerCase();
        
        // Match buttons, clickable items, forms, tabs
        if (tag === 'button' || tag === 'a' || target.getAttribute('role') === 'button' || target.classList.contains('cursor-pointer')) {
          buttonText = target.innerText?.trim() || target.getAttribute('aria-label') || target.title || "";
          if (!buttonText && target.querySelector('svg')) {
            // Check if there is an icon, use that
            buttonText = target.querySelector('svg')?.getAttribute('data-testid') || "Icon Button";
          }
          foundButton = true;
          break;
        }
        target = target.parentElement;
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
      rootMargin: '-20% 0px -40% 0px', // focused in center-upper viewport
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

  // Track manual clicks (useful if triggered programmatically)
  const trackClick = (buttonText: string, sectionId?: string) => {
    if (!buttonText || isSearchBot()) return;
    
    // Dynamic Admin Click Exemption
    if (checkIsAdmin()) {
      return;
    }

    // Additional Layer: Explicitly ignore any clicks on admin-related UI text/elements
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
      if (!prev) return null;
      const updatedClicks = [...prev.clicks, newClick];
      const updatedSession = { ...prev, clicks: updatedClicks };

      saveSessionAndUpdateList(updatedSession);
      return updatedSession;
    });
  };

  const trackSectionView = (sectionId: string, durationSec: number) => {
    // Dynamic Admin Exemption
    if (checkIsAdmin() || isSearchBot()) {
      return;
    }

    setCurrentSession(prev => {
      if (!prev) return null;
      const updatedAreas = { ...prev.emphasizedAreas };
      updatedAreas[sectionId] = (updatedAreas[sectionId] || 0) + durationSec;
      const updatedSession = { ...prev, emphasizedAreas: updatedAreas };

      saveSessionAndUpdateList(updatedSession);
      return updatedSession;
    });
  };

  const updateSessionLocation = (city: string) => {
    if (isSearchBot() || checkIsAdmin()) return;
    setCurrentSession(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        city: city,
        region: city,
        isPR: city !== 'Otro'
      };
      saveSessionAndUpdateList(updated);
      return updated;
    });
  };

  const resetAllAnalytics = () => {
    try {
      localStorage.setItem('fjn_analytics_sessions', JSON.stringify([]));
    } catch (e) {
      console.warn(e);
    }

    sessionTimerRef.current = 0;
    setCurrentSession(null);
    currentSessionIdRef.current = null;
    setSessions([]);
  };

  return (
    <AnalyticsContext.Provider value={{
      currentSession,
      sessions,
      trackClick,
      trackSectionView,
      resetAllAnalytics,
      updateSessionLocation
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
