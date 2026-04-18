import { useEffect, useRef, useCallback } from "react";
import { ConfiguratorState } from "../types/state.types";
import { analytics } from "@/lib/analytics";

interface UseConfiguratorAnalyticsProps {
  state: ConfiguratorState;
  onStepChange?: (step: number) => void;
  onFlavorSelect?: (flavorId: string, position: 1 | 2) => void;
  onAddonToggle?: (addonId: string, selected: boolean) => void;
  onDrinkToggle?: (drinkId: string, selected: boolean) => void;
  onWizardStart?: () => void;
  onWizardComplete?: () => void;
}

export function useConfiguratorAnalytics({
  state,
  onStepChange,
  onFlavorSelect,
  onAddonToggle,
  onDrinkToggle,
  onWizardStart,
  onWizardComplete,
}: UseConfiguratorAnalyticsProps) {
  const prevStateRef = useRef<ConfiguratorState>(state);

  useEffect(() => {
    const prevState = prevStateRef.current;

    // Track wizard start
    if (state.started && !prevState.started) {
      analytics.wizardStart();
      onWizardStart?.();
    }

    // Track wizard completion
    if (state.converted && !prevState.converted) {
      analytics.whatsappClick({
        order_id: state.sessionId,
        flavor1: state.flavor1?.id || "unknown",
        flavor2: state.flavor2?.id || "unknown",
        addons: state.addons.map((a) => a.id),
        drinks: state.drinks.map((d) => d.id),
        order_value: state.currentPrice,
        combo: `${state.flavor1?.id || "none"}+${state.flavor2?.id || "none"}`,
      });
      onWizardComplete?.();
    }

    // Track step changes
    if (state.currentStep !== prevState.currentStep) {
      analytics.stepVisit(state.currentStep);
      onStepChange?.(state.currentStep);
    }

    // Track flavor selections
    if (state.flavor1?.id !== prevState.flavor1?.id && state.flavor1) {
      analytics.flavorSelect(state.flavor1.id);
      onFlavorSelect?.(state.flavor1.id, 1);
    }

    if (state.flavor2?.id !== prevState.flavor2?.id && state.flavor2) {
      analytics.flavorSelect(state.flavor2.id);
      onFlavorSelect?.(state.flavor2.id, 2);
    }

    // Track addon toggles
    state.addons.forEach((addon) => {
      if (!prevState.addons.some((a) => a.id === addon.id)) {
        analytics.addonSelect(addon.id);
        onAddonToggle?.(addon.id, true);
      }
    });

    prevState.addons.forEach((addon) => {
      if (!state.addons.some((a) => a.id === addon.id)) {
        onAddonToggle?.(addon.id, false);
      }
    });

    // Track drink toggles
    state.drinks.forEach((drink) => {
      if (!prevState.drinks.some((d) => d.id === drink.id)) {
        analytics.drinkSelect(drink.id);
        onDrinkToggle?.(drink.id, true);
      }
    });

    prevState.drinks.forEach((drink) => {
      if (!state.drinks.some((d) => d.id === drink.id)) {
        onDrinkToggle?.(drink.id, false);
      }
    });

    // Update previous state
    prevStateRef.current = state;
  }, [
    state,
    onStepChange,
    onFlavorSelect,
    onAddonToggle,
    onDrinkToggle,
    onWizardStart,
    onWizardComplete,
  ]);

  // Helper para track abandon
  const trackAbandon = useCallback(() => {
    if (state.started && !state.converted) {
      analytics.wizardAbandon({
        step: state.currentStep,
        flavor1: state.flavor1?.id || null,
        flavor2: state.flavor2?.id || null,
        addonsCount: state.addons.length,
        price: state.currentPrice,
      });
    }
  }, [state]);

  return {
    trackAbandon,
  };
}