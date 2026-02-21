import { AppPage } from "@/components/app-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import {
  CarLeadsTable,
  CarLeadsTableFilters,
} from "@/features/car/components/car-leads-table";
import { loadCarLeadsFiltersSearchParams } from "@/features/car/lib/search-params";
import { getCarLeads } from "@/features/car/queries/get-car-leads";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/constants/pagination";
import { requireAccessContext } from "@/lib/access-context";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

const PAGE_TITLE = "Wynajem aut - leady";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

interface CarLeadsPageProps {
  searchParams: Promise<SearchParams>;
}

const CarLeadsData = async ({ searchParams }: CarLeadsPageProps) => {
  const parsedSearchParams =
    await loadCarLeadsFiltersSearchParams(searchParams);

  const { leads, page, totalPages } = await getCarLeads({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    leadId: parsedSearchParams.leadId,
    leadChannel: parsedSearchParams.leadChannel,
    leadStatus: parsedSearchParams.leadStatus,
  });

  return <CarLeadsTable data={leads} page={page} totalPages={totalPages} />;
};

const CarLeadsPage = async ({ searchParams }: CarLeadsPageProps) => {
  await requireAccessContext(["car"]);

  return (
    <AppPage
      title={PAGE_TITLE}
      breadcrumbs={[
        { name: "Wynajem aut", path: ROUTES.vehicles.index },
        { name: "Leady", path: ROUTES.vehicles.leads },
      ]}
    >
      <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
        <CarLeadsTableFilters />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-120 w-full rounded-md" />}>
        <CarLeadsData searchParams={searchParams} />
      </Suspense>
    </AppPage>
  );
};

export default CarLeadsPage;
