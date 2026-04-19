/**
 * SETUP HIPER-COMPLETO PARA TESTING EXTREMO
 * Incluye todos los matchers, mocks y configuraciones avanzadas
 */

// Extensions completas
import '@testing-library/jest-dom';
import 'jest-extended/all';
import 'jest-chain';
import * as matchers from 'jest-extended';
import { toHaveNoViolations } from 'jest-axe';
import { configure } from '@testing-library/react';
import failOnConsole from 'jest-fail-on-console';
import { jest } from '@jest/globals';

// Fail on ANY console error/warning
failOnConsole({
  shouldFailOnWarn: true,
  shouldFailOnError: true,
  shouldFailOnDebug: true,
  shouldFailOnInfo: true,
  shouldFailOnLog: true,
  silenceMessage: (errorMessage, method) => {
    // Ignorar advertencia de transformación JSX obsoleta de React
    if (method === 'warn' && errorMessage.includes('outdated JSX transform')) {
      return true;
    }
    // Ignorar sugerencias de Testing Library sobre mejores queries
    if (method === 'warn' && errorMessage.includes('A better query is available')) {
      return true;
    }
    // Ignorar errores de JSDOM por APIs no implementadas
    if (errorMessage.includes('Not implemented') || errorMessage.includes('not implemented')) {
      return true;
    }
    // Ignorar errores de getComputedStyle no implementado
    if (errorMessage.includes('getComputedStyle') || errorMessage.includes('computedStyle')) {
      return true;
    }
    // Solo permitir ciertos mensajes en development
    if (process.env.NODE_ENV === 'test') return false;
    return true;
  }
});

// Extender expect con todos los matchers
expect.extend({
  ...matchers,
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      message: () => `expected ${received} to be within range ${floor}-${ceiling}`,
      pass,
    };
  },
  toBeValidOrderId(received) {
    const pass = /^FCO-\d{4}-[A-Z0-9]{4}$/.test(received);
    return {
      message: () => `expected ${received} to be a valid FCO order ID`,
      pass,
    };
  },
  toBeValidSessionId(received) {
    const pass = typeof received === 'string' &&
                 (received.startsWith('session_') ||
                  received.startsWith('fallback_')) &&
                 received.length > 10;
    return {
      message: () => `expected ${received} to be a valid session ID`,
      pass,
    };
  },
});

// Extender expect con axe
expect.extend(toHaveNoViolations);

// Configuración de Testing Library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 10000,
  computedStyleSupportsPseudoElements: true,
  defaultHidden: true,
  throwSuggestions: true,
});

// Mock global objects exhaustivamente
global.jest = jest;

// Mock de localStorage exhaustivo con persistencia
let localStorageStore = {};
const localStorageMock = {
  getItem: jest.fn((key) => localStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageStore[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    localStorageStore = {};
  }),
  key: jest.fn((index) => Object.keys(localStorageStore)[index] || null),
  get length() {
    return Object.keys(localStorageStore).length;
  },
  _store: localStorageStore,
};

// Asegurar que el mock persista después de clearAllMocks
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock de sessionStorage
let sessionStorageStore = {};
const sessionStorageMock = {
  getItem: jest.fn((key) => sessionStorageStore[key] || null),
  setItem: jest.fn((key, value) => {
    sessionStorageStore[key] = String(value);
  }),
  removeItem: jest.fn((key) => {
    delete sessionStorageStore[key];
  }),
  clear: jest.fn(() => {
    sessionStorageStore = {};
  }),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
  configurable: true,
});

// Mock de navigator.sendBeacon
// Asegurar que window.navigator existe
if (typeof window !== 'undefined') {
  if (!window.navigator) {
    window.navigator = {};
  }
  const sendBeaconMock = jest.fn(() => true);
  Object.defineProperty(window.navigator, 'sendBeacon', {
    value: sendBeaconMock,
    writable: true,
    configurable: true,
  });
}

// También mockear navigator globalmente para acceso directo
if (typeof global !== 'undefined' && !global.navigator) {
  const sendBeaconMock = jest.fn(() => true);
  global.navigator = {
    sendBeacon: sendBeaconMock,
  };
}

// Mock de fetch exhaustivo
global.fetch = jest.fn();
global.AbortController = jest.fn(() => ({
  abort: jest.fn(),
  signal: {},
}));

// Mock de crypto.randomUUID
let uuidCounter = 0;
Object.defineProperty(global.crypto, 'randomUUID', {
  value: jest.fn(() => {
    uuidCounter++;
    return `session_${uuidCounter.toString().padStart(8, '0')}-mock-uuid`;
  }),
  writable: true,
});

