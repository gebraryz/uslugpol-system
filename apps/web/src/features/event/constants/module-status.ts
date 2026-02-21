export const EVENT_MODULE_STATUS = ["TO_ENRICH", "ENRICHED"] as const;

export type EventModuleStatus = (typeof EVENT_MODULE_STATUS)[number];

export const EVENT_MODULE_STATUS_LABELS: Record<EventModuleStatus, string> = {
  TO_ENRICH: "Do wzbogacenia",
  ENRICHED: "Wzbogacony",
};
