/**
 * Schemas de validación para inputs y APIs
 * Previene inyección de datos maliciosos
 */

// Simulación de Zod para ahora - implementaremos Zod real después
export interface ValidationSchema {
  validate: (data: any) => { success: boolean; errors: string[] };
  sanitize: (data: any) => any;
}

// Schemas para órdenes
export const orderSchema: ValidationSchema = {
  validate: (data: any) => {
    const errors: string[] = [];

    if (!data.order_id || typeof data.order_id !== "string") {
      errors.push("Invalid order_id");
    }

    if (data.flavor1 && typeof data.flavor1 !== "string") {
      errors.push("Invalid flavor1");
    }

    if (data.flavor2 && typeof data.flavor2 !== "string") {
      errors.push("Invalid flavor2");
    }

    if (!Array.isArray(data.addons)) {
      errors.push("addons must be an array");
    }

    if (!Array.isArray(data.drinks)) {
      errors.push("drinks must be an array");
    }

    if (typeof data.order_value !== "number" || data.order_value < 0) {
      errors.push("Invalid order_value");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  },

  sanitize: (data: any) => {
    const sanitized = { ...data };

    // Sanitizar strings
    if (typeof sanitized.order_id === "string") {
      sanitized.order_id = sanitized.order_id.replace(/[^a-zA-Z0-9-_]/g, "");
    }

    if (typeof sanitized.flavor1 === "string") {
      sanitized.flavor1 = sanitized.flavor1.replace(/[^a-zA-Z0-9-]/g, "");
    }

    if (typeof sanitized.flavor2 === "string") {
      sanitized.flavor2 = sanitized.flavor2.replace(/[^a-zA-Z0-9-]/g, "");
    }

    // Sanitizar arrays
    if (Array.isArray(sanitized.addons)) {
      sanitized.addons = sanitized.addons
        .filter((item: any) => typeof item === "string")
        .map((item: string) => item.replace(/[^a-zA-Z0-9-]/g, ""));
    }

    if (Array.isArray(sanitized.drinks)) {
      sanitized.drinks = sanitized.drinks
        .filter((item: any) => typeof item === "string")
        .map((item: string) => item.replace(/[^a-zA-Z0-9-]/g, ""));
    }

    return sanitized;
  },
};

// Schema para precios dinámicos
export const priceUpdateSchema: ValidationSchema = {
  validate: (data: any) => {
    const errors: string[] = [];

    if (typeof data.basePrice !== "number" || data.basePrice < 0) {
      errors.push("Invalid basePrice");
    }

    if (data.flavors && typeof data.flavors !== "object") {
      errors.push("flavors must be an object");
    }

    if (data.addons && typeof data.addons !== "object") {
      errors.push("addons must be an object");
    }

    if (data.drinks && typeof data.drinks !== "object") {
      errors.push("drinks must be an object");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  },

  sanitize: (data: any) => {
    const sanitized = { ...data };

    // Asegurar que los precios sean números positivos
    if (typeof sanitized.basePrice === "number") {
      sanitized.basePrice = Math.max(0, sanitized.basePrice);
    }

    // Sanitizar objetos de precios
    ["flavors", "addons", "drinks"].forEach((key) => {
      if (sanitized[key] && typeof sanitized[key] === "object") {
        const sanitizedObj: Record<string, number> = {};
        Object.entries(sanitized[key]).forEach(([itemId, price]) => {
          if (typeof itemId === "string" && typeof price === "number") {
            const cleanId = itemId.replace(/[^a-zA-Z0-9-]/g, "");
            sanitizedObj[cleanId] = Math.max(0, price);
          }
        });
        sanitized[key] = sanitizedObj;
      }
    });

    return sanitized;
  },
};

// Schema para UTM parameters
export const utmSchema: ValidationSchema = {
  validate: (data: any) => {
    const errors: string[] = [];

    if (data.utm_source && typeof data.utm_source !== "string") {
      errors.push("utm_source must be a string");
    }

    if (data.utm_medium && typeof data.utm_medium !== "string") {
      errors.push("utm_medium must be a string");
    }

    if (data.utm_campaign && typeof data.utm_campaign !== "string") {
      errors.push("utm_campaign must be a string");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  },

  sanitize: (data: any) => {
    const sanitized = { ...data };

    // Sanitizar UTM parameters
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
      (key) => {
        if (typeof sanitized[key] === "string") {
          sanitized[key] = sanitized[key]
            .substring(0, 100) // Limitar longitud
            .replace(/[^a-zA-Z0-9-_ ]/g, ""); // Solo caracteres seguros
        }
      }
    );

    return sanitized;
  },
};

// Schema para WhatsApp messages
export const whatsappMessageSchema: ValidationSchema = {
  validate: (data: any) => {
    const errors: string[] = [];

    if (!data.message || typeof data.message !== "string") {
      errors.push("Invalid message");
    }

    if (data.message.length > 1000) {
      errors.push("Message too long");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  },

  sanitize: (data: any) => {
    const sanitized = { ...data };

    // Sanitizar mensaje
    if (typeof sanitized.message === "string") {
      // Eliminar scripts y caracteres peligrosos
      sanitized.message = sanitized.message
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+=/gi, "")
        .substring(0, 1000); // Limitar longitud
    }

    return sanitized;
  },
};

// Función helper para validar cualquier dato
export function validateAndSanitize<T>(
  data: any,
  schema: ValidationSchema
): { success: boolean; data?: T; errors: string[] } {
  const validation = schema.validate(data);

  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  const sanitizedData = schema.sanitize(data);
  return { success: true, data: sanitizedData as T, errors: [] };
}

// Middleware para validación de API
export function createValidationMiddleware(schema: ValidationSchema) {
  return (req: any, res: any, next: Function) => {
    try {
      const result = validateAndSanitize(req.body, schema);

      if (!result.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: result.errors,
        });
      }

      // Reemplazar body con datos sanitizados
      req.body = result.data;
      next();
    } catch (error) {
      console.error("Validation middleware error:", error);
      return res.status(500).json({ error: "Internal validation error" });
    }
  };
}