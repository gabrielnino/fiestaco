/**
 * Analytics system configuration
 *
 * This file centralizes all configurations for easy maintenance
 */

// Authentication configuration
export const AUTH_CONFIG = {
  // Token for basic GET endpoint
  BASIC_TOKEN: process.env['ANALYTICS_TOKEN'] || 'fiestaco-dev',

  // Token for dashboard (more permissions)
  DASHBOARD_TOKEN: process.env['DASHBOARD_TOKEN'] || 'fiestaco-admin-2024',

  // Password for web dashboard
  DASHBOARD_PASSWORD: process.env['DASHBOARD_PASSWORD'] || 'fiestaco2024',
  
  // Key for dashboard localStorage
  DASHBOARD_STORAGE_KEY: 'fiestaco_dashboard_token',
} as const;

// Session configuration
export const SESSION_CONFIG = {
  // Session expiration time (24 hours)
  EXPIRY_MS: 24 * 60 * 60 * 1000,
  
  // Key for localStorage
  STORAGE_KEY: 'fiestaco_session_id',
  
  // Generate session ID
  generateSessionId: (): string => {
    return crypto.randomUUID();
  },
} as const;

// Event configuration
export const EVENT_CONFIG = {
  // Main events to track
  EVENTS: {
    PAGE_VIEW: 'page_view',
    WIZARD_START: 'wizard_start',
    STEP_VISIT: 'step_visit',
    FLAVOR_SELECT: 'flavor_select',
    ADDON_SELECT: 'addon_select',
    DRINK_SELECT: 'drink_select',
    KIT_COMPLETE: 'kit_complete',
    WHATSAPP_CLICK: 'whatsapp_click',
    SESSION_END: 'session_end',
    ERROR: 'error',
    TEST: 'test_event',
  } as const,
  
  // Metadata máxima por evento (caracteres)
  MAX_METADATA_LENGTH: 1000,
  
  // User agent máximo (caracteres)
  MAX_USER_AGENT_LENGTH: 500,
} as const;

// Configuración de base de datos
export const DB_CONFIG = {
  // Ruta de la base de datos
  PATH: process.env['ANALYTICS_DB_PATH'] || './data/analytics.db',
  
  // Retención de datos (días)
  RETENTION_DAYS: 90,
  
  // Límite de eventos por consulta
  QUERY_LIMIT: 1000,
} as const;

// Configuración de API
export const API_CONFIG = {
  // Endpoint base
  BASE_PATH: '/api/analytics',
  
  // Timeout de requests (ms)
  TIMEOUT_MS: 5000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Configuración del dashboard
export const DASHBOARD_CONFIG = {
  // Ruta del dashboard
  PATH: '/dashboard',
  
  // Título
  TITLE: 'Dashboard Analytics - Fiestaco',
  
  // Intervalo de actualización automática (ms)
  REFRESH_INTERVAL: 60000, // 1 minuto
  
  // Rangos de tiempo disponibles
  TIME_RANGES: [
    { label: 'Hoy', value: '1' },
    { label: 'Últimos 7 días', value: '7' },
    { label: 'Últimos 30 días', value: '30' },
    { label: 'Últimos 90 días', value: '90' },
  ],
  
  // Colores para gráficos
  CHART_COLORS: {
    primary: '#ff6b35',
    secondary: '#4361ee',
    success: '#38b000',
    warning: '#ff9e00',
    danger: '#f72585',
    info: '#4cc9f0',
  },
} as const;

// Configuración de reporting
export const REPORTING_CONFIG = {
  // Métricas principales a calcular
  METRICS: [
    'total_events',
    'unique_sessions',
    'page_views',
    'wizard_starts',
    'whatsapp_clicks',
    'conversion_rate',
  ],
  
  // Funnel steps
  FUNNEL_STEPS: [
    'page_view',
    'wizard_start',
    'step_visit',
    'whatsapp_click',
  ],
  
  // Top N para listas (sabores, addons, etc)
  TOP_N: 10,
} as const;

// Exportar configuración completa
export default {
  AUTH_CONFIG,
  SESSION_CONFIG,
  EVENT_CONFIG,
  DB_CONFIG,
  API_CONFIG,
  DASHBOARD_CONFIG,
  REPORTING_CONFIG,
} as const;