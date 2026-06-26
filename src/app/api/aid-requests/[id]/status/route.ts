import { NextResponse } from "next/server";
import { AidRequestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  if (!Object.values(AidRequestStatus).includes(body.status)) {
    return NextResponse.json({ error: "Estado invalido." }, { status: 400 });
  }
  const aidRequest = await prisma.aidRequest.update({
    where: { id },
    data: { status: body.status, verified: ["VERIFIED", "IN_PROGRESS", "PARTIALLY_RESOLVED", "RESOLVED"].includes(body.status) }
  });
  return NextResponse.json({ message: "Solicitud actualizada.", data: aidRequest });
}
