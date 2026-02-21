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
  LeadCategory,
} from "@/constants/lead-categories";
import { LEAD_CHANNELS_LABELS, LeadChannel } from "@/constants/lead-channels";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { createLeadAction } from "../actions/create-lead";
import { createLeadSchema } from "../schema/create-lead";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";

export const CreateLeadDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const {
    form,
    action: { isPending },
    handleSubmitWithAction,
  } = useHookFormAction(createLeadAction, zodResolver(createLeadSchema), {
    actionProps: {
      onSuccess: ({ data }) => {
        router.refresh();
        setIsDialogOpen(false);

        if (typeof data?.dispatchedToModule === "undefined") {
          toast.success("Lead został utworzony");
          return;
        }

        if (data.dispatchedToModule) {
          toast.success("Lead został utworzony");
        } else {
          toast.warning(
            "Lead został utworzony, ale nie został przekazany do modułu docelowego",
          );
        }
      },
      onError: () => {
        toast.error("Wystąpił błąd podczas tworzenia leada");
      },
    },
  });

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
          <FieldSet>
            <Field data-invalid={!!form.formState.errors.channel}>
              <FieldLabel htmlFor="channel">Kanał</FieldLabel>
              <Select
                onValueChange={(value: LeadChannel) => {
                  form.setValue("channel", value, { shouldDirty: true });
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
                onValueChange={(value: LeadCategory) => {
                  form.setValue("category", value, { shouldDirty: true });
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
                  form.setValue("lat", value.lat, { shouldDirty: true });
                  form.setValue("lng", value.lng, { shouldDirty: true });
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
