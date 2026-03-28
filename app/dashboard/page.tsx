'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Tipos para los datos
interface DashboardStats {
  today: {
    total_events: number;
    unique_sessions_today: number;
    page_views: number;
    wizard_starts: number;
    whatsapp_clicks: number;
    conversion_rate: number;
  };
  recent_events: Array<{
    session_id: string;
    event_name: string;
    page_path: string;
    metadata: string | null;
    created_at: string;
  }>;
  funnel: Array<{
    event_name: string;
    users: number;
    percentage: number;
  }>;
  popular_flavors: Array<{
    flavor: string;
    selections: number;
  }>;
  daily_trends: Array<{
    date: string;
    visits: number;
    conversions: number;
  }>;
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState('7'); // días

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('fiestaco_dashboard_token');
    if (token === 'fiestaco-dev') {
      setAuthenticated(true);
      fetchStats();
    }
  }, []);

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

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/dashboard', {
        headers: {
          'Authorization': 'Bearer fiestaco-dev'
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fiestaco_dashboard_token');
    setAuthenticated(false);
    router.push('/');
  };

  // Formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Calcular porcentaje
  const calculatePercentage = (part: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        fontFamily: "'Nunito', sans-serif"
      }}>
        <div style={{
          background: '#1a1a1a',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #333',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{
            color: '#fff',
            fontSize: '24px',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            📊 Dashboard Fiestaco
          </h1>
          <p style={{
            color: '#888',
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            Acceso restringido al equipo
          </p>
          
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#aaa',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: '#222',
                  border: '1px solid #333',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '16px'
                }}
                placeholder="Ingresa la contraseña"
              />
            </div>
            
            {error && (
              <div style={{
                color: '#ff6b6b',
                fontSize: '14px',
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #ff6b35, #ff8e53)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Acceder al Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: '#fff',
        fontFamily: "'Nunito', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px'
          }}>
            📊
          </div>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      fontFamily: "'Nunito', sans-serif",
      color: '#fff',
      padding: '20px'
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #333'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📊</span>
            <span>Dashboard Analytics - Fiestaco</span>
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Datos en tiempo real • Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Cerrar sesión
        </button>
      </header>

      {/* Métricas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {/* Tarjeta 1: Visitas */}
        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4cc9f0, #4361ee)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span>👥</span>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>Visitas Hoy</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                {formatNumber(stats?.today.unique_sessions_today || 0)}
              </p>
            </div>
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            {formatNumber(stats?.today.page_views || 0)} vistas de página
          </p>
        </div>

        {/* Tarjeta 2: Wizards */}
        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #f72585, #b5179e)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span>🎯</span>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>Wizards Iniciados</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                {formatNumber(stats?.today.wizard_starts || 0)}
              </p>
            </div>
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            {calculatePercentage(stats?.today.wizard_starts || 0, stats?.today.unique_sessions_today || 1)}% de visitantes
          </p>
        </div>

        {/* Tarjeta 3: Conversiones */}
        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #ff9e00, #ff6b35)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span>💰</span>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>Pedidos WhatsApp</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                {formatNumber(stats?.today.whatsapp_clicks || 0)}
              </p>
            </div>
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            Tasa: {stats?.today.conversion_rate?.toFixed(1) || '0'}%
          </p>
        </div>

        {/* Tarjeta 4: Eventos Totales */}
        <div style={{
          background: '#1a1a1a',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #38b000, #2d936c)',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span>📈</span>
            </div>
            <div>
              <h3 style={{ fontSize: '14px', color: '#aaa', margin: 0 }}>Eventos Totales</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                {formatNumber(stats?.today.total_events || 0)}
              </p>
            </div>
          </div>
          <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
            Hoy • {new Date().toLocaleDateString('es-ES')}
          </p>
        </div>
      </div>

      {/* Sección 2: Funnel de Conversión */}
      <div style={{
        background: '#1a1a1a',
        padding: '25px',
        borderRadius: '10px',
        border: '1px solid #333',
        marginBottom: '40px'
      }}>
        <h2 style={{ fontSize: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🪜</span>
          Funnel de Conversión (Últimos 7 días)
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {stats?.funnel.map((step, index) => (
            <div key={step.event_name} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: index === stats.funnel.length - 1 ? '#ff6b35' : '#4361ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#fff' }}>
                    {step.event_name === 'page_view' && 'Visita la página'}
                    {step.event_name === 'wizard_start' && 'Inicia wizard'}
                    {step.event_name === 'step_visit' && 'Completa pasos'}
                    {step.event_name === 'whatsapp_click' && 'Hace pedido'}
                  </span>
                  <span style={{ color: '#aaa' }}>{formatNumber(step.users)} usuarios</span>
                </div>
                
                {/* Barra de progreso */}
                <div style={{
                  height: '8px',
                  background: '#333',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${step.percentage}%`,
                    height: '100%',
                    background: index === stats.funnel.length - 1 ? 
                      'linear-gradient(90deg, #ff6b35, #ff8e53)' : 
                      'linear-gradient(90deg, #4361ee, #4cc9f0)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px'
                }}>
                  <span style={{ color: '#888', fontSize: '12px' }}>
                    {step.percentage}% de retención
                  </span>
                  {index > 0 && (
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      ↓ {100 - step.percentage}% abandono
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección 3: Sabores Populares y Eventos Recientes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {/* Sabores Populares */}
        <div style={{
          background: '#1a1a1a',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🌮</span>
            Sabores Más Populares
          </h2>
          
          {stats?.popular_flavors && stats.popular_flavors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stats.popular_flavors.map((flavor, index) => (
                <div key={flavor.flavor} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#222',
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: index === 0 ? '#ff6b35' : 
                                 index === 1 ? '#4361ee' : 
                                 index === 2 ? '#4cc9f0' : '#888',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#fff'
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ color: '#fff' }}>{flavor.flavor}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#aaa', fontSize: '14px' }}>
                      {formatNumber(flavor.selections)} selecciones
                    </span>
                    <div style={{
                      width: '40px',
                      height: '4px',
                      background: '#333',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${Math.min(100, (flavor.selections / (stats.popular_flavors[0]?.selections || 1)) * 100)}%`,
                        height: '100%',
                        background: index === 0 ? '#ff6b35' : 
                                   index === 1 ? '#4361ee' : 
                                   index === 2 ? '#4cc9f0' : '#888'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '30px',
              textAlign: 'center',
              color: '#888',
              background: '#222',
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🌮</div>
              <p>No hay datos de sabores aún</p>
              <p style={{ fontSize: '13px', marginTop: '5px' }}>
                Los datos aparecerán cuando los usuarios seleccionen sabores
              </p>
            </div>
          )}
        </div>

        {/* Eventos Recientes */}
        <div style={{
          background: '#1a1a1a',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⏰</span>
            Eventos Recientes
          </h2>
          
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            borderRadius: '6px'
          }}>
            {stats?.recent_events && stats.recent_events.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {stats.recent_events.map((event, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    background: '#222',
                    borderRadius: '6px',
                    borderLeft: `4px solid ${
                      event.event_name === 'whatsapp_click' ? '#ff6b35' :
                      event.event_name === 'wizard_start' ? '#f72585' :
                      event.event_name === 'page_view' ? '#4361ee' : '#4cc9f0'
                    }`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}>
                        {event.event_name}
                      </span>
                      <span style={{ color: '#888', fontSize: '12px' }}>
                        {new Date(event.created_at).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#aaa', fontSize: '12px' }}>
                        Sesión: {event.session_id.substring(0, 8)}...
                      </span>
                      <span style={{
                        color: '#888',
                        fontSize: '11px',
                        background: '#333',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {event.page_path}
                      </span>
                    </div>
                    
                    {event.metadata && (
                      <div style={{
                        marginTop: '6px',
                        padding: '6px',
                        background: '#1a1a1a',
                        borderRadius: '4px',
                        fontSize: '11px',
                        color: '#888',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {JSON.stringify(JSON.parse(event.metadata), null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: '#888',
                background: '#222',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
                <p>No hay eventos recientes</p>
                <p style={{ fontSize: '13px', marginTop: '5px' }}>
                  Los eventos aparecerán cuando los usuarios interactúen con el sitio
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        color: '#888',
        fontSize: '13px',
        borderTop: '1px solid #333'
      }}>
        <p>
          📊 Sistema de Analytics Fiestaco • 
          Datos actualizados automáticamente • 
          <button
            onClick={fetchStats}
            style={{
              marginLeft: '10px',
              padding: '4px 12px',
              background: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Actualizar ahora
          </button>
        </p>
        <p style={{ marginTop: '8px', fontSize: '12px' }}>
          ℹ️ Este dashboard es solo para uso interno del equipo Fiestaco
        </p>
      </footer>
    </div>
  );
}