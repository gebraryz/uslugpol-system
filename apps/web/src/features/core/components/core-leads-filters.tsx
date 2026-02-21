"use client";

import {
  LEAD_CATEGORIES,
  LEAD_CATEGORIES_LABELS,
} from "@/constants/lead-categories";
import { LEAD_CHANNELS, LEAD_CHANNELS_LABELS } from "@/constants/lead-channels";
import { LEAD_STATUS, LEAD_STATUS_LABELS } from "@/constants/lead-status";
import { QuerySearchInput } from "@/features/shared/filters/components/query-search-input";
import { QuerySelects } from "@/features/shared/filters/components/query-selects";
import { toQueryOptionsStructure } from "@/features/shared/filters/lib/query-select";

const FILTER_ITEMS = [
  {
    queryKey: "channel",
    label: "Kanał",
    options: toQueryOptionsStructure(LEAD_CHANNELS, LEAD_CHANNELS_LABELS),
  },
  {
    queryKey: "category",
    label: "Kategoria",
    options: toQueryOptionsStructure(LEAD_CATEGORIES, LEAD_CATEGORIES_LABELS),
  },
  {
    queryKey: "status",
    label: "Status",
    options: toQueryOptionsStructure(LEAD_STATUS, LEAD_STATUS_LABELS),
  },
];

export const CoreLeadsFilters = () => (
  <div className="flex flex-wrap gap-3">
    <QuerySearchInput
      queryKey="id"
      label="ID leada"
      placeholder="np. 81763ada..."
    />
    <QuerySelects items={FILTER_ITEMS} />
  </div>
);
