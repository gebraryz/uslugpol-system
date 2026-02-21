import type { LeadChannel } from "@/constants/lead/lead-channels";
import type { LeadStatus } from "@/constants/lead/lead-status";
import type { PaginationParams } from "@/features/shared/filters/types/pagination";
import { toPaginationMeta } from "@/features/shared/filters/lib/utils";
import { requireAccessContext } from "@/lib/access-context";
import { getDb } from "@/lib/db";
import type { Prisma as CarPrisma } from "@uslugpol/car-service";

interface CarLeadsFilters {
  leadId?: string | null;
  leadChannel?: LeadChannel | null;
  leadStatus?: LeadStatus | null;
}

export const getCarLeads = async ({
  page,
  pageSize,
  leadId,
  leadChannel,
  leadStatus,
}: PaginationParams & CarLeadsFilters) => {
  await requireAccessContext(["car"]);

  const { car: db } = getDb();

  const where: CarPrisma.CarLeadInboxWhereInput = {
    ...(leadId ? { leadId: { contains: leadId } } : {}),
    ...(leadChannel ? { channel: leadChannel } : {}),
    ...(leadStatus ? { status: leadStatus } : {}),
  };

  const totalItems = await db.carLeadInbox.count({ where });
  const pagination = toPaginationMeta({ page, pageSize, totalItems });

  const leads = await db.carLeadInbox.findMany({
    where,
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
    orderBy: { receivedAt: "desc" },
    select: {
      leadId: true,
      channel: true,
      status: true,
      description: true,
      lat: true,
      lng: true,
      receivedAt: true,
    },
  });

  return { leads, ...pagination };
};

export type CarLeadsResult = Awaited<ReturnType<typeof getCarLeads>>;
export type CarLead = CarLeadsResult["leads"][number];
