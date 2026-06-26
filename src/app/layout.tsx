import type { Metadata } from "next";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";

export const metadata: Metadata = {
  title: "SOS Venezuela",
  description: "Coordinación de ayuda humanitaria, reportes y recursos disponibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <SiteNav />
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.14),transparent_35%),#050505] text-white">
          {children}
        </main>
      </body>
    </html>
  );
}
