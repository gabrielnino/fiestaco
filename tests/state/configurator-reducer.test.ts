import { configuratorReducer, calculateTotalPrice } from "@/features/configurator/state/configurator-reducer";
import { initialState } from "@/features/configurator/types/state.types";
import { Flavor, Addon, Drink } from "@/types/fiesta.types";

// Datos de prueba
const mockFlavor1: Flavor = {
  id: "al-pastor",
  name: "Al Pastor",
  image: "/images/flavors/al_pastor.webp",
};

const mockFlavor2: Flavor = {
  id: "chorizo",
  name: "Chorizo",
  image: "/images/flavors/chorizo.webp",
  surcharge: 5,
};

const mockAddon: Addon = {
  id: "cheese",
  name: "Shredded Cheese",
  image: "/images/addons/cheese.webp",
  price: 12,
};

const mockDrink: Drink = {
  id: "corona-6",
  name: "Corona x 6",
  image: "https://example.com/corona.png",
  price: 17.31,
};

describe("configuratorReducer", () => {
  test("debe retornar el estado inicial", () => {
    const state = configuratorReducer(initialState, { type: "UNKNOWN" } as any);
    // No comparar lastUpdated ya que es un objeto Date nuevo
    expect(state.started).toBe(initialState.started);
    expect(state.converted).toBe(initialState.converted);
    expect(state.currentStep).toBe(initialState.currentStep);
    expect(state.flavor1).toEqual(initialState.flavor1);
    expect(state.flavor2).toEqual(initialState.flavor2);
    expect(state.addons).toEqual(initialState.addons);
    expect(state.drinks).toEqual(initialState.drinks);
    expect(state.currentPrice).toBe(initialState.currentPrice);
    expect(state.sessionId).toBe(initialState.sessionId);
    // Verificar que lastUpdated es un objeto Date válido
    expect(state.lastUpdated).toBeDefined();
    expect(typeof state.lastUpdated.getTime).toBe('function');
    expect(state.lastUpdated.getTime()).toBeGreaterThan(0);
  });

  test("START_WIZARD debe iniciar el wizard", () => {
    const state = configuratorReducer(initialState, { type: "START_WIZARD" });

    expect(state.started).toBe(true);
    expect(state.currentStep).toBe(1);
    // Verificar que lastUpdated es un objeto Date válido
    expect(state.lastUpdated).toBeDefined();
    expect(typeof state.lastUpdated.getTime).toBe('function');
    expect(state.lastUpdated.getTime()).toBeGreaterThan(0);
  });

  test("COMPLETE_WIZARD debe marcar como completado", () => {
    const state = configuratorReducer(
      { ...initialState, started: true },
      { type: "COMPLETE_WIZARD" }
    );

    expect(state.converted).toBe(true);
    expect(state.currentStep).toBe(5);
  });

  test("SET_STEP debe cambiar el paso actual", () => {
    const state = configuratorReducer(initialState, {
      type: "SET_STEP",
      payload: 3
    });

    expect(state.currentStep).toBe(3);
  });

  test("SET_STEP debe respetar límites (1-5)", () => {
    const state1 = configuratorReducer(initialState, {
      type: "SET_STEP",
      payload: 0
    });
    expect(state1.currentStep).toBe(1);

    const state2 = configuratorReducer(initialState, {
      type: "SET_STEP",
      payload: 6
    });
    expect(state2.currentStep).toBe(5);
  });

  test("SELECT_FLAVOR_1 debe seleccionar primer flavor", () => {
    const state = configuratorReducer(initialState, {
      type: "SELECT_FLAVOR_1",
      payload: mockFlavor1,
    });

    expect(state.flavor1).toEqual(mockFlavor1);
    expect(state.currentStep).toBe(2); // Avanza al paso 2
  });

  test("SELECT_FLAVOR_1 no debe permitir seleccionar flavor ya usado en posición 2", () => {
    const stateWithFlavor2 = {
      ...initialState,
      flavor2: mockFlavor1,
    };

    const state = configuratorReducer(stateWithFlavor2, {
      type: "SELECT_FLAVOR_1",
      payload: mockFlavor1, // Mismo flavor que flavor2
    });

    expect(state.flavor1).toBeNull(); // No debe cambiar
  });

  test("SELECT_FLAVOR_2 debe seleccionar segundo flavor", () => {
    const stateWithFlavor1 = {
      ...initialState,
      flavor1: mockFlavor1,
    };

    const state = configuratorReducer(stateWithFlavor1, {
      type: "SELECT_FLAVOR_2",
      payload: mockFlavor2,
    });

    expect(state.flavor2).toEqual(mockFlavor2);
    expect(state.currentStep).toBe(3); // Avanza al paso 3
  });

  test("TOGGLE_ADDON debe agregar addon cuando no está seleccionado", () => {
    const state = configuratorReducer(initialState, {
      type: "TOGGLE_ADDON",
      payload: mockAddon,
    });

    expect(state.addons).toHaveLength(1);
    expect(state.addons[0]).toEqual(mockAddon);
  });

  test("TOGGLE_ADDON debe remover addon cuando ya está seleccionado", () => {
    const stateWithAddon = {
      ...initialState,
      addons: [mockAddon],
    };

    const state = configuratorReducer(stateWithAddon, {
      type: "TOGGLE_ADDON",
      payload: mockAddon,
    });

    expect(state.addons).toHaveLength(0);
  });

  test("TOGGLE_DRINK debe agregar drink cuando no está seleccionado", () => {
    const state = configuratorReducer(initialState, {
      type: "TOGGLE_DRINK",
      payload: mockDrink,
    });

    expect(state.drinks).toHaveLength(1);
    expect(state.drinks[0]).toEqual(mockDrink);
  });

  test("CLEAR_SELECTION debe limpiar todas las selecciones", () => {
    const stateWithSelections = {
      ...initialState,
      flavor1: mockFlavor1,
      flavor2: mockFlavor2,
      addons: [mockAddon],
      drinks: [mockDrink],
      currentStep: 4,
      currentPrice: 100,
    };

    const state = configuratorReducer(stateWithSelections, {
      type: "CLEAR_SELECTION",
    });

    expect(state.flavor1).toBeNull();
    expect(state.flavor2).toBeNull();
    expect(state.addons).toHaveLength(0);
    expect(state.drinks).toHaveLength(0);
    expect(state.currentStep).toBe(1);
    expect(state.currentPrice).toBe(0);
  });

  test("UPDATE_PRICE debe actualizar el precio actual", () => {
    const state = configuratorReducer(initialState, {
      type: "UPDATE_PRICE",
      payload: 99.99,
    });

    expect(state.currentPrice).toBe(99.99);
  });

  test("SET_SESSION debe establecer session ID", () => {
    const sessionId = "test-session-123";
    const state = configuratorReducer(initialState, {
      type: "SET_SESSION",
      payload: sessionId,
    });

    expect(state.sessionId).toBe(sessionId);
  });
});

