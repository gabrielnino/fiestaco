import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        url: "/images/flavors/al-pastor.png",
        width: 800,
        height: 600,
        alt: "Fiestaco Al Pastor Kit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiestaco | Match Night Taco Kit",
    description: "Order your perfect custom taco kit for match night.",
    images: ["/images/flavors/al-pastor.png"],
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
  image: "https://fiestaco.today/images/flavors/al-pastor.png",
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
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
