import { ROUTES } from "./routes";

export const ACCESS_CONTEXT_COOKIE_NAME = "ctx";

export const ACCESS_CONTEXTS = ["core", "event", "car", "cleaning"] as const;
export type AccessContext = (typeof ACCESS_CONTEXTS)[number];

type NonCoreAccessContext = Exclude<AccessContext, "core">;

export const ACCESS_CONTEXT_LABELS: Record<AccessContext, string> = {
  core: "Centrum",
  event: "Organizacja imprez",
  car: "Wynajem aut",
  cleaning: "Sprzątanie",
};

export const ACCESS_CONTEXT_DEFAULT_ROUTE: Record<AccessContext, string> = {
  core: ROUTES.core.leads,
  event: ROUTES.events.leads,
  car: ROUTES.vehicles.rental,
  cleaning: ROUTES.cleaning.index,
};

export const ACCESS_CONTEXT_LEAD_CATEGORY: Record<
  NonCoreAccessContext,
  "EVENT" | "CAR" | "CLEANING"
> = {
  event: "EVENT",
  car: "CAR",
  cleaning: "CLEANING",
};

export const ACCESS_CONTEXT_NAMESPACE: Record<NonCoreAccessContext, string> = {
  event: "event_service",
  car: "car_service",
  cleaning: "cleaning_service",
};
