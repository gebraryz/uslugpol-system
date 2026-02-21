"use client";

import { DataTable } from "@/components/data-table";
import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadLocationDialogPreview } from "@/components/lead-location-preview-dialog";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { TableIdCell } from "@/components/table-id-cell";
import { PaginationControls } from "@/features/shared/filters/components/pagination-controls";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import type { CarLead } from "../../queries/get-car-leads";

const COLUMNS: ColumnDef<CarLead>[] = [
  {
    accessorKey: "leadId",
    header: "ID",
    cell: ({ row }) => {
      const leadId = row.original.leadId;

      return (
        <TableIdCell id={leadId} copyLabel="Kopiuj pełne ID leada" />
      );
    },
  },
  {
    accessorKey: "receivedAt",
    header: "Data przyjęcia",
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
      <LeadLocationDialogPreview
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
  },
];

interface CarLeadsTableProps {
  data: CarLead[];
  page: number;
  totalPages: number;
}

export const CarLeadsTable = ({
  data,
  page,
  totalPages,
}: CarLeadsTableProps) => (
  <div>
    <DataTable columns={COLUMNS} data={data} />
    <PaginationControls page={page} totalPages={totalPages} />
  </div>
);
