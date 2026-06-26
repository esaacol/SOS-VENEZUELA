import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskPhone(phone?: string | null) {
  if (!phone) return "Contacto disponible para coordinadores verificados";
  const clean = phone.replace(/\D/g, "");
  if (clean.length < 4) return "Contacto protegido";
  return `Contacto protegido (**${clean.slice(-4)})`;
}

export function toNumber(value: unknown) {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function isAdminRequest(request: Request) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;
  return request.headers.get("x-admin-secret") === expected;
}
