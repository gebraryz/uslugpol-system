import { getDb } from "@/lib/db";
import type { LeadCategory } from "@/constants/lead/lead-categories";
import type { LeadChannel } from "@/constants/lead/lead-channels";
import type { LeadStatus } from "@/constants/lead/lead-status";
import { PaginationParams } from "@/features/shared/filters/types/pagination";
import { toPaginationMeta } from "@/features/shared/filters/lib/utils";
import type { Prisma as CorePrisma } from "@uslugpol/core";
import { ACCESS_CONTEXT_LEAD_CATEGORY } from "@/constants/access-context";
import { getAccessContext } from "@/lib/access-context";
import { isNonCoreAccessContext } from "@/lib/utils";

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
  const accessContext = await getAccessContext();
  const scopedCategory = isNonCoreAccessContext(accessContext)
    ? ACCESS_CONTEXT_LEAD_CATEGORY[accessContext]
    : null;

  const where: CorePrisma.LeadWhereInput = {
    ...(scopedCategory ? { category: scopedCategory } : {}),
    ...(id ? { id: { contains: id } } : {}),
    ...(channel ? { channel } : {}),
    ...(category && !scopedCategory ? { category } : {}),
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

  return { leads, ...pagination };
};

export type GetLeadsResult = Awaited<ReturnType<typeof getLeads>>;
