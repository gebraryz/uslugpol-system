"use client";

import { LEAD_CHANNELS, LEAD_CHANNELS_LABELS } from "@/constants/lead-channels";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import { toQueryOptionsStructure } from "@/features/shared/filters/lib/query-select";
import {
  EVENT_MODULE_STATUS,
  EVENT_MODULE_STATUS_LABELS,
} from "../constants/module-status";

const FILTER_ITEMS = [
  {
    queryKey: "channel",
    label: "Kanał",
    options: toQueryOptionsStructure(LEAD_CHANNELS, LEAD_CHANNELS_LABELS),
  },
  {
    queryKey: "moduleStatus",
    label: "Status modułu",
    options: toQueryOptionsStructure(EVENT_MODULE_STATUS, EVENT_MODULE_STATUS_LABELS),
  },
];

export const EventLeadsFilters = () => (
  <div className="flex flex-wrap gap-3">
    <QuerySearchInput
      queryKey="id"
      label="ID leada"
      placeholder="np. 81763ada..."
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
