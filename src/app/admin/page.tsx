import { Lock, ShieldCheck } from "lucide-react";
import { AidRequestStatus, CollectionCenterStatus, ResourceStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { prisma } from "@/lib/db";
import { aidRequestTypeLabels, centerTypeLabels, reportTypeLabels, resourceTypeLabels, severityLabels, statusLabels } from "@/lib/labels";
import { isCompatibleResource } from "@/lib/matching";
import { createMatchAction, updateAidRequestStatusAction, updateCenterStatusAction, updateResourceStatusAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ secret?: string }> }) {
  const { secret = "" } = await searchParams;
  const authorized = process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET;

  if (!authorized) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <Lock className="h-8 w-8 text-rescue-500" />
          <h1 className="mt-3 text-2xl font-black">Panel admin protegido</h1>
          <p className="mt-2 text-sm text-zinc-400">Entra con el secreto administrativo. No uses variables publicas para esta clave.</p>
          <form className="mt-5 grid gap-3" action="/admin">
            <Field label="ADMIN_SECRET"><Input name="secret" type="password" required /></Field>
            <Button type="submit">Entrar</Button>
          </form>
        </Card>
      </div>
    );
  }

  const [reports, centers, offers, requests, matches] = await Promise.all([
    prisma.report.findMany({ orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }], take: 60 }),
    prisma.collectionCenter.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 60 }),
    prisma.resourceOffer.findMany({ orderBy: [{ status: "asc" }, { createdAt: "desc" }], take: 80 }),
    prisma.aidRequest.findMany({ orderBy: [{ status: "asc" }, { urgency: "desc" }, { createdAt: "desc" }], take: 80 }),
    prisma.aidMatch.findMany({ include: { aidRequest: true, resourceOffer: true }, orderBy: { updatedAt: "desc" }, take: 60 })
  ]);

  return (
    <div className="mx-auto grid max-w-7xl gap-6">
      <div>
        <div className="flex items-center gap-2 text-rescue-500"><ShieldCheck className="h-5 w-5" /> <span className="text-sm font-bold uppercase">Admin verificado</span></div>
        <h1 className="mt-2 text-3xl font-black">Panel administrativo</h1>
        <p className="text-sm text-zinc-400">Aqui si se muestran datos privados para coordinacion.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-5">
        <Metric label="Reportes" value={reports.length} />
        <Metric label="Centros" value={centers.length} />
        <Metric label="Recursos" value={offers.length} />
        <Metric label="Solicitudes" value={requests.length} />
        <Metric label="Asignaciones" value={matches.length} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black">Reportes</h2>
          <div className="mt-4 grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{reportTypeLabels[report.type]} · {severityLabels[report.severity]}</p>
                <p className="text-sm text-zinc-400">{report.sector}, {report.municipality}, {report.state}</p>
                <p className="mt-1 text-sm">{report.description}</p>
                <p className="mt-2 text-xs text-zinc-500">Contacto: {report.reporterName ?? "Sin nombre"} · {report.reporterPhone ?? "Sin telefono"}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Centros de acopio</h2>
          <div className="mt-4 grid gap-3">
            {centers.map((center) => (
              <div key={center.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{center.name} · {centerTypeLabels[center.type]}</p>
                <p className="text-sm text-zinc-400">{statusLabels[center.status]} · {center.municipality}</p>
                <p className="mt-1 text-sm">Contacto: {center.managerName ?? "Sin nombre"} · {center.managerPhone ?? "Sin telefono"}</p>
                <StatusForm id={center.id} secret={secret} action={updateCenterStatusAction} values={Object.values(CollectionCenterStatus)} current={center.status} />
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-xl font-black">Recursos disponibles</h2>
          <div className="mt-4 grid gap-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-lg bg-black/35 p-3">
                <p className="font-bold">{resourceTypeLabels[offer.resourceType]} · {statusLabels[offer.status]}</p>
                <p className="text-sm text-zinc-400">{offer.sector}, {offer.municipality}</p>
                <p className="mt-1 text-sm">{offer.description}</p>
                <p className="mt-2 text-xs text-zinc-500">Contacto: {offer.ownerName ?? "Sin nombre"} · {offer.ownerPhone ?? "Sin telefono"}</p>
                <StatusForm id={offer.id} secret={secret} action={updateResourceStatusAction} values={Object.values(ResourceStatus)} current={offer.status} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Solicitudes de ayuda</h2>
          <div className="mt-4 grid gap-3">
            {requests.map((request) => {
              const compatible = offers.filter((offer) => isCompatibleResource(request, offer)).slice(0, 5);
              return (
                <div key={request.id} className="rounded-lg bg-black/35 p-3">
                  <p className="font-bold">{request.communityName} · {aidRequestTypeLabels[request.requestType]} · {severityLabels[request.urgency]}</p>
                  <p className="text-sm text-zinc-400">{statusLabels[request.status]} · {request.sector}, {request.municipality}</p>
                  <p className="mt-1 text-sm">{request.description}</p>
                  <p className="mt-2 text-xs text-zinc-500">Contacto: {request.requesterName ?? "Sin nombre"} · {request.requesterPhone ?? "Sin telefono"}</p>
                  <StatusForm id={request.id} secret={secret} action={updateAidRequestStatusAction} values={Object.values(AidRequestStatus)} current={request.status} />
                  {compatible.length > 0 ? (
                    <form action={createMatchAction} className="mt-3 grid gap-2 rounded-lg border border-white/10 p-3">
                      <input type="hidden" name="adminSecret" value={secret} />
                      <input type="hidden" name="aidRequestId" value={request.id} />
                      <Select name="resourceOfferId">
                        {compatible.map((offer) => <option key={offer.id} value={offer.id}>{resourceTypeLabels[offer.resourceType]} · {offer.municipality}</option>)}
                      </Select>
                      <Input name="notes" placeholder="Nota de coordinacion" />
                      <Button type="submit">Asignar recurso</Button>
                    </form>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <Card>
        <h2 className="text-xl font-black">Asignaciones</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {matches.map((match) => (
            <div key={match.id} className="rounded-lg bg-black/35 p-3">
              <p className="font-bold">{match.aidRequest.communityName} ⇢ {resourceTypeLabels[match.resourceOffer.resourceType]}</p>
              <p className="text-sm text-zinc-400">{statusLabels[match.status]} · {match.notes ?? "Sin notas"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <Card><p className="text-sm text-zinc-400">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></Card>;
}

function StatusForm({ id, secret, action, values, current }: { id: string; secret: string; action: (formData: FormData) => Promise<void>; values: string[]; current: string }) {
  return (
    <form action={action} className="mt-3 flex gap-2">
      <input type="hidden" name="adminSecret" value={secret} />
      <input type="hidden" name="id" value={id} />
      <Select name="status" defaultValue={current}>{values.map((value) => <option key={value} value={value}>{statusLabels[value] ?? value}</option>)}</Select>
      <Button type="submit" variant="secondary">Cambiar</Button>
    </form>
  );
}
