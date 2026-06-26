import { AlertTriangle, Boxes, HandHeart, MapPin, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import MapboxOperationalMapWrapper, {
  type MapboxMapPoint,
} from "@/components/map/mapbox-operational-map-wrapper";
import { prisma } from "@/lib/db";
import {
  centerTypeLabels,
  reportTypeLabels,
  resourceTypeLabels,
  severityLabels,
  statusLabels,
} from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [reports, centers, offers, requests] = await Promise.all([
    prisma.report.findMany({
      where: {
        verificationStatus: {
          in: ["PENDING", "VERIFIED"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 40,
    }),

    prisma.collectionCenter.findMany({
      where: {
        status: {
          in: ["VERIFIED", "ACTIVE", "FULL"],
        },
      },
      take: 30,
    }),

    prisma.resourceOffer.findMany({
      where: {
        status: {
          in: ["VERIFIED", "AVAILABLE"],
        },
      },
      take: 30,
    }),

    prisma.aidRequest.findMany({
      where: {
        status: {
          in: ["PENDING", "VERIFIED", "IN_PROGRESS", "PARTIALLY_RESOLVED"],
        },
      },
      take: 40,
    }),
  ]);

  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    {
      label: "Reportes activos",
      value: reports.length,
      Icon: AlertTriangle,
    },
    {
      label: "Centros activos",
      value: centers.length,
      Icon: Boxes,
    },
    {
      label: "Recursos disponibles",
      value: offers.length,
      Icon: Truck,
    },
    {
      label: "Solicitudes abiertas",
      value: requests.length,
      Icon: HandHeart,
    },
  ];

  const mapPoints: MapboxMapPoint[] = [
    ...reports.map((report) => ({
      id: report.id,
      kind: "emergency" as const,
      title: reportTypeLabels[report.type] ?? "Emergencia",
      subtitle: severityLabels[report.severity] ?? "Sin gravedad",
      state: report.state,
      municipality: report.municipality,
      latitude: Number(report.latitude),
      longitude: Number(report.longitude),
      severity: report.severity,
    })),

    ...requests.map((request) => ({
      id: request.id,
      kind: "request" as const,
      title: request.communityName ?? "Solicitud de ayuda",
      subtitle: `${aidLabel(request.requestType)} - ${
        severityLabels[request.urgency] ?? "Sin urgencia"
      }`,
      state: request.state,
      municipality: request.municipality,
      latitude: Number(request.latitude),
      longitude: Number(request.longitude),
      severity: request.urgency,
    })),

    ...centers.map((center) => ({
      id: center.id,
      kind: "center" as const,
      title: center.name,
      subtitle: centerTypeLabels[center.type] ?? "Centro de acopio",
      state: center.state,
      municipality: center.municipality,
      latitude: Number(center.latitude),
      longitude: Number(center.longitude),
    })),

    ...offers.map((offer) => ({
      id: offer.id,
      kind: "resource" as const,
      title: resourceTypeLabels[offer.resourceType] ?? "Recurso disponible",
      subtitle: offer.organizationName ?? "Recurso disponible",
      state: offer.state,
      municipality: offer.municipality,
      latitude: Number(offer.latitude),
      longitude: Number(offer.longitude),
    })),
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <section className="grid gap-4 py-6">
        <p className="text-sm font-bold uppercase tracking-widest text-rescue-500">
          Respuesta coordinada
        </p>

        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
          Mapa vivo de emergencias, ayuda y recursos disponibles.
        </h1>

        <p className="max-w-2xl text-zinc-300">
          Reporta necesidades, registra centros de acopio y conecta recursos
          reales con comunidades que necesitan atención.
        </p>

        <div className="flex flex-wrap gap-3">
          <LinkButton href="/reportar">Reportar emergencia</LinkButton>

          <LinkButton href="/recursos" variant="secondary">
            Tengo recursos para ayudar
          </LinkButton>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">{label}</p>
              <Icon className="h-5 w-5 text-rescue-500" />
            </div>

            <p className="mt-4 text-3xl font-black">{value}</p>
          </Card>
        ))}
      </section>

      <section>
        <Card className="min-h-[420px]">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rescue-500" />

            <div>
              <h2 className="text-xl font-black">
                Mapa operativo de Venezuela
              </h2>

              <p className="text-sm text-zinc-400">
                Zonas afectadas, solicitudes de ayuda, centros y recursos
                disponibles.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <MapboxOperationalMapWrapper points={mapPoints} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-black">Emergencias recientes</h2>

          <div className="mt-3 grid gap-3">
            {reports.slice(0, 8).map((report) => (
              <div key={report.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">
                </p>

                <p className="text-sm text-zinc-400">
                  {report.municipality}, {report.state} -{" "}
                  {severityLabels[report.severity] ?? "Sin gravedad"}

                </p>
              </div>
            ))}
          </div>
        </Card>


        <Card>
          <h2 className="font-black">Centros activos</h2>

          <div className="mt-3 grid gap-3">
            {centers.slice(0, 8).map((center) => (
              <div key={center.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{center.name}</p>

                <p className="text-sm text-zinc-400">
                  {centerTypeLabels[center.type] ?? "Centro"} -{" "}
                  {statusLabels[center.status] ?? center.status}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-black">Recursos disponibles</h2>

          <div className="mt-3 grid gap-3">
            {offers.slice(0, 8).map((offer) => (
              <div key={offer.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">
                  {resourceTypeLabels[offer.resourceType] ??
                    "Recurso disponible"}
                </p>

                <p className="text-sm text-zinc-400">
                  {offer.municipality}, {offer.state}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

function aidLabel(type: string) {
  const labels: Record<string, string> = {
    WATER: "Agua",
    FOOD: "Comida",
    MEDICINE: "Medicinas",
    TRANSPORT: "Transporte",
    MACHINERY: "Maquinaria",
    SHELTER: "Refugio",
    RESCUE: "Rescate",
    FUEL: "Combustible",
    OTHER: "Otro",
  };

  return labels[type] ?? type;
}
