import { z } from "zod";

const optionalNumber = z.preprocess((value) => value === "" ? undefined : value, z.coerce.number().optional());
const optionalDate = z.preprocess((value) => value === "" ? undefined : value, z.coerce.date().optional());
const bool = z.preprocess((value) => value === "on" || value === "true" || value === true, z.boolean());

export const reportSchema = z.object({
  type: z.enum(["LANDSLIDE", "BLOCKED_ROAD", "NO_HELP", "TRAPPED_PEOPLE", "NEEDS_WATER", "NEEDS_FOOD", "NEEDS_MEDICINE", "NEEDS_RESCUE", "FLOOD", "POWER_OUTAGE", "COMMUNICATION_LOSS", "OTHER"]),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  state: z.string().min(2),
  municipality: z.string().min(2),
  parish: z.string().optional(),
  sector: z.string().min(2),
  latitude: optionalNumber,
  longitude: optionalNumber,
  description: z.string().min(10),
  reporterName: z.string().optional(),
  reporterPhone: z.string().optional(),
  peopleAffected: optionalNumber
});

export const collectionCenterSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["COLLECTION_CENTER", "SHELTER", "MEDICAL_POINT", "FOOD_POINT", "WATER_POINT", "LOGISTICS_BASE", "OTHER"]),
  state: z.string().min(2),
  municipality: z.string().min(2),
  parish: z.string().optional(),
  sector: z.string().min(2),
  latitude: optionalNumber,
  longitude: optionalNumber,
  description: z.string().min(10),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  publicContact: bool.default(false),
  schedule: z.string().optional(),
  acceptsWater: bool.default(false),
  acceptsFood: bool.default(false),
  acceptsMedicine: bool.default(false),
  acceptsClothes: bool.default(false),
  acceptsTools: bool.default(false),
  acceptsFuel: bool.default(false),
  acceptsOther: bool.default(false),
  otherDetails: z.string().optional(),
  capacityNote: z.string().optional()
});

export const resourceOfferSchema = z.object({
  resourceType: z.enum(["TRUCK", "PICKUP", "MOTORCYCLE", "BOAT", "AMBULANCE", "BUS", "HEAVY_MACHINE", "BACKHOE", "TRACTOR", "CHAINSAW", "GENERATOR", "MEDICAL_TEAM", "VOLUNTEERS", "FOOD", "WATER", "MEDICINE", "FUEL", "TOOLS", "OTHER"]),
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  organizationName: z.string().optional(),
  state: z.string().min(2),
  municipality: z.string().min(2),
  parish: z.string().optional(),
  sector: z.string().min(2),
  latitude: optionalNumber,
  longitude: optionalNumber,
  description: z.string().min(10),
  availableFrom: optionalDate,
  availableUntil: optionalDate,
  capacity: z.string().optional(),
  canMoveToOtherZones: bool.default(false),
  needsFuel: bool.default(false),
  needsDriver: bool.default(false)
});

export const aidRequestSchema = z.object({
  requestType: z.enum(["WATER", "FOOD", "MEDICINE", "TRANSPORT", "MACHINERY", "SHELTER", "RESCUE", "FUEL", "OTHER"]),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  requesterName: z.string().optional(),
  requesterPhone: z.string().optional(),
  communityName: z.string().min(2),
  state: z.string().min(2),
  municipality: z.string().min(2),
  parish: z.string().optional(),
  sector: z.string().min(2),
  latitude: optionalNumber,
  longitude: optionalNumber,
  description: z.string().min(10),
  peopleCount: optionalNumber,
  needsWater: bool.default(false),
  needsFood: bool.default(false),
  needsMedicine: bool.default(false),
  needsTransport: bool.default(false),
  needsMachinery: bool.default(false),
  needsShelter: bool.default(false),
  needsFuel: bool.default(false)
});
