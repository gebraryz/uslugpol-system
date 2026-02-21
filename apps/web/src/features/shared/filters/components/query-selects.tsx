"use client";

import { cn } from "@/lib/utils";
import type { QuerySelectOption } from "../lib/query-select";
import { QuerySelect } from "./query-select";

export interface QuerySelectItem {
  queryKey: string;
  label: string;
  options: QuerySelectOption[];
}

interface QuerySelectsProps {
  items: QuerySelectItem[];
  className?: string;
}

export const QuerySelects = ({ items, className }: QuerySelectsProps) => (
  <div className={cn("flex flex-wrap gap-3", className)}>
    {items.map((item) => {
      if (!item.options.length) return null;

      return (
        <QuerySelect
          key={item.queryKey}
          queryKey={item.queryKey}
          label={item.label}
          options={item.options}
        />
      );
    })}
  </div>
);
