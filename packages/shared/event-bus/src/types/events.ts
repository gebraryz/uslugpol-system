import type {
  CrossSellOpportunityStatus,
  CrossSellSource,
  LeadChannel,
  LeadStatus,
  LeadType,
} from "../../../../core/generated/prisma/client";

export type {
  CrossSellOpportunityStatus,
  CrossSellSource,
  LeadChannel,
  LeadStatus,
  LeadType,
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ServiceName =
  | "core"
  | "event_service"
  | "car_service"
  | "cleaning_service";
export type CrossSellTargetService = Exclude<
  ServiceName,
  "core" | "event_service"
>;

export type EventEnvelope<TType extends string, TPayload> = {
  id: string;
  type: TType;
  occurredAt: string;
  actorService: ServiceName;
  aggregateId: string;
  correlationId?: string;
  payload: TPayload;
};

export type EventMap = Record<string, JsonObject>;

export interface EventBus<TEvents extends EventMap> {
  publish<TKey extends keyof TEvents & string>(
    event: EventEnvelope<TKey, TEvents[TKey]>,
  ): Promise<number>;
  subscribe<TKey extends keyof TEvents & string>(
    type: TKey,
    handler: (
      event: EventEnvelope<TKey, TEvents[TKey]>,
    ) => Promise<void> | void,
  ): () => void;
}

export type LeadSnapshot = {
  id: string;
  category: LeadType;
  status: LeadStatus;
  channel: LeadChannel;
  description: string;
  location: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
};

export type AppEventMap = {
  "core.lead.created.v1": {
    lead: LeadSnapshot;
    correlationId?: string;
  };
  "core.lead.assigned.v1": {
    leadId: string;
    category: LeadType;
    status: LeadStatus;
    channel: LeadChannel;
    description: string;
    lat: number;
    lng: number;
    locationLabel?: string;
    createdAt: string;
    updatedAt: string;
    assignedService: Exclude<ServiceName, "core">;
    correlationId?: string;
  };
  "core.lead.status.changed.v1": {
    leadId: string;
    from: LeadStatus;
    to: LeadStatus;
    changedAt: string;
    correlationId?: string;
  };
  "event.lead.enriched.v1": {
    leadId: string;
    namespace: Exclude<ServiceName, "core">;
    data: JsonObject;
    enrichedAt: string;
    correlationId?: string;
  };
  "event.opportunity.reported.v1": {
    leadId: string;
    sourceService: Exclude<ServiceName, "core">;
    targetService: CrossSellTargetService;
    description: string;
    context?: JsonObject;
    reportedAt: string;
    correlationId?: string;
  };
  "core.crosssell.proposed.v1": {
    opportunityId: string;
    leadId: string;
    leadCategory: LeadType;
    targetService: CrossSellTargetService;
    source: CrossSellSource;
    reason: string;
    ruleKey?: string;
    context?: JsonObject;
    snapshot: {
      description: string;
      lat: number;
      lng: number;
      channel: LeadChannel;
      createdAt: string;
      locationLabel?: string;
    };
    proposedAt: string;
    correlationId?: string;
  };
  "service.cross_sell.decision.v1": {
    opportunityId: string;
    targetService: CrossSellTargetService;
    decision: CrossSellOpportunityStatus;
    decisionNote?: string;
    decidedAt: string;
    correlationId?: string;
  };
  "core.cross_sell.status_changed.v1": {
    opportunityId: string;
    leadId: string;
    from: CrossSellOpportunityStatus;
    to: CrossSellOpportunityStatus;
    changedAt: string;
    correlationId?: string;
  };
};
