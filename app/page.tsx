"use client";

import { useState, useEffect, useRef } from "react";
import SkullLogo from "../components/SkullLogo";
import T from "./translations.json";

import { COLORS, FLAVORS, ADDONS, DRINKS, BASE_PRICE, WHATSAPP_NUMBER } from "../lib/constants";
import Step1Flavor from "../components/Step1Flavor";
import Step2Flavor from "../components/Step2Flavor";
import Step3Addons from "../components/Step3Addons";
import Step4Drinks from "../components/Step4Drinks";

export default function FiestaCo() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const t: any = T[lang];

  const [flavor1, setFlavor1] = useState<any>(null);
  const [flavor2, setFlavor2] = useState<any>(null);
  const [addons, setAddons] = useState<string[]>([]);
  const [drinks, setDrinks] = useState<string[]>([]);
  const [showMoreFlavors, setShowMoreFlavors] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const configuratorRef = useRef<HTMLElement>(null);

  const scrollToStepContainer = () => {
    configuratorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFlavor1Select = (f: any) => {
    setFlavor1(f);
    setTimeout(() => {
      setCurrentStep(2);
      scrollToStepContainer();
    }, 150);
  };

  const handleFlavor2Select = (f: any) => {
    setFlavor2(f);
    setTimeout(() => {
      setCurrentStep(3);
      scrollToStepContainer();
    }, 150);
  };

  const handleNextAddons = () => {
    setTimeout(() => {
      setCurrentStep(4);
      scrollToStepContainer();
    }, 150);
  };

  const handleNextDrinks = () => {
    setTimeout(() => {
      setCurrentStep(5);
      scrollToStepContainer();
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const existing = document.getElementById("fiestaco-google-fonts");
    if (existing) return;

    const link = document.createElement("link");
    link.id = "fiestaco-google-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&family=Bebas+Neue&family=Nunito:wght@400;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const visibleFlavors = showMoreFlavors ? FLAVORS : FLAVORS.slice(0, 6);

  const toggleAddon = (id: string) => {
    setAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  };

  const toggleDrink = (id: string) => {
    setDrinks((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const addonTotal = addons.reduce((sum: number, id: string) => {
    const addon = ADDONS.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const drinkTotal = drinks.reduce((sum: number, id: string) => {
    const drink = DRINKS.find((d) => d.id === id);
    return sum + (drink?.price || 0);
  }, 0);

  const flavorTotal = (flavor1?.surcharge || 0) + (flavor2?.surcharge || 0);
  const totalPrice = BASE_PRICE + addonTotal + drinkTotal + flavorTotal;

  const buildWhatsAppMessage = () => {
    const f1 = flavor1?.name || "—";
    const f2 = flavor2?.name || "—";
    const addonNames = addons
      .map((id) => (t as any).addonNames[id] || ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    const drinkNames = drinks
      .map((id) => DRINKS.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    return ((t as any).waMessage as string)
      .replace("{f1}", f1)
      .replace("{f2}", f2)
      .replace("{addons}", addonNames || (t as any).none)
      .replace("{drinks}", drinkNames || (t as any).none)
      .replace("{total}", totalPrice.toString());
  };

  const handleOrder = () => {
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const scrollToConfigurator = () => {
    configuratorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const kitReady = Boolean(flavor1 && flavor2);

  return (
    <div
      style={{
        background: COLORS.black,
        minHeight: "100vh",
        fontFamily: "'Nunito', sans-serif",
        color: COLORS.bone,
        overflowX: "hidden",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "10px 32px",
          background: scrolled ? "rgba(11,11,11,0.95)" : "rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: scrolled ? `1px solid ${COLORS.cardBorder}` : "none",
        }}
      >
        {/* Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SkullLogo size={72} />
          <span
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
            }}
          >
            <span style={{ color: COLORS.bone }}>FIESTA</span>
            <span style={{ color: COLORS.orange }}>CO</span>
          </span>
        </div>



        {/* Lang + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              onClick={() => setLang("en")}
              style={{
                background:
                  lang === "en" ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})` : "transparent",
                color: lang === "en" ? "#fff" : "#888",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1,
                padding: "8px 14px",
                transition: "all 0.2s",
              }}
            >
              EN
            </button>

            <button
              onClick={() => setLang("es")}
              style={{
                background:
                  lang === "es" ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})` : "transparent",
                color: lang === "es" ? "#fff" : "#888",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: 1,
                padding: "8px 14px",
                transition: "all 0.2s",
              }}
            >
              ES
            </button>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
              color: "#fff",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: 1,
              padding: "8px 16px",
              borderRadius: 999,
              textDecoration: "none",
              border: "none",
            }}
          >
            {t.waBtn}
          </a>
        </div>
      </header>

      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 20px 60px",
          overflow: "hidden",
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
          }}
        />
        {/* Dark overlay for text readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.72) 60%, rgba(11,11,11,0.95) 100%)",
          }}
        />

        <div style={{ position: "absolute", top: 80, right: 20, opacity: 0.18 }}>
          <SkullLogo size={120} />
        </div>
        <div style={{ position: "absolute", bottom: 100, left: 10, opacity: 0.12 }}>
          <SkullLogo size={90} />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 560, paddingTop: 80 }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 9vw, 84px)",
              lineHeight: 1.05,
              margin: "0 0 16px",
              letterSpacing: 2,
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ color: COLORS.bone }}>{t.headline1}</span>
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.magenta})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.headline2}
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
            {t.sub}
          </p>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>{t.support}</p>

          <button
            onClick={scrollToConfigurator}
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
            {t.heroCTA}
          </button>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "bounce 2s infinite",
          }}
        >
          <div style={{ color: "#444", fontSize: 20 }}>↓</div>
          <h2
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 4vw, 32px)",
              textAlign: "center",
              marginBottom: 40,
              color: COLORS.bone,
            }}
          >
            {t.howTitle}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
            }}
          >
            {[
              { icon: "🛒", step: "01", label: t.step1label, desc: t.step1desc },
              { icon: "⏱️", step: "02", label: t.step2label, desc: t.step2desc },
              { icon: "🏆", step: "03", label: t.step3label, desc: t.step3desc },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.darkCard,
                  border: `1px solid ${COLORS.cardBorder}`,
                  borderRadius: 16,
                  padding: "24px 16px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ color: COLORS.orange, fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
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
        <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }`}</style>
      </section>

      {/* Problem + Product sections side by side like mockup */}

      <section
        ref={configuratorRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          width: "100vw",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 20px 60px",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "100%", maxWidth: 900, textAlign: "left" }}>
          
          {/* Progress Indicator */}
          <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                style={{
                  height: 4,
                  flex: 1,
                  background: currentStep >= step ? COLORS.orange : COLORS.cardBorder,
                  borderRadius: 2,
                  transition: "background 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Optional Back Button */}
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                background: "transparent",
                border: "none",
                color: COLORS.orange,
                fontFamily: "'Oswald', sans-serif",
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 20,
                padding: 0,
              }}
            >
              ← Back
            </button>
          )}

          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            
            {currentStep === 1 && (
              <>
                <div
                  style={{
                    background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.magenta})`,
                    borderRadius: 12,
                    padding: "4px 16px",
                    display: "inline-block",
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: 3,
                      color: "#fff",
                    }}
                  >
                    {t.configTag}
                  </span>
                </div>

                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(32px, 7vw, 56px)",
                    letterSpacing: 2,
                    marginBottom: 6,
                    color: COLORS.bone,
                  }}
                >
                  {t.configTitle}
                </h2>

                <p style={{ color: "#777", marginBottom: 40, fontSize: 15 }}>{t.configSub}</p>

                <Step1Flavor
                  flavor1={flavor1}
                  flavor2={flavor2}
                  onSelect={handleFlavor1Select}
                  t={t}
                  visibleFlavors={visibleFlavors}
                  showMoreFlavors={showMoreFlavors}
                  onShowMore={() => setShowMoreFlavors(true)}
                />
              </>
            )}

            {currentStep === 2 && (
              <Step2Flavor
                containerRef={{ current: null }}
                flavor1={flavor1}
                flavor2={flavor2}
                onSelect={handleFlavor2Select}
                t={t}
                visibleFlavors={visibleFlavors}
              />
            )}

            {currentStep === 3 && (
              <Step3Addons
                containerRef={{ current: null }}
                addons={addons}
                onToggle={toggleAddon}
                onNext={handleNextAddons}
                t={t}
              />
            )}

            {currentStep === 4 && (
              <Step4Drinks
                containerRef={{ current: null }}
                drinks={drinks}
                onToggle={toggleDrink}
                onNext={handleNextDrinks}
                t={t}
              />
            )}

            {currentStep === 5 && (
              <div
                style={{
                  background: `linear-gradient(135deg, #1f1710, #1a1a1a)`,
                  border: `2px solid ${kitReady ? COLORS.orange : COLORS.cardBorder}`,
                  borderRadius: 20,
                  padding: "28px 24px",
                  boxShadow: kitReady ? `0 0 30px ${COLORS.orange}22` : "none",
                  transition: "all 0.3s",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    marginBottom: 20,
                    color: COLORS.bone,
                  }}
                >
                  {t.summaryTitle}
                </h3>

                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${COLORS.cardBorder}`,
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 14 }}>{t.flavor1}</span>
                    <span style={{ color: flavor1 ? COLORS.orange : "#555", fontWeight: 600 }}>{flavor1?.name || "—"}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${COLORS.cardBorder}`,
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 14 }}>{t.flavor2}</span>
                    <span style={{ color: flavor2 ? COLORS.magenta : "#555", fontWeight: 600 }}>{flavor2?.name || "—"}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${COLORS.cardBorder}`,
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 14 }}>{t.addonsLabel}</span>
                    <span style={{ color: "#ccc", fontSize: 13, textAlign: "right", maxWidth: 200 }}>
                      {addons.length > 0
                        ? addons.map((id) => t.addonNames[id] || ADDONS.find((a) => a.id === id)?.name).join(", ")
                        : t.none}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: `1px solid ${COLORS.cardBorder}`,
                    }}
                  >
                    <span style={{ color: "#888", fontSize: 14 }}>{t.drinksLabel}</span>
                    <span style={{ color: "#ccc", fontSize: 13, textAlign: "right", maxWidth: 200 }}>
                      {drinks.length > 0
                        ? drinks.map((id) => DRINKS.find((d) => d.id === id)?.name).join(", ")
                        : t.none}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "14px 0 0",
                    }}
                  >
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, color: COLORS.bone }}>{t.total}</span>
                    <span
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 28,
                        color: COLORS.yellow,
                        letterSpacing: 1,
                      }}
                    >
                      CA${totalPrice}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={!kitReady}
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: kitReady ? `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})` : "#2a2a2a",
                    color: kitReady ? "#fff" : "#555",
                    border: "none",
                    borderRadius: 14,
                    cursor: kitReady ? "pointer" : "not-allowed",
                    fontFamily: "'Oswald', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    letterSpacing: 2,
                    boxShadow: kitReady ? `0 8px 24px ${COLORS.orange}44` : "none",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  📱 {t.orderBtn}
                </button>

                {!kitReady && (
                  <p style={{ textAlign: "center", color: "#555", fontSize: 12, marginTop: 10 }}>{t.selectBoth}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        style={{
          background: `linear-gradient(180deg, ${COLORS.black} 0%, #0f0a08 100%)`,
          padding: "60px 20px",
          borderTop: `1px solid ${COLORS.cardBorder}`,
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ color: COLORS.orange, fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>{t.exp1}</p>
            <p style={{ color: COLORS.magenta, fontSize: 18, fontStyle: "italic", marginBottom: 8 }}>{t.exp2}</p>
            <p
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(20px, 4vw, 28px)",
                color: COLORS.bone,
              }}
            >
              {t.exp3}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              marginBottom: 40,
            }}
          >
            {[t.trust1, t.trust2, t.trust3].map((label, i) => (
              <div
                key={i}
                style={{
                  background: COLORS.darkCard,
                  border: `1px solid ${COLORS.cardBorder}`,
                  borderRadius: 12,
                  padding: "16px 12px",
                  color: "#ccc",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                ✓ {label}
              </div>
            ))}
          </div>

          <button
            onClick={scrollToConfigurator}
            style={{
              background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.orange})`,
              color: "#000",
              border: "none",
              borderRadius: 999,
              padding: "18px 40px",
              fontSize: 16,
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              letterSpacing: 2,
              cursor: "pointer",
              boxShadow: `0 8px 24px ${COLORS.yellow}33`,
            }}
          >
            {t.finalCTA}
          </button>
        </div>
      </section>

      <footer
        style={{
          padding: "24px 32px",
          borderTop: `1px solid ${COLORS.cardBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          background: "#0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SkullLogo size={32} />
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 18, fontWeight: 700 }}>
            <span style={{ color: COLORS.bone }}>FIESTA</span>
            <span style={{ color: COLORS.orange }}>CO</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {["About Us", "Contact", "Privacy Policy"].map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: "#666", fontSize: 13, textDecoration: "none" }}
            >
              {lang === "en" ? link : link === "About Us" ? "Nosotros" : link === "Contact" ? "Contacto" : "Privacidad"}
            </a>
          ))}
        </div>

        <span style={{ color: "#3a3a3a", fontSize: 12 }}>© Copyright {new Date().getFullYear()}</span>
      </footer>

      {kitReady && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(11,11,11,0.96)",
            backdropFilter: "blur(12px)",
            borderTop: `1px solid ${COLORS.orange}40`,
            padding: "12px 20px",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                color: COLORS.turquoise,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {t.kitReady}
            </div>

            <div style={{ color: COLORS.bone, fontSize: 13, marginTop: 2 }}>
              {flavor1?.name} + {flavor2?.name}
              {addons.length > 0 &&
                ` + ${addons.length} ${lang === "en" ? `add-on${addons.length > 1 ? "s" : ""}` : `extra${addons.length > 1 ? "s" : ""}`}`}
            </div>
          </div>

          <button
            onClick={handleOrder}
            style={{
              background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.magenta})`,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "12px 24px",
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: 1,
              cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: `0 4px 16px ${COLORS.orange}44`,
            }}
          >
            {t.stickyOrder}
          </button>
        </div>
      )}
    </div>
  );
}