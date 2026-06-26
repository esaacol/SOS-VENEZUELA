import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest, maskPhone } from "@/lib/utils";
import { aidRequestSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const admin = isAdminRequest(request);
  const requests = await prisma.aidRequest.findMany({
    where: admin ? undefined : { status: { in: ["VERIFIED", "IN_PROGRESS", "PARTIALLY_RESOLVED"] } },
    orderBy: [{ urgency: "desc" }, { createdAt: "desc" }]
  });

  return NextResponse.json({
    data: requests.map((aidRequest) => ({
      ...aidRequest,
      requesterPhone: admin ? aidRequest.requesterPhone : maskPhone(aidRequest.requesterPhone),
      requesterName: admin ? aidRequest.requesterName : aidRequest.requesterName ? "Solicitante protegido" : null
    }))
  });
}

export async function POST(request: Request) {
  try {
    const payload = aidRequestSchema.parse(await request.json());
    const aidRequest = await prisma.aidRequest.create({
      data: {
        ...payload,
        peopleCount: payload.peopleCount ? Math.round(payload.peopleCount) : undefined
      }
    });
    return NextResponse.json({ message: "Solicitud recibida. Queda pendiente de verificacion.", data: aidRequest }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Revisa los datos de la solicitud. Faltan campos obligatorios." }, { status: 400 });
  }
}
