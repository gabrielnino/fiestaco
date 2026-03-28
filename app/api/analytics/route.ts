import { NextRequest, NextResponse } from 'next/server';

// Versión MEJORADA con validaciones robustas
export async function POST(request: NextRequest) {
  console.log('📥 ANALYTICS IMPROVED: Recibiendo evento');
  
  try {
    // 1. Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }
    
    // 2. Parsear body con manejo de errores mejorado
    let body;
    try {
      const text = await request.text();
      if (!text.trim()) {
        return NextResponse.json(
          { error: 'Request body is empty' },
          { status: 400 }
        );
      }
      body = JSON.parse(text);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }
    
    const { sessionId, eventName, pagePath, metadata } = body;
    
    // 3. Validación robusta de campos requeridos
    const errors: string[] = [];
    
    // Validar sessionId
    if (typeof sessionId !== 'string') {
      errors.push('sessionId must be a string');
    } else if (!sessionId.trim()) {
      errors.push('sessionId cannot be empty or whitespace only');
    } else if (sessionId.length > 255) {
      errors.push('sessionId cannot exceed 255 characters');
    } else if (!/^[a-zA-Z0-9\-_.:@]+$/.test(sessionId)) {
      errors.push('sessionId contains invalid characters');
    }
    
    // Validar eventName
    if (typeof eventName !== 'string') {
      errors.push('eventName must be a string');
    } else if (!eventName.trim()) {
      errors.push('eventName cannot be empty or whitespace only');
    } else if (eventName.length > 100) {
      errors.push('eventName cannot exceed 100 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(eventName)) {
      errors.push('eventName can only contain letters, numbers, and underscores');
    }
    
    // Validar pagePath
    if (typeof pagePath !== 'string') {
      errors.push('pagePath must be a string');
    } else if (!pagePath.trim()) {
      errors.push('pagePath cannot be empty or whitespace only');
    } else if (pagePath.length > 500) {
      errors.push('pagePath cannot exceed 500 characters');
    } else if (!pagePath.startsWith('/')) {
      errors.push('pagePath must start with /');
    }
    
    // Validar metadata (opcional)
    if (metadata !== undefined && metadata !== null) {
      if (typeof metadata !== 'object' || Array.isArray(metadata)) {
        errors.push('metadata must be an object');
      } else {
        try {
          const metadataStr = JSON.stringify(metadata);
          if (metadataStr.length > 5000) {
            errors.push('metadata cannot exceed 5000 characters when serialized');
          }
        } catch {
          errors.push('metadata must be JSON serializable');
        }
      }
    }
    
    // Si hay errores, retornarlos
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors 
        },
        { status: 400 }
      );
    }
    
    console.log(`📊 Evento validado: ${eventName} de ${sessionId}`);
    
    // 4. Intentar guardar en SQLite (con sanitización)
    let dbSuccess = false;
    try {
      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      // Sanitizar metadata para SQLite
      const sanitizedMetadata = metadata ? JSON.stringify(metadata) : null;
      
      await db.run(
        `INSERT INTO events (session_id, event_name, page_path, metadata) 
         VALUES (?, ?, ?, ?)`,
        [sessionId.trim(), eventName.trim(), pagePath.trim(), sanitizedMetadata]
      );
      
      dbSuccess = true;
      console.log(`✅ Evento guardado en DB: ${eventName}`);
      
    } catch (dbError) {
      console.warn('⚠️ No se pudo guardar en DB (pero la API responde):', (dbError as Error).message);
      // NO fallamos la solicitud si la DB falla
    }
    
    // 5. Respuesta exitosa
    return NextResponse.json({
      success: true,
      event: eventName,
      sessionId: sessionId,
      storedInDb: dbSuccess,
      timestamp: new Date().toISOString(),
      message: dbSuccess ? 'Event stored in database' : 'Event received (database unavailable)'
    });
    
  } catch (error) {
    console.error('❌ Error inesperado en analytics endpoint:', (error as Error).message);
    
    // Respuesta de error genérica para errores inesperados
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Mantener GET endpoint igual por ahora
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ANALYTICS_TOKEN || 'fiestaco-dev';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Bearer token required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.substring(7);
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({
      message: 'Analytics API',
      status: 'operational',
      timestamp: new Date().toISOString(),
      endpoints: {
        POST: 'Track analytics events',
        GET: 'Get analytics stats (requires auth)'
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      message: 'Analytics API',
      status: 'error',
      error: (error as Error).message
    }, { status: 500 });
  }
}
