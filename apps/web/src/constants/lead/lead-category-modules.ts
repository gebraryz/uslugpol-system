import { type LeadCategory } from "./lead-categories";
import { ROUTES } from "../routes";
import type { AccessContext } from "../access-context";

type AssignedService = "event_service" | "car_service" | "cleaning_service";
type ServiceAccessContext = Exclude<AccessContext, "core">;

type LeadCategoryModuleMeta = {
  assignedService: AssignedService;
  extensionsEmptyState: {
    message: string;
    cta: {
      label: string;
      context: ServiceAccessContext;
      href: (leadId: string) => string;
    } | null;
  };
};

export const LEAD_CATEGORY_MODULES = {
  EVENT: {
    assignedService: "event_service",
    extensionsEmptyState: {
      message: "Czeka na uzupełnienie danych wydarzenia",
      cta: {
        label: "Przejdź do obsługi wydarzenia",
        context: "event",
        href: (leadId: string) => ROUTES.events.leadDetails(leadId),
      },
    },
  },
  CAR: {
    assignedService: "car_service",
    extensionsEmptyState: {
      message: "To zgłoszenie obsługuje obszar wynajmu aut",
      cta: {
        label: "Przejdź do widoku wynajmu aut",
        context: "car",
        href: () => ROUTES.vehicles.leads,
      },
    },
  },
  CLEANING: {
    assignedService: "cleaning_service",
    extensionsEmptyState: {
      message: "Dodatkowe dane dla tej kategorii nie są jeszcze dostępne (MVP)",
      cta: null,
    },
  },
} as const satisfies Record<LeadCategory, LeadCategoryModuleMeta>;
