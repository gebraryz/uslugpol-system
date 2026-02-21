"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsString, useQueryState } from "nuqs";
import type { QuerySelectOption } from "../lib/query-select";
import { pageParser } from "../lib/search-params";

interface QuerySelectProps {
  queryKey: string;
  label: string;
  options: QuerySelectOption[];
}

const ALL_OPTIONS = "ALL";
const ALL_OPTIONS_LABEL = "Wszystkie";

const queryStateParser = parseAsString.withOptions({
  shallow: false,
  history: "push",
});

export const QuerySelect = ({ queryKey, label, options }: QuerySelectProps) => {
  const allowedValues = options.map((option) => option.value);

  const [value, setValue] = useQueryState(queryKey, queryStateParser);
  const [, setPage] = useQueryState(
    "page",
    pageParser.withOptions({ shallow: false, history: "push" }),
  );

  const currentValue =
    value && allowedValues.includes(value) ? value : ALL_OPTIONS;

  const onValueChange = (nextValue: string) => {
    const parsedValue = nextValue === ALL_OPTIONS ? null : nextValue;

    setValue(parsedValue);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Select value={currentValue} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={ALL_OPTIONS_LABEL} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_OPTIONS}>{ALL_OPTIONS_LABEL}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
