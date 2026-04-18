import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlavorCard } from "@/components/ui";
import { Flavor } from "@/types/fiesta.types";

// Mock para Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => (
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    <img {...props} />
  ),
}));

describe("FlavorCard", () => {
  const mockFlavor: Flavor = {
    id: "al-pastor",
    name: "Al Pastor",
    image: "/images/flavors/al_pastor.webp",
    surcharge: 5,
  };

  const mockFlavorWithoutSurcharge: Flavor = {
    id: "chorizo",
    name: "Chorizo",
    image: "/images/flavors/chorizo.webp",
  };

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar correctamente", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        onSelect={mockOnSelect}
        description="Delicious marinated pork"
      />
    );

    expect(screen.getByText("Al Pastor")).toBeInTheDocument();
    expect(screen.getByText("Delicious marinated pork")).toBeInTheDocument();
    expect(screen.getByText("+CA$5.00")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select al pastor flavor/i })).toBeInTheDocument();
  });

  test("debe mostrar estado seleccionado", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={true}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByRole('button', { name: /select al pastor flavor/i });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  test("debe mostrar estado deshabilitado", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        disabled={true}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByRole('button', { name: /select al pastor flavor/i });
    expect(button).toBeDisabled();
    expect(button).toHaveStyle("cursor: not-allowed");
    expect(button).toHaveStyle("opacity: 0.4");
  });

  test("debe llamar onSelect al hacer click", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByRole('button', { name: /select al pastor flavor/i });
    fireEvent.click(button);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(mockFlavor);
  });

  test("no debe llamar onSelect cuando está deshabilitado", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        disabled={true}
        onSelect={mockOnSelect}
      />
    );

    const button = screen.getByRole('button', { name: /select al pastor flavor/i });
    fireEvent.click(button);

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  test("no debe mostrar surcharge cuando es 0 o undefined", () => {
    const { rerender } = render(
      <FlavorCard
        flavor={mockFlavorWithoutSurcharge}
        selected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.queryByText(/\+CA\$/)).not.toBeInTheDocument();

    // Test con surcharge 0
    const flavorWithZeroSurcharge = {
      ...mockFlavorWithoutSurcharge,
      surcharge: 0,
    };

    rerender(
      <FlavorCard
        flavor={flavorWithZeroSurcharge}
        selected={false}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.queryByText(/\+CA\$/)).not.toBeInTheDocument();
  });

  test("debe aceptar className y style adicionales", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        onSelect={mockOnSelect}
        className="custom-class"
        style={{ marginTop: "10px" }}
      />
    );

    const button = screen.getByRole('button', { name: /select al pastor flavor/i });
    expect(button).toHaveClass("custom-class");
    expect(button).toHaveStyle("margin-top: 10px");
  });

  test("debe renderizar imagen correctamente", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        onSelect={mockOnSelect}
      />
    );

    const image = screen.getByRole('img', { name: /al pastor/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockFlavor.image);
  });

  test("debe manejar flavor sin description", () => {
    render(
      <FlavorCard
        flavor={mockFlavor}
        selected={false}
        onSelect={mockOnSelect}
      />
    );

    // No debe haber descripción si no se pasa prop
    expect(screen.queryByText(/Delicious/)).not.toBeInTheDocument();
  });
});