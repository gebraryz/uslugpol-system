"use server";

import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";
import { ROUTES } from "@/constants/routes";
import { getDb } from "@/lib/db";
import { getEventBus } from "@/lib/event-bus";
import { ActionError, actionClientWithAccess } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { reportOpportunitySchema } from "../schema/report-opportunity";
import type { AppEventMap } from "@uslugpol/shared/event-bus";
import type { CrossSellTargetService as EventModuleTargetService } from "@uslugpol/event-service/enums";

const TARGET_SERVICE_TO_CORE = {
  CAR: "car_service",
  CLEANING: "cleaning_service",
} as const satisfies Record<
  EventModuleTargetService,
  AppEventMap["event.opportunity.reported.v1"]["targetService"]
>;

export const reportOpportunityAction = actionClientWithAccess(["event"])
  .inputSchema(reportOpportunitySchema)
  .action(async ({ parsedInput }) => {
    const { event: db } = getDb();

    const lead = await db.eventLeadInbox.findUnique({
      where: { leadId: parsedInput.leadId },
      select: { leadId: true },
    });

    if (!lead) {
      throw new ActionError("Lead nie istnieje w obszarze wydarzeń", 404);
    }

    const correlationId = crypto.randomUUID();
    const reportedAt = new Date().toISOString();
    const targetService = TARGET_SERVICE_TO_CORE[parsedInput.targetService];

    const report = await db.opportunityReport.create({
      data: {
        leadId: parsedInput.leadId,
        targetService: parsedInput.targetService,
        description: parsedInput.description,
        sentToCore: false,
      },
      select: { id: true },
    });

    let sentToCore = false;
    try {
      const handledCount = await getEventBus().publish({
        id: crypto.randomUUID(),
        type: AUDIT_EVENT_TYPES.OPPORTUNITY_REPORTED,
        occurredAt: reportedAt,
        actorService: "event_service",
        aggregateId: parsedInput.leadId,
        correlationId,
        payload: {
          leadId: parsedInput.leadId,
          sourceService: "event_service",
          targetService,
          description: parsedInput.description,
          reportedAt,
          correlationId,
        },
      });

      sentToCore = handledCount > 0;
    } catch {
      sentToCore = false;
    }

    if (sentToCore) {
      await db.opportunityReport.update({
        where: { id: report.id },
        data: { sentToCore: true },
      });
    }

    revalidatePath(ROUTES.events.leadDetails(parsedInput.leadId));
    if (sentToCore) {
      revalidatePath(ROUTES.core.leadDetails(parsedInput.leadId));
    }

    return { leadId: parsedInput.leadId, sentToCore };
  });
