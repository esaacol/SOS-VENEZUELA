"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Field, Input } from "@/components/ui/input";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

type LocationPickerProps = {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onChange?: (lat: number | null, lng: number | null) => void;
};

export function LocationPicker({ initialLatitude, initialLongitude, onChange }: LocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [latitude, setLatitude] = useState(initialLatitude ?? 8.6);
  const [longitude, setLongitude] = useState(initialLongitude ?? -66.9);
  const [status, setStatus] = useState("Haz clic en el mapa para elegir la ubicación.");

  const initialCenter = useMemo(() => ({ latitude: latitude ?? 8.6, longitude: longitude ?? -66.9 }), [latitude, longitude]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxgl.accessToken) {
      setStatus("Añade NEXT_PUBLIC_MAPBOX_TOKEN para activar el mapa interactivo.");
      return;
    }

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialCenter.longitude, initialCenter.latitude],
      zoom: 5.5,
      attributionControl: false
    });

    newMap.on("load", () => {
      const markerEl = document.createElement("div");
      markerEl.className = "mapbox-marker";
      markerEl.innerHTML = '<div class="flex h-8 w-8 items-center justify-center rounded-full bg-rescue-500 text-black shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg></div>';
      const newMarker = new mapboxgl.Marker({ element: markerEl, draggable: true })
        .setLngLat([initialCenter.longitude, initialCenter.latitude])
        .addTo(newMap);

      newMarker.on("dragend", () => {
        const { lng, lat } = newMarker.getLngLat();
        setLatitude(lat);
        setLongitude(lng);
        onChange?.(lat, lng);
        setStatus(`Ubicación seleccionada: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });

      newMap.on("click", (event) => {
        const { lng, lat } = event.lngLat;
        newMarker.setLngLat([lng, lat]);
        setLatitude(lat);
        setLongitude(lng);
        onChange?.(lat, lng);
        setStatus(`Ubicación seleccionada: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      });

      marker.current = newMarker;
    });

    map.current = newMap;

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !marker.current) return;
    marker.current.setLngLat([longitude, latitude]);
    map.current.setCenter([longitude, latitude]);
  }, [latitude, longitude]);

  return (
    <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Latitud">
          <Input name="latitude" type="number" step="0.0000001" value={latitude ?? ""} onChange={(event) => {
            const next = event.target.value === "" ? null : Number(event.target.value);
            setLatitude(next ?? 8.6);
            onChange?.(next ?? null, longitude);
          }} />
        </Field>
        <Field label="Longitud">
          <Input name="longitude" type="number" step="0.0000001" value={longitude ?? ""} onChange={(event) => {
            const next = event.target.value === "" ? null : Number(event.target.value);
            setLongitude(next ?? -66.9);
            onChange?.(latitude, next ?? null);
          }} />
        </Field>
      </div>
      <div ref={mapContainer} className="h-64 w-full overflow-hidden rounded-lg border border-white/10" />
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-zinc-300">
        <MapPin className="h-4 w-4 text-rescue-500" />
        <span>{status}</span>
      </div>
    </div>
  );
}
