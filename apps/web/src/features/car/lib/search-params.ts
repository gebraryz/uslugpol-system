import {
  CROSS_SELL_RULE_KEYS,
  CROSS_SELL_STATUSES,
} from "@/constants/cross-sell";
import { LEAD_CHANNELS } from "@/constants/lead/lead-channels";
import { LEAD_STATUS } from "@/constants/lead/lead-status";
import { pageParser } from "@/features/shared/filters/lib/search-params";
import { CAR_RECOMMENDATION_REVIEW_STATES } from "../constants/recommendation-review-state";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const carRuleKeyParser = parseAsStringLiteral(CROSS_SELL_RULE_KEYS);
export const carLeadIdParser = parseAsString;
export const carStatusParser = parseAsStringLiteral(CROSS_SELL_STATUSES);
export const carReviewStateParser = parseAsStringLiteral(
  CAR_RECOMMENDATION_REVIEW_STATES,
);
export const carLeadChannelParser = parseAsStringLiteral(LEAD_CHANNELS);
export const carLeadStatusParser = parseAsStringLiteral(LEAD_STATUS);

export const loadCarRecommendationsTableFiltersSearchParams = createLoader({
  page: pageParser,
  id: carLeadIdParser,
  ruleKey: carRuleKeyParser,
  status: carStatusParser,
  reviewState: carReviewStateParser,
});

export const loadCarLeadsFiltersSearchParams = createLoader({
  page: pageParser,
  leadId: parseAsString,
  leadChannel: carLeadChannelParser,
  leadStatus: carLeadStatusParser,
});
