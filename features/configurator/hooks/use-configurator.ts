import { useConfigurator } from "../context/configurator-context";
import { useConfiguratorAnalytics } from "./use-configurator-analytics";
import { Flavor, Addon, Drink } from "@/types/fiesta.types";

interface UseConfiguratorOptions {
  onStateChange?: (state: any) => void;
  enableAnalytics?: boolean;
}

export function useConfiguratorEnhanced(options: UseConfiguratorOptions = {}) {
  const { enableAnalytics = true, onStateChange } = options;

  // Obtener estado y acciones del contexto
  const configurator = useConfigurator();
  const { state, ...actions } = configurator;

  // Configurar analytics si está habilitado
  const { trackAbandon } = useConfiguratorAnalytics({
    state,
    onStepChange: (step) => {
      console.log(`Step changed to: ${step}`);
    },
    onFlavorSelect: (flavorId, position) => {
      console.log(`Flavor ${position} selected: ${flavorId}`);
    },
    onAddonToggle: (addonId, selected) => {
      console.log(`Addon ${addonId} ${selected ? "selected" : "deselected"}`);
    },
    onDrinkToggle: (drinkId, selected) => {
      console.log(`Drink ${drinkId} ${selected ? "selected" : "deselected"}`);
    },
    onWizardStart: () => {
      console.log("Wizard started");
    },
    onWizardComplete: () => {
      console.log("Wizard completed");
    },
  });

  // Helper para construir mensaje de WhatsApp
  const buildWhatsAppMessage = (
    translations: Record<string, any>,
    basePrice: number
  ): string => {
    const f1 = state.flavor1?.name || "—";
    const f2 = state.flavor2?.name || "—";
    const addonNames = state.addons
      .map((addon) => translations.addonNames[addon.id] || addon.name)
      .join(", ");
    const drinkNames = state.drinks.map((drink) => drink.name).join(", ");

    const totalPrice = actions.getTotalPrice(basePrice);

    return translations.waMessage
      .replace("{order_id}", state.sessionId)
      .replace("{f1}", f1)
      .replace("{f2}", f2)
      .replace("{addons}", addonNames || translations.none)
      .replace("{drinks}", drinkNames || translations.none)
      .replace("{total}", totalPrice.toString());
  };

  // Helper para verificar si se puede avanzar
  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!state.flavor1;
      case 2:
        return !!state.flavor2;
      case 3:
      case 4:
        return true; // Addons y drinks son opcionales
      case 5:
        return !!state.flavor1 && !!state.flavor2;
      default:
        return false;
    }
  };

  // Helper para obtener datos para UI
  const getStepData = (step: number) => {
    const stepData = {
      title: "",
      subtitle: "",
      canProceed: canProceed(step),
      nextStep: Math.min(5, step + 1),
      prevStep: Math.max(1, step - 1),
    };

    // Aquí se deberían agregar los títulos y subtítulos específicos de cada paso
    // basados en las traducciones

    return stepData;
  };

  return {
    // Estado
    state,

    // Acciones
    ...actions,

    // Helpers
    buildWhatsAppMessage,
    canProceed,
    getStepData,
    trackAbandon,

    // Computed values
    totalPrice: actions.getTotalPrice(),
    isKitReady: actions.isKitReady,
    selectedAddons: state.addons,
    selectedDrinks: state.drinks,
    selectedFlavors: [state.flavor1, state.flavor2].filter(Boolean) as Flavor[],
  };
}