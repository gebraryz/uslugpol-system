import { getDb } from "@/lib/db";

export const getLeadDetails = async (leadId: string) => {
  const { core: db } = getDb();

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      extensions: {
        orderBy: [{ namespace: "asc" }, { updatedAt: "desc" }],
      },
      opportunities: {
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!lead) {
    return null;
  }

  const auditLog = await db.auditLog.findMany({
    where: { leadId },
    orderBy: { occurredAt: "desc" },
  });

  return { lead, auditLog };
};

export type GetLeadDetailsResult = Awaited<ReturnType<typeof getLeadDetails>>;
export type LeadDetailsResult = NonNullable<GetLeadDetailsResult>;
