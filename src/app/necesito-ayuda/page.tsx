import { Card } from "@/components/ui/card";
import { PublicJsonForm } from "@/components/forms/public-json-form";
import { AidRequestFields } from "@/components/forms/form-controls";

export default function AidRequestPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <h1 className="text-3xl font-black">Necesito ayuda</h1>
        <p className="mt-2 text-sm text-zinc-400">Registra la necesidad de una comunidad o familia. El contacto queda protegido.</p>
        <div className="mt-6">
          <PublicJsonForm endpoint="/api/aid-requests"><AidRequestFields /></PublicJsonForm>
        </div>
      </Card>
    </div>
  );
}
