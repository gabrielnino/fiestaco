"use client";

import { useState, useEffect } from "react";
import { SkullLogo } from "@/components/ui";
import { COLORS } from "@/lib/constants";

interface MainHeaderProps {
  translations: {
    waBtn: string;
  };
  whatsappNumber: string;
  onLanguageChange?: (lang: "en" | "es") => void;
  defaultLang?: "en" | "es";
  className?: string;
}

export default function MainHeader({
  translations,
  whatsappNumber,
  onLanguageChange,
  defaultLang = "en",
  className = "",
}: MainHeaderProps) {
  const [lang, setLang] = useState<"en" | "es">(defaultLang);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLangChange = (newLang: "en" | "es") => {
    setLang(newLang);
    onLanguageChange?.(newLang);
  };

  return (
    <header
      className={`main-header ${className}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 32px",
        background: scrolled ? "rgba(11,11,11,0.95)" : "rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: scrolled
          ? `1px solid ${COLORS.cardBorder}`
          : "none",
      }}
    >
      {/* Logo + Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <SkullLogo size={54} />
        <span
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          <span style={{ color: COLORS.bone }}>FIESTA</span>
          <span style={{ color: COLORS.orange }}>CO</span>
        </span>
      </div>

      {/* Lang + Social + CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Language Selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: COLORS.darkCard,
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => handleLangChange("en")}
            style={{
              background:
                lang === "en"
                  ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`
                  : "transparent",
              color: lang === "en" ? "#fff" : "#888",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1,
              padding: "6px 12px",
              transition: "all 0.2s",
            }}
            aria-label="Switch to English"
          >
            EN
          </button>

          <button
            onClick={() => handleLangChange("es")}
            style={{
              background:
                lang === "es"
                  ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`
                  : "transparent",
              color: lang === "es" ? "#fff" : "#888",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1,
              padding: "6px 12px",
              transition: "all 0.2s",
            }}
            aria-label="Cambiar a Español"
          >
            ES
          </button>
        </div>

        {/* Social Icons - Hidden on very small screens */}
        <div
          className="mobile-hide"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <a
            href="mailto:hello@fiestaco.today"
            title="hello@fiestaco.today"
            style={{
              color: "#888",
              transition: "color 0.2s",
              display: "flex",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.orange)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a
            href="https://instagram.com/fiestacotoday"
            target="_blank"
            rel="noreferrer"
            title="@fiestacotoday"
            style={{
              color: "#888",
              transition: "color 0.2s",
              display: "flex",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.magenta)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          style={{
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
            color: "#fff",
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 1,
            padding: "8px 14px",
            borderRadius: 999,
            textDecoration: "none",
            border: "none",
          }}
        >
          {translations.waBtn}
        </a>
      </div>
    </header>
  );
}