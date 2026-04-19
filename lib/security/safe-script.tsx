/**
 * Utilidades seguras para scripts y contenido dinámico
 * Previene XSS y otras vulnerabilidades de seguridad
 */

import Script from "next/script";
import { ReactNode } from "react";

/**
 * Componente seguro para JSON-LD schema
 * Valida y sanitiza el JSON antes de inyectarlo
 */
interface SafeJsonLdProps {
  data: Record<string, any>;
  id?: string;
}

export function SafeJsonLd({ data, id = "json-ld-schema" }: SafeJsonLdProps) {
  // Validación básica del JSON
  const isValidJsonLd = data["@context"] === "https://schema.org";

  if (!isValidJsonLd) {
    console.warn("Invalid JSON-LD schema detected");
    return null;
  }

  // Sanitizar el JSON (eliminar scripts potenciales)
  const sanitizedData = { ...data };

  // Eliminar propiedades potencialmente peligrosas
  const dangerousProps = ["script", "javascript", "onload", "onerror"];
  dangerousProps.forEach(prop => {
    if (sanitizedData[prop]) {
      delete sanitizedData[prop];
    }
  });

  const jsonString = JSON.stringify(sanitizedData);

  // Verificar que no contenga scripts
  if (jsonString.toLowerCase().includes("<script") ||
      jsonString.toLowerCase().includes("javascript:")) {
    console.error("Potential XSS detected in JSON-LD");
    return null;
  }

  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
      strategy="beforeInteractive"
    />
  );
}

/**
 * Componente seguro para scripts de analytics
 * Solo permite scripts pre-aprobados
 */
interface SafeAnalyticsScriptProps {
  provider: "plausible" | "google-analytics" | "custom";
  config?: Record<string, any>;
  children?: ReactNode;
}

export function SafeAnalyticsScript({
  provider,
  config = {},
  children,
}: SafeAnalyticsScriptProps) {
  if (provider === "plausible") {
    return (
      <>
        <Script
          defer
          data-domain={config['domain'] || "fiestaco.today"}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
        {children}
      </>
    );
  }

  // Para otros providers, usar implementaciones específicas seguras
  return null;
}

/**
 * Función para sanitizar strings y prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/<script/gi, "")
    .replace(/<\/script/gi, "");
}

/**
 * Validar y sanitizar URLs
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);

    // Solo permitir protocolos seguros
    const allowedProtocols = ["https:", "http:", "mailto:", "tel:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return "#";
    }

    // Sanitizar parámetros de query
    parsed.search = sanitizeString(parsed.search.substring(1));

    return parsed.toString();
  } catch {
    return "#";
  }
}

/**
 * Validar datos de formulario contra un schema
 */
export function validateFormData<T>(
  data: Record<string, any>,
  schema: Record<string, (value: any) => boolean>
): { valid: boolean; errors: string[]; sanitizedData: T } {
  const errors: string[] = [];
  const sanitizedData: Record<string, any> = {};

  Object.keys(schema).forEach((key) => {
    const validator = schema[key];
    const value = data[key];

    if (validator && !validator(value)) {
      errors.push(`Invalid value for ${key}`);
    } else if (validator) {
      // Sanitizar strings
      sanitizedData[key] = typeof value === "string" ? sanitizeString(value) : value;
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    sanitizedData: sanitizedData as T,
  };
}