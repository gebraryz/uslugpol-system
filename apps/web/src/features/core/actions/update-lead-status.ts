"use server";

import { ActionError, actionClient } from "@/lib/safe-action";
import { getDb } from "@/lib/db";
import { updateLeadStatusSchema } from "../schema/update-lead-status";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/routes";
import { LEAD_NEXT_STATUS } from "@/constants/lead-status";
import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";

export const updateLeadStatusAction = actionClient
  .inputSchema(updateLeadStatusSchema)
  .action(async ({ parsedInput }) => {
    const { core: db } = getDb();
    const lead = await db.lead.findUnique({
      where: { id: parsedInput.leadId },
      select: { id: true, status: true },
    });

    if (!lead) {
      throw new ActionError("Lead nie istnieje", 404);
    }

    const allowedNext = LEAD_NEXT_STATUS[lead.status];
    if (!allowedNext || allowedNext !== parsedInput.status) {
      throw new ActionError("Nieprawidłowa zmiana statusu", 400);
    }

    await db.$transaction(async (transaction) => {
      await transaction.lead.update({
        where: { id: parsedInput.leadId },
        data: { status: parsedInput.status },
      });

      await transaction.auditLog.create({
        data: {
          actorService: "core",
          eventType: AUDIT_EVENT_TYPES.LEAD_STATUS_CHANGED,
          entityType: "Lead",
          entityId: parsedInput.leadId,
          leadId: parsedInput.leadId,
          payload: {
            from: lead.status,
            to: parsedInput.status,
          },
        },
      });
    });

    revalidatePath(`${ROUTES.core.leads}/${parsedInput.leadId}`);
    revalidatePath(ROUTES.core.leads);

    return { leadId: parsedInput.leadId, status: parsedInput.status };
  });
