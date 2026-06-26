import { Card } from "@/components/ui/card";
import { PublicJsonForm } from "@/components/forms/public-json-form";
import { ReportFields } from "@/components/forms/form-controls";

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <h1 className="text-3xl font-black">Reportar emergencia</h1>
        <p className="mt-2 text-sm text-zinc-400">Los datos de contacto son privados y solo los ve el equipo verificador.</p>
        <div className="mt-6">
          <PublicJsonForm endpoint="/api/reports"><ReportFields /></PublicJsonForm>
        </div>
      </Card>
    </div>
  );
}
