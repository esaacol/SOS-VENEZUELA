import { AlertTriangle, Boxes, HandHeart, MapPin, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { centerTypeLabels, reportTypeLabels, resourceTypeLabels, severityLabels, statusLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [reports, centers, offers, requests] = await Promise.all([
    prisma.report.findMany({ where: { verificationStatus: { in: ["PENDING", "VERIFIED"] } }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.collectionCenter.findMany({ where: { status: { in: ["VERIFIED", "ACTIVE"] } }, take: 8 }),
    prisma.resourceOffer.findMany({ where: { status: { in: ["VERIFIED", "AVAILABLE"] } }, take: 8 }),
    prisma.aidRequest.findMany({ where: { status: { in: ["PENDING", "VERIFIED", "IN_PROGRESS"] } }, take: 8 })
  ]);

  const stats: { label: string; value: number; Icon: LucideIcon }[] = [
    { label: "Reportes activos", value: reports.length, Icon: AlertTriangle },
    { label: "Centros activos", value: centers.length, Icon: Boxes },
    { label: "Recursos disponibles", value: offers.length, Icon: Truck },
    { label: "Solicitudes abiertas", value: requests.length, Icon: HandHeart }
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <section className="grid gap-4 py-6">
        <p className="text-sm font-bold uppercase tracking-widest text-rescue-500">Respuesta coordinada</p>
        <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Mapa vivo de emergencias, ayuda y recursos disponibles.</h1>
        <p className="max-w-2xl text-zinc-300">Reporta necesidades, registra centros de acopio y conecta recursos reales con comunidades que necesitan atencion.</p>
        <div className="flex flex-wrap gap-3">
          <LinkButton href="/reportar">Reportar emergencia</LinkButton>
          <LinkButton href="/recursos" variant="secondary">Tengo recursos para ayudar</LinkButton>
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

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="min-h-[420px]">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rescue-500" />
            <h2 className="text-xl font-black">Mapa operativo</h2>
          </div>
          <div className="mt-4 grid min-h-[330px] place-items-center rounded-lg border border-dashed border-white/15 bg-black/35 p-6 text-center">
            <div>
              <p className="text-2xl font-black">Capa visual lista para conectar Leaflet/Mapbox</p>
              <p className="mt-2 max-w-xl text-sm text-zinc-400">Mientras evitamos errores SSR, mostramos el tablero por capas. El siguiente paso es activar mapa con marcadores cuando tengamos dominio y ubicaciones reales.</p>
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Capas disponibles</h2>
          <div className="mt-4 grid gap-2 text-sm text-zinc-300">
            {["Emergencias", "Centros de acopio", "Transporte disponible", "Maquinaria disponible", "Refugios", "Puntos confirmados"].map((layer) => (
              <div key={layer} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">{layer}</div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-black">Emergencias recientes</h2>
          <div className="mt-3 grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{reportTypeLabels[report.type]}</p>
                <p className="text-sm text-zinc-400">{report.municipality}, {report.state} · {severityLabels[report.severity]}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-black">Centros activos</h2>
          <div className="mt-3 grid gap-3">
            {centers.map((center) => (
              <div key={center.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{center.name}</p>
                <p className="text-sm text-zinc-400">{centerTypeLabels[center.type]} · {statusLabels[center.status]}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-black">Recursos disponibles</h2>
          <div className="mt-3 grid gap-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{resourceTypeLabels[offer.resourceType]}</p>
                <p className="text-sm text-zinc-400">{offer.municipality}, {offer.state}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
