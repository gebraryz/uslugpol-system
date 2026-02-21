import { CROSS_SELL_RULE_KEYS } from "@/constants/cross-sell";
import { pageParser } from "@/features/shared/filters/lib/search-params";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const carRuleKeyParser = parseAsStringLiteral(CROSS_SELL_RULE_KEYS);
export const carLeadIdParser = parseAsString;

export const loadCarRecommendationsFiltersSearchParams = createLoader({
  page: pageParser,
  id: carLeadIdParser,
  ruleKey: carRuleKeyParser,
});
