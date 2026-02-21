"use client";

import { LocationPicker } from "@/components/location-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LEAD_CATEGORIES_LABELS,
  type LeadCategory,
} from "@/constants/lead/lead-categories";
import {
  LEAD_CHANNELS_LABELS,
  type LeadChannel,
} from "@/constants/lead/lead-channels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { createCoreLeadAction } from "../actions/create-lead";
import { createLeadSchema } from "../schema/create-lead";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export const CreateCoreLeadDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(createCoreLeadAction, zodResolver(createLeadSchema), {
    actionProps: {
      onSuccess: ({ data }) => {
        router.refresh();
        setIsDialogOpen(false);

        if (data?.dispatchedToModule === false) {
          toast.warning(
            "Lead został utworzony, ale nie został przekazany do odpowiedniego zespołu",
          );
        } else {
          toast.success("Lead został utworzony");
        }
      },
      onError: ({ error }) => {
        toast.error(
          error.serverError ??
            "Nie udało się utworzyć leada. Sprawdź wymagane pola.",
        );
      },
    },
  });
  const selectedChannel = form.watch("channel");
  const selectedCategory = form.watch("category");

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild onClick={() => setIsDialogOpen(true)}>
        <Button>
          <Plus className="size-4" />
          Utwórz leada
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Utwórz nowego leada</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction}>
          <input type="hidden" {...form.register("channel")} />
          <input type="hidden" {...form.register("category")} />
          <input
            type="hidden"
            {...form.register("lat", { valueAsNumber: true })}
          />
          <input
            type="hidden"
            {...form.register("lng", { valueAsNumber: true })}
          />

          <FieldSet>
            <Field data-invalid={!!form.formState.errors.channel}>
              <FieldLabel htmlFor="channel">Kanał</FieldLabel>
              <Select
                value={selectedChannel}
                onValueChange={(value: LeadChannel) => {
                  form.setValue("channel", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kanał" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(LEAD_CHANNELS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.channel && (
                <FieldError>{form.formState.errors.channel.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!form.formState.errors.category}>
              <FieldLabel htmlFor="category">Kategoria</FieldLabel>
              <Select
                value={selectedCategory}
                onValueChange={(value: LeadCategory) => {
                  form.setValue("category", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(LEAD_CATEGORIES_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <FieldError>
                  {form.formState.errors.category.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Opis</FieldLabel>
              <Textarea
                {...form.register("description")}
                className="min-h-12"
              />
            </Field>

            <Field data-invalid={!!form.formState.errors.lat}>
              <FieldLabel>Lokalizacja</FieldLabel>
              <LocationPicker
                onChange={(value) => {
                  form.setValue("lat", value.lat, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  form.setValue("lng", value.lng, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              {form.formState.errors.lat && (
                <FieldError>{form.formState.errors.lat.message}</FieldError>
              )}
            </Field>

            <Field>
              <Button type="submit" loading={isPending}>
                Utwórz
              </Button>
            </Field>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
};
