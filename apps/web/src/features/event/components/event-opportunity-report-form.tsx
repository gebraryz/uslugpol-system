"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";
import {
  CrossSellTargetService as CrossSellTargetServiceEnum,
  type CrossSellTargetService,
} from "@uslugpol/event-service/enums";
import { reportOpportunityAction } from "../actions/report-opportunity";
import { reportOpportunitySchema } from "../schema/report-opportunity";

interface EventOpportunityReportFormProps {
  leadId: string;
}

export const EventOpportunityReportForm = ({
  leadId,
}: EventOpportunityReportFormProps) => {
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(
    reportOpportunityAction,
    zodResolver(reportOpportunitySchema),
    {
      actionProps: {
        onSuccess: ({ data }) => {
          if (data.sentToCore) {
            toast.success("Okazja została zgłoszona");
          } else {
            toast.warning(
              "Okazja zapisana, ale nie została jeszcze przekazana",
            );
          }
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? "Nie udało się zgłosić okazji");
        },
      },
      formProps: {
        mode: "onChange",
        defaultValues: {
          leadId,
          targetService: CrossSellTargetServiceEnum.CAR,
          description: "",
        },
      },
    },
  );

  const targetService = form.watch("targetService");
  const description = form.watch("description");
  const canSubmit = description.trim().length >= 3 && !isPending;

  return (
    <form className="space-y-4" onSubmit={handleSubmitWithAction}>
      <input type="hidden" {...form.register("leadId")} />

      <FieldSet>
        <Field data-invalid={!!form.formState.errors.targetService}>
          <FieldLabel>Usługa docelowa</FieldLabel>
          <Select
            value={targetService}
            onValueChange={(value: CrossSellTargetService) => {
              form.setValue("targetService", value, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CrossSellTargetServiceEnum.CAR}>
                Samochody
              </SelectItem>
              <SelectItem value={CrossSellTargetServiceEnum.CLEANING}>
                Sprzątanie
              </SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.targetService && (
            <FieldError>
              {form.formState.errors.targetService.message}
            </FieldError>
          )}
        </Field>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel>Opis okazji</FieldLabel>
          <Textarea
            {...form.register("description")}
            placeholder="Np. transport dla 20 osób z lotniska na miejsce wydarzenia"
          />
          {form.formState.errors.description && (
            <FieldError>{form.formState.errors.description.message}</FieldError>
          )}
        </Field>
      </FieldSet>

      <FieldDescription>
        Zgłoszenie zostanie zapisane jako dodatkowa okazja sprzedażowa.
      </FieldDescription>

      <Button type="submit" loading={isPending} disabled={!canSubmit}>
        Zgłoś okazję
      </Button>
    </form>
  );
};
