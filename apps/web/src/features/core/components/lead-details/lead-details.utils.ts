import { LEAD_STATUS, LeadStatus } from "@/constants/lead/lead-status";

const LEAD_STATUS_VALUES: readonly string[] = LEAD_STATUS;

export const isLeadStatus = (value: unknown): value is LeadStatus =>
  typeof value === "string" && LEAD_STATUS_VALUES.includes(value);
