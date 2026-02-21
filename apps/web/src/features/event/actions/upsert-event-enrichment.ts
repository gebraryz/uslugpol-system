"use server";

import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";
import { LEAD_CATEGORY_MODULES } from "@/constants/lead/lead-category-modules";
import { ROUTES } from "@/constants/routes";
import { getDb } from "@/lib/db";
import { getEventBus } from "@/lib/event-bus";
import { ActionError, actionClientWithAccess } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import crypto from "node:crypto";
import { upsertEventEnrichmentSchema } from "../schema/upsert-event-enrichment";

export const upsertEventEnrichmentAction = actionClientWithAccess(["event"])
  .inputSchema(upsertEventEnrichmentSchema)
  .action(async ({ parsedInput }) => {
    const { event: db } = getDb();
    const lead = await db.eventLeadInbox.findUnique({
      where: { leadId: parsedInput.leadId },
      select: { leadId: true },
    });

    if (!lead) {
      throw new ActionError("Lead nie istnieje w module wydarzeń", 404);
    }

    const eventDate = parsedInput.eventDate
      ? new Date(`${parsedInput.eventDate}T00:00:00.000Z`)
      : null;
    const guestCount = parsedInput.guestCount ?? null;
    const budget = parsedInput.budget ?? null;
    const isOutdoor = parsedInput.isOutdoor ?? null;

    const correlationId = crypto.randomUUID();
    const enrichedAt = new Date().toISOString();

    await db.eventDetails.upsert({
      where: { leadId: parsedInput.leadId },
      create: {
        id: crypto.randomUUID(),
        leadId: parsedInput.leadId,
        eventDate,
        guestCount,
        budget,
        isOutdoor,
        updatedAt: new Date(),
      },
      update: {
        eventDate,
        guestCount,
        budget,
        isOutdoor,
        updatedAt: new Date(),
      },
    });

    let sentToCore = false;
    try {
      const handledCount = await getEventBus().publish({
        id: crypto.randomUUID(),
        type: AUDIT_EVENT_TYPES.LEAD_ENRICHED,
        occurredAt: enrichedAt,
        actorService: LEAD_CATEGORY_MODULES.EVENT.assignedService,
        aggregateId: parsedInput.leadId,
        correlationId,
        payload: {
          leadId: parsedInput.leadId,
          namespace: LEAD_CATEGORY_MODULES.EVENT.assignedService,
          data: {
            eventDate: eventDate ? eventDate.toISOString() : null,
            guestCount,
            budget,
            isOutdoor,
          },
          enrichedAt,
          correlationId,
        },
      });
      sentToCore = handledCount > 0;
    } catch {
      sentToCore = false;
    }

    revalidatePath(ROUTES.events.leads);
    revalidatePath(ROUTES.events.leadDetails(parsedInput.leadId));
    if (sentToCore) {
      revalidatePath(ROUTES.core.leadDetails(parsedInput.leadId));
    }

    return { leadId: parsedInput.leadId, sentToCore };
  });
