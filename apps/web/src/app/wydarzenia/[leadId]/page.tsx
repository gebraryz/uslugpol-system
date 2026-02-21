import { AppPage } from "@/components/app-page";
import { ROUTES } from "@/constants/routes";
import { EventLeadDetails } from "@/features/event/components/event-lead-details";
import { getEventLeadDetails } from "@/features/event/queries/get-event-lead-details";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface EventLeadDetailsPageProps {
  params: Promise<{ leadId: string }>;
}

const getData = async (leadId: string) => {
  const data = await getEventLeadDetails(leadId);

  if (!data) {
    notFound();
  }

  return data;
};

export const generateMetadata = async ({
  params,
}: EventLeadDetailsPageProps): Promise<Metadata> => {
  const data = await getData((await params).leadId);

  return {
    title: `Wydarzenie ${formatId(data.lead.leadId)}`,
  };
};

const EventLeadDetailsPage = async ({ params }: EventLeadDetailsPageProps) => {
  const data = await getData((await params).leadId);

  return (
    <AppPage
      title={`Wydarzenie ${formatId(data.lead.leadId)}`}
      breadcrumbs={[
        { name: "Organizacja imprez", path: ROUTES.events.leads },
        {
          name: data.lead.leadId.slice(0, 8),
          path: ROUTES.events.leadDetails(data.lead.leadId),
        },
      ]}
    >
      <EventLeadDetails data={data} />
    </AppPage>
  );
};

export default EventLeadDetailsPage;
