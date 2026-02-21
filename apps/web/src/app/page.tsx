import { AppPage } from "@/components/app-page";
import { ROUTES } from "@/constants/routes";
import { CreateLeadDialog } from "@/features/core/components/create-lead-dialog";
import { CoreLeadsFilters } from "@/features/core/components/core-leads-filters";
import { LeadsTable } from "@/features/core/components/leads-table";
import { getLeads } from "@/features/core/queries/get-leads";
import { loadCoreLeadsFiltersSearchParams } from "@/features/core/search-params/leads-filters";
import { FILTERS_DEFAULT_PAGE_SIZE } from "@/features/shared/filters/lib/search-params";
import type { SearchParams } from "nuqs/server";

interface CoreLeadsPageProps {
  searchParams: Promise<SearchParams>;
}

const CoreLeadsPage = async ({ searchParams }: CoreLeadsPageProps) => {
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

  return (
    <AppPage
      title="Centrum leadów"
      headerAction={<CreateLeadDialog />}
      breadcrumbs={[{ name: "Centrum leadów", path: ROUTES.core.leads }]}
    >
      <div className="flex gap-x-12 justify-between">
        <CoreLeadsFilters />
      </div>
      <LeadsTable data={leads} page={page} totalPages={totalPages} />
    </AppPage>
  );
};

export default CoreLeadsPage;
