"use client";

import { cn } from "@/lib/utils";
import { QuerySelect } from "./query-select";
import { QuerySelectOption } from "../types/query-select-option";

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
  <div className={cn("flex w-full flex-col gap-3 md:flex-row md:flex-wrap", className)}>
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
