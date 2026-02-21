"use server";

import { actionClient } from "@/lib/safe-action";
import { createLeadSchema } from "../schema/create-lead";
import { getDb } from "@/lib/db";
import { getEventBus } from "@/lib/event-bus";
import { LeadStatus } from "@uslugpol/core/enums";
import crypto from "node:crypto";
import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";
import { LEAD_CATEGORY_MODULES } from "@/constants/lead-category-modules";

export const createLeadAction = actionClient
  .inputSchema(createLeadSchema)
  .action(async ({ parsedInput }) => {
    const { core: db } = getDb();
    const correlationId = crypto.randomUUID();

    const lead = await db.$transaction(async (transaction) => {
      const assignedService =
        LEAD_CATEGORY_MODULES[parsedInput.category].assignedService;
      const createdLead = await transaction.lead.create({
        data: {
          channel: parsedInput.channel,
          category: parsedInput.category,
          status: LeadStatus.NEW,
          description: parsedInput.description,
          lat: parsedInput.lat,
          lng: parsedInput.lng,
        },
        select: {
          id: true,
          channel: true,
          category: true,
          status: true,
          description: true,
          lat: true,
          lng: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await transaction.auditLog.create({
        data: {
          actorService: "core",
          eventType: AUDIT_EVENT_TYPES.LEAD_CREATED,
          entityType: "Lead",
          entityId: createdLead.id,
          leadId: createdLead.id,
          correlationId,
          payload: {
            leadId: createdLead.id,
            category: createdLead.category,
            channel: createdLead.channel,
            status: createdLead.status,
            description: createdLead.description,
            location: { lat: createdLead.lat, lng: createdLead.lng },
            createdAt: createdLead.createdAt.toISOString(),
          },
        },
      });

      await transaction.auditLog.create({
        data: {
          actorService: "core",
          eventType: AUDIT_EVENT_TYPES.LEAD_ASSIGNED,
          entityType: "Lead",
          entityId: createdLead.id,
          leadId: createdLead.id,
          correlationId,
          payload: {
            leadId: createdLead.id,
            assignedService,
            category: createdLead.category,
          },
        },
      });

      return createdLead;
    });

    const leadSnapshot = {
      id: lead.id,
      category: lead.category,
      status: lead.status,
      channel: lead.channel,
      description: lead.description,
      location: { lat: lead.lat, lng: lead.lng },
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    } as const;

    try {
      await getEventBus().publish({
        id: crypto.randomUUID(),
        type: AUDIT_EVENT_TYPES.LEAD_CREATED,
        occurredAt: new Date().toISOString(),
        actorService: "core",
        aggregateId: lead.id,
        correlationId,
        payload: {
          lead: leadSnapshot,
          correlationId,
        },
      });
    } catch (error) {
      console.error("Lead created, but created-event dispatch failed", {
        leadId: lead.id,
        correlationId,
        error,
      });
    }

    let dispatchedToModule = false;
    const assignedService =
      LEAD_CATEGORY_MODULES[lead.category].assignedService;

    try {
      const handledCount = await getEventBus().publish({
        id: crypto.randomUUID(),
        type: AUDIT_EVENT_TYPES.LEAD_ASSIGNED,
        occurredAt: new Date().toISOString(),
        actorService: "core",
        aggregateId: lead.id,
        correlationId,
        payload: {
          leadId: lead.id,
          category: lead.category,
          status: lead.status,
          channel: lead.channel,
          description: lead.description,
          lat: lead.lat,
          lng: lead.lng,
          createdAt: lead.createdAt.toISOString(),
          updatedAt: lead.updatedAt.toISOString(),
          assignedService,
          correlationId,
        },
      });
      dispatchedToModule = handledCount > 0;
    } catch (error) {
      console.error("Lead created, but dispatch failed", {
        leadId: lead.id,
        correlationId,
        error,
      });
      dispatchedToModule = false;
    }

    return { leadId: lead.id, dispatchedToModule };
  });
