import { Flavor, Addon, Drink } from "@/types/fiesta.types";

// Estado principal del configurador
export interface ConfiguratorState {
  // Estado del wizard
  started: boolean;
  converted: boolean;
  currentStep: number;

  // Selecciones del usuario
  flavor1: Flavor | null;
  flavor2: Flavor | null;
  addons: Addon[];
  drinks: Drink[];

  // Metadata
  currentPrice: number;
  lastUpdated: Date;
  sessionId: string;
}

// Estado inicial
export const initialState: ConfiguratorState = {
  started: false,
  converted: false,
  currentStep: 1,

  flavor1: null,
  flavor2: null,
  addons: [],
  drinks: [],

  currentPrice: 0,
  lastUpdated: new Date(),
  sessionId: "",
};

// Acciones tipadas
export type ConfiguratorAction =
  | { type: "START_WIZARD" }
  | { type: "COMPLETE_WIZARD" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SELECT_FLAVOR_1"; payload: Flavor }
  | { type: "SELECT_FLAVOR_2"; payload: Flavor }
  | { type: "TOGGLE_ADDON"; payload: Addon }
  | { type: "TOGGLE_DRINK"; payload: Drink }
  | { type: "CLEAR_SELECTION" }
  | { type: "UPDATE_PRICE"; payload: number }
  | { type: "SET_SESSION"; payload: string }
  | { type: "LOAD_FROM_STORAGE"; payload: Partial<ConfiguratorState> };

// Tipos para el contexto
export interface ConfiguratorContextType {
  state: ConfiguratorState;
  dispatch: React.Dispatch<ConfiguratorAction>;
  startWizard: () => void;
  completeWizard: () => void;
  setStep: (step: number) => void;
  selectFlavor1: (flavor: Flavor) => void;
  selectFlavor2: (flavor: Flavor) => void;
  toggleAddon: (addon: Addon) => void;
  toggleDrink: (drink: Drink) => void;
  clearSelection: () => void;
  getTotalPrice: (basePrice: number) => number;
  isKitReady: boolean;
}