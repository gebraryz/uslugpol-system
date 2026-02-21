import { PaginationParams, PaginationMeta } from "../types/pagination";

export const toPaginationMeta = ({
  page,
  pageSize,
  totalItems,
}: PaginationParams & { totalItems: number }): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return { page: safePage, pageSize, totalItems, totalPages };
};

export const toQueryOptionsStructure = (
  values: readonly string[],
  labels: Record<string, string>,
) => values.map((value) => ({ value, label: labels[value] ?? value }));
