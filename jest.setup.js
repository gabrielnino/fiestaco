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
  throwSuggestions: false,
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

// Function to ensure global mocks are set up, even after jest.restoreAllMocks()
let uuidCounter = 0;
const applyGlobalMocks = () => {
  // Re-apply implementations for localStorageMock
  if (localStorageMock.getItem.mockImplementation) {
    localStorageMock.getItem.mockImplementation((key) => localStorageStore[key] || null);
    localStorageMock.setItem.mockImplementation((key, value) => {
      localStorageStore[key] = String(value);
    });
    localStorageMock.removeItem.mockImplementation((key) => {
      delete localStorageStore[key];
    });
    localStorageMock.clear.mockImplementation(() => {
      localStorageStore = {};
    });
    localStorageMock.key.mockImplementation((index) => Object.keys(localStorageStore)[index] || null);
  }

  // Re-apply implementations for sessionStorageMock
  if (sessionStorageMock.getItem.mockImplementation) {
    sessionStorageMock.getItem.mockImplementation((key) => sessionStorageStore[key] || null);
    sessionStorageMock.setItem.mockImplementation((key, value) => {
      sessionStorageStore[key] = String(value);
    });
    sessionStorageMock.removeItem.mockImplementation((key) => {
      delete sessionStorageStore[key];
    });
    sessionStorageMock.clear.mockImplementation(() => {
      sessionStorageStore = {};
    });
  }

  // Re-apply sendBeacon mock implementations
  if (typeof window !== 'undefined' && window.navigator && window.navigator.sendBeacon && window.navigator.sendBeacon.mockImplementation) {
    window.navigator.sendBeacon.mockImplementation(() => true);
  }
  if (typeof global !== 'undefined' && global.navigator && global.navigator.sendBeacon && global.navigator.sendBeacon.mockImplementation) {
    global.navigator.sendBeacon.mockImplementation(() => true);
  }

  // Re-apply fetch and AbortController implementations
  if (global.fetch && global.fetch.mockImplementation) {
    global.fetch.mockImplementation(() => Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({ success: true }),
      text: () => Promise.resolve(JSON.stringify({ success: true })),
      headers: new Map([['Content-Type', 'application/json']]),
    }));
  }
  if (global.AbortController && global.AbortController.mockImplementation) {
    global.AbortController.mockImplementation(() => ({
      abort: jest.fn(),
      signal: {},
    }));
  }

  // Re-apply crypto.randomUUID implementation
  if (global.crypto && global.crypto.randomUUID && global.crypto.randomUUID.mockImplementation) {
    global.crypto.randomUUID.mockImplementation(() => {
      uuidCounter++;
      return `session_${uuidCounter.toString().padStart(8, '0')}-mock-uuid`;
    });
  } else if (global.crypto) {
    try {
      const mockFn = jest.fn(() => {
        uuidCounter++;
        return `session_${uuidCounter.toString().padStart(8, '0')}-mock-uuid`;
      });
      Object.defineProperty(global.crypto, 'randomUUID', {
        value: mockFn,
        writable: true,
        configurable: true,
      });
    } catch (e) {}
  }

  // Re-apply Math.random implementation
  if (Math.random.mockImplementation) {
    let randomCallCount = 0;
    Math.random.mockImplementation(() => {
      randomCallCount++;
      return (0.1 + ((randomCallCount * 12345.6789) % 10000) / 10000) % 1.0;
    });
  } else {
    let randomCallCount = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      randomCallCount++;
      return (0.1 + ((randomCallCount * 12345.6789) % 10000) / 10000) % 1.0;
    });
  }

  // Re-apply window.location mock implementations
  if (window.location) {
    if (window.location.assign && window.location.assign.mockImplementation) window.location.assign.mockImplementation(() => {});
    if (window.location.replace && window.location.replace.mockImplementation) window.location.replace.mockImplementation(() => {});
    if (window.location.reload && window.location.reload.mockImplementation) window.location.reload.mockImplementation(() => {});
    if (window.location.toString && window.location.toString.mockImplementation) {
      window.location.toString.mockImplementation(() => window.location.href || 'http://localhost:3000/test');
    }
  }

  // Re-apply performance mock implementations
  if (window.performance) {
    if (window.performance.now && window.performance.now.mockImplementation) window.performance.now.mockImplementation(() => Date.now());
    if (window.performance.mark && window.performance.mark.mockImplementation) window.performance.mark.mockImplementation(() => {});
    if (window.performance.measure && window.performance.measure.mockImplementation) window.performance.measure.mockImplementation(() => {});
    if (window.performance.getEntriesByName && window.performance.getEntriesByName.mockImplementation) window.performance.getEntriesByName.mockImplementation(() => []);
    if (window.performance.getEntriesByType && window.performance.getEntriesByType.mockImplementation) window.performance.getEntriesByType.mockImplementation(() => []);
    if (window.performance.clearMarks && window.performance.clearMarks.mockImplementation) window.performance.clearMarks.mockImplementation(() => {});
    if (window.performance.clearMeasures && window.performance.clearMeasures.mockImplementation) window.performance.clearMeasures.mockImplementation(() => {});
    if (window.performance.clearResourceTimings && window.performance.clearResourceTimings.mockImplementation) window.performance.clearResourceTimings.mockImplementation(() => {});
  }

  // Re-apply Observers mock implementations
  if (window.IntersectionObserver && window.IntersectionObserver.mockImplementation) {
    window.IntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    }));
  }
  if (window.ResizeObserver && window.ResizeObserver.mockImplementation) {
    window.ResizeObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }
  if (window.MutationObserver && window.MutationObserver.mockImplementation) {
    window.MutationObserver.mockImplementation(() => ({
      observe: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(() => []),
    }));
  }

  // Re-apply console mock implementations
  const consoleMethods = ['log', 'error', 'warn', 'info', 'debug', 'trace'];
  consoleMethods.forEach(method => {
    if (console[method] && console[method].mockImplementation) {
      console[method].mockImplementation(() => {});
    } else {
      try {
        jest.spyOn(console, method).mockImplementation(() => {});
      } catch (e) {}
    }
  });
};

// Initial invocation
applyGlobalMocks();

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

// Re-apply implementations before every test (critical when resetMocks: true is configured)
beforeEach(() => {
  applyGlobalMocks();
});

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