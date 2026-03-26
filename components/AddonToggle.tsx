import { COLORS } from "../lib/constants";

export default function AddonToggle({
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
  return (
    <div
      onClick={() => onToggle(addon.id)}
      style={{
        background: selected ? `${COLORS.orange}15` : COLORS.darkCard,
        border: `1.5px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
        borderRadius: 12,
        padding: "14px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {addon.image && (
          <div
            style={{
              width: isDrink ? 54 : 64,
              height: isDrink ? 80 : 64,
              borderRadius: isDrink ? 12 : "50%",
              backgroundColor: isDrink ? "#1a1a1a" : "transparent",
              overflow: "hidden",
              border: `2px solid ${selected ? COLORS.orange : COLORS.cardBorder}`,
              transition: "border-color 0.2s",
              flexShrink: 0,
              padding: isDrink ? 4 : 0,
            }}
          >
            <img src={addon.image} alt={label} style={{ width: "100%", height: "100%", objectFit: isDrink ? "contain" : "cover" }} />
          </div>
        )}
        <span style={{ color: COLORS.bone, fontFamily: "'Oswald', sans-serif", fontSize: selected ? 16 : 15, transition: "all 0.2s" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: COLORS.yellow, fontSize: 13, fontWeight: 600 }}>+CA${addon.price}</span>
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
