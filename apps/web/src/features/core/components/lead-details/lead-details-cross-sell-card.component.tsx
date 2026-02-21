import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  formatJson,
  statusBadgeVariant,
  toCrossSellRuleLabel,
  toCrossSellStatusLabel,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import type { LeadDetailsLead } from "./lead-details.types";

interface LeadDetailsCrossSellCardProps {
  lead: LeadDetailsLead;
}

export const LeadDetailsCrossSellCard = ({
  lead,
}: LeadDetailsCrossSellCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Rekomendacje cross-sell</CardTitle>
    </CardHeader>
    <CardContent>
      {lead.opportunities.length === 0 ? (
        <Empty className="gap-4 rounded-md p-5 md:p-6">
          <EmptyHeader>
            <EmptyTitle>Brak rekomendacji</EmptyTitle>
            {lead.category !== "EVENT" ? (
              <EmptyDescription>
                Rekomendacje cross-sell są dostępne dla leadów kategorii{" "}
                <code>EVENT</code>.
              </EmptyDescription>
            ) : (
              <EmptyDescription>
                Silnik reguł nie zaproponował jeszcze dodatkowej usługi dla tego
                leada.
              </EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usługa docelowa</TableHead>
                <TableHead>Uzasadnienie</TableHead>
                <TableHead>Reguła</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Utworzono</TableHead>
                <TableHead>Szczegóły</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lead.opportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    {toServiceLabelOrUnknown(opportunity.targetService)}
                  </TableCell>
                  <TableCell className="max-w-sm whitespace-pre-wrap">
                    {opportunity.reason}
                  </TableCell>
                  <TableCell>
                    {toCrossSellRuleLabel(opportunity.ruleKey)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(opportunity.status)}>
                      {toCrossSellStatusLabel(opportunity.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(opportunity.createdAt)}</TableCell>
                  <TableCell>
                    {opportunity.context ? (
                      <details className="text-sm">
                        <summary className="cursor-pointer">
                          Pokaż szczegóły
                        </summary>
                        <pre className="bg-muted mt-2 max-w-md overflow-x-auto rounded-md p-2 text-xs">
                          {formatJson(opportunity.context)}
                        </pre>
                      </details>
                    ) : (
                      "Brak"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
);
