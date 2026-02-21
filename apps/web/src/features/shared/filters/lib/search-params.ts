import { parseAsInteger } from "nuqs/server";
import { FILTERS_DEFAULT_PAGE } from "../constants/pagination";

export const pageParser = parseAsInteger.withDefault(FILTERS_DEFAULT_PAGE);
