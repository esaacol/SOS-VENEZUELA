import { NextResponse } from "next/server";
import { CollectionCenterStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAdminRequest } from "@/lib/utils";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  if (!Object.values(CollectionCenterStatus).includes(body.status)) {
    return NextResponse.json({ error: "Estado invalido." }, { status: 400 });
  }
  const center = await prisma.collectionCenter.update({
    where: { id },
    data: { status: body.status, verified: ["VERIFIED", "ACTIVE"].includes(body.status) }
  });
  return NextResponse.json({ message: "Centro actualizado.", data: center });
}
