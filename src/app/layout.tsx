import type { Metadata, Viewport } from "next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

export const metadata: Metadata = {
  title: "SOS Venezuela",
  description: "Coordinacion de ayuda humanitaria, reportes y recursos disponibles."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <SiteNav />
        <main className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_35%),#050505] px-3 py-4 text-white sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
