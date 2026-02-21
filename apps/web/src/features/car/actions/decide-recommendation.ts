"use server";

import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";
import { ROUTES } from "@/constants/routes";
import { getDb } from "@/lib/db";
import { getEventBus } from "@/lib/event-bus";
import { ActionError, actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { decideCarRecommendationSchema } from "../schema/decide-recommendation";

export const decideCarRecommendationAction = actionClient
  .inputSchema(decideCarRecommendationSchema)
  .action(async ({ parsedInput }) => {
    const { car: db } = getDb();

    const recommendation = await db.crossSellInbox.findUnique({
      where: { id: parsedInput.recommendationId },
      select: {
        id: true,
        leadId: true,
        opportunityId: true,
        status: true,
      },
    });

    if (!recommendation) {
      throw new ActionError("Rekomendacja nie istnieje", 404);
    }

    if (recommendation.status !== "PENDING") {
      return {
        recommendationId: recommendation.id,
        sentToCore: false,
        alreadyDecided: true,
      };
    }

    await db.crossSellInbox.update({
      where: { id: recommendation.id },
      data: {
        status: parsedInput.decision,
      },
    });

    const correlationId = crypto.randomUUID();
    const decidedAt = new Date().toISOString();
    let sentToCore = false;

    if (recommendation.opportunityId) {
      try {
        const handledCount = await getEventBus().publish({
          id: crypto.randomUUID(),
          type: AUDIT_EVENT_TYPES.CROSS_SELL_DECISION,
          occurredAt: decidedAt,
          actorService: "car_service",
          aggregateId: recommendation.leadId,
          correlationId,
          payload: {
            opportunityId: recommendation.opportunityId,
            targetService: "car_service",
            decision: parsedInput.decision,
            decidedAt,
            correlationId,
          },
        });

        sentToCore = handledCount > 0;
      } catch {
        sentToCore = false;
      }
    }

    revalidatePath(ROUTES.vehicles.rental);
    revalidatePath(ROUTES.core.leadDetails(recommendation.leadId));

    return {
      recommendationId: recommendation.id,
      sentToCore,
      alreadyDecided: false,
    };
  });
