import {
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/constants/lead/lead-status";
import {
  CircleCheckBig,
  CircleDollarSign,
  CircleDot,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusConfig = {
  NEW: {
    icon: CircleDot,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  QUALIFIED: {
    icon: CircleCheckBig,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  CONVERTED: {
    icon: CircleDollarSign,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
} as Record<LeadStatus, { icon: LucideIcon; className: string }>;

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  const { icon: Icon, className } = statusConfig[status];

  return (
    <Badge className={className} variant="outline">
      <Icon />
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
};
