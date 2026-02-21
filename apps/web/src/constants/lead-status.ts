import {
  LeadStatus as LeadStatusEnum,
  type LeadStatus as CoreLeadStatus,
} from "@uslugpol/core/enums";

export type LeadStatus = CoreLeadStatus;

export const LEAD_STATUS = Object.values(LeadStatusEnum) as [
  LeadStatus,
  ...LeadStatus[],
];

export const LEAD_STATUS_LABELS = {
  NEW: "Nowy",
  QUALIFIED: "Kwalifikowany",
  CONVERTED: "Skonwertowany",
} satisfies Record<LeadStatus, string>;

export const LEAD_STATUS_FLOW = LEAD_STATUS;

export const LEAD_NEXT_STATUS: Record<LeadStatus, LeadStatus | null> = {
  NEW: "QUALIFIED",
  QUALIFIED: "CONVERTED",
  CONVERTED: null,
};
