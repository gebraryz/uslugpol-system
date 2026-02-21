import {
  LEAD_CATEGORIES_LABELS,
  type LeadCategory,
} from "@/constants/lead-categories";
import {
  CalendarDays,
  CarFront,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface LeadCategoryBadgeProps {
  category: LeadCategory;
}

const categoryConfig = {
  EVENT: {
    icon: CalendarDays,
    className: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
  CAR: {
    icon: CarFront,
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  CLEANING: {
    icon: Sparkles,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
} as Record<LeadCategory, { icon: LucideIcon; className: string }>;

export const LeadCategoryBadge = ({ category }: LeadCategoryBadgeProps) => {
  const { icon: Icon, className } = categoryConfig[category];

  return (
    <Badge className={className} variant="outline">
      <Icon />
      {LEAD_CATEGORIES_LABELS[category]}
    </Badge>
  );
};
