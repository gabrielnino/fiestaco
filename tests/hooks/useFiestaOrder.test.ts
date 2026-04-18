/**
 * Unit tests for useFiestaOrder hook
 * Testing business logic in isolation
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useFiestaOrder } from '../../hooks/useFiestaOrder';
import { Flavor, Addon, Drink } from '../../types/fiesta.types';

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  analytics: {
    flavorSelect: jest.fn(),
    addonSelect: jest.fn(),
    drinkSelect: jest.fn(),
    kitComplete: jest.fn(() => Promise.resolve()),
  },
}));

// Mock constants
jest.mock('@/lib/constants', () => ({
  FLAVORS: [
    { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' },
    { id: 'chorizo', name: 'Chorizo', image: '/test.jpg' },
    { id: 'lengua', name: 'Lengua', image: '/test.jpg', surcharge: 5 },
  ],
  ADDONS: [
    { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' },
    { id: 'guac', name: 'Guacamole', price: 12, image: '/test.jpg' },
  ],
  DRINKS: [
    { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' },
    { id: 'pacifico-6', name: 'Pacifico x6', price: 17.09, image: '/test.jpg' },
  ],
  BASE_PRICE: 45,
  WHATSAPP_NUMBER: '1234567890',
  COLORS: {
    magenta: '#E6399B',
    turquoise: '#2EC4B6',
    black: '#0B0B0B',
  },
}));

describe('useFiestaOrder Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    test('should initialize with empty order state', () => {
      const { result } = renderHook(() => useFiestaOrder());

      expect(result.current.state.flavor1).toBeNull();
      expect(result.current.state.flavor2).toBeNull();
      expect(result.current.state.addons).toEqual([]);
      expect(result.current.state.drinks).toEqual([]);
      // Verificar que createdAt y updatedAt son objetos Date válidos
      expect(result.current.state.createdAt).toBeDefined();
      expect(result.current.state.updatedAt).toBeDefined();
      expect(typeof result.current.state.createdAt.getTime).toBe('function');
      expect(typeof result.current.state.updatedAt.getTime).toBe('function');
      expect(result.current.state.createdAt.getTime()).toBeGreaterThan(0);
      expect(result.current.state.updatedAt.getTime()).toBeGreaterThan(0);
    });

    test('should provide product lists', () => {
      const { result } = renderHook(() => useFiestaOrder());

      expect(result.current.availableFlavors).toHaveLength(3);
      expect(result.current.availableAddons).toHaveLength(2);
      expect(result.current.availableDrinks).toHaveLength(2);
    });
  });

  describe('Flavor Selection', () => {
    test('should select first flavor', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
      });

      expect(result.current.state.flavor1).toEqual(flavor);
      expect(result.current.state.flavor2).toBeNull();
    });

    test('should select second flavor', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor1: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      const flavor2: Flavor = { id: 'chorizo', name: 'Chorizo', image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor1, 1);
        result.current.actions.selectFlavor(flavor2, 2);
      });

      expect(result.current.state.flavor1).toEqual(flavor1);
      expect(result.current.state.flavor2).toEqual(flavor2);
    });

    test('should track analytics when selecting flavor', () => {
      const { analytics } = require('@/lib/analytics');
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
      });

      expect(analytics.flavorSelect).toHaveBeenCalledWith('al-pastor');
    });
  });

  describe('Addon Management', () => {
    test('should add addon to order', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };

      act(() => {
        result.current.actions.addAddon(addon);
      });

      expect(result.current.state.addons).toEqual([addon]);
    });

    test('should remove addon from order', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };

      act(() => {
        result.current.actions.addAddon(addon);
        result.current.actions.removeAddon(addon.id);
      });

      expect(result.current.state.addons).toHaveLength(0);
    });

    test('should track analytics when adding addon', () => {
      const { analytics } = require('@/lib/analytics');
      const { result } = renderHook(() => useFiestaOrder());
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };

      act(() => {
        result.current.actions.addAddon(addon);
      });

      expect(analytics.addonSelect).toHaveBeenCalledWith('cheese');
    });
  });

  describe('Drink Management', () => {
    test('should add drink to order', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.addDrink(drink);
      });

      expect(result.current.state.drinks).toEqual([drink]);
    });

    test('should remove drink from order', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.addDrink(drink);
        result.current.actions.removeDrink(drink.id);
      });

      expect(result.current.state.drinks).toHaveLength(0);
    });
  });

  describe('Order Summary Calculations', () => {
    test('should calculate base price correctly', () => {
      const { result } = renderHook(() => useFiestaOrder());

      expect(result.current.summary.subtotal).toBe(45);
      expect(result.current.summary.tax).toBeCloseTo(45 * 0.08);
      expect(result.current.summary.total).toBeCloseTo(45 + (45 * 0.08));
    });

    test('should include flavor surcharges in calculation', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'lengua', name: 'Lengua', image: '/test.jpg', surcharge: 5 };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
      });

      expect(result.current.summary.subtotal).toBe(50); // 45 + 5
    });

    test('should include addons in calculation', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };

      act(() => {
        result.current.actions.addAddon(addon);
      });

      expect(result.current.summary.subtotal).toBe(57); // 45 + 12
    });

    test('should include drinks in calculation', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.addDrink(drink);
      });

      expect(result.current.summary.subtotal).toBeCloseTo(45 + 17.31);
    });

    test('should calculate item count correctly', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
        result.current.actions.addAddon(addon);
        result.current.actions.addDrink(drink);
      });

      expect(result.current.summary.itemCount).toBe(3);
    });
  });

  describe('WhatsApp Message Generation', () => {
    test('should generate correct WhatsApp message URL', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
        result.current.actions.addAddon(addon);
      });

      const url = result.current.whatsappUrl;
      expect(url).toContain('https://wa.me/1234567890');
      expect(url).toContain('Al%20Pastor');
      expect(url).toContain('Cheese');
      expect(url).toContain('%2412');
    });

    test('should handle complex orders in WhatsApp message', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor1: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      const flavor2: Flavor = { id: 'lengua', name: 'Lengua', image: '/test.jpg', surcharge: 5 };
      const addon1: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };
      const addon2: Addon = { id: 'guac', name: 'Guacamole', price: 12, image: '/test.jpg' };
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor1, 1);
        result.current.actions.selectFlavor(flavor2, 2);
        result.current.actions.addAddon(addon1);
        result.current.actions.addAddon(addon2);
        result.current.actions.addDrink(drink);
      });

      const encodedMessage = result.current.generateWhatsAppMessage();
      // generateWhatsAppMessage devuelve un mensaje codificado con encodeURIComponent
      const message = decodeURIComponent(encodedMessage);
      expect(message).toContain('Al Pastor');
      expect(message).toContain('Lengua');
      expect(message).toContain('Cheese');
      expect(message).toContain('Guacamole');
      expect(message).toContain('Corona x6');
      expect(message).toContain('Total:');
    });
  });

  describe('Order Completion', () => {
    test('should complete order successfully', async () => {
      const { analytics } = require('@/lib/analytics');
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
      });

      let completionResult;
      await act(async () => {
        completionResult = await result.current.actions.completeOrder();
      });

      expect(completionResult).toEqual({
        success: true,
        summary: expect.any(Object),
        whatsappUrl: expect.any(String),
      });

      expect(analytics.kitComplete).toHaveBeenCalledWith({
        flavor1: 'al-pastor',
        flavor2: '',
        addons: [],
        drinks: [],
        order_value: expect.any(Number),
      });
    });

    test('should handle order completion errors', async () => {
      const { analytics } = require('@/lib/analytics');
      analytics.kitComplete.mockRejectedValueOnce(new Error('Network error'));

      const mockOnError = jest.fn();
      const { result } = renderHook(() => useFiestaOrder({ onError: mockOnError }));

      let completionResult;
      await act(async () => {
        completionResult = await result.current.actions.completeOrder();
      });

      expect(completionResult).toEqual({
        success: false,
        error: expect.any(Error),
      });
      expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('Order Clearing', () => {
    test('should clear entire order', () => {
      const { result } = renderHook(() => useFiestaOrder());
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      const addon: Addon = { id: 'cheese', name: 'Cheese', price: 12, image: '/test.jpg' };
      const drink: Drink = { id: 'corona-6', name: 'Corona x6', price: 17.31, image: '/test.jpg' };

      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
        result.current.actions.addAddon(addon);
        result.current.actions.addDrink(drink);
      });

      expect(result.current.state.flavor1).not.toBeNull();
      expect(result.current.state.addons).toHaveLength(1);
      expect(result.current.state.drinks).toHaveLength(1);

      act(() => {
        result.current.actions.clearOrder();
      });

      expect(result.current.state.flavor1).toBeNull();
      expect(result.current.state.flavor2).toBeNull();
      expect(result.current.state.addons).toHaveLength(0);
      expect(result.current.state.drinks).toHaveLength(0);
    });
  });

  describe('Performance Optimizations', () => {
    test('should memoize summary calculations', () => {
      const { result, rerender } = renderHook(() => useFiestaOrder());

      const firstSummary = result.current.summary;
      rerender(); // Re-render without state changes

      expect(result.current.summary).toBe(firstSummary); // Same reference (memoized)

      // Change state
      const flavor: Flavor = { id: 'al-pastor', name: 'Al Pastor', image: '/test.jpg' };
      act(() => {
        result.current.actions.selectFlavor(flavor, 1);
      });

      expect(result.current.summary).not.toBe(firstSummary); // New reference after state change
    });

    test('should memoize WhatsApp URL', () => {
      const { result, rerender } = renderHook(() => useFiestaOrder());

      const firstUrl = result.current.whatsappUrl;
      rerender();

      expect(result.current.whatsappUrl).toBe(firstUrl); // Same reference
    });
  });
});