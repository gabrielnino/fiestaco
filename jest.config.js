/**
 * CONFIGURACIÓN JEST HIPER-COMPLETA PARA 100% COBERTURA
 * Incluye todos los plugins y configuraciones para testing extremo
 */

module.exports = {
  // Ambiente de testing
  testEnvironment: 'jsdom',

  // Configuraciones de cobertura EXTREMAS
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/*.d.ts',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/next.config.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'clover',
    'html',
    'cobertura',
    'text-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/jest.extreme.setup.js'
  ],

  // Módulos
  moduleNameMapper: {
    // Mapeos para imports
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',

    // CSS/Assets mocks
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Transform
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', {
      presets: ['next/babel']
    }],
  },

  // Rutas de test
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test|cyber-test|extreme-test).[jt]s?(x)',
    '**/tests/**/*.[jt]s?(x)',
    '**/test-suites/**/*.[jt]s?(x)'
  ],

  // Extensions
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // Watch
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Performance
  testTimeout: 30000,
  maxWorkers: '50%',

  // Fails on console errors
  setupFiles: ['<rootDir>/jest.console.setup.js'],

  // Reporters múltiples
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Reporte de Pruebas EXAGERADO - Fiestaco',
      outputPath: './coverage/test-report.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
    }],
    ['jest-junit', {
      outputDirectory: './coverage',
      outputName: 'junit.xml',
    }],
    ['jest-sonar', {
      outputDirectory: './coverage',
      outputName: 'sonar-report.xml',
    }]
  ],

  // Snapshot
  snapshotSerializers: ['@emotion/jest/serializer'],

  // Clear mocks
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};