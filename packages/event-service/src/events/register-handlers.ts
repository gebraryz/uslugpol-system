import type { AppEventMap, EventBus } from "@uslugpol/shared/event-bus";
import crypto from "node:crypto";
import { PrismaClient } from "../../generated/prisma/client";

export const registerEventServiceHandlers = (
  eventBus: EventBus<AppEventMap>,
  { db }: { db: PrismaClient },
) => {
  eventBus.subscribe("core.lead.assigned.v1", async (event) => {
    const payload = event.payload;

    if (payload.category !== "EVENT") return;

    await db.eventLeadInbox.upsert({
      where: { leadId: payload.leadId },
      create: {
        id: crypto.randomUUID(),
        leadId: payload.leadId,
        channel: payload.channel,
        status: payload.status,
        description: payload.description,
        lat: payload.lat,
        lng: payload.lng,
        updatedAt: new Date(),
      },
      update: {
        channel: payload.channel,
        status: payload.status,
        description: payload.description,
        lat: payload.lat,
        lng: payload.lng,
        updatedAt: new Date(),
      },
    });
  });

  eventBus.subscribe("core.lead.status.changed.v1", async (event) => {
    const { leadId, to } = event.payload;

    await db.eventLeadInbox.updateMany({
      where: { leadId },
      data: { status: to },
    });
  });

  eventBus.subscribe("core.crosssell.proposed.v1", async (event) => {
    const { payload } = event;

    if (payload.leadCategory !== "EVENT") return;

    const targetService =
      payload.targetService === "car_service" ? "CAR" : "CLEANING";

    await db.crossSellProposalInbox.upsert({
      where: { opportunityId: payload.opportunityId },
      create: {
        id: crypto.randomUUID(),
        leadId: payload.leadId,
        opportunityId: payload.opportunityId,
        targetService,
        reason: payload.reason,
        ruleKey: payload.ruleKey ?? null,
      },
      update: {
        reason: payload.reason,
        ruleKey: payload.ruleKey ?? null,
      },
    });
  });
};
