'use client';

import { createContext, useContext, useRef, useCallback } from 'react';

export interface WizardState {
  started: boolean;
  converted: boolean;
  currentStep: number;
  flavor1: string | null;
  flavor2: string | null;
  addonsCount: number;
  currentPrice: number;
}

interface WizardContextType {
  stateRef: React.MutableRefObject<WizardState>;
  updateWizard: (update: Partial<WizardState>) => void;
}

const defaultState: WizardState = {
  started: false,
  converted: false,
  currentStep: 0,
  flavor1: null,
  flavor2: null,
  addonsCount: 0,
  currentPrice: 0,
};

export const WizardContext = createContext<WizardContextType>({
  stateRef: { current: defaultState },
  updateWizard: () => {},
});

export function useWizardContext() {
  return useContext(WizardContext);
}

export function createWizardContextValue() {
  // This is a hook — must be called inside a component
  // Returns memoized ref + updater for use in WizardProvider
  const stateRef = useRef<WizardState>({ ...defaultState });
  const updateWizard = useCallback((update: Partial<WizardState>) => {
    stateRef.current = { ...stateRef.current, ...update };
  }, []);
  return { stateRef, updateWizard };
}
