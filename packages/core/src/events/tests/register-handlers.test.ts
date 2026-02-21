import type {
  AppEventMap,
  EventBus,
  EventEnvelope,
} from "@uslugpol/shared/event-bus";
import {
  CrossSellOpportunityStatus,
  CrossSellSource,
  LeadChannel,
  LeadStatus,
  LeadType,
} from "../../../generated/prisma/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerCoreHandlers } from "../register-handlers";

type AppEventType = keyof AppEventMap & string;
type AppEnvelope = EventEnvelope<AppEventType, AppEventMap[AppEventType]>;
type AppHandler = (event: AppEnvelope) => Promise<void> | void;

const createEventBusHarness = () => {
  const handlers = new Map<AppEventType, AppHandler>();
  const published: AppEnvelope[] = [];

  const eventBus: EventBus<AppEventMap> = {
    publish: vi.fn(async (event: AppEnvelope) => {
      published.push(event);
      return 0;
    }),
    subscribe: vi.fn((type: AppEventType, handler: AppHandler) => {
      handlers.set(type, handler);
      return () => {
        handlers.delete(type);
      };
    }),
  };

  const getHandler = <Key extends AppEventType>(type: Key) => {
    const handler = handlers.get(type);

    if (!handler) {
      throw new Error(`Missing handler for ${type}`);
    }

    return handler as (
      event: EventEnvelope<Key, AppEventMap[Key]>,
    ) => Promise<void> | void;
  };

  return { eventBus, published, getHandler };
};

const createCoreDbMock = () =>
  ({
    auditLog: { findFirst: vi.fn(), create: vi.fn() },
    leadExtension: { upsert: vi.fn() },
    lead: { findUnique: vi.fn() },
    crossSellOpportunity: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  }) as const;

const triggerLeadCreated = async (
  trigger: (
    event: EventEnvelope<
      "core.lead.created.v1",
      AppEventMap["core.lead.created.v1"]
    >,
  ) => Promise<void> | void,
  category: LeadType,
  location: { lat: number; lng: number } = { lat: 53.4506, lng: 18.7521 },
) =>
  trigger({
    id: "evt-lead-created",
    type: "core.lead.created.v1",
    occurredAt: "2026-02-21T12:00:00.000Z",
    actorService: "core",
    aggregateId: "lead-1",
    payload: {
      lead: {
        id: "lead-1",
        category,
        status: LeadStatus.NEW,
        channel: LeadChannel.EMAIL,
        description: "Event outside the city",
        location,
        createdAt: "2026-02-21T10:00:00.000Z",
        updatedAt: "2026-02-21T10:00:00.000Z",
      },
      correlationId: "corr-1",
    },
  });

afterEach(() => {
  vi.clearAllMocks();
});

