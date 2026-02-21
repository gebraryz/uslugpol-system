import { getDb } from "@/lib/db";
import {
  type PaginationParams,
  toPaginationMeta,
} from "@/features/shared/filters/lib/pagination";
import type { CrossSellRuleKey } from "@/constants/cross-sell";

interface CarRecommendationsFilters {
  id?: string | null;
  ruleKey?: CrossSellRuleKey | null;
}

export const getCarRecommendations = async ({
  page,
  pageSize,
  id,
  ruleKey,
}: PaginationParams & CarRecommendationsFilters) => {
  const { car: db } = getDb();

  const where = {
    ...(ruleKey ? { ruleKey } : {}),
    ...(id
      ? {
          OR: [
            { leadId: { contains: id } },
            { opportunityId: { contains: id } },
          ],
        }
      : {}),
  };

  const totalItems = await db.crossSellInbox.count({ where });
  const pagination = toPaginationMeta({
    page,
    pageSize,
    totalItems,
  });

  const recommendations = await db.crossSellInbox.findMany({
    where,
    take: pagination.pageSize,
    skip: (pagination.page - 1) * pagination.pageSize,
    orderBy: { receivedAt: "desc" },
    select: {
      id: true,
      leadId: true,
      opportunityId: true,
      reason: true,
      ruleKey: true,
      context: true,
      receivedAt: true,
      status: true,
      decisionNote: true,
    },
  });

  return {
    recommendations,
    ...pagination,
  };
};

export type GetCarRecommendationsResult = Awaited<
  ReturnType<typeof getCarRecommendations>
>;
