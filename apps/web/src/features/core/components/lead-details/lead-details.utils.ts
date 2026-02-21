import { LEAD_STATUS, LeadStatus } from "@/constants/lead-status";

export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === "string" &&
  new Set<LeadStatus>(LEAD_STATUS).has(value as LeadStatus);
