"use client";

import { DataTable } from "@/components/data-table";
import { LeadLocationPreview } from "@/components/lead-location-preview";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CopyToClipboardButton } from "@/features/core/components/copy-to-clipboard-button";
import { PaginationControls } from "@/features/shared/filters/components/pagination-controls";
import {
  formatDate,
  formatId,
  isObjectRecord,
  statusBadgeVariant,
  toCrossSellRuleLabel,
  toCrossSellStatusLabel,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import type { GetCarRecommendationsResult } from "../queries/get-car-recommendations";

const readSnapshotLocation = (context: unknown) => {
  if (!isObjectRecord(context)) {
    return null;
  }

  const snapshot = context.snapshot;
  if (!isObjectRecord(snapshot)) {
    return null;
  }

  const lat = snapshot.lat;
  const lng = snapshot.lng;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  return { lat, lng };
};

type CarRecommendationRow =
  GetCarRecommendationsResult["recommendations"][number];

const COLUMNS: ColumnDef<CarRecommendationRow>[] = [
  {
    accessorKey: "leadId",
    header: "Lead",
    cell: ({ row }) => {
      const leadId = row.original.leadId;
      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="font-mono text-sm">{formatId(leadId)}</span>
            </TooltipTrigger>
            <TooltipContent>{leadId}</TooltipContent>
          </Tooltip>
          <CopyToClipboardButton value={leadId} label="Kopiuj ID leada" />
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Uzasadnienie",
    cell: ({ row }) => (
      <p className="max-w-sm whitespace-pre-wrap text-sm">
        {row.original.reason}
      </p>
    ),
  },
  {
    accessorKey: "ruleKey",
    header: "Reguła",
    cell: ({ row }) => toCrossSellRuleLabel(row.original.ruleKey),
  },
  {
    accessorKey: "location",
    header: "Lokalizacja",
    cell: ({ row }) => {
      const location = readSnapshotLocation(row.original.context);
      if (!location) return "Brak";

      return (
        <LeadLocationPreview lat={location.lat} lng={location.lng} showLabel />
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusBadgeVariant(row.original.status)}>
        {toCrossSellStatusLabel(row.original.status)}
      </Badge>
    ),
  },
  {
    accessorKey: "receivedAt",
    header: "Odebrano",
    cell: ({ row }) => (
      <span suppressHydrationWarning>
        {formatDate(row.original.receivedAt)}
      </span>
    ),
  },
];

interface CarRecommendationsTableProps {
  data: CarRecommendationRow[];
  page: number;
  totalPages: number;
}

export const CarRecommendationsTable = ({
  data,
  page,
  totalPages,
}: CarRecommendationsTableProps) => (
  <div>
    <DataTable columns={COLUMNS} data={data} />
    <PaginationControls page={page} totalPages={totalPages} />
  </div>
);
