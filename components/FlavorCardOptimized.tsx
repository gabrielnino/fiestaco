"use client";

import { useMemo } from 'react';
import { COLORS } from "../lib/constants";
import { ProductImage } from "./ImageOptimized";
import { STATIC_STYLES, mergeStyles } from "../lib/optimized-styles";

export default function FlavorCardOptimized({
  flavor,
  selected,
  onSelect,
  disabled,
  translatedDesc,
}: {
  flavor: any;
  selected: boolean;
  onSelect: (f: any) => void;
  disabled: boolean;
  translatedDesc: string;
}) {
  // Estilos memoizados para evitar re-renders innecesarios
  const cardStyles = useMemo(() => 
    mergeStyles(
      STATIC_STYLES.card.flavor,
      selected && STATIC_STYLES.card.selected,
      disabled && { opacity: 0.4, cursor: 'not-allowed' }
    ),
    [selected, disabled]
  );

  const checkmarkStyles = useMemo(() => ({
    position: 'absolute' as const,
    top: 8,
    right: 8,
    background: COLORS.orange,
    borderRadius: '50%',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 900,
    color: '#000',
  }), []);

  const imageContainerStyles = useMemo(() => ({
    width: 80,
    height: 80,
    borderRadius: '50%',
    overflow: 'hidden' as const,
    marginBottom: 4,
    border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
  }), [selected]);

  const nameStyles = useMemo(() => ({
    color: COLORS.bone,
    fontFamily: "'Oswald', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    textAlign: 'center' as const,
  }), []);

  const surchargeStyles = useMemo(() => ({
    color: COLORS.yellow,
    fontSize: 13,
    fontWeight: 600,
    marginTop: -4,
  }), []);

  const descStyles = useMemo(() => ({
    color: '#888',
    fontSize: 11,
    textAlign: 'center' as const,
    lineHeight: 1.3,
  }), []);

  return (
    <button
      onClick={() => !disabled && onSelect(flavor)}
      style={cardStyles}
      aria-label={`Select ${flavor.name} tacos`}
      aria-pressed={selected}
      disabled={disabled}
    >
      {selected && (
        <div style={checkmarkStyles} aria-hidden="true">
          ✓
        </div>
      )}
      <div style={imageContainerStyles}>
        <ProductImage 
          productId={flavor.id}
          productName={flavor.name}
          width={80}
          height={80}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span style={nameStyles}>
        {flavor.name}
      </span>
      {flavor.surcharge && (
        <span style={surchargeStyles}>
          +CA${flavor.surcharge.toFixed(2)}
        </span>
      )}
      <span style={descStyles}>
        {translatedDesc || flavor.desc}
      </span>
    </button>
  );
}