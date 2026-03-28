'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

export default function AnalyticsProvider() {
  useEffect(() => {
    // Inicializar analytics
    analytics.pageView();
    
    // Trackear eventos de navegación
    const handleRouteChange = () => {
      analytics.pageView();
    };
    
    // En Next.js App Router, podemos usar el evento popstate
    window.addEventListener('popstate', handleRouteChange);
    
    // Trackear salida de página
    const handleBeforeUnload = () => {
      analytics.sessionEnd();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Trackear cambios de visibilidad
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        analytics.sessionEnd();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Este componente no renderiza nada
  return null;
}