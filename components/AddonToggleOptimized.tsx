"use client";

import { useMemo } from 'react';
import { COLORS } from "../lib/constants";
import ImageOptimized from "./ImageOptimized";
import { STATIC_STYLES, mergeStyles } from "../lib/optimized-styles";

export default function AddonToggleOptimized({
  addon,
  selected,
  onToggle,
  label,
  isDrink = false,
}: {
  addon: any;
  selected: boolean;
  onToggle: (id: string) => void;
  label: string;
  isDrink?: boolean;
}) {
  // Estilos memoizados
  const containerStyles = useMemo(() => 
    mergeStyles(
      {
        background: selected ? `${COLORS.orange}15` : COLORS.darkCard,
        border: `1.5px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
      }
    ),
    [selected]
  );

  const imageContainerStyles = useMemo(() => ({
    width: isDrink ? 54 : 64,
    height: isDrink ? 80 : 64,
    borderRadius: isDrink ? 12 : "50%",
    backgroundColor: isDrink ? "#1a1a1a" : "transparent",
    overflow: "hidden" as const,
    border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
    transition: "border-color 0.2s",
    flexShrink: 0,
    padding: isDrink ? 4 : 0,
  }), [isDrink, selected]);

  const labelStyles = useMemo(() => ({
    color: COLORS.bone,
    fontFamily: "'Oswald', sans-serif",
    fontSize: selected ? 16 : 15,
    transition: "all 0.2s",
  }), [selected]);

  const priceStyles = useMemo(() => ({
    color: COLORS.bone,
    fontFamily: "'Oswald', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    whiteSpace: "nowrap" as const,
  }), []);

  return (
    <div
      onClick={() => onToggle(addon.id)}
      style={containerStyles}
      role="button"
      tabIndex={0}
      aria-label={`${selected ? 'Deselect' : 'Select'} ${label}`}
      aria-pressed={selected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(addon.id);
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {addon.image && (
          <div style={imageContainerStyles}>
            <ImageOptimized 
              src={addon.image} 
              alt={label}
              width={isDrink ? 54 : 64}
              height={isDrink ? 80 : 64}
              style={{ width: "100%", height: "100%", objectFit: isDrink ? "contain" : "cover" }}
            />
          </div>
        )}
        <span style={labelStyles}>
          {label}
        </span>
      </div>
      <span style={priceStyles}>
        CA${addon.price?.toFixed(2) || "0.00"}
      </span>
    </div>
  );
}