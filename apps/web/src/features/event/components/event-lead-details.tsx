import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadLocation } from "@/components/lead-location";
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
import { CopyToClipboardButton } from "@/features/core/components/copy-to-clipboard-button";
import {
  formatDate,
  toCrossSellRuleLabel,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import { isEventLeadEnriched } from "../lib/utils";
import type { EventLeadDetailsResult } from "../queries/get-event-lead-details";
import { EventEnrichmentForm } from "./event-enrichment-form";
import { EventEnrichmentStatusBadge } from "./event-enrichment-status-badge";
import { EventOpportunityReportForm } from "./event-opportunity-report-form";

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
            <CardDescription>ID zgłoszenia</CardDescription>
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
            <span className="text-muted-foreground text-sm">Status leada:</span>
            <LeadStatusBadge status={lead.status} />
            <span className="text-muted-foreground text-sm">Status obsługi:</span>
            <EventEnrichmentStatusBadge isEnriched={isEnriched} />
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-muted-foreground">Data przyjęcia</p>
            <p>{formatDate(lead.receivedAt)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Ostatnia aktualizacja</p>
            <p>{formatDate(lead.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dane zgłoszenia</CardTitle>
          <CardDescription>
            Dane przekazane na początku obsługi tego zgłoszenia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-1 text-sm">Opis</p>
            <p className="whitespace-pre-wrap">{lead.description}</p>
          </div>
          <LeadLocation lat={lead.lat} lng={lead.lng} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wzbogacenie wydarzenia</CardTitle>
          <CardDescription>
            Uzupełnij szczegóły wydarzenia i zapisz zmiany.
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
          <CardTitle>Propozycje usług dodatkowych</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.proposals.length === 0 ? (
            <Empty className="rounded-md p-5 md:p-6">
              <EmptyHeader>
                <EmptyTitle>Brak rekomendacji</EmptyTitle>
                <EmptyDescription>
                  Dla tego zgłoszenia nie ma jeszcze propozycji usług
                  dodatkowych.
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
            Opcjonalnie zgłoś dodatkową potrzebę klienta, np. transport lub
            sprzątanie.
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
                          {report.sentToCore ? "Przekazane" : "Oczekuje"}
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
