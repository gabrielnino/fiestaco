import { COLORS, ADDONS } from "../lib/constants";
import { AddonToggle } from "./ui";

export default function Step3Addons({
  containerRef,
  addons,
  onToggle,
  onNext,
  t,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  addons: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
  t: any;
}) {
  return (
    <div ref={containerRef} style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            background: addons.length > 0 ? COLORS.orange : "#333",
            color: addons.length > 0 ? "#fff" : "#888",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: 1,
            padding: "4px 12px",
            borderRadius: 999,
          }}
        >
          {t.step3Tag}
        </div>

        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.bone,
          }}
        >
          {t.step3Title}
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        {ADDONS.map((addon) => (
          <AddonToggle
            key={addon.id}
            item={addon}
            selected={addons.includes(addon.id)}
            onToggle={onToggle}
            label={t.addonNames[addon.id] || addon.name}
          />
        ))}
        <div
          onClick={onNext}
          style={{
            background: addons.length === 0 ? `${COLORS.orange}15` : COLORS.darkCard,
            border: `1.5px solid ${addons.length === 0 ? COLORS.orange : COLORS.cardBorder}`,
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
          <span style={{ color: COLORS.bone, fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>
            {t.next}
          </span>
        </div>
      </div>
    </div>
  );
}
