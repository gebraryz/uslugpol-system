"use client";

import {
  CROSS_SELL_RULE_KEYS,
  CROSS_SELL_STATUSES,
  CROSS_SELL_STATUS_LABELS,
} from "@/constants/cross-sell";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import { toQueryOptionsStructure } from "@/features/shared/filters/lib/utils";
import { toCrossSellRuleLabel } from "@/lib/utils";
import {
  CAR_RECOMMENDATION_REVIEW_STATES,
  CAR_RECOMMENDATION_REVIEW_STATE_LABELS,
} from "../constants/recommendation-review-state";

const FILTER_ITEMS = [
  {
    queryKey: "ruleKey",
    label: "Reguła",
    options: CROSS_SELL_RULE_KEYS.map((value) => ({
      value,
      label: toCrossSellRuleLabel(value),
    })),
  },
  {
    queryKey: "status",
    label: "Status",
    options: toQueryOptionsStructure(CROSS_SELL_STATUSES, CROSS_SELL_STATUS_LABELS),
  },
  {
    queryKey: "reviewState",
    label: "Rozpatrzenie",
    options: toQueryOptionsStructure(
      CAR_RECOMMENDATION_REVIEW_STATES,
      CAR_RECOMMENDATION_REVIEW_STATE_LABELS,
    ),
  },
];

export const CarRecommendationsFilters = () => (
  <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap">
    <QuerySearchInput
      queryKey="id"
      label="ID leada/opcji"
      placeholder="np. 81763ada..."
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
