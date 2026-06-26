import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminRequest, maskPhone } from "@/lib/utils";
import { reportSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const admin = isAdminRequest(request);
  const reports = await prisma.report.findMany({
    orderBy: [{ verificationStatus: "asc" }, { createdAt: "desc" }],
    take: 300
  });

  return NextResponse.json({
    data: reports.map((report) => ({
      ...report,
      reporterPhone: admin ? report.reporterPhone : maskPhone(report.reporterPhone),
      reporterName: admin ? report.reporterName : report.reporterName ? "Reportante protegido" : null
    }))
  });
}

export async function POST(request: Request) {
  try {
    const payload = reportSchema.parse(await request.json());
    const report = await prisma.report.create({
      data: {
        ...payload,
        peopleAffected: payload.peopleAffected ? Math.round(payload.peopleAffected) : undefined
      }
    });
    return NextResponse.json({ message: "Reporte recibido. Queda pendiente de verificacion.", data: report }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Revisa los datos del reporte. Faltan campos obligatorios." }, { status: 400 });
  }
}
