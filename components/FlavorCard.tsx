import { COLORS } from "../lib/constants";
import { ProductImage } from "./ImageOptimized";

export default function FlavorCard({
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
  return (
    <button
      onClick={() => !disabled && onSelect(flavor)}
      className="mobile-padding-x-small"
      style={{
        background: selected ? `linear-gradient(135deg, ${COLORS.orange}22, ${COLORS.magenta}22)` : COLORS.darkCard,
        border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
        borderRadius: 16,
        padding: "16px 12px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1, // Added to ensure buttons stretch in grid
        minWidth: 140, // Increased minWidth slightly
        gap: 8,
        position: "relative",
        boxShadow: selected ? `0 0 20px ${COLORS.orange}44` : "none",
        transform: selected ? "scale(1.03)" : "scale(1)",
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: COLORS.orange,
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
            color: "#000",
          }}
        >
          ✓
        </div>
      )}
      <div 
        style={{ 
          width: 80, 
          height: 80, 
          borderRadius: "50%", 
          overflow: "hidden", 
          marginBottom: 4,
          border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
        }}
      >
        <ProductImage 
          productId={flavor.id}
          productName={flavor.name}
          width={80}
          height={80}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <span
        style={{
          color: COLORS.bone,
          fontFamily: "'Oswald', sans-serif",
          fontSize: 15,
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {flavor.name}
      </span>
      {flavor.surcharge && (
        <span style={{ color: COLORS.yellow, fontSize: 13, fontWeight: 600, marginTop: -4 }}>
          +CA${flavor.surcharge.toFixed(2)}
        </span>
      )}
      <span style={{ color: "#888", fontSize: 11, textAlign: "center", lineHeight: 1.3 }}>
        {translatedDesc || flavor.desc}
      </span>
    </button>
  );
}
