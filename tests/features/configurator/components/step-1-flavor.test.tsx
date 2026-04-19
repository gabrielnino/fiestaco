import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Step1Flavor from '@/features/configurator/components/step-1-flavor';

// Mock data
const mockFlavors = [
  { id: 'flavor1', name: 'Classic Beef', image: '/beef.jpg', surcharge: 0 },
  { id: 'flavor2', name: 'Spicy Chicken', image: '/chicken.jpg', surcharge: 2 },
  { id: 'flavor3', name: 'Vegetarian', image: '/veg.jpg', surcharge: 0 },
  { id: 'flavor4', name: 'Fish', image: '/fish.jpg', surcharge: 3 },
  { id: 'flavor5', name: 'Pork', image: '/pork.jpg', surcharge: 1 },
  { id: 'flavor6', name: 'Lamb', image: '/lamb.jpg', surcharge: 4 },
  { id: 'flavor7', name: 'Shrimp', image: '/shrimp.jpg', surcharge: 5 },
  { id: 'flavor8', name: 'Duck', image: '/duck.jpg', surcharge: 6 },
];

const mockTranslations = {
  title: 'Select First Flavor',
  moreOptions: 'Show more',
  next: 'Next',
};

describe('Step1Flavor', () => {
  const mockOnSelect = jest.fn();
  const mockOnShowMore = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the step header correctly', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
      />
    );

    // Usar métodos más básicos para evitar problemas con jest-dom
    expect(screen.getByText('Select First Flavor')).toBeTruthy();
    expect(screen.getByText('STEP 1')).toBeTruthy();
  });

  it('renders limited flavors by default (6 max)', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
      />
    );

    // Should show only first 6 flavors by default
    expect(screen.getByText('Classic Beef')).toBeTruthy();
    expect(screen.getByText('Spicy Chicken')).toBeTruthy();
    expect(screen.getByText('Vegetarian')).toBeTruthy();
    expect(screen.getByText('Fish')).toBeTruthy();
    expect(screen.getByText('Pork')).toBeTruthy();
    expect(screen.getByText('Lamb')).toBeTruthy();
    // These should NOT be visible by default
    expect(screen.queryByText('Shrimp')).not.toBeTruthy();
    expect(screen.queryByText('Duck')).not.toBeTruthy();
  });

  it('shows all flavors when showMoreFlavors is true', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
        showMoreFlavors={true}
      />
    );

    // All flavors should be visible
    expect(screen.getByText('Classic Beef')).toBeTruthy();
    expect(screen.getByText('Shrimp')).toBeTruthy();
    expect(screen.getByText('Duck')).toBeTruthy();
  });

  it('calls onSelect when a flavor is clicked', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
      />
    );

    // Click on first flavor
    const flavorCard = screen.getByText('Classic Beef').closest('[role="button"]');
    if (flavorCard) {
      fireEvent.click(flavorCard);
    }

    expect(mockOnSelect).toHaveBeenCalledWith(mockFlavors[0]);
  });

  it('calls onShowMore when show more button is clicked', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
        onShowMore={mockOnShowMore}
      />
    );

    const showMoreButton = screen.getByText('Show more');
    fireEvent.click(showMoreButton);

    expect(mockOnShowMore).toHaveBeenCalled();
  });

  it('shows next button when a flavor is selected', () => {
    render(
      <Step1Flavor
        selectedFlavor={mockFlavors[0]}
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByText('Next →');
    expect(nextButton).toBeTruthy();

    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('does not show next button when no flavor is selected', () => {
    render(
      <Step1Flavor
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
        onNext={mockOnNext}
      />
    );

    expect(screen.queryByText('Next →')).not.toBeTruthy();
  });

  it('adds checkmark when flavor is selected', () => {
    render(
      <Step1Flavor
        selectedFlavor={mockFlavors[0]}
        flavors={mockFlavors}
        translations={mockTranslations}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('STEP 1 ✓')).toBeTruthy();
  });
});