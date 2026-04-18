import {
  API_CONFIG,
  SESSION_CONFIG,
  AUTH_CONFIG
} from './analytics-config';

const API_URL = API_CONFIG.BASE_PATH;

// ─────────────────────────────────────────────
// ORDER ID — visible in WhatsApp and dashboard
// Format: FCO-MMDD-XXXX  e.g., FCO-0329-A1B2
// ─────────────────────────────────────────────
export function generateOrderId(): string {
  const now = new Date();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FCO-${mm}${dd}-${rand}`;
}

// ─────────────────────────────────────────────
// SESSION ID
// ─────────────────────────────────────────────
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    const stored = localStorage.getItem(SESSION_CONFIG.STORAGE_KEY);
    if (stored) {
      const sessionData = JSON.parse(stored);
      if (Date.now() - sessionData.timestamp < SESSION_CONFIG.EXPIRY_MS) {
        return sessionData.id;
      }
    }
    const newSessionId = SESSION_CONFIG.generateSessionId();
    localStorage.setItem(SESSION_CONFIG.STORAGE_KEY, JSON.stringify({
      id: newSessionId,
      timestamp: Date.now(),
      firstSeen: new Date().toISOString()
    }));
    return newSessionId;
  } catch {
    return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ─────────────────────────────────────────────
// UTM ATTRIBUTION
// ─────────────────────────────────────────────
const UTM_STORAGE_KEY = 'fiestaco_utm';

export function captureUTM(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source:   params.get('utm_source')   || 'direct',
      utm_medium:   params.get('utm_medium')   || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_content:  params.get('utm_content')  || null,
      captured_at:  new Date().toISOString(),
    };
    // Only overwrite if new UTM params are present (don't clear organic referral)
    if (params.get('utm_source')) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } else if (!localStorage.getItem(UTM_STORAGE_KEY)) {
      // First visit with no UTM — record as direct
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // Fail silently
  }
}

export function getUTM(): Record<string, string | null> {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Fail silently
  }
  return { utm_source: 'direct' };
}

// ─────────────────────────────────────────────
// CORE TRACK EVENT
// ─────────────────────────────────────────────
export async function trackEvent(
  eventName: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const sessionId = getSessionId();
    const pagePath = window.location.pathname;
    const utm = getUTM();
    const useBeacon = eventName === 'session_end' && navigator.sendBeacon;

    const payload = {
      sessionId,
      eventName,
      pagePath,
      metadata: {
        ...utm,
        ...(metadata || {}),
      },
    };

    if (useBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(API_URL, blob);
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
        keepalive: true,
      });
      clearTimeout(timeoutId);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Analytics] ${eventName}`, payload.metadata);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Analytics tracking failed:', error);
    }
  }
}

// ─────────────────────────────────────────────
// EVENT HELPERS
// ─────────────────────────────────────────────
export const analytics = {
  // Page lifecycle
  pageView: () => trackEvent('page_view'),

  // Wizard flow
  wizardStart: () => trackEvent('wizard_start'),
  stepVisit: (step: number) => trackEvent('step_visit', { step }),
  stepBack: (from_step: number) => trackEvent('step_back', { from_step }),

  // Product selections
  flavorSelect: (flavor: string) => trackEvent('flavor_select', { flavor }),
  addonSelect: (addon: string) => trackEvent('addon_select', { addon }),
  drinkSelect: (drink: string) => trackEvent('drink_select', { drink }),

  // Kit summary (fires when user reaches summary step)
  kitComplete: (data: {
    flavor1: string;
    flavor2: string;
    addons: string[];
    drinks: string[];
    order_value: number;
  }) => trackEvent('kit_complete', data),

  // CONVERSION — includes order_id + order_value for real revenue tracking
  whatsappClick: (data: {
    order_id: string;             // FCO-MMDD-XXXX — links to orders table
    flavor1: string;
    flavor2: string;
    addons: string[];
    drinks: string[];
    order_value: number;
    combo: string;
  }) => trackEvent('whatsapp_click', data),

  // ABANDON — fires when session ends mid-wizard without converting
  wizardAbandon: (data: {
    at_step: number;
    flavor1: string | null;
    flavor2: string | null;
    addons_count: number;
    had_price: number;
  }) => trackEvent('wizard_abandon', data),

  // Session lifecycle
  sessionEnd: () => {
    const sessionId = getSessionId();
    const pagePath = window.location.pathname;
    const utm = getUTM();
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({
        sessionId,
        eventName: 'session_end',
        pagePath,
        metadata: { ...utm },
      })], { type: 'application/json' });
      navigator.sendBeacon(API_URL, blob);
    } else {
      trackEvent('session_end');
    }
  },

  // Errors
  error: (errorType: string, details?: string) =>
    trackEvent('error', { type: errorType, details }),
};

// NOTE: Page view tracking and session lifecycle events are handled
// exclusively by the AnalyticsProvider component (components/AnalyticsProvider.tsx)
// to avoid double-firing events. Do not add auto-initialization here.