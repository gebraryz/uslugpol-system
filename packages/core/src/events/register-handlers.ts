import type {
  AppEventMap,
  CrossSellSource,
  CrossSellTargetService,
  EventBus,
  EventEnvelope,
  LeadChannel,
  LeadType,
} from "@uslugpol/shared/event-bus";
import crypto from "node:crypto";
import { Prisma, PrismaClient } from "../../generated/prisma/client";

type AppEventBus = EventBus<AppEventMap>;
type AppEventType = keyof AppEventMap & string;
type AppEvent<Key extends AppEventType> = EventEnvelope<Key, AppEventMap[Key]>;

type CoreDependencies = { db: PrismaClient; eventBus: AppEventBus };
type CrossSellProposedPayload = AppEventMap["core.crosssell.proposed.v1"];
type CrossSellSnapshot = CrossSellProposedPayload["snapshot"];

type LeadTargetType = Exclude<LeadType, "EVENT">;

type CreateCrossSellOpportunityParams = {
  leadId: string;
  leadCategory: LeadType;
  targetService: LeadTargetType;
  source: CrossSellSource;
  reason: string;
  ruleKey?: string;
  context?: CrossSellProposedPayload["context"];
  snapshot: CrossSellSnapshot;
  correlationId?: string;
  causationId?: string;
};

type AuditCreate = Pick<
  Prisma.AuditLogCreateInput,
  | "actorService"
  | "eventType"
  | "entityType"
  | "entityId"
  | "leadId"
  | "payload"
  | "correlationId"
  | "causationId"
> & { occurredAt?: Prisma.AuditLogCreateInput["occurredAt"] };

const CROSS_SELL_EVENT_DISTANCE_RULE = {
  key: "event_distance_over_50km",
  thresholdKm: 50,
  referencePoint: { lat: 52.2297, lng: 21.0122 },
  referenceLabel: "centrum_operacyjne",
} as const;

const TARGET_SERVICE_NAME = {
  CAR: "car_service",
  CLEANING: "cleaning_service",
} as const satisfies Record<LeadTargetType, CrossSellTargetService>;

const LEAD_TARGET_TYPE = {
  car_service: "CAR",
  cleaning_service: "CLEANING",
} as const satisfies Record<CrossSellTargetService, LeadTargetType>;

const toRadians = (value: number) => (value * Math.PI) / 180;
const haversineDistanceKm = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) => {
  const earthRadiusKm = 6371;

  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const toCrossSellSnapshot = (lead: {
  description: string;
  lat: number;
  lng: number;
  channel: LeadChannel;
  createdAt: Date;
}): CrossSellSnapshot => ({
  description: lead.description,
  lat: lead.lat,
  lng: lead.lng,
  channel: lead.channel,
  createdAt: lead.createdAt.toISOString(),
});

export const audit = async (db: PrismaClient, params: AuditCreate) =>
  db.auditLog.create({
    data: {
      ...params,
      occurredAt: params.occurredAt,
      leadId: params.leadId ?? null,
      correlationId: params.correlationId ?? null,
      causationId: params.causationId ?? null,
    },
  });

const findExistingCrossSellForCausation = async (
  db: PrismaClient,
  params: Pick<CreateCrossSellOpportunityParams, "leadId" | "causationId">,
) => {
  if (!params.causationId) return null;

  const existingAudit = await db.auditLog.findFirst({
    where: {
      eventType: "core.crosssell.proposed.v1",
      causationId: params.causationId,
      leadId: params.leadId,
    },
    select: { entityId: true },
  });

  if (!existingAudit) return null;

  return db.crossSellOpportunity.findUnique({
    where: { id: existingAudit.entityId },
  });
};

const createAndPublishCrossSellOpportunity = async (
  dependencies: CoreDependencies,
  params: CreateCrossSellOpportunityParams,
) => {
  const { db, eventBus } = dependencies;

  const existingOpportunity = await findExistingCrossSellForCausation(db, {
    leadId: params.leadId,
    causationId: params.causationId,
  });

  if (existingOpportunity) {
    return existingOpportunity;
  }

  const opportunityId = params.causationId ?? crypto.randomUUID();
  const opportunity = await db.crossSellOpportunity.upsert({
    where: { id: opportunityId },
    create: {
      id: opportunityId,
      leadId: params.leadId,
      targetService: params.targetService,
      source: params.source,
      reason: params.reason,
      ruleKey: params.ruleKey,
      context: params.context as Prisma.InputJsonValue | undefined,
      updatedAt: new Date(),
    },
    update: {
      reason: params.reason,
      ruleKey: params.ruleKey ?? null,
      context: params.context as Prisma.InputJsonValue | undefined,
      updatedAt: new Date(),
    },
  });

  const proposedAt = new Date().toISOString();
  const payload: CrossSellProposedPayload = {
    leadId: params.leadId,
    opportunityId: opportunity.id,
    leadCategory: params.leadCategory,
    targetService: TARGET_SERVICE_NAME[params.targetService],
    source: params.source,
    reason: params.reason,
    snapshot: params.snapshot,
    proposedAt,
    ruleKey: params.ruleKey,
    context: params.context,
    correlationId: params.correlationId,
  };

  await eventBus.publish({
    id: crypto.randomUUID(),
    type: "core.crosssell.proposed.v1",
    occurredAt: proposedAt,
    actorService: "core",
    aggregateId: params.leadId,
    correlationId: params.correlationId,
    payload,
  });

  await audit(db, {
    actorService: "core",
    eventType: "core.crosssell.proposed.v1",
    entityType: "CrossSellOpportunity",
    entityId: opportunity.id,
    leadId: params.leadId,
    payload,
    correlationId: params.correlationId,
    causationId: params.causationId,
  });

  return opportunity;
};

const handleLeadEnriched = async (
  dependencies: CoreDependencies,
  event: AppEvent<"event.lead.enriched.v1">,
) => {
  const { db } = dependencies;
  const { leadId, namespace, data, correlationId } = event.payload;

  await db.leadExtension.upsert({
    where: { leadId_namespace: { leadId, namespace } },
    create: {
      id: crypto.randomUUID(),
      leadId,
      namespace,
      data: data as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
    update: {
      data: data as Prisma.InputJsonValue,
      updatedAt: new Date(),
    },
  });

  await audit(db, {
    actorService: namespace,
    eventType: event.type,
    entityType: "LeadExtension",
    entityId: leadId,
    leadId,
    payload: event.payload,
    correlationId,
    causationId: event.id,
  });

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    select: {
      category: true,
      lat: true,
      lng: true,
      description: true,
      channel: true,
      createdAt: true,
    },
  });

  if (!lead || lead.category !== "EVENT") return;

  const distanceKm = haversineDistanceKm(
    CROSS_SELL_EVENT_DISTANCE_RULE.referencePoint,
    { lat: lead.lat, lng: lead.lng },
  );

  if (distanceKm <= CROSS_SELL_EVENT_DISTANCE_RULE.thresholdKm) return;

  const existingRuleOpportunity = await db.crossSellOpportunity.findFirst({
    where: {
      leadId,
      targetService: "CAR",
      source: "RULE_ENGINE",
      ruleKey: CROSS_SELL_EVENT_DISTANCE_RULE.key,
    },
    select: { id: true },
  });

  if (existingRuleOpportunity) return;

  const roundedDistanceKm = Number(distanceKm.toFixed(1));
  await createAndPublishCrossSellOpportunity(dependencies, {
    leadId,
    leadCategory: lead.category,
    targetService: "CAR",
    source: "RULE_ENGINE",
    reason: `Wydarzenie oddalone o ${roundedDistanceKm} km od centrum operacyjnego.`,
    ruleKey: CROSS_SELL_EVENT_DISTANCE_RULE.key,
    context: {
      distanceKm: roundedDistanceKm,
      thresholdKm: CROSS_SELL_EVENT_DISTANCE_RULE.thresholdKm,
      referenceLocation: CROSS_SELL_EVENT_DISTANCE_RULE.referenceLabel,
    },
    snapshot: toCrossSellSnapshot(lead),
    correlationId,
    causationId: event.id,
  });
};

