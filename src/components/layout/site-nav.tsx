import Link from "next/link";
import { AlertTriangle, HandHeart } from "lucide-react";

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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rescue-500 text-black">
            <HandHeart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-black leading-none">SOS Venezuela</p>
            <p className="text-xs text-zinc-400">Coordinacion humanitaria verificada</p>
          </div>
          <AlertTriangle className="ml-auto h-5 w-5 text-rescue-500" />
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="shrink-0 rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-200 hover:border-rescue-500/60 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
