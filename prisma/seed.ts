import { prisma } from "../src/lib/db";

async function main() {
  await prisma.report.create({
    data: {
      type: "BLOCKED_ROAD",
      severity: "HIGH",
      state: "Merida",
      municipality: "Campo Elias",
      sector: "Via principal",
      description: "Via parcialmente bloqueada. Se requiere verificacion y maquinaria liviana.",
      reporterName: "Coordinador local",
      reporterPhone: "+58 000-0000000",
      peopleAffected: 120
    }
  });

  await prisma.collectionCenter.create({
    data: {
      name: "Centro comunitario piloto",
      type: "COLLECTION_CENTER",
      status: "ACTIVE",
      state: "Merida",
      municipality: "Campo Elias",
      sector: "Centro",
      description: "Recibe agua, comida y medicinas en horario diurno.",
      schedule: "8:00 AM a 6:00 PM",
      acceptsWater: true,
      acceptsFood: true,
      acceptsMedicine: true,
      verified: true
    }
  });

  await prisma.resourceOffer.create({
    data: {
      resourceType: "PICKUP",
      status: "AVAILABLE",
      ownerName: "Voluntario piloto",
      ownerPhone: "+58 000-0000000",
      state: "Merida",
      municipality: "Campo Elias",
      sector: "Centro",
      description: "Camioneta disponible para traslados de insumos livianos.",
      canMoveToOtherZones: true,
      verified: true
    }
  });

  await prisma.aidRequest.create({
    data: {
      requestType: "TRANSPORT",
      status: "VERIFIED",
      urgency: "HIGH",
      requesterName: "Vocero comunitario",
      requesterPhone: "+58 000-0000000",
      communityName: "Comunidad piloto",
      state: "Merida",
      municipality: "Campo Elias",
      sector: "Parte alta",
      description: "Necesitan traslado de agua y alimentos para familias incomunicadas.",
      peopleCount: 50,
      needsTransport: true,
      needsWater: true,
      needsFood: true,
      verified: true
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
