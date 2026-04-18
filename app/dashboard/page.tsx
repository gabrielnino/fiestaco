'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ── Types ────────────────────────────────────────────────────
interface DashboardStats {
  today: {
    total_events: number;
    unique_sessions_today: number;
    page_views: number;
    wizard_starts: number;
    whatsapp_clicks: number;
    conversion_intent: number;
    revenue_intent: number;
  };
  real_revenue: {
    total_orders: number;
    orders_won: number;
    orders_pending: number;
    orders_lost: number;
    revenue_real: number;
    avg_ticket_real: number;
    close_rate: number;
  };
  pending_orders: Array<{
    order_id: string;
    intended_price: number;
    flavor1: string;
    flavor2: string;
    utm_source: string;
    created_at: string;
  }>;
  lost_reasons: Array<{ reason: string; count: number }>;
  recent_events: Array<{
    session_id: string;
    event_name: string;
    page_path: string;
    metadata: string | null;
    created_at: string;
  }>;
  funnel: Array<{ event_name: string; users: number; percentage: number }>;
  popular_flavors: Array<{ flavor: string; selections: number }>;
  daily_trends: Array<{ date: string; visits: number; conversions: number; revenue: number }>;
  abandon_by_step: Array<{ at_step: number; abandons: number; avg_price_at_abandon: number }>;
  channel_attribution: Array<{ utm_source: string; orders: number; revenue: number; avg_order: number }>;
  top_combos: Array<{ combo: string; orders: number; total_revenue: number; avg_order: number }>;
}

// ── Design tokens ────────────────────────────────────────────
const C = {
  bg: '#0a0a0a',
  card: '#141414',
  border: '#1e1e1e',
  text: '#f0f0f0',
  muted: '#666',
  orange: '#FF7A00',
  magenta: '#E6399B',
  blue: '#4361ee',
  cyan: '#2EC4B6',
  green: '#38b000',
  yellow: '#FFD23F',
  red: '#D72638',
};

const card = {
  background: C.card,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  padding: '20px 24px',
};

function KpiCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>}
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...card, marginBottom: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 18, margin: '0 0 18px' }}>{title}</h2>
      {children}
    </div>
  );
}

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 6, background: '#222', borderRadius: 3, overflow: 'hidden', flex: 1 }}>
      <div style={{ width: `${Math.max(pct, 2)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
    </div>
  );
}

const EVENT_COLOR: Record<string, string> = {
  whatsapp_click: C.orange,
  wizard_start: C.magenta,
  page_view: C.blue,
  wizard_abandon: C.red,
  step_back: C.yellow,
};

// ── Main Component ────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  // Order registration form state
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<'won' | 'lost'>('won');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderReason, setOrderReason] = useState('no_response');
  const [orderNotes, setOrderNotes] = useState('');
  const [registerMsg, setRegisterMsg] = useState('');

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/analytics/dashboard', {
        headers: { Authorization: 'Bearer fiestaco-admin-2024' },
      });
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const data = await res.json();
      setStats(data);
      setLastUpdated(new Date().toLocaleTimeString('es-ES'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('fiestaco_dashboard_token');
    if (token === 'fiestaco-dev') { setAuthenticated(true); fetchStats(); }
  }, [fetchStats]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fiestaco2024') {
      localStorage.setItem('fiestaco_dashboard_token', 'fiestaco-dev');
      setAuthenticated(true);
      fetchStats();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleRegisterOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    try {
      const res = await fetch('/api/analytics/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer fiestaco-admin-2024' },
        body: JSON.stringify({
          order_id: orderId.trim().toUpperCase(),
          status: orderStatus,
          final_price: orderPrice ? parseFloat(orderPrice) : null,
          reason: orderStatus === 'lost' ? orderReason : null,
          notes: orderNotes || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterMsg(`✅ ${orderId.toUpperCase()} → ${orderStatus.toUpperCase()}`);
        setOrderId(''); setOrderPrice(''); setOrderNotes('');
        fetchStats();
      } else {
        setRegisterMsg(`❌ ${data.error || 'Error'}`);
      }
    } catch {
      setRegisterMsg('❌ Error de conexión');
    }
    setTimeout(() => setRegisterMsg(''), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem('fiestaco_dashboard_token');
    setAuthenticated(false);
    router.push('/');
  };

  // ── CSV Export (for manual Google Sheets) ──────────────────
  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/analytics/orders?limit=500', {
        headers: { Authorization: 'Bearer fiestaco-admin-2024' },
      });
      const data = await res.json();
      const rows = data.orders || [];
      const header = 'Order ID,Status,Precio Estimado,Precio Final,Raz\u00f3n,Sabor 1,Sabor 2,Canal UTM,Fecha';
      const csv = [
        header,
        ...rows.map((o: any) =>
          [
            o.order_id, o.status,
            o.intended_price ?? '', o.final_price ?? '',
            o.reason ?? '', o.flavor1 ?? '', o.flavor2 ?? '',
            o.utm_source ?? 'direct',
            new Date(o.created_at).toLocaleDateString('es-ES'),
          ].join(',')
        ),
      ].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiestaco-orders-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Error al exportar');
    }
  };

  // ── UTM Link Generator state ─────────────────────────────────
  const [utmSource, setUtmSource] = useState('instagram');
  const [utmMedium, setUtmMedium] = useState('bio');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmCopied, setUtmCopied] = useState(false);
  const utmLink = `https://fiestaco.today?utm_source=${utmSource}&utm_medium=${utmMedium}${utmCampaign ? `&utm_campaign=${utmCampaign}` : ''}`;
  const copyUTM = () => {
    navigator.clipboard.writeText(utmLink).then(() => {
      setUtmCopied(true);
      setTimeout(() => setUtmCopied(false), 2000);
    });
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-CA').format(n);
  const fmtCA = (n: number) => `CA$${n.toFixed(2)}`;
  const pct = (a: number, b: number) => b === 0 ? 0 : Math.round((a / b) * 100);

  // ── Login Screen ─────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ ...card, maxWidth: 380, width: '100%', padding: '48px 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <h1 style={{ color: C.text, fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Control de Negocio</h1>
            <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>Fiestaco · Acceso restringido</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              style={{ width: '100%', padding: '12px 16px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 15, boxSizing: 'border-box', outline: 'none', marginBottom: 12 }}
            />
            {error && <p style={{ color: C.red, fontSize: 13, margin: '0 0 12px', textAlign: 'center' }}>{error}</p>}
            <button type="submit" style={{ width: '100%', padding: '12px', background: `linear-gradient(135deg, ${C.orange}, ${C.magenta})`, color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, color: C.text, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <p style={{ color: C.muted }}>Cargando datos...</p>
        </div>
      </div>
    );
  }

  const s = stats!;
  const maxRevenue = Math.max(...(s.daily_trends.map(d => d.revenue)), 1);
  const maxVisits = Math.max(...(s.daily_trends.map(d => d.visits)), 1);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', maxWidth: 1200, margin: '0 auto' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
            <span style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.magenta})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fiestaco</span>
            {' '}· Control de Negocio
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Actualizado: {lastUpdated}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => router.push('/dashboard/prices')} style={{ padding: '8px 16px', background: `linear-gradient(135deg, ${C.orange}, ${C.magenta})`, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>⚙️ Precios</button>
          <button onClick={handleExportCSV} style={{ padding: '8px 16px', background: '#1a2a1a', color: C.green, border: `1px solid ${C.green}44`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📊 Exportar CSV</button>
          <button onClick={fetchStats} style={{ padding: '8px 16px', background: '#1e1e1e', color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↺ Actualizar</button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Salir</button>
        </div>
      </div>

      {/* ── Row 1: KPIs — REAL vs INTENCIÓN ──────────────────── */}
      {/* REAL REVENUE (from won orders) */}
      <div style={{ marginBottom: 8 }}>
        <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>💰 Revenue Real (ventas confirmadas)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
          <KpiCard icon="💰" label="Revenue Real" value={fmtCA(s.real_revenue?.revenue_real || 0)} sub="Ventas confirmadas (won)" color={C.yellow} />
          <KpiCard icon="✅" label="Ventas Reales" value={fmt(s.real_revenue?.orders_won || 0)} sub="Orders marcados won" color={C.green} />
          <KpiCard icon="🎫" label="Ticket Real" value={fmtCA(s.real_revenue?.avg_ticket_real || 0)} sub="Promedio por venta ganada" color={C.cyan} />
          <KpiCard icon="📊" label="Tasa de Cierre" value={`${s.real_revenue?.close_rate?.toFixed(1) || 0}%`} sub="Won / total intenciones" color={C.orange} />
        </div>
      </div>

      {/* INTENT (whatsapp clicks — not confirmed sales) */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>⏳ Intención (no son ventas aún)</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <KpiCard icon="📱" label="Intenciones WA" value={fmt(s.today.whatsapp_clicks)} sub="Clicks en WhatsApp" color={C.blue} />
          <KpiCard icon="⏳" label="Sin Respuesta" value={fmt(s.real_revenue?.orders_pending || 0)} sub="Órdenes pendientes" color={'#aaa'} />
          <KpiCard icon="❌" label="Perdidas" value={fmt(s.real_revenue?.orders_lost || 0)} sub="No cerraron" color={C.red} />
          <KpiCard icon="👥" label="Visitas Hoy" value={fmt(s.today.unique_sessions_today)} sub={`${s.today.conversion_intent || 0}% → WA`} color={C.magenta} />
        </div>
      </div>

      {/* ── REGISTRAR RESULTADO DE ORDEN ── (ACCIÓN PRINCIPAL) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Form */}
        <div style={{ ...card, border: `1px solid ${C.orange}33` }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📋</span> Registrar Resultado de Orden
          </h2>
          <form onSubmit={handleRegisterOrder}>
            {/* Order ID */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Order ID (del mensaje WhatsApp)</label>
              <input
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="FCO-0329-A1B2"
                style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 14, boxSizing: 'border-box', fontFamily: 'monospace' }}
              />
            </div>

            {/* Status buttons */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6 }}>Resultado</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setOrderStatus('won')} style={{ flex: 1, padding: '9px', background: orderStatus === 'won' ? C.green : '#1a1a1a', color: orderStatus === 'won' ? '#000' : C.muted, border: `1px solid ${orderStatus === 'won' ? C.green : C.border}`, borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>✅ WON</button>
                <button type="button" onClick={() => setOrderStatus('lost')} style={{ flex: 1, padding: '9px', background: orderStatus === 'lost' ? C.red : '#1a1a1a', color: orderStatus === 'lost' ? '#fff' : C.muted, border: `1px solid ${orderStatus === 'lost' ? C.red : C.border}`, borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>❌ LOST</button>
              </div>
            </div>

            {/* Lost reason (only if lost) */}
            {orderStatus === 'lost' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>¿Por qué se perdió?</label>
                <select value={orderReason} onChange={e => setOrderReason(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13 }}>
                  <option value="no_response">Sin respuesta del cliente</option>
                  <option value="price">Precio muy alto</option>
                  <option value="changed_mind">Cambió de idea</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            )}

            {/* Final price (optional override) */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Precio final (CA$ — opcional si difiere)</label>
              <input value={orderPrice} onChange={e => setOrderPrice(e.target.value)} placeholder="ej: 74.31" type="number" step="0.01" style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 14, boxSizing: 'border-box' }} />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Notas (opcional)</label>
              <input value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Detalles adicionales..." style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '11px', background: `linear-gradient(135deg, ${C.orange}, ${C.magenta})`, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Registrar
            </button>

            {registerMsg && (
              <p style={{ marginTop: 10, textAlign: 'center', fontSize: 13, color: registerMsg.startsWith('✅') ? C.green : C.red }}>{registerMsg}</p>
            )}
          </form>
        </div>

        {/* Pending orders + Lost reasons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Pending */}
          <div style={{ ...card, flex: 1 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>⏳ Pendientes de Registrar</h2>
            {s.pending_orders.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>✅ Sin pendientes — todo registrado</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {s.pending_orders.map(o => (
                  <div key={o.order_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: '#1a1a1a', borderRadius: 6, cursor: 'pointer' }} onClick={() => setOrderId(o.order_id)} title="Click para llenar el form">
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: C.orange }}>{o.order_id}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 12, color: C.yellow }}>{fmtCA(o.intended_price)}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{o.utm_source}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lost Reasons */}
          <div style={{ ...card, flex: 1 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 12px' }}>❓ Por qué pierdes después de WA</h2>
            {s.lost_reasons.length === 0 ? (
              <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Sin datos aún — registra algunas órdenes perdidas</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {s.lost_reasons.map(r => {
                  const total = s.lost_reasons.reduce((a, b) => a + b.count, 0);
                  const reasonLabel: Record<string, string> = { no_response: 'Sin respuesta', price: 'Precio alto', changed_mind: 'Cambió de idea', other: 'Otro', unknown: 'Sin registrar' };
                  return (
                    <div key={r.reason}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: C.text }}>{reasonLabel[r.reason] || r.reason}</span>
                        <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{r.count} ({pct(r.count, total)}%)</span>
                      </div>
                      <Bar pct={pct(r.count, total)} color={C.red} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: Revenue Chart (14 days) ────────────────────── */}
      <SectionCard title="💰 Revenue & Visitas — Últimos 14 días">
        {s.daily_trends.length === 0 ? (
          <p style={{ color: C.muted, textAlign: 'center', padding: '24px 0' }}>Sin datos aún</p>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 100, marginBottom: 8 }}>
              {[...s.daily_trends].reverse().map((d) => (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'flex-end', height: 80 }}>
                    <div title={`CA$${d.revenue}`} style={{ width: '45%', height: `${Math.max((d.revenue / maxRevenue) * 80, 2)}px`, background: C.orange, borderRadius: '2px 2px 0 0', transition: 'height 0.4s ease' }} />
                    <div title={`${d.visits} visitas`} style={{ width: '45%', height: `${Math.max((d.visits / maxVisits) * 80, 2)}px`, background: C.blue, borderRadius: '2px 2px 0 0', transition: 'height 0.4s ease', opacity: 0.7 }} />
                  </div>
                  <div style={{ fontSize: 9, color: C.muted, whiteSpace: 'nowrap' }}>
                    {new Date(d.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', fontSize: 11, color: C.muted }}>
              <span><span style={{ color: C.orange }}>■</span> Revenue (CA$)</span>
              <span><span style={{ color: C.blue, opacity: 0.7 }}>■</span> Visitas</span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Row 3: Drop-off + Attribution ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Drop-off por paso */}
        <SectionCard title="🚪 Donde pierdes ventas">
          {s.abandon_by_step.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <p style={{ margin: 0, fontSize: 13 }}>Sin abandonos registrados</p>
            </div>
          ) : (
            <div>
              {[1, 2, 3, 4, 5].map(step => {
                const data = s.abandon_by_step.find(a => a.at_step === step);
                const stepLabel = ['', 'Sabor 1', 'Sabor 2', 'Add-ons', 'Bebidas', 'Resumen'][step];
                const total = s.abandon_by_step.reduce((acc, a) => acc + a.abandons, 0);
                const percent = data ? pct(data.abandons, total) : 0;
                return (
                  <div key={step} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: data ? C.text : C.muted }}>Paso {step} — {stepLabel}</span>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {data != null && (data.avg_price_at_abandon ?? 0) > 0 && (
                          <span style={{ fontSize: 11, color: C.yellow }}>{fmtCA(data.avg_price_at_abandon ?? 0)} promedio</span>
                        )}
                        <span style={{ fontSize: 13, color: data ? C.red : C.muted, fontWeight: 600 }}>
                          {data ? data.abandons : 0}
                        </span>
                      </div>
                    </div>
                    <Bar pct={percent} color={C.red} />
                  </div>
                );
              })}
              <p style={{ fontSize: 11, color: C.muted, marginTop: 12, margin: '12px 0 0' }}>
                Últimos 30 días · CA$ perdido visible por paso
              </p>
            </div>
          )}
        </SectionCard>

        {/* Atribución UTM */}
        <SectionCard title="📣 Canales que convierten">
          {s.channel_attribution.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📣</div>
              <p style={{ margin: 0, fontSize: 13 }}>Sin órdenes atribuidas aún</p>
              <p style={{ margin: '6px 0 0', fontSize: 11 }}>Usa ?utm_source=instagram en tus links</p>
            </div>
          ) : (
            <div>
              {s.channel_attribution.map((ch, i) => {
                const maxRev = Math.max(...s.channel_attribution.map(c => c.revenue), 1);
                const channelColor = ch.utm_source === 'instagram' ? '#E1306C' :
                  ch.utm_source === 'tiktok' ? '#69C9D0' :
                  ch.utm_source === 'direct' ? C.muted :
                  ch.utm_source === 'whatsapp' ? '#25D366' : C.cyan;
                return (
                  <div key={ch.utm_source} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: C.text, fontWeight: 500, textTransform: 'capitalize' }}>
                        {ch.utm_source}
                      </span>
                      <div style={{ display: 'flex', gap: 14 }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{ch.orders} pedidos</span>
                        <span style={{ fontSize: 13, color: C.yellow, fontWeight: 700 }}>{fmtCA(ch.revenue)}</span>
                      </div>
                    </div>
                    <Bar pct={pct(ch.revenue, maxRev)} color={channelColor} />
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>
                      Ticket promedio: {fmtCA(ch.avg_order)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Row 4: Funnel + Combos ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Funnel clásico */}
        <SectionCard title="🪜 Funnel de Conversión — 7 días">
          {s.funnel.length === 0 ? (
            <p style={{ color: C.muted, textAlign: 'center', padding: '20px 0', margin: 0 }}>Sin datos</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {s.funnel.map((step, i) => {
                const label = { page_view: 'Visitan la página', wizard_start: 'Inician wizard', step_visit: 'Completan pasos', whatsapp_click: 'Hacen pedido' }[step.event_name] || step.event_name;
                const color = i === s.funnel.length - 1 ? C.orange : C.blue;
                return (
                  <div key={step.event_name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: C.text }}>{label}</span>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ fontSize: 12, color: C.muted }}>{fmt(step.users)} usuarios</span>
                        <span style={{ fontSize: 13, color, fontWeight: 600 }}>{step.percentage}%</span>
                      </div>
                    </div>
                    <Bar pct={step.percentage} color={color} />
                    {i > 0 && <span style={{ fontSize: 11, color: C.red }}>↓ {100 - step.percentage}% abandono</span>}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Top combos */}
        <SectionCard title="🌮 Combos que venden más">
          {s.top_combos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: C.muted }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🌮</div>
              <p style={{ margin: 0, fontSize: 13 }}>Sin combos registrados aún</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.top_combos.slice(0, 6).map((combo, i) => (
                <div key={combo.combo} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#1a1a1a', borderRadius: 8 }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center' }}>{['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                      {combo.combo?.split('+').join(' + ') || 'N/A'}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted }}>{combo.orders} pedido{combo.orders !== 1 ? 's' : ''} · prom. {fmtCA(combo.avg_order)}</div>
                  </div>
                  <span style={{ fontSize: 14, color: C.yellow, fontWeight: 700 }}>{fmtCA(combo.total_revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Row 5: Popular Flavors + Recent Orders ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>

        {/* Sabores populares */}
        <SectionCard title="🫙 Sabores Seleccionados — 7 días">
          {s.popular_flavors.length === 0 ? (
            <p style={{ color: C.muted, textAlign: 'center', padding: '20px 0', margin: 0 }}>Sin datos</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {s.popular_flavors.map((f, i) => {
                const maxSel = s.popular_flavors[0]?.selections || 1;
                return (
                  <div key={f.flavor}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: C.text }}>{i + 1}. {f.flavor}</span>
                      <span style={{ fontSize: 12, color: C.muted }}>{fmt(f.selections)}</span>
                    </div>
                    <Bar pct={pct(f.selections, maxSel)} color={i === 0 ? C.orange : i === 1 ? C.magenta : C.cyan} />
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* Eventos recientes: solo órdenes y eventos importantes */}
        <SectionCard title="⏰ Actividad Reciente">
          {s.recent_events.length === 0 ? (
            <p style={{ color: C.muted, textAlign: 'center', padding: '20px 0', margin: 0 }}>Sin eventos</p>
          ) : (
            <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.recent_events.map((ev, i) => {
                let meta: any = {};
                try { meta = ev.metadata ? JSON.parse(ev.metadata) : {}; } catch {}
                const isOrder = ev.event_name === 'whatsapp_click';
                const isAbandon = ev.event_name === 'wizard_abandon';
                const orderValue = meta.order_value || meta.totalPrice;
                return (
                  <div key={i} style={{
                    padding: '8px 12px',
                    background: '#1a1a1a',
                    borderRadius: 7,
                    borderLeft: `3px solid ${EVENT_COLOR[ev.event_name] || C.muted}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: isOrder ? 700 : 400 }}>
                        {ev.event_name}
                        {isOrder && orderValue && (
                          <span style={{ color: C.yellow, marginLeft: 8 }}>{fmtCA(orderValue)}</span>
                        )}
                        {isAbandon && meta.at_step && (
                          <span style={{ color: C.red, marginLeft: 8, fontSize: 11 }}>paso {meta.at_step}</span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted }}>
                        {ev.session_id.substring(0, 8)} · {meta.utm_source || 'direct'}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: C.muted }}>
                      {new Date(ev.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── UTM LINK GENERATOR (para campañas) ────────────────── */}
      <div style={{ ...card, marginBottom: 20, border: `1px solid ${C.cyan}22` }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>🔗</span> Generador de Links de Campaña
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>— pega el link en Instagram Bio, TikTok, etc.</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: 10, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Canal (utm_source)</label>
            <select value={utmSource} onChange={e => setUtmSource(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13 }}>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="facebook">Facebook</option>
              <option value="whatsapp">WhatsApp Broadcast</option>
              <option value="email">Email</option>
              <option value="referral">Referido</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Formato (utm_medium)</label>
            <select value={utmMedium} onChange={e => setUtmMedium(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13 }}>
              <option value="bio">Bio / Perfil</option>
              <option value="story">Story</option>
              <option value="reel">Reel / Video</option>
              <option value="post">Post</option>
              <option value="broadcast">Broadcast</option>
              <option value="paid">Paid Ad</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 4 }}>Nombre campaña (utm_campaign) — opcional</label>
            <input value={utmCampaign} onChange={e => setUtmCampaign(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="ej: match-night-abril" style={{ width: '100%', padding: '9px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 7, color: C.text, fontSize: 13, boxSizing: 'border-box' }} />
          </div>
          <button onClick={copyUTM} style={{ padding: '9px 18px', background: utmCopied ? C.green : `linear-gradient(135deg, ${C.cyan}, ${C.blue})`, color: utmCopied ? '#000' : '#fff', border: 'none', borderRadius: 7, cursor: 'pointer', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', transition: 'background 0.2s' }}>
            {utmCopied ? '✅ Copiado' : '📋 Copiar link'}
          </button>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: '#0f1a0f', border: `1px solid ${C.cyan}33`, borderRadius: 6, fontFamily: 'monospace', fontSize: 12, color: C.cyan, wordBreak: 'break-all' }}>
          {utmLink}
        </div>
        <p style={{ fontSize: 11, color: C.muted, margin: '8px 0 0' }}>💡 Activa el link → los pedidos de ese canal aparecen en &quot;Canales que convierten&quot; con revenue real.</p>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ textAlign: 'center', padding: '20px', color: C.muted, fontSize: 12, borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
        <p style={{ margin: '0 0 4px' }}>
          📊 Fiestaco Business Intelligence · {new Date().toLocaleDateString('es-ES')} ·{' '}
          <button onClick={fetchStats} style={{ background: '#1e1e1e', color: C.text, border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 10px', cursor: 'pointer', fontSize: 12 }}>
            Actualizar ahora
          </button>
        </p>
        <p style={{ margin: 0, fontSize: 11 }}>ℹ️ Uso interno — Solo equipo Fiestaco</p>
      </footer>
    </div>
  );
}