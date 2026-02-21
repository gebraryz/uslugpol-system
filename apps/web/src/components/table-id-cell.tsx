"use client";

import { CopyToClipboardButton } from "@/features/core/components/copy-to-clipboard-button";
import { formatId } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TableIdCellProps {
  id: string;
  copyLabel: string;
  href?: string;
}

export const TableIdCell = ({ id, copyLabel, href }: TableIdCellProps) => (
  <div className="flex items-center gap-1">
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Link
            href={href}
            className="font-mono text-sm underline-offset-2 hover:underline"
          >
            {formatId(id)}
          </Link>
        ) : (
          <span className="font-mono text-sm">{formatId(id)}</span>
        )}
      </TooltipTrigger>
      <TooltipContent>{id}</TooltipContent>
    </Tooltip>

    <CopyToClipboardButton value={id} label={copyLabel} />
  </div>
);
