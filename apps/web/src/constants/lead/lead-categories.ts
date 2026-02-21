import {
  LeadType as LeadTypeEnum,
  type LeadType as CoreLeadCategory,
} from "@uslugpol/core/enums";

export type LeadCategory = CoreLeadCategory;

export const LEAD_CATEGORIES = Object.values(LeadTypeEnum) as [
  LeadCategory,
  ...LeadCategory[],
];

export const LEAD_CATEGORIES_LABELS = {
  EVENT: "Wydarzenie",
  CAR: "Samochód",
  CLEANING: "Czyszczenie",
} satisfies Record<LeadCategory, string>;
