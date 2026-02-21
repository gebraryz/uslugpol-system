import { getDb } from "@/lib/db";

export const getEventLeadDetails = async (leadId: string) => {
  const { event: db } = getDb();

  const lead = await db.eventLeadInbox.findUnique({
    where: { leadId },
    include: {
      details: true,
      proposals: {
        orderBy: { receivedAt: "desc" },
      },
    },
  });

  if (!lead) {
    return null;
  }

  const opportunityReports = await db.opportunityReport.findMany({
    where: { leadId },
    orderBy: { reportedAt: "desc" },
    take: 10,
  });

  return { lead, opportunityReports };
};

export type GetEventLeadDetailsResult = Awaited<
  ReturnType<typeof getEventLeadDetails>
>;
export type EventLeadDetailsResult = NonNullable<GetEventLeadDetailsResult>;
