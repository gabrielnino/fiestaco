/**
 * Headers de seguridad para APIs y aplicaciones web
 * Protege contra XSS, CSRF, clickjacking, y otras vulnerabilidades
 */

export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * Headers de seguridad básicos para todas las respuestas
 */
export const basicSecurityHeaders: SecurityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

/**
 * Headers de seguridad para APIs
 */
export const apiSecurityHeaders: SecurityHeaders = {
  ...basicSecurityHeaders,
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://plausible.io https://upload.wikimedia.org;",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

/**
 * Headers de seguridad para contenido estático
 */
export const staticContentSecurityHeaders: SecurityHeaders = {
  ...basicSecurityHeaders,
  "Cache-Control": "public, max-age=31536000, immutable",
  "Content-Security-Policy": "default-src 'self'",
};

/**
 * Headers específicos para prevenir CSRF
 */
export const csrfProtectionHeaders: SecurityHeaders = {
  "Access-Control-Allow-Origin": "https://fiestaco.today",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
  "Access-Control-Allow-Credentials": "true",
};

/**
 * Generar nonce para CSP
 */
export function generateCSPNonce(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(16).toString("base64");
}

/**
 * Headers de CSP con nonce para scripts inline
 */
export function getCSPHeadersWithNonce(nonce: string): SecurityHeaders {
  return {
    "Content-Security-Policy": `default-src 'self'; script-src 'self' 'nonce-${nonce}' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://plausible.io https://upload.wikimedia.org;`,
  };
}

/**
 * Middleware para agregar headers de seguridad a respuestas
 */
export function securityHeadersMiddleware(req: any, res: any, next: Function) {
  // Determinar tipo de contenido
  const isApiRoute = req.path.startsWith("/api/");
  const isStaticAsset =
    req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$/) ||
    req.path.startsWith("/_next/static/");

  let headers = basicSecurityHeaders;

  if (isApiRoute) {
    headers = { ...headers, ...apiSecurityHeaders };
  } else if (isStaticAsset) {
    headers = { ...headers, ...staticContentSecurityHeaders };
  } else {
    // Para páginas HTML, agregar CSP con nonce
    const nonce = generateCSPNonce();
    res.locals.cspNonce = nonce;
    headers = { ...headers, ...getCSPHeadersWithNonce(nonce) };
  }

  // Agregar headers a la respuesta
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  next();
}

/**
 * Middleware para protección CSRF
 */
export function csrfProtectionMiddleware(req: any, res: any, next: Function) {
  // Solo aplicar a métodos que modifican datos
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  try {
    // Verificar token CSRF
    const csrfToken = req.headers["x-csrf-token"];
    const sessionToken = req.session?.csrfToken;

    if (!csrfToken || csrfToken !== sessionToken) {
      return res.status(403).json({
        error: "CSRF token validation failed",
        code: "INVALID_CSRF_TOKEN",
      });
    }

    // Token válido, continuar
    next();
  } catch (error) {
    console.error("CSRF middleware error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Generar y almacenar token CSRF
 */
export function generateCsrfToken(req: any, res: any): string {
  const crypto = require("crypto");
  const token = crypto.randomBytes(32).toString("hex");

  // Almacenar en sesión
  if (req.session) {
    req.session.csrfToken = token;
  }

  return token;
}

/**
 * Headers para rate limiting
 */
export const rateLimitHeaders = {
  "X-RateLimit-Limit": "100",
  "X-RateLimit-Remaining": "99",
  "X-RateLimit-Reset": "3600",
};

/**
 * Validar origen de la request (CORS)
 */
export function validateOrigin(origin: string): boolean {
  const allowedOrigins = [
    "https://fiestaco.today",
    "https://www.fiestaco.today",
    "http://localhost:3000",
  ];

  return allowedOrigins.includes(origin);
}

/**
 * Middleware para validación CORS
 */
export function corsValidationMiddleware(req: any, res: any, next: Function) {
  const origin = req.headers.origin;

  if (origin && !validateOrigin(origin)) {
    return res.status(403).json({
      error: "Cross-origin request not allowed",
      code: "CORS_VIOLATION",
    });
  }

  // Agregar headers CORS
  Object.entries(csrfProtectionHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  next();
}