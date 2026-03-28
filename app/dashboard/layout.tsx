import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard Analytics - Fiestaco",
  description: "Panel de control interno para métricas de Fiestaco",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={inter.className}
      style={{ margin: 0, padding: 0, minHeight: "100vh" }}
    >
      <style>{`
        /* Scrollbar personalizado */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }

        /* Selección de texto */
        ::selection {
          background: rgba(255, 107, 53, 0.3);
          color: #fff;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      {children}
    </div>
  );
}