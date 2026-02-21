import { AppPage } from "@/components/app-page";
import { ROUTES } from "@/constants/routes";
import { CarRecommendationsFilters } from "@/features/car/components/car-recommendations-filters";
import { CarRecommendationsTable } from "@/features/car/components/car-recommendations-table";
import { getCarRecommendations } from "@/features/car/queries/get-car-recommendations";
import {
  loadCarRecommendationsFiltersSearchParams,
} from "@/features/car/search-params/recommendations-filters";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/lib/search-params";
import type { SearchParams } from "nuqs/server";

interface VehicleRentalPageProps {
  searchParams: Promise<SearchParams>;
}

const VehicleRentalPage = async ({ searchParams }: VehicleRentalPageProps) => {
  const parsedSearchParams =
    await loadCarRecommendationsFiltersSearchParams(searchParams);

  const { recommendations, page, totalPages } = await getCarRecommendations({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    id: parsedSearchParams.id,
    ruleKey: parsedSearchParams.ruleKey,
  });

  return (
    <AppPage
      title="Wynajem aut"
      breadcrumbs={[{ name: "Wynajem aut", path: ROUTES.vehicles.rental }]}
    >
      <CarRecommendationsFilters />
      <CarRecommendationsTable
        data={recommendations}
        page={page}
        totalPages={totalPages}
      />
    </AppPage>
  );
};

export default VehicleRentalPage;
