import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/utils";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const matches = await prisma.aidMatch.findMany({
    include: { aidRequest: true, resourceOffer: true, report: true },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json({ data: matches });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json();
  if (!body.aidRequestId || !body.resourceOfferId) {
    return NextResponse.json({ error: "Selecciona solicitud y recurso." }, { status: 400 });
  }
  const match = await prisma.aidMatch.upsert({
    where: {
      aidRequestId_resourceOfferId: {
        aidRequestId: body.aidRequestId,
        resourceOfferId: body.resourceOfferId
      }
    },
    update: { status: body.status ?? "ASSIGNED", notes: body.notes },
    create: {
      aidRequestId: body.aidRequestId,
      resourceOfferId: body.resourceOfferId,
      reportId: body.reportId,
      status: body.status ?? "ASSIGNED",
      notes: body.notes
    }
  });
  return NextResponse.json({ message: "Asignacion guardada.", data: match }, { status: 201 });
}
