import { Flavor } from "@/types/fiesta.types";
import { FlavorCard } from "@/components/ui";
import { COLORS } from "@/lib/constants";
import { Step1FlavorProps } from "../types/steps.types";

export default function Step1Flavor({
  selectedFlavor,
  secondFlavor,
  flavors,
  onSelect,
  translations,
  showMoreFlavors = false,
  onShowMore,
  onNext,
  className = "",
}: Step1FlavorProps) {
  const visibleFlavors = showMoreFlavors ? flavors : flavors.slice(0, 6);

  return (
    <div className={`step-1-flavor ${className}`}>
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
            background: selectedFlavor ? COLORS.orange : "#333",
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
          STEP 1 {selectedFlavor ? "✓" : ""}
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

      {/* Flavor Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
          gap: 12,
        }}
      >
        {visibleFlavors.map((flavor) => (
          <FlavorCard
            key={flavor.id}
            flavor={flavor}
            selected={selectedFlavor?.id === flavor.id}
            disabled={secondFlavor?.id === flavor.id}
            onSelect={onSelect}
            description={flavor.id} // This should come from translations
          />
        ))}
      </div>

      {/* Show More Button */}
      {!showMoreFlavors && onShowMore && (
        <button
          onClick={onShowMore}
          style={{
            marginTop: 12,
            background: "transparent",
            border: `1px dashed ${COLORS.cardBorder}`,
            color: "#777",
            borderRadius: 12,
            padding: "12px 20px",
            cursor: "pointer",
            fontSize: 14,
            width: "100%",
          }}
          type="button"
        >
          {translations.moreOptions}
        </button>
      )}

      {/* Next Button */}
      {selectedFlavor && onNext && (
        <button
          onClick={onNext}
          style={{
            background: COLORS.orange,
            borderRadius: 12,
            padding: "14px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            marginTop: 16,
            width: "100%",
            border: "none",
            color: "#000",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 16,
          }}
          type="button"
        >
          {translations.next} →
        </button>
      )}
    </div>
  );
}