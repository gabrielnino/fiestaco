import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ANALYTICS_TOKEN || 'fiestaco-admin-2024';
    
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
    
    // 1. Estadísticas de hoy
    const today = new Date().toISOString().split('T')[0];
    const todayStats = await db.get(`
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

    // 2. Eventos recientes (últimos 20)
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

    // 3. Funnel de conversión (últimos 7 días)
    const funnelData = await db.all(`
      SELECT 
        event_name,
        COUNT(DISTINCT session_id) as users
      FROM events
      WHERE event_name IN ('page_view', 'wizard_start', 'step_visit', 'whatsapp_click')
        AND created_at >= DATETIME('now', '-7 days')
      GROUP BY event_name
      ORDER BY 
        CASE event_name
          WHEN 'page_view' THEN 1
          WHEN 'wizard_start' THEN 2
          WHEN 'step_visit' THEN 3
          WHEN 'whatsapp_click' THEN 4
        END
    `);

    // Calcular porcentajes para el funnel
    let funnelWithPercentages: Array<{event_name: string; users: number; percentage: number}> = [];
    if (funnelData.length > 0) {
      const baseUsers = funnelData[0].users;
      funnelWithPercentages = funnelData.map((item: any, index: number) => ({
        ...item,
        percentage: index === 0 ? 100 : Math.round((item.users / funnelData[0].users) * 100)
      }));
    }

    // 4. Sabores populares (últimos 7 días)
    const popularFlavors = await db.all(`
      SELECT 
        json_extract(metadata, '$.flavor') as flavor,
        COUNT(*) as selections
      FROM events
      WHERE event_name = 'flavor_select'
        AND created_at >= DATETIME('now', '-7 days')
        AND json_extract(metadata, '$.flavor') IS NOT NULL
        AND json_extract(metadata, '$.flavor') != 'null'
      GROUP BY flavor
      ORDER BY selections DESC
      LIMIT 10
    `);

    // 5. Tendencias diarias (últimos 14 días)
    const dailyTrends = await db.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as visits,
        SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as conversions
      FROM events
      WHERE created_at >= DATETIME('now', '-14 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 14
    `);

    return NextResponse.json({
      today: todayStats || {
        total_events: 0,
        unique_sessions_today: 0,
        page_views: 0,
        wizard_starts: 0,
        whatsapp_clicks: 0,
        conversion_rate: 0
      },
      recent_events: recentEvents || [],
      funnel: funnelWithPercentages,
      popular_flavors: popularFlavors || [],
      daily_trends: dailyTrends || []
    });
    
  } catch (error) {
    console.error('❌ Error en dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}