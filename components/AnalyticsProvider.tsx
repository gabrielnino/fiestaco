'use client';

import { useEffect, useRef } from 'react';
import { analytics } from '@/lib/analytics';

export default function AnalyticsProvider() {
  // Guard against React Strict Mode double-invoking effects in development.
  // The ref value persists across the mount → unmount → remount cycle,
  // so the page_view fires exactly once per real navigation.
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true;
      analytics.pageView();
    }

    // Track navigation via browser back/forward
    const handleRouteChange = () => {
      analytics.pageView();
    };
    window.addEventListener('popstate', handleRouteChange);

    // Track page exit
    const handleBeforeUnload = () => {
      analytics.sessionEnd();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track tab visibility change
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

  // This component renders nothing — it only tracks analytics
  return null;
}