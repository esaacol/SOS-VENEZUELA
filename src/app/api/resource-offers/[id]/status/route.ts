import { NextResponse } from "next/server";
import { ResourceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  if (!Object.values(ResourceStatus).includes(body.status)) {
    return NextResponse.json({ error: "Estado invalido." }, { status: 400 });
  }
  const offer = await prisma.resourceOffer.update({
    where: { id },
    data: { status: body.status, verified: ["VERIFIED", "AVAILABLE", "ASSIGNED"].includes(body.status) }
  });
  return NextResponse.json({ message: "Recurso actualizado.", data: offer });
}
