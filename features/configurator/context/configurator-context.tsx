"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  ConfiguratorState,
  ConfiguratorContextType,
  ConfiguratorAction,
  initialState,
} from "../types/state.types";
import { configuratorReducer, calculateTotalPrice } from "../state/configurator-reducer";

// Crear contexto
const ConfiguratorContext = createContext<ConfiguratorContextType | undefined>(
  undefined
);

// Hook para usar el contexto
export function useConfigurator() {
  const context = useContext(ConfiguratorContext);
  if (!context) {
    throw new Error(
      "useConfigurator must be used within a ConfiguratorProvider"
    );
  }
  return context;
}

// Props del provider
interface ConfiguratorProviderProps {
  children: React.ReactNode;
  basePrice?: number;
  onStateChange?: (state: ConfiguratorState) => void;
}

// Provider principal
export function ConfiguratorProvider({
  children,
  basePrice = 45,
  onStateChange,
}: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(configuratorReducer, {
    ...initialState,
    sessionId: generateSessionId(),
  });

  // Notificar cambios de estado (para analytics)
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  // Acciones memoizadas para performance
  const startWizard = useCallback(() => {
    dispatch({ type: "START_WIZARD" });
  }, []);

  const completeWizard = useCallback(() => {
    dispatch({ type: "COMPLETE_WIZARD" });
  }, []);

  const setStep = useCallback((step: number) => {
    dispatch({ type: "SET_STEP", payload: step });
  }, []);

  const selectFlavor1 = useCallback((flavor: ConfiguratorState["flavor1"]) => {
    if (flavor) {
      dispatch({ type: "SELECT_FLAVOR_1", payload: flavor });
    }
  }, []);

  const selectFlavor2 = useCallback((flavor: ConfiguratorState["flavor2"]) => {
    if (flavor) {
      dispatch({ type: "SELECT_FLAVOR_2", payload: flavor });
    }
  }, []);

  const toggleAddon = useCallback((addon: ConfiguratorState["addons"][0]) => {
    dispatch({ type: "TOGGLE_ADDON", payload: addon });
  }, []);

  const toggleDrink = useCallback((drink: ConfiguratorState["drinks"][0]) => {
    dispatch({ type: "TOGGLE_DRINK", payload: drink });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  // Calcular precio total memoizado
  const getTotalPrice = useCallback(
    (customBasePrice?: number) => {
      return calculateTotalPrice(state, customBasePrice || basePrice);
    },
    [state, basePrice]
  );

  // Verificar si el kit está listo
  const isKitReady = useMemo(
    () => Boolean(state.flavor1 && state.flavor2),
    [state.flavor1, state.flavor2]
  );

  // Valor del contexto
  const contextValue = useMemo(
    (): ConfiguratorContextType => ({
      state,
      dispatch,
      startWizard,
      completeWizard,
      setStep,
      selectFlavor1,
      selectFlavor2,
      toggleAddon,
      toggleDrink,
      clearSelection,
      getTotalPrice,
      isKitReady,
    }),
    [
      state,
      startWizard,
      completeWizard,
      setStep,
      selectFlavor1,
      selectFlavor2,
      toggleAddon,
      toggleDrink,
      clearSelection,
      getTotalPrice,
      isKitReady,
    ]
  );

  return (
    <ConfiguratorContext.Provider value={contextValue}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

// Helper para generar session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}