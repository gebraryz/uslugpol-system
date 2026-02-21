"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LEAD_NEXT_STATUS,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/constants/lead/lead-status";
import { updateCoreLeadStatusAction } from "../../actions/update-lead-status";
import { updateLeadStatusSchema } from "../../schema/update-lead-status";

interface CoreLeadDetailsStatusControlProps {
  leadId: string;
  status: LeadStatus;
}

export const CoreLeadDetailsStatusControl = ({
  leadId,
  status,
}: CoreLeadDetailsStatusControlProps) => {
  const allowedNextStatus = LEAD_NEXT_STATUS[status];
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(
    updateCoreLeadStatusAction,
    zodResolver(updateLeadStatusSchema),
    {
      actionProps: {
        onSuccess: () => {
          toast.success("Status leada został zaktualizowany");
        },
        onError: ({ error }) => {
          toast.error(
            error.serverError ?? "Nie udało się zaktualizować statusu",
          );
        },
      },
      formProps: {
        defaultValues: {
          leadId,
          status: allowedNextStatus ?? status,
        },
      },
    },
  );

  useEffect(() => {
    form.setValue("leadId", leadId, { shouldDirty: false });
    form.setValue("status", allowedNextStatus ?? status, {
      shouldDirty: false,
    });
  }, [allowedNextStatus, form, leadId, status]);

  const selectedStatus = form.watch("status");

  const placeholder = useMemo(() => {
    if (!allowedNextStatus) {
      return "Lead zakończony";
    }
    return `Następny: ${LEAD_STATUS_LABELS[allowedNextStatus]}`;
  }, [allowedNextStatus]);

  return (
    <form
      onSubmit={handleSubmitWithAction}
      className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
    >
      <input type="hidden" {...form.register("leadId")} />
      <input type="hidden" {...form.register("status")} />
      {allowedNextStatus ? (
        <Select
          disabled={isPending}
          value={selectedStatus}
          onValueChange={(value) => {
            form.setValue("status", value as LeadStatus, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
        >
          <SelectTrigger className="w-full sm:w-55">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allowedNextStatus}>
              {LEAD_STATUS_LABELS[allowedNextStatus]}
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="text-muted-foreground border-input bg-muted/30 flex h-10 w-full items-center rounded-md border px-3 text-sm sm:w-55">
          Lead zakończony
        </div>
      )}

      <Button
        type="submit"
        variant="outline"
        className="w-full sm:w-auto"
        disabled={
          !allowedNextStatus ||
          selectedStatus !== allowedNextStatus ||
          isPending
        }
      >
        {isPending ? "Zmiana..." : "Zmień status"}
      </Button>

      {form.formState.errors.status && (
        <FieldError>{form.formState.errors.status.message}</FieldError>
      )}
    </form>
  );
};
