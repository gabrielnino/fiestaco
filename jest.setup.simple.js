// Setup práctico para Testing
import '@testing-library/jest-dom';

// Console mocks - solo silenciar en tests
const originalConsole = { ...console };

beforeAll(() => {
  // Silenciar console.log/info/debug en tests
  console.log = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();

  // Mantener warnings y errors visibles
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
});

afterAll(() => {
  // Restaurar console original
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
});

// Mock para Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock para Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock básico para analytics
jest.mock('@/lib/analytics', () => ({
  analytics: {
    wizardStart: jest.fn(),
    stepVisit: jest.fn(),
    flavorSelect: jest.fn(),
    addonSelect: jest.fn(),
    drinkSelect: jest.fn(),
    whatsappClick: jest.fn(),
    wizardAbandon: jest.fn(),
  },
  generateOrderId: jest.fn(() => 'test-order-123'),
}));

// Mock para localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn((key) => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset mocks antes de cada test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});