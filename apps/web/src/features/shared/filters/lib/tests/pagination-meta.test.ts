import { describe, expect, it } from "vitest";
import { toPaginationMeta } from "../utils";

describe("toPaginationMeta", () => {
  it("clamps page to available bounds and computes total pages", () => {
    const result = toPaginationMeta({ page: 99, pageSize: 10, totalItems: 35 });

    expect(result).toEqual({
      page: 4,
      pageSize: 10,
      totalItems: 35,
      totalPages: 4,
    });
  });

  it("returns at least one page when there are no items", () => {
    const result = toPaginationMeta({ page: 0, pageSize: 10, totalItems: 0 });

    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1,
    });
  });
});
