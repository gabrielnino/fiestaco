/**
 * Strongly typed interfaces for Fiestaco
 * Following TypeScript best practices
 */

export interface Product {
  id: string;
  name: string;
  image: string;
}

export interface Flavor extends Product {
  surcharge?: number;
}

export interface Addon extends Product {
  price: number;
}

export interface Drink extends Product {
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'flavor' | 'addon' | 'drink';
}

export interface OrderState {
  flavor1: Flavor | null;
  flavor2: Flavor | null;
  addons: Addon[];
  drinks: Drink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
  flavors: Flavor[];
  addons: Addon[];
  drinks: Drink[];
}

export interface WhatsAppMessage {
  orderId: string;
  customerName?: string;
  phoneNumber: string;
  message: string;
  items: OrderItem[];
  total: number;
}

export interface AnalyticsEvent {
  eventName: string;
  sessionId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// React component props
export interface WithChildren {
  children: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Configuration types
export interface AppConfig {
  basePrice: number;
  whatsappNumber: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
}

// Local storage keys
export enum StorageKeys {
  SESSION_ID = 'fiestaco_session_id',
  UTM_PARAMS = 'fiestaco_utm',
  CART = 'fiestaco_cart',
  USER_PREFERENCES = 'fiestaco_prefs',
}

// Event names for analytics
export enum AnalyticsEvents {
  PAGE_VIEW = 'page_view',
  WIZARD_START = 'wizard_start',
  STEP_VISIT = 'step_visit',
  FLAVOR_SELECT = 'flavor_select',
  ADDON_SELECT = 'addon_select',
  DRINK_SELECT = 'drink_select',
  KIT_COMPLETE = 'kit_complete',
  WHATSAPP_CLICK = 'whatsapp_click',
  WIZARD_ABANDON = 'wizard_abandon',
  SESSION_END = 'session_end',
  ERROR = 'error',
}