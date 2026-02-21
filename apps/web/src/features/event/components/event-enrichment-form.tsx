"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import { upsertEventEnrichmentAction } from "../actions/upsert-event-enrichment";
import { upsertEventEnrichmentSchema } from "../schema/upsert-event-enrichment";

interface EventEnrichmentFormProps {
  leadId: string;
  initialData: {
    eventDate: Date | null;
    guestCount: number | null;
    budget: number | null;
    isOutdoor: boolean | null;
    updatedAt?: Date;
  } | null;
}

type OutdoorSelectValue = "unknown" | "true" | "false";

const toOutdoorSelectValue = (
  value: boolean | null | undefined,
): OutdoorSelectValue => {
  if (value === true) return "true";
  if (value === false) return "false";
  return "unknown";
};

const fromOutdoorSelectValue = (value: OutdoorSelectValue): boolean | null => {
  if (value === "true") return true;
  if (value === "false") return false;

  return null;
};

const toDateInput = (date: Date | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : undefined;

const toNullableInt = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

export const EventEnrichmentForm = ({
  leadId,
  initialData,
}: EventEnrichmentFormProps) => {
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(
    upsertEventEnrichmentAction,
    zodResolver(upsertEventEnrichmentSchema),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          if (data.sentToCore) {
            toast.success(
              "Dane wydarzenia zostały zapisane i wysłane do Centrum",
            );
          } else {
            toast.warning(
              "Dane zapisane lokalnie, ale nie zostały wysłane do Centrum",
            );
          }
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? "Nie udało się zapisać wzbogacenia");
        },
      },
      formProps: {
        defaultValues: {
          leadId,
          eventDate: toDateInput(initialData?.eventDate ?? null),
          guestCount: initialData?.guestCount ?? undefined,
          budget: initialData?.budget ?? undefined,
          isOutdoor: initialData?.isOutdoor ?? null,
        },
      },
    },
  );

  const isOutdoor = form.watch("isOutdoor");

  return (
    <form className="space-y-4" onSubmit={handleSubmitWithAction}>
      <input type="hidden" {...form.register("leadId")} />

      <FieldSet>
        <Field data-invalid={!!form.formState.errors.eventDate}>
          <FieldLabel htmlFor="eventDate">Data wydarzenia</FieldLabel>
          <Input
            id="eventDate"
            type="date"
            {...form.register("eventDate", {
              setValueAs: (value) =>
                typeof value === "string" && value.trim() === "" ? null : value,
            })}
          />
          {form.formState.errors.eventDate && (
            <FieldError>{form.formState.errors.eventDate.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.guestCount}>
          <FieldLabel htmlFor="guestCount">Liczba gości</FieldLabel>
          <Input
            id="guestCount"
            type="number"
            min={1}
            {...form.register("guestCount", {
              setValueAs: (value) => toNullableInt(String(value ?? "")),
            })}
          />
          {form.formState.errors.guestCount && (
            <FieldError>{form.formState.errors.guestCount.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.budget}>
          <FieldLabel htmlFor="budget">Budżet (PLN)</FieldLabel>
          <Input
            id="budget"
            type="number"
            min={0}
            {...form.register("budget", {
              setValueAs: (value) => toNullableInt(String(value ?? "")),
            })}
          />
          {form.formState.errors.budget && (
            <FieldError>{form.formState.errors.budget.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.isOutdoor}>
          <FieldLabel>Czy plener?</FieldLabel>
          <Select
            value={toOutdoorSelectValue(isOutdoor)}
            onValueChange={(value) => {
              form.setValue(
                "isOutdoor",
                fromOutdoorSelectValue(value as OutdoorSelectValue),
                { shouldDirty: true },
              );
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unknown">Brak informacji</SelectItem>
              <SelectItem value="true">Tak</SelectItem>
              <SelectItem value="false">Nie</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.isOutdoor && (
            <FieldError>{form.formState.errors.isOutdoor.message}</FieldError>
          )}
        </Field>
      </FieldSet>

      {initialData?.updatedAt ? (
        <FieldDescription>
          Ostatnia aktualizacja: {formatDate(initialData.updatedAt)}
        </FieldDescription>
      ) : null}

      <Button type="submit" loading={isPending} disabled={isPending}>
        Zapisz i wyślij wzbogacenie
      </Button>
    </form>
  );
};
