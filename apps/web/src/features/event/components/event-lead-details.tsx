import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDate,
  toCrossSellRuleLabel,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import type { EventLeadDetailsResult } from "../queries/get-event-lead-details";
import { isEventLeadEnriched } from "../lib/enrichment";
import { EventEnrichmentForm } from "./event-enrichment-form";
import { EventEnrichmentStatusBadge } from "./event-enrichment-status-badge";
import { EventOpportunityReportForm } from "./event-opportunity-report-form";
import { CopyToClipboardButton } from "@/features/core/components/copy-to-clipboard-button";
import { LeadDetailsLocation } from "@/features/core/components/lead-details/lead-details-location.component";

interface EventLeadDetailsProps {
  data: EventLeadDetailsResult;
}

export const EventLeadDetails = ({ data }: EventLeadDetailsProps) => {
  const { lead, opportunityReports } = data;

  const isEnriched = isEventLeadEnriched(lead.details);

  return (
    <div className="space-y-6 pb-10">
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardDescription>ID leada (z Centrum)</CardDescription>
            <div className="flex items-center gap-1">
              <code className="font-mono text-sm">{lead.leadId}</code>
              <CopyToClipboardButton
                value={lead.leadId}
                label="Kopiuj ID leada"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LeadChannelBadge channel={lead.channel} />
            <LeadStatusBadge status={lead.status} />
            <EventEnrichmentStatusBadge isEnriched={isEnriched} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Odebrano w module</p>
            <p>{formatDate(lead.receivedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Zaktualizowano w module</p>
            <p>{formatDate(lead.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Snapshot z Centrum</CardTitle>
          <CardDescription>
            Dane, które moduł Wydarzenia otrzymał po przypisaniu leada.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Opis</p>
            <p className="whitespace-pre-wrap">{lead.description}</p>
          </div>
          <LeadDetailsLocation lat={lead.lat} lng={lead.lng} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wzbogacenie wydarzenia</CardTitle>
          <CardDescription>
            Uzupełnij dane i opublikuj zdarzenie `LeadEnriched` do Centrum.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventEnrichmentForm
            leadId={lead.leadId}
            initialData={
              lead.details
                ? {
                    eventDate: lead.details.eventDate,
                    guestCount: lead.details.guestCount,
                    budget: lead.details.budget,
                    isOutdoor: lead.details.isOutdoor,
                    updatedAt: lead.details.updatedAt,
                  }
                : null
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rekomendacje cross-sell z Centrum</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.proposals.length === 0 ? (
            <Empty className="rounded-md p-5 md:p-6">
              <EmptyHeader>
                <EmptyTitle>Brak rekomendacji</EmptyTitle>
                <EmptyDescription>
                  Centrum nie przekazało jeszcze propozycji cross-sell dla tego
                  leada.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usługa docelowa</TableHead>
                  <TableHead>Uzasadnienie</TableHead>
                  <TableHead>Reguła</TableHead>
                  <TableHead>Odebrano</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lead.proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      {toServiceLabelOrUnknown(proposal.targetService)}
                    </TableCell>
                    <TableCell>{proposal.reason}</TableCell>
                    <TableCell>
                      {toCrossSellRuleLabel(proposal.ruleKey)}
                    </TableCell>
                    <TableCell>{formatDate(proposal.receivedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zgłoś okazję</CardTitle>
          <CardDescription>
            Opcjonalny feedback do Centrum, np. potrzeba transportu lub
            sprzątania.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <EventOpportunityReportForm leadId={lead.leadId} />

          {opportunityReports.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Ostatnie zgłoszenia</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usługa docelowa</TableHead>
                    <TableHead>Opis</TableHead>
                    <TableHead>Zgłoszono</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunityReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {report.targetService
                          ? toServiceLabelOrUnknown(report.targetService)
                          : "Brak"}
                      </TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell>{formatDate(report.reportedAt)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={report.sentToCore ? "default" : "outline"}
                        >
                          {report.sentToCore
                            ? "Wysłane do Centrum"
                            : "W kolejce"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
