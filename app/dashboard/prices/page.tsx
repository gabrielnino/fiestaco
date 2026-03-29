'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FLAVORS, ADDONS, DRINKS, BASE_PRICE } from '../../../lib/constants';

interface PricesConfig {
  basePrice: number;
  addons: Record<string, number>;
  drinks: Record<string, number>;
  flavors: Record<string, number>;
}

function getDefaultPrices(): PricesConfig {
  const addons: Record<string, number> = {};
  ADDONS.forEach(a => addons[a.id] = a.price || 0);

  const drinks: Record<string, number> = {};
  DRINKS.forEach(d => drinks[d.id] = d.price || 0);

  const flavors: Record<string, number> = {};
  FLAVORS.forEach(f => {
    // @ts-ignore
    flavors[f.id] = f.surcharge || 0;
  });

  return {
    basePrice: BASE_PRICE,
    addons,
    drinks,
    flavors
  };
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

const cardStyles = {
  background: C.card,
  borderRadius: 12,
  border: `1px solid ${C.border}`,
  padding: '20px 24px',
};

export default function PricesDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const [prices, setPrices] = useState<PricesConfig>(getDefaultPrices());

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/config/prices');
      if (!res.ok) throw new Error('Error al cargar precios');
      const data = await res.json();
      setPrices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('fiestaco_dashboard_token');
    if (token === 'fiestaco-dev') { 
      setAuthenticated(true); 
      fetchPrices(); 
    } else {
      router.push('/dashboard');
    }
  }, [fetchPrices, router]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const res = await fetch('/api/config/prices', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fiestaco-admin-2024'
        },
        body: JSON.stringify(prices),
      });
      if (!res.ok) throw new Error('Error al guardar precios');
      
      const updated = await res.json();
      setPrices(updated);
      setSuccess('Precios guardados correctamente ✅');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateBasePrice = (val: string) => {
    setPrices((prev: PricesConfig) => ({ ...prev, basePrice: Number(val) || 0 }));
  };

  const updateFlavor = (id: string, val: string) => {
    setPrices((prev: PricesConfig) => ({
      ...prev,
      flavors: { ...prev.flavors, [id]: Number(val) || 0 }
    }));
  };

  const updateAddon = (id: string, val: string) => {
    setPrices((prev: PricesConfig) => ({
      ...prev,
      addons: { ...prev.addons, [id]: Number(val) || 0 }
    }));
  };

  const updateDrink = (id: string, val: string) => {
    setPrices((prev: PricesConfig) => ({
      ...prev,
      drinks: { ...prev.drinks, [id]: Number(val) || 0 }
    }));
  };

  if (!authenticated || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, color: C.text, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
          <p style={{ color: C.muted }}>Cargando panel de precios...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', maxWidth: 1000, margin: '0 auto' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>
            <span style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.magenta})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fiestaco</span>
            {' '}· Configuración de Precios
          </h1>
          <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Modifica los precios del sitio en tiempo real</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/dashboard')} style={{ padding: '8px 16px', background: '#1a1a1a', color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>← Volver al Dashboard</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '8px 24px', background: `linear-gradient(135deg, ${C.green}, #2b8a00)`, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Guardando...' : '💾 Guardar Precios'}
          </button>
        </div>
      </div>

      {error && <div style={{ background: `${C.red}33`, color: '#fff', border: `1px solid ${C.red}`, padding: '12px', borderRadius: 8, marginBottom: 20 }}>{error}</div>}
      {success && <div style={{ background: `${C.green}33`, color: '#fff', border: `1px solid ${C.green}`, padding: '12px', borderRadius: 8, marginBottom: 20 }}>{success}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        {/* Base Price */}
        <div style={{ ...cardStyles }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.orange, margin: '0 0 16px' }}>Precio Base del Kit</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <label style={{ fontSize: 14, color: C.muted, width: 250 }}>Kit de Tacos Fiestaco</label>
             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
               <span>CA$</span>
               <input 
                 type="number" step="0.01" 
                 value={prices.basePrice}
                 onChange={(e) => updateBasePrice(e.target.value)}
                 style={{ padding: '8px 12px', background: '#1a1a1a', border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, width: 100, fontSize: 14 }}
               />
             </div>
          </div>
        </div>

        {/* Flavors */}
        <div style={{ ...cardStyles }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.magenta, margin: '0 0 16px' }}>Sabores Premium (Recargos)</h2>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>Establece en 0 los sabores que no tienen recargo adicional.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {FLAVORS.map((f: any) => (
              <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#1a1a1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{f.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>+CA$</span>
                  <input 
                    type="number" step="0.01" 
                    value={prices.flavors[f.id] ?? 0}
                    onChange={(e) => updateFlavor(f.id, e.target.value)}
                    style={{ padding: '6px 10px', background: '#222', border: `1px solid #333`, borderRadius: 6, color: C.text, width: 80, fontSize: 14 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Addons */}
        <div style={{ ...cardStyles }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.cyan, margin: '0 0 16px' }}>Add-ons (Extras)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {ADDONS.map((a: any) => (
              <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#1a1a1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{a.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>+CA$</span>
                  <input 
                    type="number" step="0.01" 
                    value={prices.addons[a.id] ?? 0}
                    onChange={(e) => updateAddon(a.id, e.target.value)}
                    style={{ padding: '6px 10px', background: '#222', border: `1px solid #333`, borderRadius: 6, color: C.text, width: 80, fontSize: 14 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drinks */}
        <div style={{ ...cardStyles }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: C.yellow, margin: '0 0 16px' }}>Bebidas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {DRINKS.map((d: any) => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#1a1a1a', borderRadius: 8, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 14 }}>{d.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: C.muted }}>+CA$</span>
                  <input 
                    type="number" step="0.01" 
                    value={prices.drinks[d.id] ?? 0}
                    onChange={(e) => updateDrink(d.id, e.target.value)}
                    style={{ padding: '6px 10px', background: '#222', border: `1px solid #333`, borderRadius: 6, color: C.text, width: 80, fontSize: 14 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
