import { NextRequest, NextResponse } from 'next/server';

// Versión SIMPLIFICADA y FUNCIONAL del endpoint analytics
export async function POST(request: NextRequest) {
  console.log('📥 ANALYTICS: Recibiendo evento');
  
  try {
    // 1. Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }
    
    // 2. Parsear body
    const body = await request.json();
    const { sessionId, eventName, pagePath, metadata } = body;
    
    console.log(`📊 Evento recibido: ${eventName} de ${sessionId}`);
    
    // 3. Validación básica
    if (!sessionId || !eventName || !pagePath) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, eventName, pagePath' },
        { status: 400 }
      );
    }
    
    // 4. Intentar guardar en SQLite (opcional)
    let dbSuccess = false;
    try {
      // Importación dinámica para evitar errores de carga
      const { getDb } = await import('@/lib/db');
      const db = await getDb();
      
      await db.run(
        `INSERT INTO events (session_id, event_name, page_path, metadata) 
         VALUES (?, ?, ?, ?)`,
        [sessionId, eventName, pagePath, metadata ? JSON.stringify(metadata) : null]
      );
      
      dbSuccess = true;
      console.log(`✅ Evento guardado en DB: ${eventName}`);
      
    } catch (dbError) {
      console.warn('⚠️ No se pudo guardar en DB (pero la API responde):', (dbError as Error).message);
      // NO fallamos la solicitud si la DB falla
    }
    
    // 5. Respuesta exitosa (siempre)
    return NextResponse.json({
      success: true,
      event: eventName,
      sessionId: sessionId,
      storedInDb: dbSuccess,
      timestamp: new Date().toISOString(),
      message: dbSuccess ? 'Event stored in database' : 'Event received (database unavailable)'
    });
    
  } catch (error) {
    console.error('❌ Error en analytics endpoint:', (error as Error).message);
    
    // Respuesta de error controlada (NO cae el servidor)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: (error as Error).message.substring(0, 100)
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Endpoint GET protegido pero robusto
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
