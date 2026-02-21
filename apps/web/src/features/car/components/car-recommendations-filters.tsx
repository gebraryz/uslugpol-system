"use client";

import { CROSS_SELL_RULE_KEYS } from "@/constants/cross-sell";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import { toCrossSellRuleLabel } from "@/lib/utils";

const FILTER_ITEMS = [
  {
    queryKey: "ruleKey",
    label: "Reguła",
    options: CROSS_SELL_RULE_KEYS.map((value) => ({
      value,
      label: toCrossSellRuleLabel(value),
    })),
  },
];

export const CarRecommendationsFilters = () => (
  <div className="flex flex-wrap gap-3">
    <QuerySearchInput
      queryKey="id"
      label="ID leada/opcji"
      placeholder="np. 81763ada..."
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
