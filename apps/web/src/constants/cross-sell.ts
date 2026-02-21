import {
  CrossSellOpportunityStatus as CrossSellOpportunityStatusEnum,
  type CrossSellOpportunityStatus,
} from "@uslugpol/core/enums";

export type CrossSellStatus = CrossSellOpportunityStatus;

export const CROSS_SELL_STATUSES = Object.values(
  CrossSellOpportunityStatusEnum,
) as [CrossSellStatus, ...CrossSellStatus[]];

export const CROSS_SELL_STATUS_LABELS = {
  PENDING: "Propozycja",
  ACCEPTED: "Zaakceptowana",
  DECLINED: "Odrzucona",
} as const satisfies Record<CrossSellOpportunityStatus, string>;

export const CROSS_SELL_RULE_LABELS = {
  event_distance_over_50km: "Wydarzenie powyżej 50 km od centrum",
  event_distance_gt_50km: "Wydarzenie powyżej 50 km od centrum",
} as const;

export type CrossSellRuleKey = keyof typeof CROSS_SELL_RULE_LABELS;

export const CROSS_SELL_RULE_KEYS = Object.keys(CROSS_SELL_RULE_LABELS) as [
  CrossSellRuleKey,
  ...CrossSellRuleKey[],
];
