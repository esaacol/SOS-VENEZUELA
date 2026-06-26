"use client";

import { useState } from "react";
import { Boxes, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

type FormState = {
  name: string;
  type: string;
  state: string;
  municipality: string;
  parish: string;
  sector: string;
  latitude: string;
  longitude: string;
  description: string;
  managerName: string;
  managerPhone: string;
  publicContact: boolean;
  schedule: string;
  acceptsWater: boolean;
  acceptsFood: boolean;
  acceptsMedicine: boolean;
  acceptsClothes: boolean;
  acceptsTools: boolean;
  acceptsFuel: boolean;
  acceptsOther: boolean;
  otherDetails: string;
  capacityNote: string;
};

const initialForm: FormState = {
  name: "",
  type: "COLLECTION_CENTER",
  state: "",
  municipality: "",
  parish: "",
  sector: "",
  latitude: "",
  longitude: "",
  description: "",
  managerName: "",
  managerPhone: "",
  publicContact: false,
  schedule: "",
  acceptsWater: false,
  acceptsFood: false,
  acceptsMedicine: false,
  acceptsClothes: false,
  acceptsTools: false,
  acceptsFuel: false,
  acceptsOther: false,
  otherDetails: "",
  capacityNote: "",
};

const centerTypes = [
  { value: "COLLECTION_CENTER", label: "Centro de acopio" },
  { value: "SHELTER", label: "Refugio" },
  { value: "MEDICAL_POINT", label: "Punto médico" },
  { value: "FOOD_POINT", label: "Punto de comida" },
  { value: "WATER_POINT", label: "Punto de agua" },
  { value: "LOGISTICS_BASE", label: "Base logística" },
  { value: "OTHER", label: "Otro" },
];

export default function CollectionCentersPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitCenter() {
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/collection-centers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMessage(data.message || "No se pudo registrar el centro.");
        return;
      }

      setMessage("Centro registrado correctamente. Quedó pendiente de verificación.");
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      setMessage("Ocurrió un error registrando el centro.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 py-6">
      <section className="grid gap-3">
        <p className="text-sm font-bold uppercase tracking-widest text-rescue-500">
          Centros de acopio
        </p>

        <h1 className="text-4xl font-black leading-tight sm:text-5xl">
          Registra un centro de acopio, refugio o punto de suministros.
        </h1>

        <p className="max-w-2xl text-zinc-300">
          Usa este formulario para indicar dónde se están recibiendo ayudas,
          comida, agua, medicinas, ropa, herramientas o suministros.
        </p>

        <div className="flex flex-wrap gap-3">
          <LinkButton href="/">Ver mapa</LinkButton>
          <LinkButton href="/reportar" variant="secondary">
            Reportar emergencia
          </LinkButton>
        </div>
      </section>

      <Card>
        <div className="mb-5 flex items-center gap-3">
          <Boxes className="h-6 w-6 text-rescue-500" />
          <div>
            <h2 className="text-xl font-black">Datos del centro</h2>
            <p className="text-sm text-zinc-400">
              La información sensible no se muestra públicamente.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm">
            Nombre del centro
            <input
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Ej: Centro de acopio Iglesia San José"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Tipo
            <select
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
            >
              {centerTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Estado
              <input
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                value={form.state}
                onChange={(event) => updateField("state", event.target.value)}
                placeholder="Ej: Mérida"
              />
            </label>

            <label className="grid gap-2 text-sm">
              Municipio
              <input
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                value={form.municipality}
                onChange={(event) =>
                  updateField("municipality", event.target.value)
                }
                placeholder="Ej: Campo Elías"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              Parroquia
              <input
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                value={form.parish}
                onChange={(event) => updateField("parish", event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm">
              Sector
              <input
                className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                value={form.sector}
                onChange={(event) => updateField("sector", event.target.value)}
              />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-rescue-500" />
              <p className="font-bold">Ubicación en el mapa</p>
            </div>

            <p className="mb-3 text-sm text-zinc-400">
              Por ahora coloca latitud y longitud manualmente. Luego podemos
              agregar selector visual en mapa como el de recursos.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Latitud
                <input
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  value={form.latitude}
                  onChange={(event) =>
                    updateField("latitude", event.target.value)
                  }
                  placeholder="Ej: 8.5897"
                />
              </label>

              <label className="grid gap-2 text-sm">
                Longitud
                <input
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  value={form.longitude}
                  onChange={(event) =>
                    updateField("longitude", event.target.value)
                  }
                  placeholder="Ej: -71.1561"
                />
              </label>
            </div>
          </div>

          <label className="grid gap-2 text-sm">
            Horario
            <input
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.schedule}
              onChange={(event) => updateField("schedule", event.target.value)}
              placeholder="Ej: Lunes a sábado de 8:00 am a 5:00 pm"
            />
          </label>

          <label className="grid gap-2 text-sm">
            Descripción
            <textarea
              rows={4}
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Explica qué reciben, qué necesitan o cómo funciona este punto."
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-3 font-bold">¿Qué recibe o entrega?</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <CheckItem
                label="Agua"
                checked={form.acceptsWater}
                onChange={(checked) => updateField("acceptsWater", checked)}
              />

              <CheckItem
                label="Comida"
                checked={form.acceptsFood}
                onChange={(checked) => updateField("acceptsFood", checked)}
              />

              <CheckItem
                label="Medicinas"
                checked={form.acceptsMedicine}
                onChange={(checked) => updateField("acceptsMedicine", checked)}
              />

              <CheckItem
                label="Ropa"
                checked={form.acceptsClothes}
                onChange={(checked) => updateField("acceptsClothes", checked)}
              />

              <CheckItem
                label="Herramientas"
                checked={form.acceptsTools}
                onChange={(checked) => updateField("acceptsTools", checked)}
              />

              <CheckItem
                label="Combustible"
                checked={form.acceptsFuel}
                onChange={(checked) => updateField("acceptsFuel", checked)}
              />

              <CheckItem
                label="Otros suministros"
                checked={form.acceptsOther}
                onChange={(checked) => updateField("acceptsOther", checked)}
              />
            </div>
          </div>

          <label className="grid gap-2 text-sm">
            Otros detalles
            <input
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.otherDetails}
              onChange={(event) =>
                updateField("otherDetails", event.target.value)
              }
              placeholder="Ej: pañales, colchonetas, alimentos no perecederos..."
            />
          </label>

          <label className="grid gap-2 text-sm">
            Capacidad o nota importante
            <input
              className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
              value={form.capacityNote}
              onChange={(event) =>
                updateField("capacityNote", event.target.value)
              }
              placeholder="Ej: espacio limitado, solo recibimos hasta las 4 pm..."
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-3 font-bold">Contacto del responsable</p>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Nombre
                <input
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  value={form.managerName}
                  onChange={(event) =>
                    updateField("managerName", event.target.value)
                  }
                />
              </label>

              <label className="grid gap-2 text-sm">
                Teléfono
                <input
                  className="rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none"
                  value={form.managerPhone}
                  onChange={(event) =>
                    updateField("managerPhone", event.target.value)
                  }
                />
              </label>
            </div>

            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.publicContact}
                onChange={(event) =>
                  updateField("publicContact", event.target.checked)
                }
              />
              Permitir que el teléfono se muestre públicamente
            </label>
          </div>

          <button
            type="button"
            onClick={submitCenter}
            disabled={isSubmitting}
            className="rounded-xl bg-rescue-500 px-5 py-4 font-black text-white transition hover:bg-rescue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Registrando..." : "Registrar centro de acopio"}
          </button>

          {message && (
            <div className="rounded-2xl border border-white/10 bg-black/35 p-4 text-sm text-zinc-200">
              {message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-xl bg-black/30 p-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}
