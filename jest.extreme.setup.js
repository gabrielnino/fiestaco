/**
 * SETUP EXTREMO PARA CASOS DE PRUEBA EXAGERADOS
 * Incluye utilities para testing de casos extremos, performance y stress
 */

import { jest } from '@jest/globals';

// ============================================
// UTILITIES PARA CASOS EXTREMOS (EDGE CASES)
// ============================================

/**
 * Genera datos de prueba EXTREMOS para cada tipo
 */
export const ExtremeTestData = {
  // Strings extremos
  strings: {
    EMPTY: '',
    SINGLE_CHAR: 'a',
    VERY_LONG: 'a'.repeat(10000),
    UNICODE_EXTREME: '🐉🎯🚀🔥💥⭐🌟✨🎨🎭🎪🎢🎠🦄🌈🌊🎵🎶📱💻🖥️⌨️🖱️🖨️📠📞📱💾',
    SPECIAL_CHARS: '!@#$%^&*()_+-=[]{}|;:,.<>?/~`',
    SQL_INJECTION: "'; DROP TABLE users; --",
    XSS_INJECTION: '<script>alert("XSS")</script>',
    NULL_BYTES: 'test\u0000string',
    WHITESPACE_ONLY: '   \t\n\r   ',
    EMOJI_ONLY: '😀😃😄😁😆😅😂🤣🥲☺️😊😇🙂🙃😉😌😍🥰😘😗😙😚😋😛😝😜🤪🤨🧐🤓',
  },

  // Numbers extremos
  numbers: {
    ZERO: 0,
    NEGATIVE: -42,
    VERY_LARGE: Number.MAX_SAFE_INTEGER,
    VERY_SMALL: Number.MIN_SAFE_INTEGER,
    FLOAT_PRECISION: 0.1 + 0.2, // 0.30000000000000004
    INFINITY: Infinity,
    NEGATIVE_INFINITY: -Infinity,
    NAN: NaN,
    MAX_INT: 2147483647,
    MIN_INT: -2147483648,
    SCIENTIFIC: 1.23e45,
    VERY_SMALL_FLOAT: 0.000000000000001,
  },

  // Arrays extremos
  arrays: {
    EMPTY: [],
    SINGLE: [1],
    VERY_LARGE: Array(10000).fill(0).map((_, i) => i),
    NESTED_DEEP: [[[[[[[[[[['deep']]]]]]]]]]],
    MIXED_TYPES: [1, 'two', null, undefined, {}, [], true, Symbol('test')],
    SPARSE: [, , ,], // eslint-disable-line no-sparse-arrays
    CYCLIC: (() => {
      const arr = [1, 2, 3];
      arr.push(arr);
      return arr;
    })(),
  },

  // Objects extremos
  objects: {
    EMPTY: {},
    VERY_DEEP: (() => {
      let obj = {};
      let current = obj;
      for (let i = 0; i < 100; i++) {
        current.level = i;
        current.next = {};
        current = current.next;
      }
      return obj;
    })(),
    CIRCULAR: (() => {
      const obj = { a: 1 };
      obj.self = obj;
      return obj;
    })(),
    WITH_SYMBOLS: {
      [Symbol('secret')]: 'hidden',
      normal: 'visible',
    },
    WITH_GETTER: {
      get value() {
        return Math.random();
      },
      normal: 'static',
    },
    PROTOTYPE_POLLUTED: JSON.parse('{"__proto__": {"polluted": true}}'),
    NULL_PROTOTYPE: Object.create(null),
  },

  // Dates extremos
  dates: {
    UNIX_EPOCH: new Date(0),
    DISTANT_FUTURE: new Date('9999-12-31T23:59:59.999Z'),
    DISTANT_PAST: new Date('0001-01-01T00:00:00.000Z'),
    LEAP_YEAR: new Date('2024-02-29T12:00:00.000Z'),
    INVALID: new Date('invalid'),
    VERY_EARLY: new Date(-8640000000000000), // Minimum valid date
    VERY_LATE: new Date(8640000000000000), // Maximum valid date
    TIMEZONE_EDGE: new Date('2023-12-31T23:59:59.999-12:00'), // Edge of timezone
  },

  // Errors extremos
  errors: {
    STANDARD: new Error('Standard error'),
    CUSTOM: new TypeError('Custom type error'),
    AGGREGATE: new AggregateError([
      new Error('Error 1'),
      new Error('Error 2'),
      new Error('Error 3'),
    ], 'Multiple errors'),
  },
};

