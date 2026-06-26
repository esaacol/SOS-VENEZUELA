import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const allowedTypes = [
  "COLLECTION_CENTER",
  "SHELTER",
  "MEDICAL_POINT",
  "FOOD_POINT",
  "WATER_POINT",
  "LOGISTICS_BASE",
  "OTHER",
] as const;

type CollectionCenterType = (typeof allowedTypes)[number];

function isValidType(value: string): value is CollectionCenterType {
  return allowedTypes.includes(value as CollectionCenterType);
}

function cleanText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

export async function GET() {
  try {
    const centers = await prisma.collectionCenter.findMany({
      where: {
        status: {
          in: ["PENDING", "VERIFIED", "ACTIVE", "FULL"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 200,
    });

    return NextResponse.json({
      ok: true,
      centers: centers.map((center) => ({
        id: center.id,
        name: center.name,
        type: center.type,
        status: center.status,
        state: center.state,
        municipality: center.municipality,
        parish: center.parish,
        sector: center.sector,
        latitude: Number(center.latitude),
        longitude: Number(center.longitude),
        description: center.description,
        schedule: center.schedule,
        acceptsWater: center.acceptsWater,
        acceptsFood: center.acceptsFood,
        acceptsMedicine: center.acceptsMedicine,
        acceptsClothes: center.acceptsClothes,
        acceptsTools: center.acceptsTools,
        acceptsFuel: center.acceptsFuel,
        acceptsOther: center.acceptsOther,
        otherDetails: center.otherDetails,
        capacityNote: center.capacityNote,
        publicContact: center.publicContact,
        managerPhone: center.publicContact ? center.managerPhone : null,
        createdAt: center.createdAt,
      })),
    });
  } catch (error) {
    console.error("GET_COLLECTION_CENTERS_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No se pudieron cargar los centros de acopio.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = cleanText(body.name);
    const type = cleanText(body.type);
    const state = cleanText(body.state);
    const municipality = cleanText(body.municipality);
    const description = cleanText(body.description);
    const latitude = Number(body.latitude);
    const longitude = Number(body.longitude);

    if (name.length < 3) {
      return NextResponse.json(
        {
          ok: false,
          message: "Coloca el nombre del centro de acopio.",
        },
        { status: 400 }
      );
    }

    if (!isValidType(type)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Tipo de centro inválido.",
        },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        {
          ok: false,
          message: "Coloca el estado donde está ubicado.",
        },
        { status: 400 }
      );
    }

    if (!municipality) {
      return NextResponse.json(
        {
          ok: false,
          message: "Coloca el municipio donde está ubicado.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Coloca una latitud y longitud válida.",
        },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        {
          ok: false,
          message: "Las coordenadas no son válidas.",
        },
        { status: 400 }
      );
    }

    if (description.length < 10) {
      return NextResponse.json(
        {
          ok: false,
          message: "Describe qué recibe o qué ayuda ofrece este punto.",
        },
        { status: 400 }
      );
    }

    const center = await prisma.collectionCenter.create({
      data: {
        name,
        type,
        status: "PENDING",
        state,
        municipality,
        parish: cleanText(body.parish) || null,
        sector: cleanText(body.sector) || "Sin especificar",
        latitude,
        longitude,
        description,
        managerName: cleanText(body.managerName) || null,
        managerPhone: cleanText(body.managerPhone) || null,
        publicContact: toBoolean(body.publicContact),
        schedule: cleanText(body.schedule) || null,
        acceptsWater: toBoolean(body.acceptsWater),
        acceptsFood: toBoolean(body.acceptsFood),
        acceptsMedicine: toBoolean(body.acceptsMedicine),
        acceptsClothes: toBoolean(body.acceptsClothes),
        acceptsTools: toBoolean(body.acceptsTools),
        acceptsFuel: toBoolean(body.acceptsFuel),
        acceptsOther: toBoolean(body.acceptsOther),
        otherDetails: cleanText(body.otherDetails) || null,
        capacityNote: cleanText(body.capacityNote) || null,
        verified: false,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Centro registrado. Quedará pendiente de verificación.",
      center: {
        id: center.id,
        name: center.name,
        status: center.status,
      },
    });
  } catch (error) {
    console.error("CREATE_COLLECTION_CENTER_ERROR", error);

    return NextResponse.json(
      {
        ok: false,
        message: "No se pudo registrar el centro de acopio.",
      },
      { status: 500 }
    );
  }
}
