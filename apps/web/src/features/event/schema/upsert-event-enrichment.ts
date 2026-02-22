import z from "zod";
import { isNotPastDateInput, isValidDateInput } from "../lib/utils";

export const upsertEventEnrichmentSchema = z
  .object({
    leadId: z.string().min(1, "Brak ID leada"),
    eventDate: z
      .string()
      .refine(isValidDateInput, "Nieprawidłowy format daty")
      .nullish(),
    guestCount: z.number().int().positive().nullish(),
    budget: z.number().int().nonnegative().nullish(),
    isOutdoor: z.boolean().nullish(),
  })
  .refine((value) => isNotPastDateInput(value.eventDate), {
    message: "Data wydarzenia nie może być z przeszłości",
    path: ["eventDate"],
  })
  .refine(
    (value) =>
      value.eventDate != null ||
      value.guestCount != null ||
      value.budget != null ||
      value.isOutdoor != null,
    {
      message: "Uzupełnij przynajmniej jedno pole wzbogacenia",
      path: ["eventDate"],
    },
  );
