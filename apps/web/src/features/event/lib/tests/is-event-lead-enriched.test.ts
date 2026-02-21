import { describe, expect, it } from "vitest";
import { isEventLeadEnriched } from "../utils";

describe("isEventLeadEnriched", () => {
  it("returns false for null/undefined details", () => {
    expect(isEventLeadEnriched(null)).toBe(false);
    expect(isEventLeadEnriched(undefined)).toBe(false);
  });

  it("returns false when all fields are null", () => {
    expect(
      isEventLeadEnriched({
        eventDate: null,
        guestCount: null,
        budget: null,
        isOutdoor: null,
      }),
    ).toBe(false);
  });

  it("returns false for empty object payload", () => {
    expect(
      isEventLeadEnriched(
        {} as unknown as Parameters<typeof isEventLeadEnriched>[0],
      ),
    ).toBe(false);
  });

  it("treats zero values as provided enrichment data", () => {
    expect(
      isEventLeadEnriched({
        eventDate: null,
        guestCount: 0,
        budget: null,
        isOutdoor: null,
      }),
    ).toBe(true);
  });

  it("returns true when at least one enrichment field is present", () => {
    expect(
      isEventLeadEnriched({
        eventDate: null,
        guestCount: 120,
        budget: null,
        isOutdoor: null,
      }),
    ).toBe(true);
  });
});