// Mock de Math.random para tests determinísticos
// Se puede sobreescribir en tests específicos si es necesario
if (!Math.random.isMocked) {
  let randomCallCount = 0;
  jest.spyOn(Math, 'random').mockImplementation(() => {
    randomCallCount++;
    // Usar un valor que produzca una string base36 con al menos 6 caracteres después del punto
    return 0.1000001 + (randomCallCount * 0.000000001);
  });
  Math.random.isMocked = true;
}

// Mock de URLSearchParams
global.URLSearchParams = jest.fn((init) => {
  const params = new Map();
  if (init) {
    if (typeof init === 'string') {
      init.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        params.set(key, decodeURIComponent(value || ''));
      });
    } else if (Array.isArray(init)) {
      init.forEach(([key, value]) => params.set(key, value));
    } else if (typeof init === 'object') {
      Object.entries(init).forEach(([key, value]) => params.set(key, value));
    }
  }

  return {
    get: jest.fn((key) => params.get(key) || null),
    getAll: jest.fn((key) => Array.from(params.values())),
    has: jest.fn((key) => params.has(key)),
    set: jest.fn((key, value) => params.set(key, value)),
    append: jest.fn((key, value) => {
      if (!params.has(key)) params.set(key, value);
    }),
    delete: jest.fn((key) => params.delete(key)),
    entries: jest.fn(() => Array.from(params.entries())),
    forEach: jest.fn((callback) => params.forEach((value, key) => callback(value, key))),
    keys: jest.fn(() => Array.from(params.keys())),
    values: jest.fn(() => Array.from(params.values())),
    toString: jest.fn(() =>
      Array.from(params.entries())
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    ),
    size: params.size,
    _params: params,
  };
});

// Mock de Date exhaustivo
const OriginalDate = global.Date;
let currentTime = 0;

global.Date = class extends OriginalDate {
  constructor(...args) {
    if (args.length === 0) {
      return new OriginalDate(currentTime || Date.now());
    }
    return new OriginalDate(...args);
  }

  static now() {
    return currentTime || OriginalDate.now();
  }
};

global.Date.originalNow = OriginalDate.now;
global.Date.setCurrentTime = (time) => { currentTime = time; };
global.Date.reset = () => { currentTime = 0; };

// Mock de window.location exhaustivo
delete window.location;
window.location = {
  href: 'http://localhost:3000/test',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/test',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  toString: jest.fn(() => 'http://localhost:3000/test'),
};

// Mock de document
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Mock de performance
window.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  clearResourceTimings: jest.fn(),
};

// Mock de IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// Mock de ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock de MutationObserver
window.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(() => []),
}));

// Console spy exhaustivo
global.console = {
  ...console,
  log: jest.spyOn(console, 'log').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  info: jest.spyOn(console, 'info').mockImplementation(() => {}),
  debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
  trace: jest.spyOn(console, 'trace').mockImplementation(() => {}),
};

// Cleanup después de cada test
afterEach(() => {
  // Limpiar mocks pero no restaurar implementaciones originales
  // jest.clearAllMocks() restauraría implementaciones originales
  jest.clearAllTimers();

  // Limpiar stores
  localStorageStore = {};
  sessionStorageStore = {};

  window.location.search = '';
  window.location.hash = '';
  window.location.pathname = '/test';
  global.Date.reset();

  // Reset fetch sin restaurar implementación
  if (global.fetch.mockClear) global.fetch.mockClear();

  // Reset navigator.sendBeacon
  if (window.navigator?.sendBeacon?.mockClear) {
    window.navigator.sendBeacon.mockClear();
  }

  // Resetear contadores de mocks
  if (Math.random.mockClear) Math.random.mockClear();
  if (crypto.randomUUID?.mockClear) crypto.randomUUID.mockClear();
});

// Setup global beforeAll
beforeAll(() => {
  // Establecer NODE_ENV para testing
  process.env.NODE_ENV = 'test';
  process.env.ANALYTICS_TOKEN = 'test-token-123';
  process.env.DASHBOARD_TOKEN = 'test-dashboard-token-456';
  process.env.DASHBOARD_PASSWORD = 'test-password-789';

  // Mock para crypto.subtle (si es necesario)
  if (!global.crypto.subtle) {
    global.crypto.subtle = {
      digest: jest.fn(),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
      generateKey: jest.fn(),
      deriveKey: jest.fn(),
      deriveBits: jest.fn(),
      importKey: jest.fn(),
      exportKey: jest.fn(),
      wrapKey: jest.fn(),
      unwrapKey: jest.fn(),
    };
  }
});

afterAll(() => {
  jest.restoreAllMocks();
  delete process.env.NODE_ENV;
  delete process.env.ANALYTICS_TOKEN;
  delete process.env.DASHBOARD_TOKEN;
  delete process.env.DASHBOARD_PASSWORD;
});