import { getDb } from "@/lib/db";
import {
  type PaginationParams,
  toPaginationMeta,
} from "@/features/shared/filters/lib/pagination";
import type { LeadChannel } from "@/constants/lead-channels";
import type { EventModuleStatus } from "../constants/module-status";

interface EventLeadsFilters {
  id?: string | null;
  channel?: LeadChannel | null;
  moduleStatus?: EventModuleStatus | null;
}

export const getEventLeads = async ({
  page,
  pageSize,
  id,
  channel,
  moduleStatus,
}: PaginationParams & EventLeadsFilters) => {
  const { event: db } = getDb();

  const where = {
    ...(id ? { leadId: { contains: id } } : {}),
    ...(channel ? { channel } : {}),
    ...(moduleStatus === "ENRICHED"
      ? { details: { isNot: null } }
      : moduleStatus === "TO_ENRICH"
        ? { details: { is: null } }
        : {}),
  };

  const totalItems = await db.eventLeadInbox.count({ where });
  const pagination = toPaginationMeta({
    page,
    pageSize,
    totalItems,
  });

  const leads = await db.eventLeadInbox.findMany({
    where,
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
    orderBy: { receivedAt: "desc" },
    select: {
      id: true,
      leadId: true,
      channel: true,
      status: true,
      description: true,
      lat: true,
      lng: true,
      receivedAt: true,
      updatedAt: true,
      details: {
        select: {
          eventDate: true,
          guestCount: true,
          budget: true,
          isOutdoor: true,
        },
      },
    },
  });

  return {
    leads,
    ...pagination,
  };
};

export type GetEventLeadsResult = Awaited<ReturnType<typeof getEventLeads>>;
