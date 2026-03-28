// Estilos optimizados para reducir CLS y mejorar performance
import { COLORS } from './constants';

// Estilos estáticos para componentes comunes
export const STATIC_STYLES = {
  // Botones
  button: {
    primary: {
      background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
      color: COLORS.bone,
      border: 'none',
      borderRadius: '999px',
      padding: '12px 24px',
      fontFamily: "'Oswald', sans-serif",
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '1px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    circle: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `2px solid ${COLORS.bone}`,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  },
  
  // Cards
  card: {
    flavor: {
      background: COLORS.darkCard,
      border: `2px solid ${COLORS.cardBorder}`,
      borderRadius: '16px',
      padding: '16px 12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px',
    },
    selected: {
      background: `linear-gradient(135deg, ${COLORS.orange}22, ${COLORS.magenta}22)`,
      border: `2px solid ${COLORS.orange}`,
      boxShadow: `0 0 20px ${COLORS.orange}44`,
      transform: 'scale(1.03)',
    },
  },
  
  // Layout
  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    hero: {
      position: 'relative' as const,
      minHeight: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center' as const,
      padding: '100px 20px 60px',
      overflow: 'hidden' as const,
    },
  },
  
  // Typography
  typography: {
    h1: {
      fontFamily: "'Oswald', sans-serif",
      fontWeight: 800,
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      lineHeight: 1.1,
      color: COLORS.bone,
    },
    h2: {
      fontFamily: "'Oswald', sans-serif",
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
      color: COLORS.bone,
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#888',
    },
  },
} as const;

// Helper para estilos condicionales sin CLS
export function mergeStyles(base: any, ...overrides: any[]) {
  return Object.assign({}, base, ...overrides);
}

// Hook para estilos memoizados
export function useMemoizedStyles(deps: any[]) {
  // Este hook sería usado en componentes client
  // Para usar: import { useMemo } from 'react';
  // const styles = useMemoizedStyles([deps]);
  return STATIC_STYLES;
}