// ============================================
// HELPERS PARA STRESS TESTING
// ============================================

/**
 * Ejecuta una función múltiples veces para stress testing
 */
export const stressTest = (fn, options = {}) => {
  const {
    iterations = 1000,
    concurrency = 10,
    timeout = 30000,
    warmup = 10,
  } = options;

  return async () => {
    // Warmup
    for (let i = 0; i < warmup; i++) {
      await fn(i);
    }

    // Main test
    const promises = [];
    for (let i = 0; i < iterations; i++) {
      if (i % concurrency === 0 && i > 0) {
        await Promise.all(promises);
        promises.length = 0;
      }
      promises.push(fn(i));
    }
    await Promise.all(promises);
  };
};

/**
 * Test de memory leak
 */
export const memoryLeakTest = async (createFn, cleanupFn, options = {}) => {
  const { iterations = 100, checkInterval = 10 } = options;
  const initialMemory = process.memoryUsage?.()?.heapUsed || 0;
  const memoryReadings = [];

  for (let i = 0; i < iterations; i++) {
    const instance = createFn(i);

    if (i % checkInterval === 0) {
      const currentMemory = process.memoryUsage?.()?.heapUsed || 0;
      memoryReadings.push(currentMemory);

      // Check for significant memory increase
      if (i > checkInterval * 2) {
        const avgIncrease = (currentMemory - initialMemory) / (i / checkInterval);
        const latestIncrease = memoryReadings.slice(-3).reduce((a, b) => a + b, 0) / 3;

        if (latestIncrease > avgIncrease * 2) {
          console.warn(`Potential memory leak detected at iteration ${i}`);
        }
      }
    }

    if (cleanupFn) {
      cleanupFn(instance);
    }
  }

  const finalMemory = process.memoryUsage?.()?.heapUsed || 0;
  return { initialMemory, finalMemory, memoryReadings };
};

// ============================================
// HELPERS PARA PERFORMANCE TESTING
// ============================================

/**
 * Mide performance de una función
 */
export const measurePerformance = (fn, options = {}) => {
  const { iterations = 1000, warmup = 100 } = options;

  // Warmup
  for (let i = 0; i < warmup; i++) {
    fn();
  }

  // Measurement
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();

  return {
    totalTime: end - start,
    averageTime: (end - start) / iterations,
    iterationsPerSecond: (iterations / (end - start)) * 1000,
  };
};

/**
 * Test de límites (boundary testing)
 */
export const boundaryTest = (fn, boundaries) => {
  const results = [];

  boundaries.forEach(([input, expected, description]) => {
    try {
      const result = fn(input);
      results.push({
        input,
        expected,
        actual: result,
        passed: result === expected,
        description,
      });
    } catch (error) {
      results.push({
        input,
        expected,
        error: error.message,
        passed: false,
        description,
      });
    }
  });

  return results;
};

// ============================================
// MOCKS AVANZADOS
// ============================================

/**
 * Mock de fetch exhaustivo con todos los casos
 */
export const createExhaustiveFetchMock = () => {
  const mockFetch = jest.fn();

  // Configurar respuestas para diferentes casos
  mockFetch.mockImplementation((url, options = {}) => {
    // Caso: URL inválida
    if (!url || typeof url !== 'string') {
      return Promise.reject(new TypeError('Failed to fetch'));
    }

    // Caso: Timeout
    if (url.includes('timeout')) {
      return new Promise(() => {}); // Nunca resuelve
    }

    // Caso: Network error
    if (url.includes('network-error')) {
      return Promise.reject(new Error('Network error'));
    }

    // Caso: Status codes específicos
    if (url.includes('status/')) {
      const status = parseInt(url.split('/').pop(), 10);
      return Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        statusText: 'Test',
        json: () => Promise.resolve({ error: `Status ${status}` }),
        text: () => Promise.resolve(`Status ${status}`),
      });
    }

    // Respuesta por defecto (éxito)
    return Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({ success: true, url }),
      text: () => Promise.resolve(JSON.stringify({ success: true, url })),
      headers: new Map([['Content-Type', 'application/json']]),
    });
  });

  return mockFetch;
};

/**
 * Mock de localStorage exhaustivo
 */
