import { AppPage } from "@/components/app-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { CarRecommendationsFilters } from "@/features/car/components/car-recommendations-filters";
import { CarRecommendationsTable } from "@/features/car/components/car-recommendations-table";
import { getCarRecommendations } from "@/features/car/queries/get-car-recommendations";
import { loadCarRecommendationsFiltersSearchParams } from "@/features/car/lib/search-params";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/constants/pagination";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

interface VehicleRentalPageProps {
  searchParams: Promise<SearchParams>;
}

const CarRecommendationsData = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const parsedSearchParams =
    await loadCarRecommendationsFiltersSearchParams(searchParams);

  const { recommendations, page, totalPages } = await getCarRecommendations({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    id: parsedSearchParams.id,
    ruleKey: parsedSearchParams.ruleKey,
    status: parsedSearchParams.status,
    reviewState: parsedSearchParams.reviewState,
  });

  return (
    <CarRecommendationsTable
      data={recommendations}
      page={page}
      totalPages={totalPages}
    />
  );
};

const VehicleRentalPage = async ({ searchParams }: VehicleRentalPageProps) => {
  return (
    <AppPage
      title="Wynajem aut"
      breadcrumbs={[{ name: "Wynajem aut", path: ROUTES.vehicles.rental }]}
    >
      <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
        <CarRecommendationsFilters />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-[480px] w-full rounded-md" />}>
        <CarRecommendationsData searchParams={searchParams} />
      </Suspense>
    </AppPage>
  );
};

export default VehicleRentalPage;
