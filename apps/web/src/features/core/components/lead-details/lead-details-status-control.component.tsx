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
} from "@/constants/lead-status";
import { updateLeadStatusAction } from "../../actions/update-lead-status";
import { updateLeadStatusSchema } from "../../schema/update-lead-status";

interface LeadDetailsStatusControlProps {
  leadId: string;
  status: LeadStatus;
}

export const LeadDetailsStatusControl = ({
  leadId,
  status,
}: LeadDetailsStatusControlProps) => {
  const allowedNextStatus = LEAD_NEXT_STATUS[status];
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(
    updateLeadStatusAction,
    zodResolver(updateLeadStatusSchema),
    {
      actionProps: {
        onSuccess: () => {
          toast.success("Status leada został zaktualizowany");
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? "Nie udało się zaktualizować statusu");
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
    <form onSubmit={handleSubmitWithAction} className="flex items-center gap-2">
      <input type="hidden" {...form.register("leadId")} />
      <Select
        disabled={!allowedNextStatus || isPending}
        value={allowedNextStatus ? selectedStatus : undefined}
        onValueChange={(value) => {
          form.setValue("status", value as LeadStatus, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      >
        <SelectTrigger className="w-55">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowedNextStatus && (
            <SelectItem value={allowedNextStatus}>
              {LEAD_STATUS_LABELS[allowedNextStatus]}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <Button
        type="submit"
        variant="outline"
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
