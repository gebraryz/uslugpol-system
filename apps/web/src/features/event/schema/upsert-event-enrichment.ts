import z from "zod";

export const EVENT_ENRICHMENT_OUTDOOR_VALUES = [
  "unknown",
  "true",
  "false",
] as const;

const toNullWhenEmpty = (value: unknown): string | null => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
};

const toNullableInteger = (value: unknown): number | null => {
  const text = toNullWhenEmpty(value);
  if (text === null) return null;

  const number = Number(text);
  if (!Number.isFinite(number) || !Number.isInteger(number)) {
    return Number.NaN;
  }

  return number;
};

export const upsertEventEnrichmentSchema = z
  .object({
    leadId: z.string().min(1, "Brak ID leada"),
    eventDate: z.preprocess(
      toNullWhenEmpty,
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Nieprawidłowy format daty")
        .nullable(),
    ),
    guestCount: z.preprocess(
      toNullableInteger,
      z.number().int().positive().nullable(),
    ),
    budget: z.preprocess(
      toNullableInteger,
      z.number().int().nonnegative().nullable(),
    ),
    isOutdoor: z
      .enum(EVENT_ENRICHMENT_OUTDOOR_VALUES)
      .transform((value) => (value === "unknown" ? null : value === "true")),
  })
  .refine(
    (value) =>
      value.eventDate !== null ||
      value.guestCount !== null ||
      value.budget !== null ||
      value.isOutdoor !== null,
    {
      message: "Uzupełnij przynajmniej jedno pole wzbogacenia",
      path: ["eventDate"],
    },
  );
