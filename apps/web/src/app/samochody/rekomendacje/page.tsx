import { AppPage } from "@/components/app-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import {
  CarRecommendationsTable,
  CarRecommendationsTableFilters,
} from "@/features/car/components/car-recommendations-table";
import { loadCarRecommendationsTableFiltersSearchParams } from "@/features/car/lib/search-params";
import { getCarRecommendations } from "@/features/car/queries/get-car-recommendations";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/constants/pagination";
import { requireAccessContext } from "@/lib/access-context";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

const PAGE_TITLE = "Wynajem aut - rekomendacje";

export const metadata: Metadata = {
  title: PAGE_TITLE,
};

interface CarRecommendationsPageProps {
  searchParams: Promise<SearchParams>;
}

const CarRecommendationsData = async ({
  searchParams,
}: CarRecommendationsPageProps) => {
  const parsedSearchParams =
    await loadCarRecommendationsTableFiltersSearchParams(searchParams);

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

const CarRecommendationsPage = async ({
  searchParams,
}: CarRecommendationsPageProps) => {
  await requireAccessContext(["car"]);

  return (
    <AppPage
      title={PAGE_TITLE}
      breadcrumbs={[
        { name: "Wynajem aut", path: ROUTES.vehicles.leads },
        { name: "Rekomendacje", path: ROUTES.vehicles.recommendations },
      ]}
    >
      <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
        <CarRecommendationsTableFilters />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-120 w-full rounded-md" />}>
        <CarRecommendationsData searchParams={searchParams} />
      </Suspense>
    </AppPage>
  );
};

export default CarRecommendationsPage;