const handleOpportunityReported = async (
  dependencies: CoreDependencies,
  event: AppEvent<"event.opportunity.reported.v1">,
) => {
  const { db } = dependencies;
  const {
    leadId,
    sourceService,
    targetService,
    description,
    context,
    correlationId,
  } = event.payload;

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    select: {
      category: true,
      description: true,
      lat: true,
      lng: true,
      channel: true,
      createdAt: true,
    },
  });

  if (!lead) return;

  const opportunity = await createAndPublishCrossSellOpportunity(dependencies, {
    leadId,
    leadCategory: lead.category,
    targetService: LEAD_TARGET_TYPE[targetService],
    source: "SERVICE_REPORT",
    reason: description,
    context: context ?? undefined,
    snapshot: toCrossSellSnapshot(lead),
    correlationId,
    causationId: event.id,
  });

  await audit(db, {
    actorService: sourceService,
    eventType: event.type,
    entityType: "CrossSellOpportunity",
    entityId: opportunity.id,
    leadId,
    payload: event.payload,
    correlationId,
    causationId: event.id,
  });
};

const handleCrossSellDecision = async (
  dependencies: CoreDependencies,
  event: AppEvent<"service.cross_sell.decision.v1">,
) => {
  const { db } = dependencies;
  const {
    opportunityId,
    decision,
    decisionNote,
    correlationId,
    targetService,
  } = event.payload;

  await db.crossSellOpportunity.updateMany({
    where: { id: opportunityId },
    data: {
      status: decision,
      context: decisionNote ? { decisionNote } : undefined,
    },
  });

  await audit(db, {
    actorService: targetService,
    eventType: event.type,
    entityType: "CrossSellOpportunity",
    entityId: opportunityId,
    leadId: null,
    payload: event.payload,
    correlationId,
    causationId: event.id,
  });
};

export const registerCoreHandlers = (
  eventBus: AppEventBus,
  dependencies: CoreDependencies,
) => {
  eventBus.subscribe("event.lead.enriched.v1", (event) =>
    handleLeadEnriched(dependencies, event),
  );
  eventBus.subscribe("event.opportunity.reported.v1", (event) =>
    handleOpportunityReported(dependencies, event),
  );
  eventBus.subscribe("service.cross_sell.decision.v1", (event) =>
    handleCrossSellDecision(dependencies, event),
  );
};
