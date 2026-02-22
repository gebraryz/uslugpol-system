import { subDays } from "date-fns";
import { describe, expect, it } from "vitest";
import { toDateInput } from "../../lib/utils";
import { upsertEventEnrichmentSchema } from "../upsert-event-enrichment";

describe("upsertEventEnrichmentSchema", () => {
  it("rejects payload when no enrichment field is provided", () => {
    const result = upsertEventEnrichmentSchema.safeParse({
      leadId: "lead-1",
      eventDate: null,
      guestCount: null,
      budget: null,
      isOutdoor: null,
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues[0]?.path).toEqual(["eventDate"]);
  });

  it("accepts payload with at least one field", () => {
    const result = upsertEventEnrichmentSchema.safeParse({
      leadId: "lead-1",
      guestCount: 50,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid eventDate format", () => {
    const result = upsertEventEnrichmentSchema.safeParse({
      leadId: "lead-1",
      eventDate: "2026/02/21",
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues[0]?.path).toEqual(["eventDate"]);
  });

  it("rejects past eventDate", () => {
    const yesterday = toDateInput(subDays(new Date(), 1));

    const result = upsertEventEnrichmentSchema.safeParse({
      leadId: "lead-1",
      eventDate: yesterday,
    });

    expect(result.success).toBe(false);
    if (result.success) return;

    expect(result.error.issues[0]?.path).toEqual(["eventDate"]);
  });
});
