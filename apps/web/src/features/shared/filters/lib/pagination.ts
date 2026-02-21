export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const toPaginationMeta = ({
  page,
  pageSize,
  totalItems,
}: PaginationParams & { totalItems: number }): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
  };
};
