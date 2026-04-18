import { COLORS } from "../lib/constants";
import { FlavorCard } from "./ui";

export default function Step1Flavor({
  flavor1,
  flavor2,
  onSelect,
  t,
  visibleFlavors,
  showMoreFlavors,
  onShowMore,
  onNext,
}: {
  flavor1: any;
  flavor2: any;
  onSelect: (f: any) => void;
  t: any;
  visibleFlavors: any[];
  showMoreFlavors: boolean;
  onShowMore: () => void;
  onNext: () => void;
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            background: flavor1 ? COLORS.orange : "#333",
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
          STEP 1 {flavor1 ? "✓" : ""}
        </div>

        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.bone,
          }}
        >
          {t.step1Title}
        </h3>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))",
          gap: 12,
        }}
      >
        {visibleFlavors.map((f) => (
          <FlavorCard
            key={f.id}
            flavor={f}
            selected={flavor1?.id === f.id}
            onSelect={onSelect}
            disabled={flavor2?.id === f.id}
            description={t.flavorDescs[f.id]}
          />
        ))}
      </div>

      {!showMoreFlavors && (
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
        >
          {t.moreOptions}
        </button>
      )}

      {flavor1 && (
        <div
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
          }}
        >
          <span style={{ color: "#000", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16 }}>
            {t.next} →
          </span>
        </div>
      )}
    </div>
  );
}
