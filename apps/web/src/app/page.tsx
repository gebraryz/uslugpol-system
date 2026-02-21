import { AppPage } from "@/components/app-page";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { CreateCoreLeadDialog } from "@/features/core/components/create-lead-dialog";
import { CoreLeadsFilters } from "@/features/core/components/leads-filters";
import { CoreLeadsTable } from "@/features/core/components/leads-table";
import { getLeads } from "@/features/core/queries/get-leads";
import { loadCoreLeadsFiltersSearchParams } from "@/features/core/lib/search-params";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/constants/pagination";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";

interface CoreLeadsPageProps {
  searchParams: Promise<SearchParams>;
}

const CoreLeadsData = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const parsedSearchParams =
    await loadCoreLeadsFiltersSearchParams(searchParams);

  const { leads, page, totalPages } = await getLeads({
    page: Math.max(parsedSearchParams.page, 1),
    pageSize: FILTERS_DEFAULT_PAGE_SIZE,
    id: parsedSearchParams.id,
    channel: parsedSearchParams.channel,
    category: parsedSearchParams.category,
    status: parsedSearchParams.status,
  });

  return <CoreLeadsTable data={leads} page={page} totalPages={totalPages} />;
};

const CoreLeadsPage = async ({ searchParams }: CoreLeadsPageProps) => {
  return (
    <AppPage
      title="Centrum leadów"
      headerAction={<CreateCoreLeadDialog />}
      breadcrumbs={[{ name: "Centrum leadów", path: ROUTES.core.leads }]}
    >
      <div className="flex gap-x-12 justify-between">
        <Suspense fallback={<Skeleton className="h-24 w-full rounded-md" />}>
          <CoreLeadsFilters />
        </Suspense>
      </div>
      <Suspense fallback={<Skeleton className="h-[480px] w-full rounded-md" />}>
        <CoreLeadsData searchParams={searchParams} />
      </Suspense>
    </AppPage>
  );
};

export default CoreLeadsPage;
