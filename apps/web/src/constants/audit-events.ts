import type { AppEventMap } from "@uslugpol/shared/event-bus";

export type AuditEventType = keyof AppEventMap;
export type AuditEventGroup =
  | "created"
  | "assigned"
  | "enriched"
  | "cross_sell"
  | "opportunity"
  | "status"
  | "other";

export const AUDIT_EVENT_TYPES = {
  LEAD_CREATED: "core.lead.created.v1",
  LEAD_ASSIGNED: "core.lead.assigned.v1",
  LEAD_STATUS_CHANGED: "core.lead.status.changed.v1",
  LEAD_ENRICHED: "event.lead.enriched.v1",
  OPPORTUNITY_REPORTED: "event.opportunity.reported.v1",
  CROSS_SELL_PROPOSED: "core.crosssell.proposed.v1",
  CROSS_SELL_DECISION: "service.cross_sell.decision.v1",
  CROSS_SELL_STATUS_CHANGED: "core.cross_sell.status_changed.v1",
} as const satisfies Record<string, AuditEventType>;

export const AUDIT_EVENT_GROUP_LABELS: Record<AuditEventGroup, string> = {
  created: "Utworzony",
  assigned: "Przypisany",
  enriched: "Wzbogacony",
  cross_sell: "Cross-sell",
  opportunity: "Okazja",
  status: "Status",
  other: "Inne",
};

export const AUDIT_EVENT_GROUP_ORDER: AuditEventGroup[] = [
  "created",
  "assigned",
  "enriched",
  "cross_sell",
  "opportunity",
  "status",
  "other",
];

export const AUDIT_EVENT_GROUP_BY_TYPE = {
  [AUDIT_EVENT_TYPES.LEAD_CREATED]: "created",
  [AUDIT_EVENT_TYPES.LEAD_ASSIGNED]: "assigned",
  [AUDIT_EVENT_TYPES.LEAD_ENRICHED]: "enriched",
  [AUDIT_EVENT_TYPES.CROSS_SELL_PROPOSED]: "cross_sell",
  [AUDIT_EVENT_TYPES.OPPORTUNITY_REPORTED]: "opportunity",
  [AUDIT_EVENT_TYPES.LEAD_STATUS_CHANGED]: "status",
  [AUDIT_EVENT_TYPES.CROSS_SELL_DECISION]: "cross_sell",
  [AUDIT_EVENT_TYPES.CROSS_SELL_STATUS_CHANGED]: "cross_sell",
} as const satisfies Record<AuditEventType, AuditEventGroup>;

type KeyAuditEvent = { key: AuditEventType; label: string };

export const KEY_AUDIT_EVENTS: KeyAuditEvent[] = [
  { key: AUDIT_EVENT_TYPES.LEAD_CREATED, label: "Utworzony" },
  { key: AUDIT_EVENT_TYPES.LEAD_ASSIGNED, label: "Przypisany" },
  { key: AUDIT_EVENT_TYPES.LEAD_ENRICHED, label: "Wzbogacony" },
  { key: AUDIT_EVENT_TYPES.CROSS_SELL_PROPOSED, label: "Cross-sell" },
  { key: AUDIT_EVENT_TYPES.OPPORTUNITY_REPORTED, label: "Okazja" },
];

export const AUDIT_EVENT_UI_LABELS: Record<AuditEventType, string> = {
  [AUDIT_EVENT_TYPES.LEAD_CREATED]: "Lead utworzony",
  [AUDIT_EVENT_TYPES.LEAD_ASSIGNED]: "Lead przypisany",
  [AUDIT_EVENT_TYPES.LEAD_STATUS_CHANGED]: "Status zmieniony",
  [AUDIT_EVENT_TYPES.LEAD_ENRICHED]: "Lead wzbogacony",
  [AUDIT_EVENT_TYPES.CROSS_SELL_PROPOSED]: "Rekomendacja cross-sell",
  [AUDIT_EVENT_TYPES.OPPORTUNITY_REPORTED]: "Zgłoszono okazję",
  [AUDIT_EVENT_TYPES.CROSS_SELL_DECISION]: "Decyzja cross-sell",
  [AUDIT_EVENT_TYPES.CROSS_SELL_STATUS_CHANGED]: "Status cross-sell zmieniony",
};
