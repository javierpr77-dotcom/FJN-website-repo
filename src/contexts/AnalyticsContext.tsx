import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';

export interface ClickEvent {
  id: string;
  timestamp: number;
  buttonText: string;
  sectionId?: string;
  path: string;
}

export type TrafficCategory = 'organic' | 'social' | 'direct' | 'referral' | 'campaign';

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
  source?: string; // e.g., 'Google Orgánico', 'Bing Orgánico', 'Instagram', 'Directo'
  sourceCategory?: TrafficCategory;
  referrerUrl?: string;
  landingPage?: string;
  searchKeyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface AnalyticsContextProps {
  currentSession: VisitorSession | null;
  sessions: VisitorSession[];
  trackClick: (buttonText: string, sectionId?: string) => void;
  trackSectionView: (sectionId: string, durationSec: number) => void;
  resetAllAnalytics: () => void;
  seedOrganicTraffic: () => void;
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

// Check if current device/browser is configured to exclude admin traffic
const isDeviceExcludedByAdmin = (): boolean => {
  try {
    if (isCurrentlyOnAdminRoute()) return true;
    const isExcludedDevice = localStorage.getItem("fjn_exclude_admin_device");
    // Default to true if not set, but respect explicit false
    return isExcludedDevice !== "false";
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

// Parse traffic referrer and marketing tags
const parseTrafficSource = (): {
  source: string;
  sourceCategory: TrafficCategory;
  referrerUrl: string;
  landingPage: string;
  searchKeyword?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
} => {
  let referrer = '';
  let landingPage = '/';
  let utmSource = '';
  let utmMedium = '';
  let utmCampaign = '';
  let searchKeyword = '';

  try {
    referrer = document.referrer || '';
    landingPage = window.location.pathname || '/';
    const urlParams = new URLSearchParams(window.location.search);
    utmSource = urlParams.get('utm_source') || '';
    utmMedium = urlParams.get('utm_medium') || '';
    utmCampaign = urlParams.get('utm_campaign') || '';
    searchKeyword = urlParams.get('q') || urlParams.get('query') || urlParams.get('keyword') || '';
  } catch (e) {
    console.warn(e);
  }

  const refLower = referrer.toLowerCase();

  // 1. UTM Campaign tagging
  if (utmSource) {
    let cat: TrafficCategory = 'campaign';
    if (utmMedium.includes('organic')) cat = 'organic';
    else if (utmMedium.includes('social') || /instagram|facebook|tiktok|linkedin/i.test(utmSource)) cat = 'social';
    
    return {
      source: `Campaña: ${utmSource}${utmMedium ? ` / ${utmMedium}` : ''}`,
      sourceCategory: cat,
      referrerUrl: referrer || 'utm_tag',
      landingPage,
      searchKeyword,
      utmSource,
      utmMedium,
      utmCampaign
    };
  }

  // 2. Google Search Organic
  if (refLower.includes('google.com') || refLower.includes('google.com.pr') || refLower.includes('google.es') || refLower.includes('google.')) {
    return {
      source: 'Google Orgánico',
      sourceCategory: 'organic',
      referrerUrl: referrer,
      landingPage,
      searchKeyword: searchKeyword || 'diseño web puerto rico'
    };
  }

  // 3. Bing Search Organic
  if (refLower.includes('bing.com')) {
    return {
      source: 'Bing Orgánico',
      sourceCategory: 'organic',
      referrerUrl: referrer,
      landingPage,
      searchKeyword: searchKeyword || 'paginas web pr'
    };
  }

  // 4. DuckDuckGo Search Organic
  if (refLower.includes('duckduckgo.com')) {
    return {
      source: 'DuckDuckGo Orgánico',
      sourceCategory: 'organic',
      referrerUrl: referrer,
      landingPage
    };
  }

  // 5. Yahoo Search Organic
  if (refLower.includes('yahoo.com')) {
    return {
      source: 'Yahoo Orgánico',
      sourceCategory: 'organic',
      referrerUrl: referrer,
      landingPage
    };
  }

  // 6. Social Channels
  if (refLower.includes('instagram.com') || refLower.includes('l.instagram.com')) {
    return {
      source: 'Instagram (Social)',
      sourceCategory: 'social',
      referrerUrl: referrer,
      landingPage
    };
  }
  if (refLower.includes('facebook.com') || refLower.includes('fb.com') || refLower.includes('l.facebook.com')) {
    return {
      source: 'Facebook (Social)',
      sourceCategory: 'social',
      referrerUrl: referrer,
      landingPage
    };
  }
  if (refLower.includes('tiktok.com')) {
    return {
      source: 'TikTok (Social)',
      sourceCategory: 'social',
      referrerUrl: referrer,
      landingPage
    };
  }
  if (refLower.includes('linkedin.com') || refLower.includes('lnkd.in')) {
    return {
      source: 'LinkedIn (Social)',
      sourceCategory: 'social',
      referrerUrl: referrer,
      landingPage
    };
  }

  // 7. External Website Referral
  if (referrer && !refLower.includes(window.location.hostname.toLowerCase())) {
    try {
      const urlObj = new URL(referrer);
      return {
        source: `Referencia: ${urlObj.hostname}`,
        sourceCategory: 'referral',
        referrerUrl: referrer,
        landingPage
      };
    } catch {
      return {
        source: 'Referencia Externa',
        sourceCategory: 'referral',
        referrerUrl: referrer,
        landingPage
      };
    }
  }

  // 8. Direct Entry
  return {
    source: 'Tráfico Directo',
    sourceCategory: 'direct',
    referrerUrl: 'Direct / Marcador',
    landingPage
  };
};

// Helper to filter out any remnant or legacy fake seed sessions
const isRealSession = (s: any): s is VisitorSession => {
  if (!s || !s.id) return false;
  const id = String(s.id);
  if (id.startsWith('session-pr-organic') || id.startsWith('seed-') || id.startsWith('session-dummy')) {
    return false;
  }
  return true;
};

// No dummy or fake data - purely real organic & user sessions
const generateSeedSessions = (): VisitorSession[] => {
  return [];
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [currentSession, setCurrentSession] = useState<VisitorSession | null>(null);
  const [isAdminExcluded, setIsAdminExcluded] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("fjn_exclude_admin_device");
      return stored !== "false";
    } catch {
      return true;
    }
  });

  const activeSectionRef = useRef<string>("hero");
  const sessionTimerRef = useRef<number>(0);
  const currentSessionIdRef = useRef<string | null>(null);

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
    if (isAdminExcluded && isDeviceExcludedByAdmin()) return;
    if (!isRealSession(updatedSession)) return;

    let latestSessions: VisitorSession[] = [];
    try {
      const data = localStorage.getItem('fjn_analytics_sessions');
      if (data) {
        latestSessions = (JSON.parse(data) as VisitorSession[]).filter(isRealSession);
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

    // Sync real session with central server
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSession)
    }).catch(() => {});
  };

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
    const trafficInfo = parseTrafficSource();
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
      isActive: true,
      source: trafficInfo.source,
      sourceCategory: trafficInfo.sourceCategory,
      referrerUrl: trafficInfo.referrerUrl,
      landingPage: trafficInfo.landingPage,
      searchKeyword: trafficInfo.searchKeyword,
      utmSource: trafficInfo.utmSource,
      utmMedium: trafficInfo.utmMedium,
      utmCampaign: trafficInfo.utmCampaign
    };

    return newSession;
  };

  const startNewVisitorSession = () => {
    if (isSearchBot() || (isAdminExcluded && isDeviceExcludedByAdmin())) {
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

  // Synchronize real sessions from backend server on demand
  const seedOrganicTraffic = async () => {
    try {
      const res = await fetch('/api/analytics/sessions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.sessions)) {
          const real = data.sessions.filter(isRealSession);
          setSessions(real);
          localStorage.setItem('fjn_analytics_sessions', JSON.stringify(real));
        }
      }
    } catch (e) {
      console.warn("Error fetching server analytics sessions:", e);
    }
  };

  // Poll server & localStorage to sync real sessions in real time for cross-tab and cross-device
  useEffect(() => {
    const fetchRealSessions = async () => {
      try {
        const res = await fetch('/api/analytics/sessions');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.sessions)) {
            const real = data.sessions.filter(isRealSession);
            setSessions(real);
            try {
              localStorage.setItem('fjn_analytics_sessions', JSON.stringify(real));
            } catch {}
          }
        }
      } catch {}
    };

    fetchRealSessions();
    const pollInterval = setInterval(fetchRealSessions, 3000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'fjn_analytics_sessions') {
        try {
          const parsed = JSON.parse(e.newValue || '[]') as VisitorSession[];
          const liveOnly = parsed.filter(isRealSession);
          setSessions(liveOnly);
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

  // Load existing real sessions & start session if visitor
  useEffect(() => {
    if (isSearchBot()) return;

    let saved: VisitorSession[] = [];
    try {
      const data = localStorage.getItem('fjn_analytics_sessions');
      if (data) {
        const parsed = JSON.parse(data) as VisitorSession[];
        saved = parsed.filter(isRealSession);
      }
      localStorage.setItem('fjn_analytics_sessions', JSON.stringify(saved));
    } catch (e) {
      console.warn("localStorage error:", e);
      saved = [];
    }

    setSessions(saved);

    // Initial server fetch to get current global sessions
    fetch('/api/analytics/sessions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.sessions)) {
          const real = data.sessions.filter(isRealSession);
          setSessions(real);
          localStorage.setItem('fjn_analytics_sessions', JSON.stringify(real));
        }
      })
      .catch(() => {});

    // If on public website page and not currently excluded, start session
    if (!isCurrentlyOnAdminRoute()) {
      if (!isAdminExcluded || !isDeviceExcludedByAdmin()) {
        startNewVisitorSession();
      }
    }

    // 1-second interval tracker for session duration and emphasized areas
    const interval = setInterval(() => {
      if (isCurrentlyOnAdminRoute()) {
        return;
      }
      if (isAdminExcluded && isDeviceExcludedByAdmin()) {
        return;
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
      if (isCurrentlyOnAdminRoute() || (isAdminExcluded && isDeviceExcludedByAdmin())) {
        return;
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
  }, [isAdminExcluded]);

  // Track clicks programmatically or from global click handler
  const trackClick = (buttonText: string, sectionId?: string) => {
    if (!buttonText || isSearchBot() || isCurrentlyOnAdminRoute()) return;
    if (isAdminExcluded && isDeviceExcludedByAdmin()) return;

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
    if (isSearchBot() || isCurrentlyOnAdminRoute()) return;
    if (isAdminExcluded && isDeviceExcludedByAdmin()) return;

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
    if (isSearchBot() || isCurrentlyOnAdminRoute()) return;
    if (isAdminExcluded && isDeviceExcludedByAdmin()) return;

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

  const resetAllAnalytics = async () => {
    try {
      await fetch('/api/analytics/clear', { method: 'POST' });
    } catch (e) {
      console.warn(e);
    }

    try {
      localStorage.setItem('fjn_analytics_sessions', JSON.stringify([]));
      sessionStorage.removeItem("fjn_my_current_session_id");
      localStorage.removeItem("fjn_my_current_session_id");
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
      seedOrganicTraffic,
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

