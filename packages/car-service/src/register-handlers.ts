import { Prisma, PrismaClient } from "../generated/prisma/client";
import type { AppEventMap, EventBus } from "@uslugpol/shared/event-bus";
import crypto from "node:crypto";

export const registerCarServiceHandlers = (
  eventBus: EventBus<AppEventMap>,
  { db }: { db: PrismaClient },
) => {
  eventBus.subscribe("core.lead.assigned.v1", async (event) => {
    const payload = event.payload;

    if (payload.category !== "CAR") return;

    await db.carLeadInbox.upsert({
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

    await db.carLeadInbox.updateMany({
      where: { leadId },
      data: { status: to },
    });
  });

  eventBus.subscribe("core.crosssell.proposed.v1", async (event) => {
    const { payload } = event;
    if (payload.targetService !== "car_service") return;

    const context = {
      ...(payload.context ?? {}),
      snapshot: payload.snapshot,
    } as Prisma.InputJsonValue;

    await db.crossSellInbox.upsert({
      where: { opportunityId: payload.opportunityId },
      create: {
        id: crypto.randomUUID(),
        leadId: payload.leadId,
        opportunityId: payload.opportunityId,
        reason: payload.reason,
        ruleKey: payload.ruleKey ?? null,
        context,
      },
      update: {
        reason: payload.reason,
        ruleKey: payload.ruleKey ?? null,
        context,
      },
    });
  });
};
