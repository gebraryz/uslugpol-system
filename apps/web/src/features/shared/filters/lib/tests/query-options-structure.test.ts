import { describe, expect, it } from "vitest";
import { toQueryOptionsStructure } from "../utils";

describe("toQueryOptionsStructure", () => {
  it("maps values to labels with fallback to raw value", () => {
    const result = toQueryOptionsStructure(["A", "B"], { A: "Option A" });

    expect(result).toEqual([
      { value: "A", label: "Option A" },
      { value: "B", label: "B" },
    ]);
  });
});
