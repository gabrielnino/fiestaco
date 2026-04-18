"use client";

import { SkullLogo } from "@/components/ui";
import { COLORS } from "@/lib/constants";

interface HeroSectionProps {
  translations: {
    headline1: string;
    headline2: string;
    sub: string;
    support: string;
    heroCTA: string;
    howTitle: string;
    step1label: string;
    step1desc: string;
    step2label: string;
    step2desc: string;
    step3label: string;
    step3desc: string;
  };
  onCTAClick?: () => void;
  className?: string;
}

export default function HeroSection({
  translations,
  onCTAClick,
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`hero-section ${className}`}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 20px 60px",
        overflow: "visible",
      }}
    >
      {/* Background photo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 60%, rgba(11,11,11,0.95) 100%)",
          zIndex: 1,
        }}
      />

      {/* Decorative logos */}
      <div
        className="mobile-hide"
        style={{ position: "absolute", top: 80, right: 20, opacity: 0.18, zIndex: 1 }}
      >
        <SkullLogo size={120} />
      </div>
      <div
        className="mobile-hide"
        style={{ position: "absolute", bottom: 100, left: 10, opacity: 0.12, zIndex: 1 }}
      >
        <SkullLogo size={90} />
      </div>

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 560, margin: "auto 0" }}>
        <h1
          className="hero-text-mobile"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(48px, 9vw, 84px)",
            lineHeight: 1.05,
            margin: "0 0 16px",
            letterSpacing: 2,
            textShadow: "0 2px 20px rgba(0,0,0,0.6)",
          }}
        >
          <span style={{ color: COLORS.bone }}>{translations.headline1}</span>
          <br />
          <span
            style={{
              background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.magenta})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {translations.headline2}
          </span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2.5vw, 18px)",
            color: "rgba(255,255,255,0.85)",
            margin: "0 auto 8px",
            maxWidth: 540,
            lineHeight: 1.6,
            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
          }}
        >
          {translations.sub}
        </p>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>
          {translations.support}
        </p>

        <button
          onClick={onCTAClick}
          style={{
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "16px 44px",
            fontSize: 15,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            letterSpacing: 2,
            cursor: "pointer",
            boxShadow: `0 8px 32px ${COLORS.orange}55`,
            textTransform: "uppercase",
            transition: "transform 0.15s, box-shadow 0.15s",
            marginBottom: 40,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = `0 12px 40px ${COLORS.orange}77`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 8px 32px ${COLORS.orange}55`;
          }}
        >
          {translations.heroCTA}
        </button>
      </div>

      {/* How It Works Section */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 800,
          marginTop: 40,
        }}
      >
        <div
          className="mobile-hide"
          style={{
            color: "#444",
            fontSize: 20,
            animation: "bounce 2s infinite",
            marginBottom: 10,
          }}
        >
          ↓
        </div>
        <h2
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 4vw, 32px)",
            textAlign: "center",
            marginBottom: 30,
            color: COLORS.bone,
          }}
        >
          {translations.howTitle}
        </h2>

        <div
          className="mobile-grid-1"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {[
            {
              icon: (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.orange}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              ),
              step: "01",
              label: translations.step1label,
              desc: translations.step1desc,
            },
            {
              icon: (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.magenta}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              step: "02",
              label: translations.step2label,
              desc: translations.step2desc,
            },
            {
              icon: (
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={COLORS.turquoise}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M7 4h10" />
                  <path d="M17 4v8a5 5 0 0 1-10 0V4" />
                  <path d="M4 4h3v8H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                  <path d="M20 4h-3v8h3a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                </svg>
              ),
              step: "03",
              label: translations.step3label,
              desc: translations.step3desc,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="step-column"
              style={{
                background: COLORS.darkCard,
                border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 16,
                padding: "24px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
                {item.icon}
              </div>
              <div
                style={{
                  color: COLORS.orange,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  marginBottom: 6,
                }}
              >
                STEP {item.step}
              </div>
              <div
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 16,
                  marginBottom: 6,
                  color: COLORS.bone,
                }}
              >
                {item.label}
              </div>
              <div style={{ color: "#777", fontSize: 13 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(8px) }
        }
      `}</style>
    </section>
  );
}