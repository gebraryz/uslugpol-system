import {
  LEAD_CHANNELS_LABELS,
  type LeadChannel,
} from "@/constants/lead/lead-channels";
import { FileText, Mail, Phone, type LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

interface LeadChannelBadgeProps {
  channel: LeadChannel;
}

const channelConfig = {
  PHONE: {
    icon: Phone,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  EMAIL: {
    icon: Mail,
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  FORM: {
    icon: FileText,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
} as Record<LeadChannel, { icon: LucideIcon; className: string }>;

export const LeadChannelBadge = ({ channel }: LeadChannelBadgeProps) => {
  const { icon: Icon, className } = channelConfig[channel];

  return (
    <Badge className={className} variant="outline">
      <Icon />
      {LEAD_CHANNELS_LABELS[channel]}
    </Badge>
  );
};
