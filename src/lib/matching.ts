import type { AidRequest, ResourceOffer, ResourceType } from "@prisma/client";

const transport: ResourceType[] = ["TRUCK", "PICKUP", "MOTORCYCLE", "BOAT", "BUS", "AMBULANCE"];
const machinery: ResourceType[] = ["HEAVY_MACHINE", "BACKHOE", "TRACTOR", "CHAINSAW"];

export function isCompatibleResource(request: AidRequest, offer: ResourceOffer) {
  if (request.needsTransport && transport.includes(offer.resourceType)) return true;
  if (request.needsMachinery && machinery.includes(offer.resourceType)) return true;
  if (request.needsWater && offer.resourceType === "WATER") return true;
  if (request.needsFood && offer.resourceType === "FOOD") return true;
  if (request.needsMedicine && ["MEDICINE", "MEDICAL_TEAM"].includes(offer.resourceType)) return true;
  if (request.needsFuel && offer.resourceType === "FUEL") return true;
  if (request.needsShelter && offer.resourceType === "VOLUNTEERS") return true;
  return request.municipality.toLowerCase() === offer.municipality.toLowerCase();
}
