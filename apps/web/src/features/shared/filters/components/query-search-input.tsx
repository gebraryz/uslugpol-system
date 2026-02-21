"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search } from "lucide-react";
import { debounce, parseAsString, useQueryStates } from "nuqs";
import { useMemo, useTransition } from "react";
import { pageParser } from "../lib/search-params";

interface QuerySearchInputProps {
  queryKey: string;
  label: string;
  placeholder?: string;
  resetKeys?: string[];
}

const queryStateParser = parseAsString
  .withOptions({ shallow: false, history: "push" })
  .withDefault("");

export const QuerySearchInput = ({
  queryKey,
  label,
  placeholder = "Szukaj...",
  resetKeys = [],
}: QuerySearchInputProps) => {
  const [isPending, startTransition] = useTransition();

  const keysToReset = useMemo(
    () => resetKeys.filter((key) => key !== queryKey && key !== "page"),
    [queryKey, resetKeys],
  );

  const parserConfig = useMemo(
    () => ({
      [queryKey]: queryStateParser,
      page: pageParser,
      ...Object.fromEntries(
        keysToReset.map((key) => [
          key,
          parseAsString.withOptions({ shallow: false, history: "push" }),
        ]),
      ),
    }),
    [keysToReset, queryKey],
  );

  const [values, setValues] = useQueryStates(parserConfig, {
    history: "push",
    shallow: false,
  });

  const value = values[queryKey] ?? "";

  const onChange = (nextValue: string) => {
    const updateOptions =
      nextValue === "" ? undefined : { limitUrlUpdates: debounce(300) };
    const resetFilters = Object.fromEntries(
      keysToReset.map((key) => [key, null]),
    );

    startTransition(async () => {
      await setValues(
        {
          ...resetFilters,
          [queryKey]: nextValue === "" ? null : nextValue,
          page: null,
        },
        updateOptions,
      );
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 md:min-w-60 md:flex-1">
      <Label>{label}</Label>
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="pl-9 pr-9"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        {isPending ? (
          <Loader2 className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin" />
        ) : null}
      </div>
    </div>
  );
};