describe("calculateTotalPrice", () => {
  test("debe calcular precio total correctamente", () => {
    const state: any = {
      flavor1: mockFlavor1, // Sin surcharge
      flavor2: mockFlavor2, // Con surcharge de 5
      addons: [mockAddon], // Precio 12
      drinks: [mockDrink], // Precio 17.31
    };

    const basePrice = 45;
    const total = calculateTotalPrice(state, basePrice);

    // Cálculo: 45 (base) + 5 (surcharge) + 12 (addon) + 17.31 (drink) = 79.31
    expect(total).toBeCloseTo(79.31);
  });

  test("debe manejar estado vacío", () => {
    const state: any = {
      flavor1: null,
      flavor2: null,
      addons: [],
      drinks: [],
    };

    const basePrice = 45;
    const total = calculateTotalPrice(state, basePrice);

    expect(total).toBe(45); // Solo precio base
  });

  test("debe ignorar flavors sin surcharge", () => {
    const state: any = {
      flavor1: { ...mockFlavor1, surcharge: undefined },
      flavor2: { ...mockFlavor2, surcharge: 0 },
      addons: [],
      drinks: [],
    };

    const basePrice = 45;
    const total = calculateTotalPrice(state, basePrice);

    expect(total).toBe(45); // Solo precio base
  });
});