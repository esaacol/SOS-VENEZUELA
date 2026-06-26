"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AidRequestStatus, CollectionCenterStatus, ResourceStatus } from "@prisma/client";
import { prisma } from "@/lib/db";

function assertAdmin(formData: FormData) {
  const secret = String(formData.get("adminSecret") ?? "");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) redirect("/admin?error=unauthorized");
  return secret;
}

export async function updateCenterStatusAction(formData: FormData) {
  const secret = assertAdmin(formData);
  const id = String(formData.get("id"));
  const status = formData.get("status") as CollectionCenterStatus;
  if (!Object.values(CollectionCenterStatus).includes(status)) redirect(`/admin?secret=${secret}&error=status`);
  await prisma.collectionCenter.update({ where: { id }, data: { status, verified: ["VERIFIED", "ACTIVE"].includes(status) } });
  revalidatePath("/admin");
  redirect(`/admin?secret=${secret}`);
}

export async function updateResourceStatusAction(formData: FormData) {
  const secret = assertAdmin(formData);
  const id = String(formData.get("id"));
  const status = formData.get("status") as ResourceStatus;
  if (!Object.values(ResourceStatus).includes(status)) redirect(`/admin?secret=${secret}&error=status`);
  await prisma.resourceOffer.update({ where: { id }, data: { status, verified: ["VERIFIED", "AVAILABLE", "ASSIGNED"].includes(status) } });
  revalidatePath("/admin");
  redirect(`/admin?secret=${secret}`);
}

export async function updateAidRequestStatusAction(formData: FormData) {
  const secret = assertAdmin(formData);
  const id = String(formData.get("id"));
  const status = formData.get("status") as AidRequestStatus;
  if (!Object.values(AidRequestStatus).includes(status)) redirect(`/admin?secret=${secret}&error=status`);
  await prisma.aidRequest.update({ where: { id }, data: { status, verified: ["VERIFIED", "IN_PROGRESS", "PARTIALLY_RESOLVED", "RESOLVED"].includes(status) } });
  revalidatePath("/admin");
  redirect(`/admin?secret=${secret}`);
}

export async function createMatchAction(formData: FormData) {
  const secret = assertAdmin(formData);
  const aidRequestId = String(formData.get("aidRequestId"));
  const resourceOfferId = String(formData.get("resourceOfferId"));
  const notes = String(formData.get("notes") ?? "");

  await prisma.aidMatch.upsert({
    where: { aidRequestId_resourceOfferId: { aidRequestId, resourceOfferId } },
    update: { status: "ASSIGNED", notes },
    create: { aidRequestId, resourceOfferId, status: "ASSIGNED", notes }
  });
  await prisma.resourceOffer.update({ where: { id: resourceOfferId }, data: { status: "ASSIGNED", verified: true } });
  await prisma.aidRequest.update({ where: { id: aidRequestId }, data: { status: "IN_PROGRESS", verified: true } });
  revalidatePath("/admin");
  redirect(`/admin?secret=${secret}`);
}
