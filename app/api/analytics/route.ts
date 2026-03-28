import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      eventName,
      pagePath,
      metadata,
    } = body;

    // Validación básica
    if (!sessionId || !eventName || !pagePath) {
      console.warn('⚠️ Analytics: Campos requeridos faltantes', { sessionId, eventName, pagePath });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Obtener información del cliente
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Insertar evento
    await db.run(
      `INSERT INTO events 
       (session_id, event_name, page_path, metadata, user_agent, referrer, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        eventName,
        pagePath,
        metadata ? JSON.stringify(metadata) : null,
        userAgent.substring(0, 500), // Limitar tamaño
        referrer.substring(0, 500),
        ip
      ]
    );

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Evento registrado: ${eventName}`, { sessionId, pagePath });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error en analytics:', error);
    // NO fallar la aplicación si analytics falla
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Endpoint GET para estadísticas básicas (protegido)
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación básica (puedes mejorar esto)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ANALYTICS_TOKEN || 'fiestaco-dev';
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
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

    const db = await getDb();
    
    // Estadísticas de hoy
    const today = new Date().toISOString().split('T')[0];
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions_today,
        SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as page_views,
        SUM(CASE WHEN event_name = 'wizard_start' THEN 1 ELSE 0 END) as wizard_starts,
        SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks,
        ROUND(100.0 * 
          SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) / 
          NULLIF(SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END), 0), 2) as conversion_rate
      FROM events
      WHERE DATE(created_at) = ?
    `, [today]);

    // Eventos más recientes
    const recentEvents = await db.all(`
      SELECT 
        session_id,
        event_name,
        page_path,
        metadata,
        created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT 20
    `);

    return NextResponse.json({
      today: stats,
      recent_events: recentEvents
    });
    
  } catch (error) {
    console.error('❌ Error obteniendo stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}