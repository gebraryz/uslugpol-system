import { type LeadCategory } from "./lead-categories";
import { ROUTES } from "./routes";

type AssignedService = "event_service" | "car_service" | "cleaning_service";

type LeadCategoryModuleMeta = {
  assignedService: AssignedService;
  extensionsEmptyState: {
    message: string;
    cta: {
      label: string;
      href: (leadId: string) => string;
    } | null;
  };
};

export const LEAD_CATEGORY_MODULES = {
  EVENT: {
    assignedService: "event_service",
    extensionsEmptyState: {
      message: "Czeka na wzbogacenie z modułu Wydarzenia",
      cta: {
        label: "Przejdź do modułu wydarzeń -> Wzbogać leada",
        href: (leadId: string) => ROUTES.events.leadDetails(leadId),
      },
    },
  },
  CAR: {
    assignedService: "car_service",
    extensionsEmptyState: {
      message: "Lead jest obsługiwany przez moduł Samochody",
      cta: {
        label: "Przejdź do modułu pojazdów",
        href: () => ROUTES.vehicles.rental,
      },
    },
  },
  CLEANING: {
    assignedService: "cleaning_service",
    extensionsEmptyState: {
      message: "Brak modułu wzbogacania dla tej kategorii (MVP)",
      cta: null,
    },
  },
} as const satisfies Record<LeadCategory, LeadCategoryModuleMeta>;
