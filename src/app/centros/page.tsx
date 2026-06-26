import { Card } from "@/components/ui/card";
import { PublicJsonForm } from "@/components/forms/public-json-form";
import { CenterFields } from "@/components/forms/form-controls";
import { prisma } from "@/lib/db";
import { centerTypeLabels, statusLabels } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function CentersPage() {
  const centers = await prisma.collectionCenter.findMany({ where: { status: { in: ["VERIFIED", "ACTIVE", "FULL"] } }, orderBy: { updatedAt: "desc" } });
  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.9fr]">
      <Card>
        <h1 className="text-3xl font-black">Registrar centro de acopio</h1>
        <div className="mt-6"><PublicJsonForm endpoint="/api/collection-centers"><CenterFields /></PublicJsonForm></div>
      </Card>
      <Card>
        <h2 className="text-xl font-black">Centros activos</h2>
        <div className="mt-4 grid gap-3">
          {centers.map((center) => (
            <div key={center.id} className="rounded-lg bg-black/35 p-3">
              <p className="font-bold">{center.name}</p>
              <p className="text-sm text-zinc-400">{centerTypeLabels[center.type]} · {statusLabels[center.status]} · {center.municipality}</p>
              <p className="mt-1 text-sm">{center.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
