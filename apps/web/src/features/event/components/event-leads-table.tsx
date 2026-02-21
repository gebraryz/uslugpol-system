"use client";

import { DataTable } from "@/components/data-table";
import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadLocationPreview } from "@/components/lead-location-preview";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTES } from "@/constants/routes";
import { CopyToClipboardButton } from "@/features/core/components/copy-to-clipboard-button";
import { PaginationControls } from "@/features/shared/filters/components/pagination-controls";
import { formatDate, formatId } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { isEventLeadEnriched } from "../lib/enrichment";
import type { GetEventLeadsResult } from "../queries/get-event-leads";
import { EventEnrichmentStatusBadge } from "./event-enrichment-status-badge";

type EventLeadRow = GetEventLeadsResult["leads"][number];

const COLUMNS: ColumnDef<EventLeadRow>[] = [
  {
    accessorKey: "leadId",
    header: "ID",
    cell: ({ row }) => {
      const leadId = row.original.leadId;
      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={ROUTES.events.leadDetails(leadId)}
                className="font-mono text-sm underline-offset-2 hover:underline"
              >
                {formatId(leadId)}
              </Link>
            </TooltipTrigger>
            <TooltipContent>{leadId}</TooltipContent>
          </Tooltip>

          <CopyToClipboardButton value={leadId} label="Kopiuj pełne ID leada" />
        </div>
      );
    },
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
  {
    accessorKey: "channel",
    header: "Kanał",
    cell: ({ row }) => <LeadChannelBadge channel={row.original.channel} />,
  },
  {
    accessorKey: "location",
    header: "Lokalizacja",
    cell: ({ row }) => (
      <LeadLocationPreview
        lat={row.original.lat}
        lng={row.original.lng}
        showLabel
      />
    ),
  },
  {
    accessorKey: "description",
    header: "Opis",
    cell: ({ row }) => (
      <p className="max-w-sm truncate text-sm">{row.original.description}</p>
    ),
  },
  {
    accessorKey: "enrichmentStatus",
    header: "Status modułu",
    cell: ({ row }) => (
      <EventEnrichmentStatusBadge
        isEnriched={isEventLeadEnriched(row.original.details)}
      />
    ),
  },
  {
    accessorKey: "details",
    header: "",
    cell: ({ row }) => (
      <Link
        href={ROUTES.events.leadDetails(row.original.leadId)}
        className={buttonVariants({ variant: "ghost" })}
      >
        <ExternalLink />
      </Link>
    ),
  },
];

interface EventLeadsTableProps {
  data: EventLeadRow[];
  page: number;
  totalPages: number;
}

export const EventLeadsTable = ({
  data,
  page,
  totalPages,
}: EventLeadsTableProps) => (
  <div>
    <DataTable columns={COLUMNS} data={data} />
    <PaginationControls page={page} totalPages={totalPages} />
  </div>
);
