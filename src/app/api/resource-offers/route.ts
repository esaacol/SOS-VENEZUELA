import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest, maskPhone } from "@/lib/utils";
import { resourceOfferSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const admin = isAdminRequest(request);
  const offers = await prisma.resourceOffer.findMany({
    where: admin ? undefined : { status: { in: ["VERIFIED", "AVAILABLE"] } },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
  });

  return NextResponse.json({
    data: offers.map((offer) => ({
      ...offer,
      ownerPhone: admin ? offer.ownerPhone : maskPhone(offer.ownerPhone),
      ownerName: admin ? offer.ownerName : offer.ownerName ? "Contacto protegido" : null
    }))
  });
}

export async function POST(request: Request) {
  try {
    const payload = resourceOfferSchema.parse(await request.json());
    const offer = await prisma.resourceOffer.create({ data: payload });
    return NextResponse.json({ message: "Recurso recibido. Queda pendiente de verificacion.", data: offer }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Revisa los datos del recurso. Faltan campos obligatorios." }, { status: 400 });
  }
}
