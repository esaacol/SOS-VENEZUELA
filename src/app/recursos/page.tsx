import { Card } from "@/components/ui/card";
import { PublicJsonForm } from "@/components/forms/public-json-form";
import { ResourceFields } from "@/components/forms/form-controls";
import { prisma } from "@/lib/db";
import { resourceTypeLabels, statusLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const offers = await prisma.resourceOffer.findMany({ where: { status: { in: ["VERIFIED", "AVAILABLE"] } }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card>
        <h1 className="text-3xl font-black">Tengo recursos para ayudar</h1>
        <p className="mt-2 text-sm text-zinc-400">El telefono no se muestra publicamente.</p>
        <div className="mt-6"><PublicJsonForm endpoint="/api/resource-offers"><ResourceFields /></PublicJsonForm></div>
      </Card>
      <Card>
        <h2 className="text-xl font-black">Recursos disponibles</h2>
        <div className="mt-4 grid gap-3">
          {offers.map((offer) => (
            <div key={offer.id} className="rounded-lg bg-black/35 p-3">
              <p className="font-bold">{resourceTypeLabels[offer.resourceType]}</p>
              <p className="text-sm text-zinc-400">{statusLabels[offer.status]} · {offer.municipality}, {offer.state}</p>
              <p className="mt-1 text-sm">{offer.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
