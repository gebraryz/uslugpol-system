import { LEAD_CATEGORIES } from "@/constants/lead/lead-categories";
import { LEAD_CHANNELS } from "@/constants/lead/lead-channels";
import { LEAD_STATUS } from "@/constants/lead/lead-status";
import { pageParser } from "@/features/shared/filters/lib/search-params";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const coreLeadChannelParser = parseAsStringLiteral(LEAD_CHANNELS);
export const coreLeadCategoryParser = parseAsStringLiteral(LEAD_CATEGORIES);
export const coreLeadStatusParser = parseAsStringLiteral(LEAD_STATUS);
export const coreLeadIdParser = parseAsString;

export const loadCoreLeadsFiltersSearchParams = createLoader({
  page: pageParser,
  id: coreLeadIdParser,
  channel: coreLeadChannelParser,
  category: coreLeadCategoryParser,
  status: coreLeadStatusParser,
});
