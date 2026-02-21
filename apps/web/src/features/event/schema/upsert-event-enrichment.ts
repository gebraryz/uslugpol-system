import z from "zod";

export const upsertEventEnrichmentSchema = z
  .object({
    leadId: z.string().min(1, "Brak ID leada"),
    eventDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty")
      .nullish(),
    guestCount: z.number().int().positive().nullish(),
    budget: z.number().int().nonnegative().nullish(),
    isOutdoor: z.boolean().nullish(),
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
