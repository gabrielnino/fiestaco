// Components
export { default as Step1Flavor } from "./components/step-1-flavor";
export { default as Step2Flavor } from "./components/step-2-flavor";
export { default as Step3Addons } from "./components/step-3-addons";
export { default as Step4Drinks } from "./components/step-4-drinks";

// Types
export type {
  Step1FlavorProps,
  Step2FlavorProps,
  Step3AddonsProps,
  Step4DrinksProps,
  SummaryStepProps,
} from "./types/steps.types";

export type {
  ConfiguratorState,
  ConfiguratorAction,
  ConfiguratorContextType,
} from "./types/state.types";

// Context
export {
  ConfiguratorProvider,
  useConfigurator,
} from "./context/configurator-context";

// Hooks
export { useConfiguratorEnhanced } from "./hooks/use-configurator";
export { useConfiguratorAnalytics } from "./hooks/use-configurator-analytics";

// State Management
export { configuratorReducer, calculateTotalPrice } from "./state/configurator-reducer";
export { initialState } from "./types/state.types";