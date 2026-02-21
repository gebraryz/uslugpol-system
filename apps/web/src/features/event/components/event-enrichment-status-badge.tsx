import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EVENT_MODULE_STATUS_LABELS } from "../constants/event-module-status";

interface EventEnrichmentStatusBadgeProps {
  isEnriched: boolean;
}

export const EventEnrichmentStatusBadge = ({
  isEnriched,
}: EventEnrichmentStatusBadgeProps) => (
  <Badge
    variant="outline"
    className={cn(
      isEnriched
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-amber-200 bg-amber-50 text-amber-700",
    )}
  >
    {isEnriched
      ? EVENT_MODULE_STATUS_LABELS.ENRICHED
      : EVENT_MODULE_STATUS_LABELS.TO_ENRICH}
  </Badge>
);
