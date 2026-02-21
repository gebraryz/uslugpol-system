import { getDb } from "@/lib/db";
import type { LeadCategory } from "@/constants/lead-categories";
import type { LeadChannel } from "@/constants/lead-channels";
import type { LeadStatus } from "@/constants/lead-status";
import {
  type PaginationParams,
  toPaginationMeta,
} from "@/features/shared/filters/lib/pagination";

interface CoreLeadsFilters {
  id?: string | null;
  channel?: LeadChannel | null;
  category?: LeadCategory | null;
  status?: LeadStatus | null;
}

export const getLeads = async ({
  page,
  pageSize,
  id,
  channel,
  category,
  status,
}: PaginationParams & CoreLeadsFilters) => {
  const { core: db } = getDb();

  const where = {
    ...(id ? { id: { contains: id } } : {}),
    ...(channel ? { channel } : {}),
    ...(category ? { category } : {}),
    ...(status ? { status } : {}),
  };

  const totalItems = await db.lead.count({ where });
  const pagination = toPaginationMeta({
    page,
    pageSize,
    totalItems,
  });

  const leads = await db.lead.findMany({
    where,
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
    orderBy: { createdAt: "desc" },
  });

  return {
    leads,
    ...pagination,
  };
};

export type GetLeadsResult = Awaited<ReturnType<typeof getLeads>>;
