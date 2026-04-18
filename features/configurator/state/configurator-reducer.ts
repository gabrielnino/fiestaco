import { ConfiguratorState, ConfiguratorAction } from "../types/state.types";

// Helper para calcular precio total
export function calculateTotalPrice(state: ConfiguratorState, basePrice: number): number {
  const flavorSurcharge = (state.flavor1?.surcharge || 0) + (state.flavor2?.surcharge || 0);
  const addonsTotal = state.addons.reduce((sum, addon) => sum + addon.price, 0);
  const drinksTotal = state.drinks.reduce((sum, drink) => sum + drink.price, 0);

  return basePrice + flavorSurcharge + addonsTotal + drinksTotal;
}

// Reducer principal
export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction
): ConfiguratorState {
  const newState = { ...state, lastUpdated: new Date() };

  switch (action.type) {
    case "START_WIZARD":
      return {
        ...newState,
        started: true,
        currentStep: 1,
      };

    case "COMPLETE_WIZARD":
      return {
        ...newState,
        converted: true,
        currentStep: 5,
      };

    case "SET_STEP":
      return {
        ...newState,
        currentStep: Math.max(1, Math.min(5, action.payload)),
      };

    case "SELECT_FLAVOR_1":
      // No permitir seleccionar el mismo flavor dos veces
      if (state.flavor2?.id === action.payload.id) {
        return newState;
      }
      return {
        ...newState,
        flavor1: action.payload,
        currentStep: state.currentStep < 2 ? 2 : state.currentStep,
      };

    case "SELECT_FLAVOR_2":
      // No permitir seleccionar el mismo flavor dos veces
      if (state.flavor1?.id === action.payload.id) {
        return newState;
      }
      return {
        ...newState,
        flavor2: action.payload,
        currentStep: state.currentStep < 3 ? 3 : state.currentStep,
      };

    case "TOGGLE_ADDON": {
      const existingIndex = state.addons.findIndex(
        (addon) => addon.id === action.payload.id
      );

      if (existingIndex >= 0) {
        // Remover addon
        const newAddons = [...state.addons];
        newAddons.splice(existingIndex, 1);
        return {
          ...newState,
          addons: newAddons,
        };
      } else {
        // Agregar addon
        return {
          ...newState,
          addons: [...state.addons, action.payload],
        };
      }
    }

    case "TOGGLE_DRINK": {
      const existingIndex = state.drinks.findIndex(
        (drink) => drink.id === action.payload.id
      );

      if (existingIndex >= 0) {
        // Remover drink
        const newDrinks = [...state.drinks];
        newDrinks.splice(existingIndex, 1);
        return {
          ...newState,
          drinks: newDrinks,
        };
      } else {
        // Agregar drink
        return {
          ...newState,
          drinks: [...state.drinks, action.payload],
        };
      }
    }

    case "CLEAR_SELECTION":
      return {
        ...newState,
        flavor1: null,
        flavor2: null,
        addons: [],
        drinks: [],
        currentStep: 1,
        currentPrice: 0,
      };

    case "UPDATE_PRICE":
      return {
        ...newState,
        currentPrice: action.payload,
      };

    case "SET_SESSION":
      return {
        ...newState,
        sessionId: action.payload,
      };

    case "LOAD_FROM_STORAGE":
      return {
        ...newState,
        ...action.payload,
        lastUpdated: new Date(),
      };

    default:
      return newState;
  }
}