import { getDb } from "@/lib/db";

export const findLead = async (leadId: string) => {
  const { core: db } = getDb();

  const lead = await db.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  return lead;
};
