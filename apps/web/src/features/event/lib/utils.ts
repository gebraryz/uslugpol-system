interface EventEnrichmentDetails {
  eventDate: Date | null;
  guestCount: number | null;
  budget: number | null;
  isOutdoor: boolean | null;
}

export const isEventLeadEnriched = (
  details: EventEnrichmentDetails | null | undefined,
) =>
  details != null &&
  (details.eventDate != null ||
    details.guestCount != null ||
    details.budget != null ||
    details.isOutdoor != null);
