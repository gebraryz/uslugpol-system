import {
  CrossSellDecisionStatus as CrossSellDecisionStatusEnum,
  type CrossSellDecisionStatus,
} from "@uslugpol/car-service/enums";
import z from "zod";

const CAR_CROSS_SELL_DECISIONS = [
  CrossSellDecisionStatusEnum.ACCEPTED,
  CrossSellDecisionStatusEnum.DECLINED,
] as [CrossSellDecisionStatus, CrossSellDecisionStatus];

export const decideCarRecommendationSchema = z.object({
  recommendationId: z.string().min(1, "Brak ID rekomendacji"),
  decision: z.enum(CAR_CROSS_SELL_DECISIONS),
});
