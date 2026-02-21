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
  statusBadgeVariant,
  toCrossSellRuleLabel,
  toCrossSellStatusLabel,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import type { CoreLeadDetailsLead } from "./lead-details.types";

interface CoreLeadDetailsCrossSellCardProps {
  lead: CoreLeadDetailsLead;
}

export const CoreLeadDetailsCrossSellCard = ({
  lead,
}: CoreLeadDetailsCrossSellCardProps) => (
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
                Rekomendacje dodatkowych usług pojawiają się dla zgłoszeń
                dotyczących wydarzeń.
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  </Card>
);
