"use client";

import {
  LEAD_CHANNELS,
  LEAD_CHANNELS_LABELS,
} from "@/constants/lead/lead-channels";
import { LEAD_STATUS, LEAD_STATUS_LABELS } from "@/constants/lead/lead-status";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import { toQueryOptionsStructure } from "@/features/shared/filters/lib/utils";

const FILTER_ITEMS = [
  {
    queryKey: "leadChannel",
    label: "Kanał",
    options: toQueryOptionsStructure(LEAD_CHANNELS, LEAD_CHANNELS_LABELS),
  },
  {
    queryKey: "leadStatus",
    label: "Status",
    options: toQueryOptionsStructure(LEAD_STATUS, LEAD_STATUS_LABELS),
  },
];

export const CarLeadsTableFilters = () => (
  <div className="flex w-full flex-col gap-3 md:flex-row md:flex-wrap">
    <QuerySearchInput
      queryKey="leadId"
      label="ID leada"
      placeholder="np. 81763ada..."
      resetKeys={["leadChannel", "leadStatus"]}
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
