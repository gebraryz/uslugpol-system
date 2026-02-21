import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KEY_AUDIT_EVENTS } from "@/constants/audit-events";
import { LeadDetailsAuditTimeline } from "./lead-details-audit-timeline.component";
import { LeadDetailsLocation } from "./lead-details-location.component";
import { LeadDetailsCrossSellCard } from "./lead-details-cross-sell-card.component";
import { LeadDetailsExtensionsCard } from "./lead-details-extensions-card.component";
import { LeadDetailsHeaderCard } from "./lead-details-header-card.component";
import type { LeadDetailsData } from "./lead-details.types";

interface LeadDetailsProps {
  data: LeadDetailsData;
}

export const LeadDetails = ({ data }: LeadDetailsProps) => {
  const { lead, auditLog } = data;
  const existingEventTypes = new Set(auditLog.map((event) => event.eventType));

  return (
    <div className="space-y-6 pb-10">
      <LeadDetailsHeaderCard lead={lead} auditLog={auditLog} />

      <Card>
        <CardHeader>
          <CardTitle>Podstawowe dane</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Opis leada</p>
            <p className="whitespace-pre-wrap">{lead.description}</p>
          </div>
          <LeadDetailsLocation lat={lead.lat} lng={lead.lng} />
        </CardContent>
      </Card>

      <LeadDetailsExtensionsCard lead={lead} />
      <LeadDetailsCrossSellCard lead={lead} />

      <Card>
        <CardHeader>
          <CardTitle>Audit timeline</CardTitle>
          <CardDescription>
            Widok pełnego audytu zdarzeń związanych z leadem.
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            {KEY_AUDIT_EVENTS.map((event) => {
              const exists = existingEventTypes.has(event.key);
              return (
                <Badge key={event.key} variant={exists ? "default" : "outline"}>
                  {event.label}
                </Badge>
              );
            })}
          </div>
        </CardHeader>
        <CardContent>
          <LeadDetailsAuditTimeline events={auditLog} />
        </CardContent>
      </Card>
    </div>
  );
};