export const createExhaustiveLocalStorageMock = () => {
  let store = {};
  let quotaExceeded = false;

  return {
    getItem: jest.fn((key) => {
      if (quotaExceeded) throw new Error('QuotaExceededError');
      return store[key] || null;
    }),

    setItem: jest.fn((key, value) => {
      if (quotaExceeded) throw new Error('QuotaExceededError');

      // Simular quota exceeded después de 5MB
      const totalSize = Object.values(store).reduce((sum, val) => sum + val.length, 0);
      if (totalSize + value.length > 5 * 1024 * 1024) {
        quotaExceeded = true;
        throw new Error('QuotaExceededError');
      }

      store[key] = String(value);
    }),

    removeItem: jest.fn((key) => {
      delete store[key];
    }),

    clear: jest.fn(() => {
      store = {};
      quotaExceeded = false;
    }),

    key: jest.fn((index) => Object.keys(store)[index] || null),

    get length() {
      return Object.keys(store).length;
    },

    // Métodos para testing
    _setQuotaExceeded: (value) => { quotaExceeded = value; },
    _getStore: () => ({ ...store }),
    _reset: () => {
      store = {};
      quotaExceeded = false;
    },
  };
};

// ============================================
// ASSERTIONS PERSONALIZADAS EXTREMAS
// ============================================

expect.extend({
  /**
   * Verifica que una función NO tenga memory leaks
   */
  toNotHaveMemoryLeaks(fn, createFn, cleanupFn, options = {}) {
    const { iterations = 100 } = options;

    return memoryLeakTest(createFn, cleanupFn, { iterations })
      .then(({ initialMemory, finalMemory }) => {
        const increase = finalMemory - initialMemory;
        const increasePercent = (increase / initialMemory) * 100;

        // Consideramos leak si aumenta más del 50%
        const pass = increasePercent < 50;

        return {
          message: () =>
            `Expected function to not have memory leaks, but memory increased by ${increasePercent.toFixed(2)}% ` +
            `(${increase} bytes) over ${iterations} iterations`,
          pass,
        };
      })
      .catch(error => ({
        message: () => `Memory leak test failed: ${error.message}`,
        pass: false,
      }));
  },

  /**
   * Verifica que una función sea performante
   */
  toBePerformant(fn, options = {}) {
    const { maxAverageTime = 10, iterations = 1000 } = options; // 10ms max

    const { averageTime } = measurePerformance(fn, { iterations });
    const pass = averageTime <= maxAverageTime;

    return {
      message: () =>
        `Expected function to be performant (average time ≤ ${maxAverageTime}ms), ` +
        `but average time was ${averageTime.toFixed(2)}ms over ${iterations} iterations`,
      pass,
    };
  },

  /**
   * Verifica que una función maneje correctamente casos extremos
   */
  toHandleExtremeCases(fn, testCases) {
    const results = testCases.map(({ input, expected, description }) => {
      try {
        const result = fn(input);
        const passed = JSON.stringify(result) === JSON.stringify(expected);
        return { input, expected, actual: result, passed, description };
      } catch (error) {
        const passed = expected instanceof Error && error.constructor === expected.constructor;
        return { input, expected, error: error.message, passed, description };
      }
    });

    const allPassed = results.every(r => r.passed);

    return {
      message: () => {
        const failedCases = results.filter(r => !r.passed);
        return `Expected function to handle all extreme cases, but ${failedCases.length} failed:\n` +
          failedCases.map(fc =>
            `- ${fc.description}: input=${JSON.stringify(fc.input)}, ` +
            `expected=${JSON.stringify(fc.expected)}, ` +
            `got=${'error' in fc ? `error: ${fc.error}` : JSON.stringify(fc.actual)}`
          ).join('\n');
      },
      pass: allPassed,
    };
  },
});

// ============================================
// GLOBAL TEST HELPERS
// ============================================

// Exponer utilities globalmente para uso en tests
global.ExtremeTestData = ExtremeTestData;
global.stressTest = stressTest;
global.memoryLeakTest = memoryLeakTest;
global.measurePerformance = measurePerformance;
global.boundaryTest = boundaryTest;
global.createExhaustiveFetchMock = createExhaustiveFetchMock;
global.createExhaustiveLocalStorageMock = createExhaustiveLocalStorageMock;

// Helper para tests asíncronos extremos
global.wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
global.randomTimeout = (min = 0, max = 100) =>
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));