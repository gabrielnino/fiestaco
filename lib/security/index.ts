/**
 * Exportaciones de módulos de seguridad
 */

// Scripts seguros
export {
  SafeJsonLd,
  SafeAnalyticsScript,
  sanitizeString,
  sanitizeUrl,
  validateFormData,
} from "./safe-script";

// Schemas de validación
export {
  orderSchema,
  priceUpdateSchema,
  utmSchema,
  whatsappMessageSchema,
  validateAndSanitize,
  createValidationMiddleware,
} from "./validation-schemas";

// Headers de seguridad
export {
  basicSecurityHeaders,
  apiSecurityHeaders,
  staticContentSecurityHeaders,
  csrfProtectionHeaders,
  generateCSPNonce,
  getCSPHeadersWithNonce,
  securityHeadersMiddleware,
  csrfProtectionMiddleware,
  generateCsrfToken,
  rateLimitHeaders,
  corsValidationMiddleware,
} from "./security-headers";

// Tipos
export type { ValidationSchema } from "./validation-schemas";
export type { SecurityHeaders } from "./security-headers";