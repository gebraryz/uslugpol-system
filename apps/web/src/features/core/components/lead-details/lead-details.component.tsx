import { LeadLocation } from "@/components/lead-location";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KEY_AUDIT_EVENTS } from "@/constants/audit-events";
import { CoreLeadDetailsAuditTimeline } from "./lead-details-audit-timeline.component";
import { CoreLeadDetailsCrossSellCard } from "./lead-details-cross-sell-card.component";
import { CoreLeadDetailsExtensionsCard } from "./lead-details-extensions-card.component";
import { CoreLeadDetailsHeaderCard } from "./lead-details-header-card.component";
import { CoreLeadDetailsData } from "./lead-details.types";

interface CoreLeadDetailsProps {
  data: CoreLeadDetailsData;
}

export const CoreLeadDetails = ({ data }: CoreLeadDetailsProps) => {
  const { lead, auditLog } = data;

  const existingEventTypes = new Set(auditLog.map((event) => event.eventType));

  return (
    <div className="space-y-6 pb-10">
      <CoreLeadDetailsHeaderCard lead={lead} auditLog={auditLog} />

      <Card>
        <CardHeader>
          <CardTitle>Podstawowe dane</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Opis leada</p>
            <p className="whitespace-pre-wrap">{lead.description}</p>
          </div>
          <LeadLocation lat={lead.lat} lng={lead.lng} />
        </CardContent>
      </Card>

      <CoreLeadDetailsExtensionsCard lead={lead} />
      <CoreLeadDetailsCrossSellCard lead={lead} />

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
          <CoreLeadDetailsAuditTimeline events={auditLog} />
        </CardContent>
      </Card>
    </div>
  );
};
