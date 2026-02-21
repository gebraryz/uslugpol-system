import { AppPage } from "@/components/app-page";
import { ROUTES } from "@/constants/routes";
import { CoreLeadDetails } from "@/features/core/components/lead-details";
import { getLeadDetails } from "@/features/core/queries/get-lead-details";
import { requireAccessContext } from "@/lib/access-context";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface LeadDetailsPageProps {
  params: Promise<{ leadId: string }>;
}

const getData = async (leadId: string) => {
  await requireAccessContext(["core"]);

  const data = await getLeadDetails(leadId);

  if (!data) {
    notFound();
  }

  return data;
};

export const generateMetadata = async ({
  params,
}: LeadDetailsPageProps): Promise<Metadata> => {
  const data = await getData((await params).leadId);

  return {
    title: `Lead ${formatId(data.lead.id)}`,
  };
};

const LeadDetailsPage = async ({ params }: LeadDetailsPageProps) => {
  const data = await getData((await params).leadId);

  return (
    <AppPage
      title={`Lead ${formatId(data.lead.id)}`}
      breadcrumbs={[
        { name: "Centrum leadów", path: ROUTES.core.leads },
        {
          name: data.lead.id.slice(0, 8),
          path: ROUTES.core.leadDetails(data.lead.id),
        },
      ]}
    >
      <CoreLeadDetails data={data} />
    </AppPage>
  );
};

export default LeadDetailsPage;
