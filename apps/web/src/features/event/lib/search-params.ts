import { LEAD_CHANNELS } from "@/constants/lead/lead-channels";
import { pageParser } from "@/features/shared/filters/lib/search-params";
import { EVENT_MODULE_STATUS } from "../constants/event-module-status";
import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs/server";

export const eventLeadChannelParser = parseAsStringLiteral(LEAD_CHANNELS);
export const eventModuleStatusParser =
  parseAsStringLiteral(EVENT_MODULE_STATUS);
export const eventLeadIdParser = parseAsString;

export const loadEventLeadsFiltersSearchParams = createLoader({
  page: pageParser,
  id: eventLeadIdParser,
  channel: eventLeadChannelParser,
  moduleStatus: eventModuleStatusParser,
});
