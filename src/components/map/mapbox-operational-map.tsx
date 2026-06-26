"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { Map, Marker } from "mapbox-gl";
import type { MapboxMapPoint } from "./mapbox-operational-map-wrapper";

type Props = {
  points: MapboxMapPoint[];
};

const VENEZUELA_CENTER: [number, number] = [-66.1109, 8.0019];

function markerColor(kind: MapboxMapPoint["kind"]) {
  if (kind === "emergency") return "#ef4444";
  if (kind === "request") return "#f97316";
  if (kind === "center") return "#38bdf8";
  if (kind === "resource") return "#22c55e";
  return "#f97316";
}

function kindLabel(kind: MapboxMapPoint["kind"]) {
  if (kind === "emergency") return "Emergencia";
  if (kind === "request") return "Solicitud de ayuda";
  if (kind === "center") return "Centro de acopio";
  if (kind === "resource") return "Recurso disponible";
  return "Punto registrado";
}

function createMarkerElement(kind: MapboxMapPoint["kind"]) {
  const element = document.createElement("div");

  element.style.width = "22px";
  element.style.height = "22px";
  element.style.borderRadius = "999px";
  element.style.background = markerColor(kind);
  element.style.border = "3px solid white";
  element.style.boxShadow = "0 8px 22px rgba(0,0,0,.45)";
  element.style.cursor = "pointer";

  return element;
}

function createPopup(point: MapboxMapPoint) {
  const wrapper = document.createElement("div");
  wrapper.className = "sos-map-popup";

  const type = document.createElement("p");
  type.textContent = kindLabel(point.kind);
  type.className = "sos-map-popup-type";

  const title = document.createElement("strong");
  title.textContent = point.title || "Punto registrado";

  const subtitle = document.createElement("p");
  subtitle.textContent = point.subtitle || "Sin detalle";

  const location = document.createElement("p");
  location.textContent = [point.municipality, point.state]
    .filter(Boolean)
    .join(", ");

  wrapper.appendChild(type);
  wrapper.appendChild(title);
  wrapper.appendChild(subtitle);

  if (location.textContent) {
    wrapper.appendChild(location);
  }

  return wrapper;
}

export default function MapboxOperationalMap({ points }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token) {
      console.error("Falta NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN en .env");
      return;
    }

    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: VENEZUELA_CENTER,
      zoom: 5.4,
      attributionControl: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      map.resize();
    });

    setTimeout(() => {
      map.resize();
    }, 300);

    mapRef.current = map;

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const validPoints = points.filter((point) => {
      return (
        Number.isFinite(point.latitude) &&
        Number.isFinite(point.longitude) &&
        point.latitude >= -90 &&
        point.latitude <= 90 &&
        point.longitude >= -180 &&
        point.longitude <= 180
      );
    });

    validPoints.forEach((point) => {
      const marker = new mapboxgl.Marker({
        element: createMarkerElement(point.kind),
      })
        .setLngLat([point.longitude, point.latitude])
        .setPopup(
          new mapboxgl.Popup({
            offset: 18,
            closeButton: true,
            closeOnClick: true,
          }).setDOMContent(createPopup(point))
        )
        .addTo(mapRef.current as Map);

      markersRef.current.push(marker);
    });
  }, [points]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        <span className="rounded-full bg-red-500 px-3 py-1 text-white">
          Emergencias
        </span>

        <span className="rounded-full bg-orange-500 px-3 py-1 text-white">
          Solicitudes
        </span>

        <span className="rounded-full bg-sky-400 px-3 py-1 text-black">
          Centros
        </span>

        <span className="rounded-full bg-green-500 px-3 py-1 text-white">
          Recursos
        </span>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 md:h-[520px]">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>

      {points.length === 0 && (
        <p className="text-sm text-zinc-400">
          Todavía no hay puntos registrados para mostrar en el mapa.
        </p>
      )}

      <style jsx global>{`
        .mapboxgl-popup-content {
          border-radius: 16px;
          background: #111827;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
          padding: 14px;
        }

        .mapboxgl-popup-close-button {
          color: #ffffff;
          font-size: 18px;
          padding: 4px 8px;
        }

        .mapboxgl-popup-tip {
          border-top-color: #111827 !important;
          border-bottom-color: #111827 !important;
        }

        .sos-map-popup {
          display: grid;
          gap: 6px;
          max-width: 240px;
          font-size: 13px;
          line-height: 1.35;
        }

        .sos-map-popup-type {
          margin: 0;
          color: #fb923c;
          font-weight: 700;
          font-size: 12px;
          text-transform: uppercase;
        }

        .sos-map-popup strong {
          color: #ffffff;
          font-size: 14px;
        }

        .sos-map-popup p {
          margin: 0;
          color: #e5e7eb;
        }
      `}</style>
    </div>
  );
}
