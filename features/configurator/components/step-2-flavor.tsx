import { FlavorCard } from "@/components/ui";
import { COLORS } from "@/lib/constants";
import { Step2FlavorProps } from "../types/steps.types";

export default function Step2Flavor({
  firstFlavor,
  selectedFlavor,
  flavors,
  onSelect,
  translations,
  onNext,
  className = "",
}: Step2FlavorProps) {
  return (
    <div className={`step-2-flavor ${className}`}>
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
            background: selectedFlavor ? COLORS.magenta : "#333",
            color: "#fff",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            padding: "4px 12px",
            borderRadius: 999,
            transition: "background 0.3s",
          }}
        >
          STEP 2 {selectedFlavor ? "✓" : ""}
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

      {/* Flavors Grid */}
      {firstFlavor ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
            gap: 12,
          }}
        >
          {flavors.map((flavor) => (
            <FlavorCard
              key={flavor.id}
              flavor={flavor}
              selected={selectedFlavor?.id === flavor.id}
              onSelect={() => onSelect(flavor)}
              disabled={firstFlavor?.id === flavor.id}
              description={flavor.name}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: COLORS.darkCard,
            border: `1px dashed ${COLORS.cardBorder}`,
            borderRadius: 16,
            padding: "30px 20px",
            textAlign: "center",
            color: "#555",
          }}
        >
          {translations.title}
        </div>
      )}

      {/* Next Button */}
      {selectedFlavor && onNext && (
        <div
          onClick={onNext}
          style={{
            background: COLORS.magenta,
            borderRadius: 12,
            padding: "14px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            marginTop: 16,
          }}
        >
          <span style={{
            color: "#fff",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 16,
          }}>
            {translations.next} →
          </span>
        </div>
      )}
    </div>
  );
}