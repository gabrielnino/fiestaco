import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnalyticsProvider from "@/components/AnalyticsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fiestaco.today"),
  title: {
    default: "Fiestaco | Build Your Match Night Taco Kit",
    template: "%s | Fiestaco",
  },
  description: "Customize your Fiestaco kit with authentic Mexican flavors, fresh add-ons, and ice-cold drinks. Order your perfect taco kit for match night directly via WhatsApp.",
  keywords: ["Tacos", "Mexican Food", "Taco Kit", "Match Night Food", "Delivery", "Fiestaco"],
  authors: [{ name: "Fiestaco" }],
  creator: "Fiestaco",
  openGraph: {
    title: "Fiestaco | Build Your Match Night Taco Kit",
    description: "Customize your Fiestaco kit with authentic Mexican flavors, fresh add-ons, and ice-cold drinks. Order directly via WhatsApp.",
    url: "https://fiestaco.today",
    siteName: "Fiestaco",
    images: [
      {
        url: "/images/flavors/al_pastor.webp",
        width: 800,
        height: 600,
        alt: "Fiestaco Al Pastor Tacos - Traditional Mexican marinated pork with pineapple and spices",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiestaco | Match Night Taco Kit",
    description: "Order your perfect custom taco kit for match night.",
    images: ["/images/flavors/al_pastor.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Fiestaco",
  image: "https://fiestaco.today/images/flavors/al_pastor.webp",
  description: "Authentic Mexican match night taco kits.",
  servesCuisine: "Mexican",
  priceRange: "$$",
  hasMenu: "https://fiestaco.today",
  url: "https://fiestaco.today",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1234567890",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href={geistSans.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={geistMono.style.fontFamily}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://wa.me" />
        
        {/* Performance hints */}
        <meta name="theme-color" content="#0B0B0B" />
        <meta name="color-scheme" content="dark" />
        
        {/* Mobile & Desktop fixes CSS */}
        <link rel="stylesheet" href="/mobile-desktop-fixes.css" />
        {/* Steps position fix - back to original hero position */}
        <link rel="stylesheet" href="/steps-position-fix.css" />
        
        {/* Plausible Analytics - Privacy-focused, GDPR-compliant, no cookies needed */}
        <Script
          defer
          data-domain="fiestaco.today"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        {children}
        <AnalyticsProvider />
        
        {/* Analytics event tracking for custom interactions */}
        <Script
          id="plausible-custom-events"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Track custom events when DOM is ready
              if (typeof window !== 'undefined' && window.plausible) {
                // Track WhatsApp clicks
                document.addEventListener('click', function(e) {
                  const whatsappLink = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
                  if (whatsappLink) {
                    window.plausible('WhatsApp Click', {
                      props: {
                        url: whatsappLink.href,
                        text: whatsappLink.textContent?.trim().substring(0, 50) || 'Unknown'
                      }
                    });
                  }

                  // Track taco flavor selections
                  const flavorButton = e.target.closest('button[data-flavor], [data-flavor]');
                  if (flavorButton) {
                    const flavor = flavorButton.getAttribute('data-flavor');
                    if (flavor) {
                      window.plausible('Flavor Select', {
                        props: { flavor: flavor }
                      });
                    }
                  }

                  // Track add-on selections
                  const addonButton = e.target.closest('button[data-addon], [data-addon]');
                  if (addonButton) {
                    const addon = addonButton.getAttribute('data-addon');
                    if (addon) {
                      window.plausible('Add-on Select', {
                        props: { addon: addon }
                      });
                    }
                  }
                });

                // Track form submissions
                document.addEventListener('submit', function(e) {
                  if (e.target.tagName === 'FORM') {
                    window.plausible('Form Submit', {
                      props: {
                        formId: e.target.id || 'unknown',
                        formAction: e.target.action || 'unknown'
                      }
                    });
                  }
                });

                // Track scroll depth
                let scrollTracked25 = false;
                let scrollTracked50 = false;
                let scrollTracked75 = false;
                let scrollTracked100 = false;

                window.addEventListener('scroll', function() {
                  const scrollTop = window.scrollY;
                  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                  const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

                  if (scrollPercent >= 25 && !scrollTracked25) {
                    window.plausible('Scroll Depth', { props: { depth: '25%' } });
                    scrollTracked25 = true;
                  }
                  if (scrollPercent >= 50 && !scrollTracked50) {
                    window.plausible('Scroll Depth', { props: { depth: '50%' } });
                    scrollTracked50 = true;
                  }
                  if (scrollPercent >= 75 && !scrollTracked75) {
                    window.plausible('Scroll Depth', { props: { depth: '75%' } });
                    scrollTracked75 = true;
                  }
                  if (scrollPercent >= 95 && !scrollTracked100) {
                    window.plausible('Scroll Depth', { props: { depth: '100%' } });
                    scrollTracked100 = true;
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
