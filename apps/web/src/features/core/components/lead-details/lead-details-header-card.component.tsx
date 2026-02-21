import { LeadCategoryBadge } from "@/components/lead-category-badge";
import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AUDIT_EVENT_TYPES } from "@/constants/audit-events";
import {
  LEAD_STATUS_FLOW,
  LEAD_STATUS_LABELS,
} from "@/constants/lead/lead-status";
import { cn, formatDate, isObjectRecord } from "@/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { CopyToClipboardButton } from "../copy-to-clipboard-button";
import { CoreLeadDetailsStatusControl } from "./lead-details-status-control.component";
import type {
  CoreLeadDetailsAuditLog,
  CoreLeadDetailsLead,
} from "./lead-details.types";
import { isLeadStatus } from "./lead-details.utils";

interface CoreLeadDetailsHeaderCardProps {
  lead: CoreLeadDetailsLead;
  auditLog: CoreLeadDetailsAuditLog;
}

const getStatusHistory = (auditLog: CoreLeadDetailsAuditLog) =>
  auditLog
    .filter(
      (event) => event.eventType === AUDIT_EVENT_TYPES.LEAD_STATUS_CHANGED,
    )
    .map((event) => {
      if (!isObjectRecord(event.payload)) {
        return null;
      }

      const from = event.payload.from;
      const to = event.payload.to;

      if (!isLeadStatus(from) || !isLeadStatus(to)) {
        return null;
      }

      return { id: event.id, from, to, occurredAt: event.occurredAt };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .slice(0, 3);

export const CoreLeadDetailsHeaderCard = ({
  lead,
  auditLog,
}: CoreLeadDetailsHeaderCardProps) => {
  const currentStatus = lead.status;
  const currentStatusIndex = LEAD_STATUS_FLOW.indexOf(currentStatus);

  const statusHistory = getStatusHistory(auditLog);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardDescription>ID</CardDescription>
            <div className="flex items-center gap-1">
              <code className="font-mono text-sm">{lead.id}</code>
              <CopyToClipboardButton value={lead.id} label="Kopiuj ID leada" />
            </div>
          </div>

          <CoreLeadDetailsStatusControl
            leadId={lead.id}
            status={currentStatus}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LeadCategoryBadge category={lead.category} />
          <LeadChannelBadge channel={lead.channel} />
          <LeadStatusBadge status={currentStatus} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />

        <div className="space-y-3">
          <p className="text-sm font-medium">Etapy obsługi</p>
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-2">
            {LEAD_STATUS_FLOW.map((status, index) => {
              const isDone = index < currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                      isDone || isCurrent
                        ? "border-primary bg-primary/10 text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      isCurrent ? "font-medium" : "text-muted-foreground",
                    )}
                  >
                    {LEAD_STATUS_LABELS[status]}
                  </span>
                  {index < LEAD_STATUS_FLOW.length - 1 ? (
                    <div className="bg-border h-px w-6" />
                  ) : null}
                </div>
              );
            })}
            </div>
          </div>
        </div>

        {statusHistory.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Ostatnie zmiany statusu</p>
            <ul className="space-y-1 text-sm">
              {statusHistory.map((entry) => (
                <li
                  key={entry.id}
                  className="text-muted-foreground flex items-center gap-1"
                >
                  <span>{formatDate(entry.occurredAt)}:</span>
                  <span>{LEAD_STATUS_LABELS[entry.from]}</span>
                  <IconArrowRight className="size-3.5" />
                  <span>{LEAD_STATUS_LABELS[entry.to]}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Utworzono</p>
            <p>{formatDate(lead.createdAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Zaktualizowano</p>
            <p>{formatDate(lead.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
