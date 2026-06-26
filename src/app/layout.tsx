import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

export const metadata: Metadata = {
  title: "SOS Venezuela",
  description: "Coordinacion de ayuda humanitaria, reportes y recursos disponibles."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,106,0,0.16),transparent_34%),#070707] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
