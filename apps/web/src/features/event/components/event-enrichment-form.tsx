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
import {
  EVENT_ENRICHMENT_OUTDOOR_VALUES,
  upsertEventEnrichmentSchema,
} from "../schema/upsert-event-enrichment";

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

const toDateInput = (date: Date | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

type OutdoorValue = (typeof EVENT_ENRICHMENT_OUTDOOR_VALUES)[number];

const toOutdoorValue = (value: boolean | null): OutdoorValue => {
  if (value === true) return "true";
  if (value === false) return "false";
  return "unknown";
};

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
          guestCount: initialData?.guestCount?.toString() ?? "",
          budget: initialData?.budget?.toString() ?? "",
          isOutdoor: toOutdoorValue(initialData?.isOutdoor ?? null),
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
          <Input id="eventDate" type="date" {...form.register("eventDate")} />
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
            {...form.register("guestCount")}
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
            {...form.register("budget")}
          />
          {form.formState.errors.budget && (
            <FieldError>{form.formState.errors.budget.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.isOutdoor}>
          <FieldLabel>Czy plener?</FieldLabel>
          <Select
            value={isOutdoor}
            onValueChange={(value) => {
              form.setValue("isOutdoor", value as OutdoorValue, {
                shouldDirty: true,
              });
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
