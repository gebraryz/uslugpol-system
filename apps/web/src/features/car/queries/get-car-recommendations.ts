import { getDb } from "@/lib/db";
import type { CrossSellRuleKey, CrossSellStatus } from "@/constants/cross-sell";
import { PaginationParams } from "@/features/shared/filters/types/pagination";
import { toPaginationMeta } from "@/features/shared/filters/lib/utils";
import type { CarRecommendationReviewState } from "../constants/recommendation-review-state";
import type { Prisma as CarPrisma } from "@uslugpol/car-service";
import { CrossSellDecisionStatus } from "@uslugpol/car-service/enums";

interface CarRecommendationsFilters {
  id?: string | null;
  ruleKey?: CrossSellRuleKey | null;
  status?: CrossSellStatus | null;
  reviewState?: CarRecommendationReviewState | null;
}

const REVIEWED_STATUSES: CrossSellStatus[] = [
  CrossSellDecisionStatus.ACCEPTED,
  CrossSellDecisionStatus.DECLINED,
];

export const getCarRecommendations = async ({
  page,
  pageSize,
  id,
  ruleKey,
  status,
  reviewState,
}: PaginationParams & CarRecommendationsFilters) => {
  const { car: db } = getDb();

  if (
    reviewState === "UNREVIEWED" &&
    status &&
    status !== CrossSellDecisionStatus.PENDING
  ) {
    return {
      recommendations: [],
      ...toPaginationMeta({ page, pageSize, totalItems: 0 }),
    };
  }

  if (reviewState === "REVIEWED" && status === CrossSellDecisionStatus.PENDING) {
    return {
      recommendations: [],
      ...toPaginationMeta({ page, pageSize, totalItems: 0 }),
    };
  }

  const statusFilter =
    reviewState === "UNREVIEWED"
      ? CrossSellDecisionStatus.PENDING
      : reviewState === "REVIEWED"
        ? status ?? { in: REVIEWED_STATUSES }
        : status;

  const where: CarPrisma.CrossSellInboxWhereInput = {
    ...(ruleKey ? { ruleKey } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
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
  const pagination = toPaginationMeta({ page, pageSize, totalItems });

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

export type CarRecommendationsResult = Awaited<
  ReturnType<typeof getCarRecommendations>
>;
export type CarRecommendation =
  CarRecommendationsResult["recommendations"][number];
