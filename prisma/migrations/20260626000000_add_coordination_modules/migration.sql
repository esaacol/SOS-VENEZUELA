CREATE TYPE "ReportType" AS ENUM ('LANDSLIDE','BLOCKED_ROAD','NO_HELP','TRAPPED_PEOPLE','NEEDS_WATER','NEEDS_FOOD','NEEDS_MEDICINE','NEEDS_RESCUE','FLOOD','POWER_OUTAGE','COMMUNICATION_LOSS','OTHER');
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING','VERIFIED','REJECTED');
CREATE TYPE "Severity" AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
CREATE TYPE "CollectionCenterType" AS ENUM ('COLLECTION_CENTER','SHELTER','MEDICAL_POINT','FOOD_POINT','WATER_POINT','LOGISTICS_BASE','OTHER');
CREATE TYPE "CollectionCenterStatus" AS ENUM ('PENDING','VERIFIED','ACTIVE','FULL','INACTIVE','REJECTED');
CREATE TYPE "ResourceType" AS ENUM ('TRUCK','PICKUP','MOTORCYCLE','BOAT','AMBULANCE','BUS','HEAVY_MACHINE','BACKHOE','TRACTOR','CHAINSAW','GENERATOR','MEDICAL_TEAM','VOLUNTEERS','FOOD','WATER','MEDICINE','FUEL','TOOLS','OTHER');
CREATE TYPE "ResourceStatus" AS ENUM ('PENDING','VERIFIED','AVAILABLE','ASSIGNED','UNAVAILABLE','REJECTED');
CREATE TYPE "AidRequestType" AS ENUM ('WATER','FOOD','MEDICINE','TRANSPORT','MACHINERY','SHELTER','RESCUE','FUEL','OTHER');
CREATE TYPE "AidRequestStatus" AS ENUM ('PENDING','VERIFIED','IN_PROGRESS','PARTIALLY_RESOLVED','RESOLVED','REJECTED');
CREATE TYPE "AidMatchStatus" AS ENUM ('SUGGESTED','CONTACTED','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED');

CREATE TABLE "Report" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "type" "ReportType" NOT NULL,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "severity" "Severity" NOT NULL DEFAULT 'MEDIUM',
  "state" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "parish" TEXT,
  "sector" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "description" TEXT NOT NULL,
  "reporterName" TEXT,
  "reporterPhone" TEXT,
  "peopleAffected" INTEGER,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "CollectionCenter" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "type" "CollectionCenterType" NOT NULL,
  "status" "CollectionCenterStatus" NOT NULL DEFAULT 'PENDING',
  "state" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "parish" TEXT,
  "sector" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "description" TEXT NOT NULL,
  "managerName" TEXT,
  "managerPhone" TEXT,
  "publicContact" BOOLEAN NOT NULL DEFAULT false,
  "schedule" TEXT,
  "acceptsWater" BOOLEAN NOT NULL DEFAULT false,
  "acceptsFood" BOOLEAN NOT NULL DEFAULT false,
  "acceptsMedicine" BOOLEAN NOT NULL DEFAULT false,
  "acceptsClothes" BOOLEAN NOT NULL DEFAULT false,
  "acceptsTools" BOOLEAN NOT NULL DEFAULT false,
  "acceptsFuel" BOOLEAN NOT NULL DEFAULT false,
  "acceptsOther" BOOLEAN NOT NULL DEFAULT false,
  "otherDetails" TEXT,
  "capacityNote" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "ResourceOffer" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "resourceType" "ResourceType" NOT NULL,
  "status" "ResourceStatus" NOT NULL DEFAULT 'PENDING',
  "ownerName" TEXT,
  "ownerPhone" TEXT,
  "organizationName" TEXT,
  "state" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "parish" TEXT,
  "sector" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "description" TEXT NOT NULL,
  "availableFrom" TIMESTAMP(3),
  "availableUntil" TIMESTAMP(3),
  "capacity" TEXT,
  "canMoveToOtherZones" BOOLEAN NOT NULL DEFAULT false,
  "needsFuel" BOOLEAN NOT NULL DEFAULT false,
  "needsDriver" BOOLEAN NOT NULL DEFAULT false,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AidRequest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "requestType" "AidRequestType" NOT NULL,
  "status" "AidRequestStatus" NOT NULL DEFAULT 'PENDING',
  "urgency" "Severity" NOT NULL DEFAULT 'MEDIUM',
  "requesterName" TEXT,
  "requesterPhone" TEXT,
  "communityName" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "municipality" TEXT NOT NULL,
  "parish" TEXT,
  "sector" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "description" TEXT NOT NULL,
  "peopleCount" INTEGER,
  "needsWater" BOOLEAN NOT NULL DEFAULT false,
  "needsFood" BOOLEAN NOT NULL DEFAULT false,
  "needsMedicine" BOOLEAN NOT NULL DEFAULT false,
  "needsTransport" BOOLEAN NOT NULL DEFAULT false,
  "needsMachinery" BOOLEAN NOT NULL DEFAULT false,
  "needsShelter" BOOLEAN NOT NULL DEFAULT false,
  "needsFuel" BOOLEAN NOT NULL DEFAULT false,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "AidMatch" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "aidRequestId" TEXT NOT NULL,
  "resourceOfferId" TEXT NOT NULL,
  "reportId" TEXT,
  "status" "AidMatchStatus" NOT NULL DEFAULT 'SUGGESTED',
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AidMatch_aidRequestId_fkey" FOREIGN KEY ("aidRequestId") REFERENCES "AidRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AidMatch_resourceOfferId_fkey" FOREIGN KEY ("resourceOfferId") REFERENCES "ResourceOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "AidMatch_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "AidMatch_aidRequestId_resourceOfferId_key" ON "AidMatch"("aidRequestId", "resourceOfferId");
CREATE INDEX "Report_status_state_idx" ON "Report"("verificationStatus", "state", "municipality");
CREATE INDEX "CollectionCenter_status_state_idx" ON "CollectionCenter"("status", "state", "municipality");
CREATE INDEX "ResourceOffer_status_state_idx" ON "ResourceOffer"("status", "state", "municipality");
CREATE INDEX "AidRequest_status_urgency_idx" ON "AidRequest"("status", "urgency");
