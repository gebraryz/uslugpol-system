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
import { pageParser } from "../lib/search-params";
import { QuerySelectOption } from "../types/query-select-option";

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
}).withDefault(ALL_OPTIONS);

export const QuerySelect = ({ queryKey, label, options }: QuerySelectProps) => {
  const allowedValues = options.map((option) => option.value);
  const optionLabels = new Map(
    options.map((option) => [option.value, option.label]),
  );

  const [value, setValue] = useQueryState(queryKey, queryStateParser);
  const [, setPage] = useQueryState(
    "page",
    pageParser.withOptions({ shallow: false, history: "push" }),
  );

  const currentValue = allowedValues.includes(value) ? value : ALL_OPTIONS;
  const currentLabel =
    currentValue === ALL_OPTIONS
      ? ALL_OPTIONS_LABEL
      : optionLabels.get(currentValue) ?? ALL_OPTIONS_LABEL;

  const onValueChange = (nextValue: string) => {
    const parsedValue = nextValue === ALL_OPTIONS ? null : nextValue;

    setValue(parsedValue);
    setPage(null);
  };

  return (
    <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-44">
      <Label>{label}</Label>
      <Select value={currentValue} onValueChange={onValueChange}>
        <SelectTrigger className="w-full md:min-w-44">
          <SelectValue placeholder={ALL_OPTIONS_LABEL}>
            {currentLabel}
          </SelectValue>
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
