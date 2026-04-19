import { AddonToggle } from "@/components/ui";
import { COLORS } from "@/lib/constants";
import { Step4DrinksProps } from "../types/steps.types";

export default function Step4Drinks({
  selectedDrinks,
  drinks,
  onToggle,
  translations,
  onNext,
  className = "",
}: Step4DrinksProps) {
  return (
    <div className={`step-4-drinks ${className}`}>
      {/* Step Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: selectedDrinks.length > 0 ? COLORS.magenta : "#333",
            color: selectedDrinks.length > 0 ? "#fff" : "#888",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            padding: "4px 12px",
            borderRadius: 999,
          }}
        >
          {translations.title}
        </div>

        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.bone,
          }}
        >
          {translations.title}
        </h3>
      </div>

      {/* Drinks Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        {drinks.map((drink) => (
          <AddonToggle
            key={drink.id}
            item={drink}
            selected={selectedDrinks.includes(drink.id)}
            onToggle={() => onToggle(drink.id)}
            label={drink.name}
            isDrink={true}
          />
        ))}

        {/* Next Button */}
        <div
          onClick={onNext}
          style={{
            background: selectedDrinks.length === 0 ? `${COLORS.orange}15` : COLORS.darkCard,
            border: `1.5px solid ${selectedDrinks.length === 0 ? COLORS.orange : COLORS.cardBorder}`,
            borderRadius: 12,
            padding: "14px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            gridColumn: "1 / -1",
          }}
        >
          <span style={{
            color: COLORS.bone,
            fontFamily: "'Oswald', sans-serif",
            fontSize: 16,
          }}>
            {translations.next}
          </span>
        </div>
      </div>
    </div>
  );
}