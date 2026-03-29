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
    conversion_rate: number;
    revenue_today: number;
    avg_order_value: number;
  };
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

  const handleLogout = () => {
    localStorage.removeItem('fiestaco_dashboard_token');
    setAuthenticated(false);
    router.push('/');
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
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={fetchStats} style={{ padding: '8px 16px', background: '#1e1e1e', color: C.text, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>↺ Actualizar</button>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Salir</button>
        </div>
      </div>

      {/* ── Row 1: KPIs ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 20 }}>
        <KpiCard icon="💰" label="Revenue Hoy" value={fmtCA(s.today.revenue_today)} sub="Total WhatsApp orders" color={C.yellow} />
        <KpiCard icon="📦" label="Órdenes" value={fmt(s.today.whatsapp_clicks)} sub="Pedidos por WhatsApp" color={C.orange} />
        <KpiCard icon="🎫" label="Ticket Promedio" value={fmtCA(s.today.avg_order_value)} sub="Por pedido" color={C.cyan} />
        <KpiCard icon="📈" label="Conversión" value={`${s.today.conversion_rate?.toFixed(1) || 0}%`} sub="Visitas → Pedidos" color={C.green} />
        <KpiCard icon="👥" label="Visitas Hoy" value={fmt(s.today.unique_sessions_today)} sub={`${fmt(s.today.page_views)} page views`} color={C.blue} />
        <KpiCard icon="🎯" label="Wizards" value={fmt(s.today.wizard_starts)} sub={`${pct(s.today.wizard_starts, s.today.unique_sessions_today)}% de visitantes`} color={C.magenta} />
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