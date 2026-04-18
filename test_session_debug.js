// Test simple de getSessionId fuera de Jest
const vm = require('vm');
const fs = require('fs');

// Cargar analytics.js
const analyticsCode = fs.readFileSync('./lib/analytics.ts', 'utf8');
const configCode = fs.readFileSync('./lib/analytics-config.ts', 'utf8');

// Crear contexto con mocks básicos
const context = {
  console: console,
  window: { location: { href: 'http://localhost:3000' } },
  localStorage: {
    getItem: (key) => {
      console.log('getItem called with:', key);
      return null;
    },
    setItem: (key, value) => {
      console.log('setItem called with:', key, value);
    }
  },
  crypto: {
    randomUUID: () => {
      console.log('randomUUID called');
      return 'session_00000001-mock-uuid';
    }
  },
  process: { env: {} },
  require: (module) => {
    if (module === './analytics-config') {
      return {
        SESSION_CONFIG: {
          STORAGE_KEY: 'fiestaco_session_id',
          EXPIRY_MS: 24 * 60 * 60 * 1000,
          generateSessionId: () => context.crypto.randomUUID()
        },
        API_CONFIG: { BASE_PATH: '/api/analytics' },
        AUTH_CONFIG: {}
      };
    }
    return {};
  },
  exports: {},
  module: { exports: {} }
};

// Ejecutar código en contexto aislado
try {
  const script = new vm.Script(`
    ${configCode}
    ${analyticsCode.replace(/export\s+(function|const|let|var)/g, '$1')}
    
    // Llamar a getSessionId
    const result = getSessionId();
    console.log('Result:', result);
    console.log('Type:', typeof result);
  `);
  
  script.runInNewContext(context);
} catch (error) {
  console.error('Error:', error.message);
  console.error(error.stack);
}
