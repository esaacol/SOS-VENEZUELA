import { AlertTriangle, Boxes, Download, HandHeart, MapPin, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import MapboxOperationalMapWrapper, { type MapboxMapPoint } from "@/components/map/mapbox-operational-map-wrapper";
import { prisma } from "@/lib/db";
import { centerTypeLabels, reportTypeLabels, resourceTypeLabels, severityLabels, statusLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [reports, centers, offers, requests] = await Promise.all([
    prisma.report.findMany({
      where: { verificationStatus: { in: ["PENDING", "VERIFIED"] } },
      orderBy: { createdAt: "desc" },
      take: 40
    }),
    prisma.collectionCenter.findMany({
      where: { status: { in: ["VERIFIED", "ACTIVE", "FULL"] } },
      take: 30
    }),
    prisma.resourceOffer.findMany({
      where: { status: { in: ["VERIFIED", "AVAILABLE"] } },
      take: 30
    }),
    prisma.aidRequest.findMany({
      where: { status: { in: ["PENDING", "VERIFIED", "IN_PROGRESS", "PARTIALLY_RESOLVED"] } },
      take: 40
    })
  ]);

  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "Reportes activos", value: reports.length, Icon: AlertTriangle },
    { label: "Centros activos", value: centers.length, Icon: Boxes },
    { label: "Recursos disponibles", value: offers.length, Icon: Truck },
    { label: "Solicitudes abiertas", value: requests.length, Icon: HandHeart }
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
      severity: report.severity
    })),
    ...requests.map((request) => ({
      id: request.id,
      kind: "request" as const,
      title: request.communityName ?? "Solicitud de ayuda",
      subtitle: `${aidLabel(request.requestType)} - ${severityLabels[request.urgency] ?? "Sin urgencia"}`,
      state: request.state,
      municipality: request.municipality,
      latitude: Number(request.latitude),
      longitude: Number(request.longitude),
      severity: request.urgency
    })),
    ...centers.map((center) => ({
      id: center.id,
      kind: "center" as const,
      title: center.name,
      subtitle: centerTypeLabels[center.type] ?? "Centro de acopio",
      state: center.state,
      municipality: center.municipality,
      latitude: Number(center.latitude),
      longitude: Number(center.longitude)
    })),
    ...offers.map((offer) => ({
      id: offer.id,
      kind: "resource" as const,
      title: resourceTypeLabels[offer.resourceType] ?? "Recurso disponible",
      subtitle: offer.organizationName ?? "Recurso disponible",
      state: offer.state,
      municipality: offer.municipality,
      latitude: Number(offer.latitude),
      longitude: Number(offer.longitude)
    }))
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-5">
      <section className="grid gap-4 py-4 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-widest text-rescue-500 sm:text-sm">Respuesta coordinada</p>
        <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-6xl">
          Mapa vivo de emergencias, ayuda y recursos disponibles.
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          Reporta necesidades, registra centros de acopio y conecta recursos reales con comunidades que necesitan atencion.
        </p>
        <div className="grid gap-3 sm:flex sm:flex-wrap">
          <LinkButton href="/reportar">Reportar emergencia</LinkButton>
          <LinkButton href="/recursos" variant="secondary">Tengo recursos para ayudar</LinkButton>
          <a
            href="/downloads/sos-venezuela.apk"
            download
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-rescue-500/45 bg-rescue-500/10 px-4 py-2 text-sm font-black text-rescue-500 transition hover:bg-rescue-500 hover:text-black"
          >
            <Download className="h-4 w-4" />
            Descargar app Android
          </a>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-zinc-400 sm:text-sm">{label}</p>
              <Icon className="h-4 w-4 shrink-0 text-rescue-500 sm:h-5 sm:w-5" />
            </div>
            <p className="mt-3 text-2xl font-black sm:mt-4 sm:text-3xl">{value}</p>
          </Card>
        ))}
      </section>

      <section>
        <Card className="min-h-[420px] p-3 sm:p-5">
          <div className="flex items-start gap-2">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-rescue-500" />
            <div>
              <h2 className="text-lg font-black sm:text-xl">Mapa operativo de Venezuela</h2>
              <p className="text-sm text-zinc-400">Zonas afectadas, solicitudes de ayuda, centros y recursos disponibles.</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <MapboxOperationalMapWrapper points={mapPoints} />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 sm:p-5">
          <h2 className="font-black">Emergencias recientes</h2>
          <div className="mt-3 grid gap-3">
            {reports.slice(0, 8).map((report) => (
              <div key={report.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{reportTypeLabels[report.type] ?? "Emergencia"}</p>
                <p className="text-sm text-zinc-400">
                  {report.municipality}, {report.state} - {severityLabels[report.severity] ?? "Sin gravedad"}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="font-black">Centros activos</h2>
          <div className="mt-3 grid gap-3">
            {centers.slice(0, 8).map((center) => (
              <div key={center.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{center.name}</p>
                <p className="text-sm text-zinc-400">
                  {centerTypeLabels[center.type] ?? "Centro"} - {statusLabels[center.status] ?? center.status}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <h2 className="font-black">Recursos disponibles</h2>
          <div className="mt-3 grid gap-3">
            {offers.slice(0, 8).map((offer) => (
              <div key={offer.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{resourceTypeLabels[offer.resourceType] ?? "Recurso disponible"}</p>
                <p className="text-sm text-zinc-400">{offer.municipality}, {offer.state}</p>
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
    OTHER: "Otro"
  };

  return labels[type] ?? type;
}
