export const reportTypeLabels = {
  LANDSLIDE: "Derrumbe",
  BLOCKED_ROAD: "Via bloqueada",
  NO_HELP: "Todavia no ha llegado ayuda",
  TRAPPED_PEOPLE: "Personas atrapadas",
  NEEDS_WATER: "Necesitan agua",
  NEEDS_FOOD: "Necesitan comida",
  NEEDS_MEDICINE: "Necesitan medicina",
  NEEDS_RESCUE: "Necesitan rescate",
  FLOOD: "Inundacion",
  POWER_OUTAGE: "Sin electricidad",
  COMMUNICATION_LOSS: "Sin comunicacion",
  OTHER: "Otro"
} as const;

export const severityLabels = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
  CRITICAL: "Critica"
} as const;

export const centerTypeLabels = {
  COLLECTION_CENTER: "Centro de acopio",
  SHELTER: "Refugio",
  MEDICAL_POINT: "Punto medico",
  FOOD_POINT: "Punto de comida",
  WATER_POINT: "Punto de agua",
  LOGISTICS_BASE: "Base logistica",
  OTHER: "Otro"
} as const;

export const resourceTypeLabels = {
  TRUCK: "Camion",
  PICKUP: "Camioneta",
  MOTORCYCLE: "Moto",
  BOAT: "Lancha",
  AMBULANCE: "Ambulancia",
  BUS: "Autobus",
  HEAVY_MACHINE: "Maquinaria pesada",
  BACKHOE: "Retroexcavadora",
  TRACTOR: "Tractor",
  CHAINSAW: "Motosierra",
  GENERATOR: "Planta electrica",
  MEDICAL_TEAM: "Personal medico",
  VOLUNTEERS: "Voluntarios",
  FOOD: "Comida",
  WATER: "Agua",
  MEDICINE: "Medicinas",
  FUEL: "Combustible",
  TOOLS: "Herramientas",
  OTHER: "Otro"
} as const;

export const aidRequestTypeLabels = {
  WATER: "Agua",
  FOOD: "Comida",
  MEDICINE: "Medicinas",
  TRANSPORT: "Transporte",
  MACHINERY: "Maquinaria",
  SHELTER: "Refugio",
  RESCUE: "Rescate",
  FUEL: "Combustible",
  OTHER: "Otro"
} as const;

export const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  VERIFIED: "Verificado",
  ACTIVE: "Activo",
  FULL: "Lleno",
  INACTIVE: "Inactivo",
  REJECTED: "Rechazado",
  AVAILABLE: "Disponible",
  ASSIGNED: "Asignado",
  UNAVAILABLE: "No disponible",
  IN_PROGRESS: "En atencion",
  PARTIALLY_RESOLVED: "Parcialmente atendida",
  RESOLVED: "Atendida",
  SUGGESTED: "Sugerido",
  CONTACTED: "Contactado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado"
};
