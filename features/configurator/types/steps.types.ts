import { Flavor, Addon, Drink } from "@/types/fiesta.types";

export interface StepBaseProps {
  onNext?: () => void;
  onBack?: () => void;
  className?: string;
}

export interface Step1FlavorProps extends StepBaseProps {
  selectedFlavor?: Flavor | null;
  secondFlavor?: Flavor | null;
  flavors: Flavor[];
  onSelect: (flavor: Flavor) => void;
  translations: {
    title: string;
    subtitle?: string;
    moreOptions: string;
    next: string;
  };
  showMoreFlavors?: boolean;
  onShowMore?: () => void;
}

export interface Step2FlavorProps extends StepBaseProps {
  firstFlavor: Flavor | null;
  selectedFlavor?: Flavor | null;
  flavors: Flavor[];
  onSelect: (flavor: Flavor) => void;
  translations: {
    title: string;
    subtitle?: string;
    next: string;
  };
}

export interface Step3AddonsProps extends StepBaseProps {
  selectedAddons: string[];
  addons: Addon[];
  onToggle: (addonId: string) => void;
  translations: {
    title: string;
    subtitle?: string;
    next: string;
  };
}

export interface Step4DrinksProps extends StepBaseProps {
  selectedDrinks: string[];
  drinks: Drink[];
  onToggle: (drinkId: string) => void;
  translations: {
    title: string;
    subtitle?: string;
    next: string;
  };
}

export interface SummaryStepProps extends StepBaseProps {
  flavor1: Flavor | null;
  flavor2: Flavor | null;
  addons: Addon[];
  drinks: Drink[];
  totalPrice: number;
  translations: {
    title: string;
    flavor1: string;
    flavor2: string;
    addonsLabel: string;
    drinksLabel: string;
    total: string;
    none: string;
    orderBtn: string;
    selectBoth: string;
  };
  onOrder: () => void;
}