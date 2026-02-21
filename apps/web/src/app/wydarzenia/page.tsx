import { AppPage } from "@/components/app-page";
import { ROUTES } from "@/constants/routes";
import { EventLeadsFilters } from "@/features/event/components/event-leads-filters";
import { EventLeadsTable } from "@/features/event/components/event-leads-table";
import { getEventLeads } from "@/features/event/queries/get-event-leads";
import {
  loadEventLeadsFiltersSearchParams,
} from "@/features/event/search-params/event-leads-filters";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/lib/search-params";
import type { SearchParams } from "nuqs/server";

interface EventLeadsPageProps {
  searchParams: Promise<SearchParams>;
}

const EventLeadsPage = async ({ searchParams }: EventLeadsPageProps) => {
  const parsedSearchParams =
    await loadEventLeadsFiltersSearchParams(searchParams);

  const { leads, page, totalPages } = await getEventLeads({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    id: parsedSearchParams.id,
    channel: parsedSearchParams.channel,
    moduleStatus: parsedSearchParams.moduleStatus,
  });

  return (
    <AppPage
      title="Organizacja imprez"
      breadcrumbs={[{ name: "Organizacja imprez", path: ROUTES.events.leads }]}
    >
      <EventLeadsFilters />
      <EventLeadsTable data={leads} page={page} totalPages={totalPages} />
    </AppPage>
  );
};

export default EventLeadsPage;
