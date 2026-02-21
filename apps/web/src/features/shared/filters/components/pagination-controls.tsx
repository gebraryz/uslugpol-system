"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryState } from "nuqs";
import { pageParser } from "../lib/search-params";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
}

const buildPageItems = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
};

export const PaginationControls = ({
  page,
  totalPages,
}: PaginationControlsProps) => {
  const [, setPage] = useQueryState(
    "page",
    pageParser.withOptions({ shallow: false, history: "push" }),
  );
  const pageItems = buildPageItems(page, totalPages);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPage(nextPage);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination className="py-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault();
              goToPage(page - 1);
            }}
          />
        </PaginationItem>

        {pageItems.map((item, index) => {
          const previous = pageItems[index - 1];
          const showEllipsis = previous !== undefined && item - previous > 1;

          return (
            <PaginationItem key={item}>
              {showEllipsis && <PaginationEllipsis />}
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(event) => {
                  event.preventDefault();
                  goToPage(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(event) => {
              event.preventDefault();
              goToPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
