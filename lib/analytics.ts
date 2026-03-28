import { 
  API_CONFIG, 
  SESSION_CONFIG, 
  EVENT_CONFIG,
  AUTH_CONFIG 
} from './analytics-config';

const API_URL = API_CONFIG.BASE_PATH;

// Generar o recuperar session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const stored = localStorage.getItem(SESSION_CONFIG.STORAGE_KEY);
    
    if (stored) {
      const sessionData = JSON.parse(stored);
      // Verificar si la sesión expiró
      if (Date.now() - sessionData.timestamp < SESSION_CONFIG.EXPIRY_MS) {
        return sessionData.id;
      }
    }
    
    // Generar nueva sesión
    const newSessionId = SESSION_CONFIG.generateSessionId();
    const newSessionData = {
      id: newSessionId,
      timestamp: Date.now(),
      firstSeen: new Date().toISOString()
    };
    
    localStorage.setItem(SESSION_CONFIG.STORAGE_KEY, JSON.stringify(newSessionData));
    return newSessionId;
    
  } catch (error) {
    // Fallback simple si localStorage falla
    console.warn('⚠️ Error con localStorage, usando session fallback');
    return `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Trackear evento de manera segura (no bloqueante)
export async function trackEvent(
  eventName: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const sessionId = getSessionId();
    const pagePath = window.location.pathname;
    
    // Usar sendBeacon para eventos de salida (más confiable)
    const useBeacon = eventName === 'session_end' && navigator.sendBeacon;
    
    const payload = {
      sessionId,
      eventName,
      pagePath,
      metadata: metadata || null,
    };
    
    if (useBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(API_URL, blob);
    } else {
      // Fetch normal con timeout corto
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        keepalive: true, // Mantener conexión viva
      });
      
      clearTimeout(timeoutId);
    }
    
    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Analytics] ${eventName}`, metadata || '');
    }
    
  } catch (error) {
    // Fallar silenciosamente en producción
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Analytics tracking failed:', error);
    }
  }
}

// Funciones de conveniencia
export const analytics = {
  // Eventos de página
  pageView: () => trackEvent('page_view'),
  
  // Eventos del wizard
  wizardStart: () => trackEvent('wizard_start'),
  
  stepVisit: (step: number) => 
    trackEvent('step_visit', { step }),
    
  flavorSelect: (flavor: string) => 
    trackEvent('flavor_select', { flavor }),
    
  addonSelect: (addon: string) => 
    trackEvent('addon_select', { addon }),
    
  drinkSelect: (drink: string) => 
    trackEvent('drink_select', { drink }),
    
  kitComplete: (data: {
    flavor1: string;
    flavor2: string;
    addons: string[];
    drinks: string[];
    totalPrice: number;
  }) => trackEvent('kit_complete', data),
  
  whatsappClick: (data: {
    flavor1: string;
    flavor2: string;
    addons: string[];
    drinks: string[];
    totalPrice: number;
  }) => trackEvent('whatsapp_click', data),
  
  // Eventos de sesión
  sessionEnd: () => {
    // Usar sendBeacon para eventos de salida
    if (navigator.sendBeacon) {
      const sessionId = getSessionId();
      const pagePath = window.location.pathname;
      const blob = new Blob([JSON.stringify({
        sessionId,
        eventName: 'session_end',
        pagePath,
      })], { type: 'application/json' });
      
      navigator.sendBeacon(API_URL, blob);
    } else {
      trackEvent('session_end');
    }
  },
  
  // Eventos de error (opcional)
  error: (errorType: string, details?: string) =>
    trackEvent('error', { type: errorType, details }),
};

// NOTE: Page view tracking and session lifecycle events are handled
// exclusively by the AnalyticsProvider component (components/AnalyticsProvider.tsx)
// to avoid double-firing events. Do not add auto-initialization here.