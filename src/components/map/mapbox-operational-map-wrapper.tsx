"use client";

import dynamic from "next/dynamic";

export type MapboxMapPoint = {
  id: string;
  kind: "emergency" | "request" | "center" | "resource";
  title: string;
  subtitle?: string;
  state?: string | null;
  municipality?: string | null;
  latitude: number;
  longitude: number;
  severity?: string;
};

const MapboxOperationalMap = dynamic(
  () => import("./mapbox-operational-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-neutral-950 text-sm text-neutral-300 md:h-[520px]">
        Cargando mapa operativo...
      </div>
    ),
  }
);

export default function MapboxOperationalMapWrapper({
  points,
}: {
  points: MapboxMapPoint[];
}) {
  return <MapboxOperationalMap points={points} />;
}
