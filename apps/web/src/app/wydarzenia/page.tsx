import { AppPage } from "@/components/app-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { EventLeadsTable } from "@/features/event/components/event-leads-table/event-leads-table";
import { EventLeadsTableFilters } from "@/features/event/components/event-leads-table/event-leads-table-filters";
import { getEventLeads } from "@/features/event/queries/get-event-leads";
import { loadEventLeadsFiltersSearchParams } from "@/features/event/lib/search-params";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/constants/pagination";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

interface EventLeadsPageProps {
  searchParams: Promise<SearchParams>;
}

const EventLeadsData = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const parsedSearchParams =
    await loadEventLeadsFiltersSearchParams(searchParams);

  const { leads, page, totalPages } = await getEventLeads({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    id: parsedSearchParams.id,
    channel: parsedSearchParams.channel,
    moduleStatus: parsedSearchParams.moduleStatus,
  });

  return <EventLeadsTable data={leads} page={page} totalPages={totalPages} />;
};

const EventLeadsPage = async ({ searchParams }: EventLeadsPageProps) => {
  return (
    <AppPage
      title="Organizacja imprez"
      breadcrumbs={[{ name: "Organizacja imprez", path: ROUTES.events.leads }]}
    >
      <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
        <EventLeadsTableFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[480px] w-full rounded-md" />}>
        <EventLeadsData searchParams={searchParams} />
      </Suspense>
    </AppPage>
  );
};

export default EventLeadsPage;
