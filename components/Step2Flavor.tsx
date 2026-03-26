import { COLORS } from "../lib/constants";
import FlavorCard from "./FlavorCard";

export default function Step2Flavor({
  containerRef,
  flavor1,
  flavor2,
  onSelect,
  t,
  visibleFlavors,
  onNext,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  flavor1: any;
  flavor2: any;
  onSelect: (f: any) => void;
  t: any;
  visibleFlavors: any[];
  onNext: () => void;
}) {
  return (
    <div ref={containerRef} style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            background: flavor2 ? COLORS.magenta : "#333",
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
          STEP 2 {flavor2 ? "✓" : ""}
        </div>

        <h3
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.bone,
          }}
        >
          {t.step2Title}
        </h3>
      </div>

      {flavor1 ? (
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
              selected={flavor2?.id === f.id}
              onSelect={onSelect}
              disabled={flavor1?.id === f.id}
              translatedDesc={t.flavorDescs[f.id]}
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
          {t.selectFirst}
        </div>
      )}

      {flavor2 && (
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
          <span style={{ color: "#fff", fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 16 }}>
            {t.next} →
          </span>
        </div>
      )}
    </div>
  );
}
