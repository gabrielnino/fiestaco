'use client';

import { useEffect, useRef } from 'react';
import { analytics, captureUTM } from '@/lib/analytics';
import { useWizardContext } from '@/lib/wizard-context';

export default function AnalyticsProvider() {
  // Guard against React Strict Mode double-invoking effects in development.
  const hasFiredRef = useRef(false);

  // Read wizard state (via ref — no re-renders) to detect abandon on exit
  const { stateRef: wizardRef } = useWizardContext();

  useEffect(() => {
    if (!hasFiredRef.current) {
      hasFiredRef.current = true;

      // 1. Capture UTM params from URL before firing page_view
      //    so the page_view event includes attribution data
      captureUTM();

      // 2. Track the page view
      analytics.pageView();
    }

    // Track navigation via browser back/forward
    const handleRouteChange = () => {
      analytics.pageView();
    };
    window.addEventListener('popstate', handleRouteChange);

    // ─── Wizard Abandon Detection ──────────────────────
    const fireAbandonIfNeeded = () => {
      const wizard = wizardRef.current;
      // Only fire if wizard was started but user never converted
      if (wizard.started && !wizard.converted && wizard.currentStep > 0) {
        analytics.wizardAbandon({
          at_step: wizard.currentStep,
          flavor1: wizard.flavor1,
          flavor2: wizard.flavor2,
          addons_count: wizard.addonsCount,
          had_price: wizard.currentPrice,
        });
      }
    };

    // Track page exit (tab close, navigation away)
    const handleBeforeUnload = () => {
      fireAbandonIfNeeded();
      analytics.sessionEnd();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track tab visibility change (switching tabs counts as potential exit)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        fireAbandonIfNeeded();
        analytics.sessionEnd();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wizardRef]);

  // This component renders nothing — it only tracks analytics
  return null;
}