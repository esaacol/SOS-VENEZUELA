import Link from "next/link";
import { AlertTriangle, Download, HandHeart } from "lucide-react";

const links = [
  ["Inicio / Mapa", "/"],
  ["Reportar emergencia", "/reportar"],
  ["Centros de acopio", "/centros"],
  ["Tengo recursos", "/recursos"],
  ["Necesito ayuda", "/necesito-ayuda"],
  ["Panel admin", "/admin"]
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rescue-500 text-black">
            <HandHeart className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black leading-none sm:text-lg">SOS Venezuela</p>
            <p className="truncate text-xs text-zinc-400">Coordinacion humanitaria verificada</p>
          </div>
          <a
            href="/downloads/sos-venezuela.apk"
            download
            className="ml-auto inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rescue-500/35 bg-rescue-500/10 text-rescue-500 sm:hidden"
            aria-label="Descargar APK"
          >
            <Download className="h-5 w-5" />
          </a>
          <AlertTriangle className="hidden h-5 w-5 shrink-0 text-rescue-500 sm:block" />
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:border-rescue-500/60 hover:text-white sm:text-sm"
            >
              {label}
            </Link>
          ))}
          <a
            href="/downloads/sos-venezuela.apk"
            download
            className="hidden shrink-0 items-center gap-2 rounded-full border border-rescue-500/40 bg-rescue-500/10 px-3 py-2 text-sm font-bold text-rescue-500 hover:bg-rescue-500 hover:text-black sm:inline-flex"
          >
            <Download className="h-4 w-4" />
            Descargar APK
          </a>
        </nav>
      </div>
    </header>
  );
}
