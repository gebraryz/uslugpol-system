import { parseAsInteger } from "nuqs/server";

export const FILTERS_DEFAULT_PAGE = 1;
export const FILTERS_DEFAULT_PAGE_SIZE = 10;

export const pageParser = parseAsInteger.withDefault(FILTERS_DEFAULT_PAGE);
