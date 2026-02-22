import { format, isBefore, isMatch, parse, startOfToday } from "date-fns";

interface EventEnrichmentDetails {
  eventDate: Date | null;
  guestCount: number | null;
  budget: number | null;
  isOutdoor: boolean | null;
}

export const DATE_INPUT_FORMAT = "yyyy-MM-dd";

export const isEventLeadEnriched = (
  details: EventEnrichmentDetails | null | undefined,
) =>
  details != null &&
  (details.eventDate != null ||
    details.guestCount != null ||
    details.budget != null ||
    details.isOutdoor != null);

export const toDateInput = (date: Date) => format(date, DATE_INPUT_FORMAT);

export const getTodayDateInput = () => toDateInput(new Date());

export const isValidDateInput = (value: string) =>
  isMatch(value, DATE_INPUT_FORMAT);

export const isNotPastDateInput = (value: string | null | undefined) => {
  if (value == null) return true;
  if (!isValidDateInput(value)) return true;

  return !isBefore(
    parse(value, DATE_INPUT_FORMAT, new Date()),
    startOfToday(),
  );
};
