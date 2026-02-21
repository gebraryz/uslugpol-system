"use client";

import { DataTable } from "@/components/data-table";
import { LeadCategoryBadge } from "@/components/lead-category-badge";
import { LeadChannelBadge } from "@/components/lead-channel-badge";
import { LeadLocationDialogPreview } from "@/components/lead-location-preview-dialog";
import { LeadStatusBadge } from "@/components/lead-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LEAD_CATEGORIES_LABELS } from "@/constants/lead/lead-categories";
import { LEAD_CHANNELS_LABELS } from "@/constants/lead/lead-channels";
import { ROUTES } from "@/constants/routes";
import { PaginationControls } from "@/features/shared/filters/components/pagination-controls";
import { formatDate, formatId } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { GetLeadsResult } from "../queries/get-leads";
import { CopyToClipboardButton } from "./copy-to-clipboard-button";

type LeadRow = GetLeadsResult["leads"][number];

const COLUMNS: ColumnDef<LeadRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original.id;

      return (
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={ROUTES.core.leadDetails(id)}
                className="font-mono text-sm underline-offset-2 hover:underline"
              >
                {formatId(id)}
              </Link>
            </TooltipTrigger>
            <TooltipContent>{id}</TooltipContent>
          </Tooltip>

          <CopyToClipboardButton value={id} label="Kopiuj pełne ID" />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategoria",
    accessorFn: (row) => LEAD_CATEGORIES_LABELS[row.category],
    cell: ({ row }) => <LeadCategoryBadge category={row.original.category} />,
  },
  {
    accessorKey: "channel",
    header: "Kanał",
    accessorFn: (row) => LEAD_CHANNELS_LABELS[row.channel],
    cell: ({ row }) => <LeadChannelBadge channel={row.original.channel} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <LeadStatusBadge status={row.original.status} />,
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
    accessorKey: "createdAt",
    header: "Utworzono",
    cell: ({ row }) => (
      <span suppressHydrationWarning>{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "details",
    header: "",
    cell: ({ row }) => (
      <Link
        href={ROUTES.core.leadDetails(row.original.id)}
        className={buttonVariants({ variant: "ghost" })}
      >
        <ExternalLink />
      </Link>
    ),
  },
];

interface LeadsTableProps {
  data: LeadRow[];
  page: number;
  totalPages: number;
}

export const CoreLeadsTable = ({ data, page, totalPages }: LeadsTableProps) => (
  <div>
    <DataTable columns={COLUMNS} data={data} />
    <PaginationControls page={page} totalPages={totalPages} />
  </div>
);
