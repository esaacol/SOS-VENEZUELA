import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest, maskPhone } from "@/lib/utils";
import { collectionCenterSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const admin = isAdminRequest(request);
  const centers = await prisma.collectionCenter.findMany({
    where: admin ? undefined : { status: { in: ["VERIFIED", "ACTIVE", "FULL"] } },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
  });

  return NextResponse.json({
    data: centers.map((center) => ({
      ...center,
      managerPhone: admin || center.publicContact ? center.managerPhone : maskPhone(center.managerPhone),
      managerName: admin || center.publicContact ? center.managerName : center.managerName ? "Responsable protegido" : null
    }))
  });
}

export async function POST(request: Request) {
  try {
    const payload = collectionCenterSchema.parse(await request.json());
    const center = await prisma.collectionCenter.create({ data: payload });
    return NextResponse.json({ message: "Centro registrado. Queda pendiente de verificacion.", data: center }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Revisa los datos del centro. Faltan campos obligatorios." }, { status: 400 });
  }
}
