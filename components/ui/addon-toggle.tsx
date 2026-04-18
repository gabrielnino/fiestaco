"use client";

import { useMemo, KeyboardEvent } from "react";
import Image from "next/image";
import { COLORS } from "@/lib/constants";
import { Addon, Drink } from "@/types/fiesta.types";

interface AddonToggleProps {
  item: Addon | Drink;
  selected: boolean;
  onToggle: (id: string) => void;
  label: string;
  isDrink?: boolean;
  className?: string;
}

export default function AddonToggle({
  item,
  selected,
  onToggle,
  label,
  isDrink = false,
  className = "",
}: AddonToggleProps) {
  // Memoized styles for performance
  const containerStyles = useMemo(
    () => ({
      background: selected ? `${COLORS.orange}15` : COLORS.darkCard,
      border: `1.5px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
      borderRadius: 12,
      padding: "14px 16px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "all 0.2s",
    }),
    [selected]
  );

  const imageContainerStyles = useMemo(
    () => ({
      width: isDrink ? 54 : 64,
      height: isDrink ? 80 : 64,
      borderRadius: isDrink ? 12 : "50%",
      backgroundColor: isDrink ? "#1a1a1a" : "transparent",
      overflow: "hidden" as const,
      border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
      transition: "border-color 0.2s",
      flexShrink: 0,
      padding: isDrink ? 4 : 0,
    }),
    [isDrink, selected]
  );

  const labelStyles = useMemo(
    () => ({
      color: COLORS.bone,
      fontFamily: "'Oswald', sans-serif",
      fontSize: selected ? 16 : 15,
      transition: "all 0.2s",
    }),
    [selected]
  );

  const priceStyles = useMemo(
    () => ({
      color: COLORS.yellow,
      fontSize: 13,
      fontWeight: 600,
    }),
    []
  );

  const handleClick = () => {
    onToggle(item.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle(item.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={containerStyles}
      className={`addon-toggle ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`${selected ? "Deselect" : "Select"} ${label}`}
      aria-pressed={selected}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {item.image && (
          <div style={imageContainerStyles}>
            <Image
              src={item.image}
              alt={label}
              width={isDrink ? 54 : 64}
              height={isDrink ? 80 : 64}
              style={{
                width: "100%",
                height: "100%",
                objectFit: isDrink ? "contain" : "cover",
              }}
              loading="lazy"
            />
          </div>
        )}
        <span style={labelStyles}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={priceStyles}>+CA${item.price.toFixed(2)}</span>
        <div
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: selected ? COLORS.orange : "#333",
            position: "relative",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#fff",
              position: "absolute",
              top: 3,
              left: selected ? 23 : 3,
              transition: "left 0.2s",
            }}
          />
        </div>
      </div>
    </div>
  );
}