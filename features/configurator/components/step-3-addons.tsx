import { AddonToggle } from "@/components/ui";
import { COLORS } from "@/lib/constants";
import { Step3AddonsProps } from "../types/steps.types";

export default function Step3Addons({
  selectedAddons,
  addons,
  onToggle,
  translations,
  onNext,
  className = "",
}: Step3AddonsProps) {
  return (
    <div className={`step-3-addons ${className}`}>
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
            background: selectedAddons.length > 0 ? COLORS.orange : "#333",
            color: selectedAddons.length > 0 ? "#fff" : "#888",
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

      {/* Addons Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        {addons.map((addon) => (
          <AddonToggle
            key={addon.id}
            item={addon}
            selected={selectedAddons.includes(addon.id)}
            onToggle={() => onToggle(addon.id)}
            label={addon.name}
          />
        ))}

        {/* Next Button */}
        <div
          onClick={onNext}
          style={{
            background: selectedAddons.length === 0 ? `${COLORS.orange}15` : COLORS.darkCard,
            border: `1.5px solid ${selectedAddons.length === 0 ? COLORS.orange : COLORS.cardBorder}`,
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