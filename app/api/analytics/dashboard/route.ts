import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ANALYTICS_TOKEN || 'fiestaco-admin-2024';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (authHeader.substring(7) !== expectedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];

    // ─── 1. KPIs DEL DÍA (eventos de intención) ──────────────────────────────
    const todayStats = await db.get(`
      SELECT
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as unique_sessions_today,
        SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END) as page_views,
        SUM(CASE WHEN event_name = 'wizard_start' THEN 1 ELSE 0 END) as wizard_starts,
        SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks,
        ROUND(100.0 *
          SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) /
          NULLIF(SUM(CASE WHEN event_name = 'page_view' THEN 1 ELSE 0 END), 0), 2) as conversion_intent,
        ROUND(COALESCE(SUM(
          CASE WHEN event_name = 'whatsapp_click'
          THEN COALESCE(
            CAST(json_extract(metadata, '$.order_value') AS REAL),
            CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0
          ) ELSE 0 END
        ), 0), 2) as revenue_intent
      FROM events
      WHERE DATE(created_at) = ?
    `, [today]);

    // ─── 1b. REVENUE REAL (desde tabla orders) ────────────────────────────────
    const realRevenue = await db.get(`
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as orders_won,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as orders_pending,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as orders_lost,
        ROUND(SUM(CASE WHEN status = 'won'
          THEN COALESCE(final_price, intended_price) ELSE 0 END), 2) as revenue_real,
        ROUND(AVG(CASE WHEN status = 'won'
          THEN COALESCE(final_price, intended_price) END), 2) as avg_ticket_real,
        ROUND(100.0 * SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) /
          NULLIF(COUNT(*), 0), 2) as close_rate
      FROM orders
      WHERE DATE(created_at) = ?
    `, [today]);

    // ─── 1c. POR QUÉ PIERDES DESPUÉS DE WHATSAPP ─────────────────────────────
    const lostReasons = await db.all(`
      SELECT
        COALESCE(reason, 'unknown') as reason,
        COUNT(*) as count
      FROM orders
      WHERE status = 'lost'
        AND created_at >= DATETIME('now', '-30 days')
      GROUP BY reason
      ORDER BY count DESC
    `);

    // ─── 1d. ÓRDENES PENDIENTES (necesitan respuesta) ─────────────────────────
    const pendingOrders = await db.all(`
      SELECT order_id, intended_price, flavor1, flavor2, utm_source, created_at
      FROM orders
      WHERE status = 'pending'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // ─── 2. EVENTOS RECIENTES (últimos 20) ───────────────────────────────────
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

    // ─── 3. FUNNEL DE CONVERSIÓN (últimos 7 días) ────────────────────────────
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

    let funnelWithPercentages: Array<{event_name: string; users: number; percentage: number}> = [];
    if (funnelData.length > 0) {
      funnelWithPercentages = funnelData.map((item: any, index: number) => ({
        ...item,
        percentage: index === 0 ? 100 : Math.round((item.users / funnelData[0].users) * 100)
      }));
    }

    // ─── 4. CAMBIO 2: ABANDONO POR PASO ─────────────────────────────────────
    const abandonByStep = await db.all(`
      SELECT
        CAST(json_extract(metadata, '$.at_step') AS INTEGER) as at_step,
        COUNT(*) as abandons,
        ROUND(AVG(COALESCE(CAST(json_extract(metadata, '$.had_price') AS REAL), 0)), 2) as avg_price_at_abandon
      FROM events
      WHERE event_name = 'wizard_abandon'
        AND created_at >= DATETIME('now', '-30 days')
        AND json_extract(metadata, '$.at_step') IS NOT NULL
      GROUP BY at_step
      ORDER BY at_step
    `);

    // ─── 5. CAMBIO 3: ATRIBUCIÓN UTM ─────────────────────────────────────────
    const channelAttribution = await db.all(`
      SELECT
        COALESCE(json_extract(metadata, '$.utm_source'), 'direct') as utm_source,
        COUNT(*) as orders,
        ROUND(SUM(
          COALESCE(CAST(json_extract(metadata, '$.order_value') AS REAL),
                   CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0)
        ), 2) as revenue,
        ROUND(AVG(
          COALESCE(CAST(json_extract(metadata, '$.order_value') AS REAL),
                   CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0)
        ), 2) as avg_order
      FROM events
      WHERE event_name = 'whatsapp_click'
        AND created_at >= DATETIME('now', '-30 days')
      GROUP BY utm_source
      ORDER BY revenue DESC
    `);

    // ─── 6. CAMBIO 4: COMBOS MÁS VENDIDOS ────────────────────────────────────
    const topCombos = await db.all(`
      SELECT
        COALESCE(json_extract(metadata, '$.combo'),
          json_extract(metadata, '$.flavor1') || '+' || json_extract(metadata, '$.flavor2')
        ) as combo,
        COUNT(*) as orders,
        ROUND(SUM(
          COALESCE(CAST(json_extract(metadata, '$.order_value') AS REAL),
                   CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0)
        ), 2) as total_revenue,
        ROUND(AVG(
          COALESCE(CAST(json_extract(metadata, '$.order_value') AS REAL),
                   CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0)
        ), 2) as avg_order
      FROM events
      WHERE event_name = 'whatsapp_click'
        AND created_at >= DATETIME('now', '-30 days')
        AND (json_extract(metadata, '$.combo') IS NOT NULL
             OR json_extract(metadata, '$.flavor1') IS NOT NULL)
      GROUP BY combo
      ORDER BY orders DESC
      LIMIT 10
    `);

    // ─── 7. SABORES POPULARES (últimos 7 días) ────────────────────────────────
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

    // ─── 8. TENDENCIAS DIARIAS (últimos 14 días) con REVENUE ─────────────────
    const dailyTrends = await db.all(`
      SELECT
        DATE(created_at) as date,
        COUNT(DISTINCT session_id) as visits,
        SUM(CASE WHEN event_name = 'whatsapp_click' THEN 1 ELSE 0 END) as conversions,
        ROUND(SUM(
          CASE WHEN event_name = 'whatsapp_click' THEN
            COALESCE(CAST(json_extract(metadata, '$.order_value') AS REAL),
                     CAST(json_extract(metadata, '$.totalPrice') AS REAL), 0)
          ELSE 0 END
        ), 2) as revenue
      FROM events
      WHERE created_at >= DATETIME('now', '-14 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 14
    `);

    return NextResponse.json({
      today: todayStats || {
        total_events: 0, unique_sessions_today: 0, page_views: 0,
        wizard_starts: 0, whatsapp_clicks: 0, conversion_intent: 0, revenue_intent: 0,
      },
      // REVENUE REAL — from orders table (won/lost/pending)
      real_revenue: realRevenue || {
        total_orders: 0, orders_won: 0, orders_pending: 0, orders_lost: 0,
        revenue_real: 0, avg_ticket_real: 0, close_rate: 0,
      },
      pending_orders: pendingOrders || [],
      lost_reasons: lostReasons || [],
      // Existing BI data
      recent_events: recentEvents || [],
      funnel: funnelWithPercentages,
      popular_flavors: popularFlavors || [],
      daily_trends: dailyTrends || [],
      abandon_by_step: abandonByStep || [],
      channel_attribution: channelAttribution || [],
      top_combos: topCombos || [],
    });


  } catch (error) {
    console.error('❌ Error en dashboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}