/**
 * Custom hook for Fiestaco order management
 * Separates business logic from UI components
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import {
  Flavor,
  Addon,
  Drink,
  OrderState,
  OrderSummary,
  AnalyticsEvents
} from '@/types/fiesta.types';
import { COLORS, FLAVORS, ADDONS, DRINKS, BASE_PRICE, WHATSAPP_NUMBER } from '@/lib/constants';

interface UseFiestaOrderOptions {
  onOrderUpdate?: (order: OrderState) => void;
  onError?: (error: Error) => void;
}

export const useFiestaOrder = (options: UseFiestaOrderOptions = {}) => {
  const { onOrderUpdate, onError } = options;

  // Order state
  const [orderState, setOrderState] = useState<OrderState>({
    flavor1: null,
    flavor2: null,
    addons: [],
    drinks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Calculate order summary
  const calculateSummary = useCallback((): OrderSummary => {
    const { flavor1, flavor2, addons, drinks } = orderState;

    // Calculate subtotal
    let subtotal = BASE_PRICE;

    // Add flavor surcharges
    if (flavor1?.surcharge) subtotal += flavor1.surcharge;
    if (flavor2?.surcharge) subtotal += flavor2.surcharge;

    // Add addons
    const addonsTotal = addons.reduce((sum, addon) => sum + addon.price, 0);
    subtotal += addonsTotal;

    // Add drinks
    const drinksTotal = drinks.reduce((sum, drink) => sum + drink.price, 0);
    subtotal += drinksTotal;

    // Calculate tax (simplified)
    const tax = subtotal * 0.08; // 8% tax

    return {
      subtotal,
      tax,
      total: subtotal + tax,
      itemCount: addons.length + drinks.length + (flavor1 ? 1 : 0) + (flavor2 ? 1 : 0),
      flavors: [flavor1, flavor2].filter(Boolean) as Flavor[],
      addons,
      drinks,
    };
  }, [orderState]);

  // Update order state helper
  const updateOrderState = useCallback((updates: Partial<OrderState> | ((prev: OrderState) => Partial<OrderState>)) => {
    setOrderState(prev => {
      const updateObj = typeof updates === 'function' ? updates(prev) : updates;
      const newState = {
        ...prev,
        ...updateObj,
        updatedAt: new Date(),
      };

      onOrderUpdate?.(newState);

      // Track analytics for significant changes
      if (updateObj.flavor1 || updateObj.flavor2) {
        analytics.flavorSelect(updateObj.flavor1?.id || updateObj.flavor2?.id || 'unknown');
      }

      return newState;
    });
  }, [onOrderUpdate]);

  // Order actions
  const selectFlavor = useCallback((flavor: Flavor, position: 1 | 2) => {
    try {
      if (position === 1) {
        updateOrderState({ flavor1: flavor });
      } else {
        updateOrderState({ flavor2: flavor });
      }

      analytics.flavorSelect(flavor.id);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  const addAddon = useCallback((addon: Addon) => {
    try {
      updateOrderState(prev => ({ addons: [...prev.addons, addon] }));
      analytics.addonSelect(addon.id);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  const removeAddon = useCallback((addonId: string) => {
    try {
      updateOrderState(prev => ({ addons: prev.addons.filter(addon => addon.id !== addonId) }));
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  const addDrink = useCallback((drink: Drink) => {
    try {
      updateOrderState(prev => ({ drinks: [...prev.drinks, drink] }));
      analytics.drinkSelect(drink.id);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  const removeDrink = useCallback((drinkId: string) => {
    try {
      updateOrderState(prev => ({ drinks: prev.drinks.filter(drink => drink.id !== drinkId) }));
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  const clearOrder = useCallback(() => {
    try {
      updateOrderState({
        flavor1: null,
        flavor2: null,
        addons: [],
        drinks: [],
      });
    } catch (error) {
      onError?.(error as Error);
    }
  }, [updateOrderState, onError]);

  // Generate WhatsApp message
  const generateWhatsAppMessage = useCallback((): string => {
    const summary = calculateSummary();
    const items = [];

    if (orderState.flavor1) {
      items.push(`• ${orderState.flavor1.name}`);
    }
    if (orderState.flavor2) {
      items.push(`• ${orderState.flavor2.name}`);
    }

    orderState.addons.forEach(addon => {
      items.push(`• Extra: ${addon.name} ($${addon.price})`);
    });

    orderState.drinks.forEach(drink => {
      items.push(`• Bebida: ${drink.name} ($${drink.price})`);
    });

    const message = `¡Hola! Quiero ordenar mi kit Fiestaco:\n\n` +
                   `${items.join('\n')}\n\n` +
                   `Subtotal: $${summary.subtotal.toFixed(2)}\n` +
                   `Impuestos: $${summary.tax.toFixed(2)}\n` +
                   `Total: $${summary.total.toFixed(2)}\n\n` +
                   `¿Cómo procedo con el pago y entrega?`;

    return encodeURIComponent(message);
  }, [calculateSummary]);

  // Get WhatsApp URL
  const getWhatsAppUrl = useCallback((): string => {
    const message = generateWhatsAppMessage();
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
  }, [generateWhatsAppMessage]);

  // Complete order (track conversion)
  const completeOrder = useCallback(async () => {
    try {
      const summary = calculateSummary();

      // Track kit completion
      await analytics.kitComplete({
        flavor1: orderState.flavor1?.id || '',
        flavor2: orderState.flavor2?.id || '',
        addons: orderState.addons.map(a => a.id),
        drinks: orderState.drinks.map(d => d.id),
        order_value: summary.total,
      });

      return {
        success: true,
        summary,
        whatsappUrl: getWhatsAppUrl(),
      };
    } catch (error) {
      onError?.(error as Error);
      return { success: false, error: error as Error };
    }
  }, [calculateSummary, getWhatsAppUrl, onError]);

  // Memoized values for performance
  const summary = useMemo(() => calculateSummary(), [calculateSummary]);
  const whatsappUrl = useMemo(() => getWhatsAppUrl(), [getWhatsAppUrl]);

  return {
    // State
    state: orderState,
    summary,

    // Actions
    actions: {
      selectFlavor,
      addAddon,
      removeAddon,
      addDrink,
      removeDrink,
      clearOrder,
      completeOrder,
    },

    // Utilities
    whatsappUrl,
    generateWhatsAppMessage,

    // Product lists (could come from API/dynamic config)
    availableFlavors: FLAVORS,
    availableAddons: ADDONS,
    availableDrinks: DRINKS,
    colors: COLORS,
  };
};

export type FiestaOrderHook = ReturnType<typeof useFiestaOrder>;