describe("registerCoreHandlers", () => {
  it("creates and publishes cross-sell proposal for distant EVENT lead", async () => {
    const db = createCoreDbMock();
    const harness = createEventBusHarness();

    db.auditLog.findFirst.mockResolvedValue(null);
    db.crossSellOpportunity.findFirst.mockResolvedValue(null);
    db.crossSellOpportunity.upsert.mockResolvedValue({ id: "opp-1" });
    db.auditLog.create.mockResolvedValue({});

    registerCoreHandlers(harness.eventBus, {
      db: db as never,
      eventBus: harness.eventBus,
    });

    await triggerLeadCreated(
      harness.getHandler("core.lead.created.v1"),
      LeadType.EVENT,
    );

    expect(db.crossSellOpportunity.upsert).toHaveBeenCalledTimes(1);

    const proposalEvents = harness.published.filter(
      (event) => event.type === "core.crosssell.proposed.v1",
    );
    expect(proposalEvents).toHaveLength(1);
    expect(proposalEvents[0]?.payload).toMatchObject({
      leadId: "lead-1",
      targetService: "car_service",
      ruleKey: "event_distance_over_50km",
      source: CrossSellSource.RULE_ENGINE,
    });
  });

  it("does not create cross-sell for non-event lead", async () => {
    const db = createCoreDbMock();
    const harness = createEventBusHarness();

    registerCoreHandlers(harness.eventBus, {
      db: db as never,
      eventBus: harness.eventBus,
    });

    await triggerLeadCreated(
      harness.getHandler("core.lead.created.v1"),
      LeadType.CAR,
    );

    expect(db.crossSellOpportunity.findFirst).not.toHaveBeenCalled();
    expect(db.crossSellOpportunity.upsert).not.toHaveBeenCalled();
    expect(
      harness.published.some(
        (event) => event.type === "core.crosssell.proposed.v1",
      ),
    ).toBe(false);
  });

  it("does not create cross-sell when EVENT lead is within 50 km", async () => {
    const db = createCoreDbMock();
    const harness = createEventBusHarness();

    registerCoreHandlers(harness.eventBus, {
      db: db as never,
      eventBus: harness.eventBus,
    });

    await triggerLeadCreated(
      harness.getHandler("core.lead.created.v1"),
      LeadType.EVENT,
      { lat: 52.2297, lng: 21.0122 },
    );

    expect(db.crossSellOpportunity.findFirst).not.toHaveBeenCalled();
    expect(db.crossSellOpportunity.upsert).not.toHaveBeenCalled();
    expect(
      harness.published.some(
        (event) => event.type === "core.crosssell.proposed.v1",
      ),
    ).toBe(false);
  });

  it("does not publish status changed event when decision does not change status", async () => {
    const db = createCoreDbMock();
    const harness = createEventBusHarness();

    db.crossSellOpportunity.findUnique.mockResolvedValue({
      id: "opp-1",
      leadId: "lead-1",
      status: CrossSellOpportunityStatus.ACCEPTED,
    });
    db.crossSellOpportunity.update.mockResolvedValue({});
    db.auditLog.create.mockResolvedValue({});

    registerCoreHandlers(harness.eventBus, {
      db: db as never,
      eventBus: harness.eventBus,
    });

    await harness.getHandler("service.cross_sell.decision.v1")({
      id: "evt-decision-1",
      type: "service.cross_sell.decision.v1",
      occurredAt: "2026-02-21T12:05:00.000Z",
      actorService: "car_service",
      aggregateId: "lead-1",
      payload: {
        opportunityId: "opp-1",
        targetService: "car_service",
        decision: CrossSellOpportunityStatus.ACCEPTED,
        decidedAt: "2026-02-21T12:05:00.000Z",
      },
    });

    expect(db.crossSellOpportunity.update).toHaveBeenCalledTimes(1);
    expect(
      harness.published.some(
        (event) => event.type === "core.cross_sell.status_changed.v1",
      ),
    ).toBe(false);
  });

  it("publishes status changed event when decision changes status", async () => {
    const db = createCoreDbMock();
    const harness = createEventBusHarness();

    db.crossSellOpportunity.findUnique.mockResolvedValue({
      id: "opp-1",
      leadId: "lead-1",
      status: CrossSellOpportunityStatus.PENDING,
    });
    db.crossSellOpportunity.update.mockResolvedValue({});
    db.auditLog.create.mockResolvedValue({});

    registerCoreHandlers(harness.eventBus, {
      db: db as never,
      eventBus: harness.eventBus,
    });

    await harness.getHandler("service.cross_sell.decision.v1")({
      id: "evt-decision-2",
      type: "service.cross_sell.decision.v1",
      occurredAt: "2026-02-21T12:06:00.000Z",
      actorService: "car_service",
      aggregateId: "lead-1",
      payload: {
        opportunityId: "opp-1",
        targetService: "car_service",
        decision: CrossSellOpportunityStatus.ACCEPTED,
        decidedAt: "2026-02-21T12:06:00.000Z",
      },
    });

    const statusChangedEvents = harness.published.filter(
      (event) => event.type === "core.cross_sell.status_changed.v1",
    );

    expect(statusChangedEvents).toHaveLength(1);
    expect(statusChangedEvents[0]?.payload).toMatchObject({
      opportunityId: "opp-1",
      leadId: "lead-1",
      from: CrossSellOpportunityStatus.PENDING,
      to: CrossSellOpportunityStatus.ACCEPTED,
    });
  });
});
