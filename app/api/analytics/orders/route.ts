import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const ADMIN_TOKEN = process.env.ANALYTICS_TOKEN || 'fiestaco-admin-2024';

function isAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${ADMIN_TOKEN}`;
}

// ── POST: crear orden pendiente (llamado desde el sitio al hacer click en WhatsApp)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, intended_price, flavor1, flavor2, utm_source } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    const db = await getDb();
    await db.run(`
      INSERT OR IGNORE INTO orders (order_id, intended_price, flavor1, flavor2, utm_source, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `, [order_id, intended_price ?? null, flavor1 ?? null, flavor2 ?? null, utm_source ?? 'direct']);

    return NextResponse.json({ success: true, order_id, status: 'pending' });
  } catch (error) {
    console.error('❌ Error creando orden:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── PATCH: registrar resultado (won/lost) — solo admin desde el dashboard
export async function PATCH(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { order_id, status, final_price, reason, notes } = body;

    if (!order_id || !['won', 'lost', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'order_id and valid status (won|lost|pending) are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.run(`
      UPDATE orders
      SET status = ?,
          final_price = ?,
          reason = ?,
          notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = ?
    `, [status, final_price ?? null, reason ?? null, notes ?? null, order_id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order_id, status });
  } catch (error) {
    console.error('❌ Error actualizando orden:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ── GET: listar órdenes — solo admin
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending | won | lost | all
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = await getDb();
    const where = status && status !== 'all' ? `WHERE status = '${status}'` : '';

    const orders = await db.all(`
      SELECT
        o.order_id,
        o.status,
        o.intended_price,
        o.final_price,
        o.reason,
        o.flavor1,
        o.flavor2,
        o.utm_source,
        o.notes,
        o.created_at,
        o.updated_at
      FROM orders o
      ${where}
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [limit]);

    const summary = await db.get(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) as won,
        SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) as lost,
        ROUND(SUM(CASE WHEN status = 'won' THEN COALESCE(final_price, intended_price) ELSE 0 END), 2) as revenue_real,
        ROUND(AVG(CASE WHEN status = 'won' THEN COALESCE(final_price, intended_price) END), 2) as avg_ticket_real
      FROM orders
      WHERE created_at >= DATETIME('now', '-30 days')
    `);

    return NextResponse.json({ orders, summary });
  } catch (error) {
    console.error('❌ Error listando órdenes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
