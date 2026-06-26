import { AlertTriangle, Boxes, HandHeart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export type VenezuelaMapPoint = {
  id: string;
  kind: "emergency" | "center" | "resource" | "request";
  title: string;
  subtitle: string;
  state: string;
  municipality?: string;
  latitude?: number | null;
  longitude?: number | null;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

const bounds = {
  minLat: 0.6,
  maxLat: 12.4,
  minLng: -73.4,
  maxLng: -59.7
};

const stateCoordinates: Record<string, { latitude: number; longitude: number }> = {
  amazonas: { latitude: 3.5, longitude: -65.8 },
  anzoategui: { latitude: 9.1, longitude: -64.0 },
  apure: { latitude: 7.0, longitude: -68.8 },
  aragua: { latitude: 10.2, longitude: -67.5 },
  barinas: { latitude: 8.6, longitude: -70.2 },
  bolivar: { latitude: 6.2, longitude: -63.5 },
  carabobo: { latitude: 10.2, longitude: -68.0 },
  cojedes: { latitude: 9.6, longitude: -68.9 },
  "delta amacuro": { latitude: 9.2, longitude: -61.5 },
  falcon: { latitude: 11.0, longitude: -69.7 },
  guarico: { latitude: 8.8, longitude: -66.2 },
  lara: { latitude: 10.1, longitude: -69.9 },
  merida: { latitude: 8.6, longitude: -71.2 },
  miranda: { latitude: 10.3, longitude: -66.3 },
  monagas: { latitude: 9.5, longitude: -63.2 },
  "nueva esparta": { latitude: 11.0, longitude: -63.9 },
  portuguesa: { latitude: 9.1, longitude: -69.2 },
  sucre: { latitude: 10.5, longitude: -63.1 },
  tachira: { latitude: 7.9, longitude: -72.0 },
  trujillo: { latitude: 9.4, longitude: -70.5 },
  "la guaira": { latitude: 10.6, longitude: -66.9 },
  vargas: { latitude: 10.6, longitude: -66.9 },
  yaracuy: { latitude: 10.2, longitude: -68.8 },
  zulia: { latitude: 10.0, longitude: -72.4 },
  caracas: { latitude: 10.5, longitude: -66.9 },
  "distrito capital": { latitude: 10.5, longitude: -66.9 }
};

const kindStyles = {
  emergency: {
    label: "Emergencias",
    className: "bg-red-500 text-white ring-red-500/30",
    Icon: AlertTriangle
  },
  request: {
    label: "Necesitan ayuda",
    className: "bg-rescue-500 text-black ring-rescue-500/30",
    Icon: HandHeart
  },
  center: {
    label: "Centros",
    className: "bg-sky-400 text-black ring-sky-400/30",
    Icon: Boxes
  },
  resource: {
    label: "Recursos",
    className: "bg-emerald-400 text-black ring-emerald-400/30",
    Icon: Truck
  }
};

function normalizeState(state: string) {
  return state
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function pointPosition(point: VenezuelaMapPoint) {
  const fallback = stateCoordinates[normalizeState(point.state)];
  const latitude = point.latitude ?? fallback?.latitude;
  const longitude = point.longitude ?? fallback?.longitude;
  if (latitude === undefined || longitude === undefined) return null;

  const x = ((longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
  const y = ((bounds.maxLat - latitude) / (bounds.maxLat - bounds.minLat)) * 100;
  return {
    x: Math.min(94, Math.max(6, x)),
    y: Math.min(92, Math.max(8, y))
  };
}

function severityRing(severity?: VenezuelaMapPoint["severity"]) {
  if (severity === "CRITICAL") return "scale-125";
  if (severity === "HIGH") return "scale-110";
  return "";
}

export function VenezuelaImpactMap({ points }: { points: VenezuelaMapPoint[] }) {
  const visiblePoints = points
    .map((point) => ({ point, position: pointPosition(point) }))
    .filter((item): item is { point: VenezuelaMapPoint; position: { x: number; y: number } } => Boolean(item.position));

  const counts = Object.entries(kindStyles).map(([kind, meta]) => ({
    kind,
    label: meta.label,
    total: points.filter((point) => point.kind === kind).length,
    className: meta.className,
    Icon: meta.Icon
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_17rem]">
      <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(circle_at_50%_35%,rgba(255,106,0,0.18),transparent_34%),#080808]">
        <svg viewBox="0 0 1000 650" className="absolute inset-0 h-full w-full opacity-95" role="img" aria-label="Mapa de Venezuela con zonas afectadas">
          <defs>
            <linearGradient id="venezuela-shape" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#232323" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
          <path
            d="M76 270 L126 234 L196 226 L254 170 L324 154 L383 183 L434 149 L510 155 L584 120 L664 139 L719 111 L805 137 L888 198 L938 264 L900 318 L816 337 L764 390 L682 390 L610 449 L514 470 L430 516 L350 489 L282 520 L214 470 L146 442 L105 376 Z"
            fill="url(#venezuela-shape)"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="3"
          />
          <path
            d="M118 279 L214 289 L292 246 L373 268 L458 236 L548 250 L635 213 L728 229 L842 282"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
          />
          <path
            d="M272 182 L315 284 L303 399 L354 488 M507 159 L520 304 L602 449 M712 139 L703 277 L768 389"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
          />
        </svg>

        {visiblePoints.map(({ point, position }) => {
          const style = kindStyles[point.kind];
          const Icon = style.Icon;
          return (
            <div
              key={`${point.kind}-${point.id}`}
              className="group absolute"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <div className={cn("relative -translate-x-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg ring-8", style.className, severityRing(point.severity))}>
                <Icon className="h-4 w-4" />
                <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-20" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-7 z-20 hidden w-64 -translate-x-1/2 rounded-lg border border-white/10 bg-black/90 p-3 text-left shadow-soft group-hover:block">
                <p className="text-sm font-black text-white">{point.title}</p>
                <p className="mt-1 text-xs text-zinc-400">{point.subtitle}</p>
                <p className="mt-2 text-xs text-zinc-500">{point.municipality ? `${point.municipality}, ` : ""}{point.state}</p>
              </div>
            </div>
          );
        })}

        <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/70 px-3 py-2 backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-widest text-rescue-500">Venezuela</p>
          <p className="text-sm text-zinc-300">Zonas afectadas y apoyo activo</p>
        </div>
      </div>

      <div className="grid content-start gap-3">
        {counts.map(({ kind, label, total, className, Icon }) => (
          <div key={kind} className="rounded-lg border border-white/10 bg-black/35 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full p-1.5 ring-4", className)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm font-bold">{label}</p>
              </div>
              <p className="text-xl font-black">{total}</p>
            </div>
          </div>
        ))}
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-zinc-400">
          Los puntos usan GPS cuando existe. Si no hay coordenadas, se ubican por estado para mantener visibilidad operativa.
        </div>
      </div>
    </div>
  );
}
