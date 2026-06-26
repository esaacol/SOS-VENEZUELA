import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { LocationPicker } from "@/components/map/location-picker";
import { aidRequestTypeLabels, centerTypeLabels, reportTypeLabels, resourceTypeLabels, severityLabels } from "@/lib/labels";

export function LocationFields() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estado"><Input name="state" required placeholder="Merida" /></Field>
        <Field label="Municipio"><Input name="municipality" required placeholder="Campo Elias" /></Field>
        <Field label="Parroquia"><Input name="parish" placeholder="Opcional" /></Field>
        <Field label="Sector"><Input name="sector" required placeholder="Sector o comunidad" /></Field>
      </div>
      <LocationPicker />
    </div>
  );
}

export function ReportFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo de emergencia">
          <Select name="type" required>{Object.entries(reportTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
        </Field>
        <Field label="Gravedad">
          <Select name="severity" required>{Object.entries(severityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
        </Field>
      </div>
      <LocationFields />
      <Field label="Descripcion"><Textarea name="description" required placeholder="Cuenta que esta pasando, cuantas personas afecta y que se necesita." /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Nombre de contacto privado"><Input name="reporterName" placeholder="No se publica" /></Field>
        <Field label="Telefono privado"><Input name="reporterPhone" placeholder="No se publica" /></Field>
        <Field label="Personas afectadas"><Input name="peopleAffected" type="number" min="0" /></Field>
      </div>
    </>
  );
}

export function CenterFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre del centro"><Input name="name" required /></Field>
        <Field label="Tipo"><Select name="type" required>{Object.entries(centerTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>
      </div>
      <LocationFields />
      <Field label="Descripcion"><Textarea name="description" required placeholder="Que reciben, como llegar, restricciones o instrucciones." /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Responsable"><Input name="managerName" placeholder="Privado si no marcas contacto publico" /></Field>
        <Field label="Telefono"><Input name="managerPhone" placeholder="Privado si no marcas contacto publico" /></Field>
        <Field label="Horario"><Input name="schedule" placeholder="Ej. 8am a 6pm" /></Field>
        <Field label="Capacidad o nota"><Input name="capacityNote" placeholder="Ej. Recibe hasta 200 personas" /></Field>
      </div>
      <CheckGrid items={[
        ["publicContact", "Mostrar contacto publicamente"],
        ["acceptsWater", "Recibe agua"],
        ["acceptsFood", "Recibe comida"],
        ["acceptsMedicine", "Recibe medicinas"],
        ["acceptsClothes", "Recibe ropa"],
        ["acceptsTools", "Recibe herramientas"],
        ["acceptsFuel", "Recibe combustible"],
        ["acceptsOther", "Recibe otros"]
      ]} />
      <Field label="Otros detalles"><Input name="otherDetails" /></Field>
    </>
  );
}

export function ResourceFields() {
  return (
    <>
      <Field label="Tipo de recurso"><Select name="resourceType" required>{Object.entries(resourceTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Nombre privado"><Input name="ownerName" placeholder="No se publica" /></Field>
        <Field label="Telefono privado"><Input name="ownerPhone" placeholder="No se publica" /></Field>
        <Field label="Organizacion"><Input name="organizationName" placeholder="Opcional" /></Field>
      </div>
      <LocationFields />
      <Field label="Descripcion"><Textarea name="description" required placeholder="Describe el recurso, cantidad, condiciones y ubicacion." /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Disponible desde"><Input name="availableFrom" type="datetime-local" /></Field>
        <Field label="Disponible hasta"><Input name="availableUntil" type="datetime-local" /></Field>
        <Field label="Capacidad"><Input name="capacity" placeholder="Ej. 2 toneladas, 12 personas, 500 litros" /></Field>
      </div>
      <CheckGrid items={[
        ["canMoveToOtherZones", "Puede moverse a otras zonas"],
        ["needsFuel", "Necesita combustible"],
        ["needsDriver", "Necesita chofer"]
      ]} />
    </>
  );
}

export function AidRequestFields() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipo principal"><Select name="requestType" required>{Object.entries(aidRequestTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>
        <Field label="Urgencia"><Select name="urgency" required>{Object.entries(severityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Comunidad"><Input name="communityName" required /></Field>
        <Field label="Contacto privado"><Input name="requesterName" placeholder="No se publica" /></Field>
        <Field label="Telefono privado"><Input name="requesterPhone" placeholder="No se publica" /></Field>
      </div>
      <LocationFields />
      <Field label="Descripcion"><Textarea name="description" required placeholder="Explica la necesidad, cantidad de personas y urgencia." /></Field>
      <Field label="Personas afectadas"><Input name="peopleCount" type="number" min="0" /></Field>
      <CheckGrid items={[
        ["needsWater", "Necesita agua"],
        ["needsFood", "Necesita comida"],
        ["needsMedicine", "Necesita medicinas"],
        ["needsTransport", "Necesita transporte"],
        ["needsMachinery", "Necesita maquinaria"],
        ["needsShelter", "Necesita refugio"],
        ["needsFuel", "Necesita combustible"]
      ]} />
    </>
  );
}

function CheckGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([name, label]) => (
        <label key={name} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm">
          <input name={name} type="checkbox" className="h-4 w-4 accent-rescue-500" />
          {label}
        </label>
      ))}
    </div>
  );
}
