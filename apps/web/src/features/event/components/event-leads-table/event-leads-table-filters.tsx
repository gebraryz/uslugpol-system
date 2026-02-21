"use client";

import {
  LEAD_CHANNELS,
  LEAD_CHANNELS_LABELS,
} from "@/constants/lead/lead-channels";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import {
  EVENT_MODULE_STATUS,
  EVENT_MODULE_STATUS_LABELS,
} from "../../constants/event-module-status";
import { toQueryOptionsStructure } from "@/features/shared/filters/lib/utils";

const FILTER_ITEMS = [
  {
    queryKey: "channel",
    label: "Kanał",
    options: toQueryOptionsStructure(LEAD_CHANNELS, LEAD_CHANNELS_LABELS),
  },
  {
    queryKey: "moduleStatus",
    label: "Status modułu",
    options: toQueryOptionsStructure(
      EVENT_MODULE_STATUS,
      EVENT_MODULE_STATUS_LABELS,
    ),
  },
];

export const EventLeadsTableFilters = () => (
  <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap">
    <QuerySearchInput
      queryKey="id"
      label="ID leada"
      placeholder="np. 81763ada..."
      resetKeys={["channel", "moduleStatus"]}
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
