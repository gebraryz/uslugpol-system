import {
  LeadChannel as LeadChannelEnum,
  type LeadChannel as CoreLeadChannel,
} from "@uslugpol/core/enums";

export type LeadChannel = CoreLeadChannel;

export const LEAD_CHANNELS = Object.values(LeadChannelEnum) as [
  LeadChannel,
  ...LeadChannel[],
];

export const LEAD_CHANNELS_LABELS = {
  PHONE: "Telefon",
  EMAIL: "E-mail",
  FORM: "Formularz",
} satisfies Record<LeadChannel, string>;
