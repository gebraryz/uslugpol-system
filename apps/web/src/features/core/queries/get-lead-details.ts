import { getDb } from "@/lib/db";
import {
  ACCESS_CONTEXT_LEAD_CATEGORY,
  ACCESS_CONTEXT_NAMESPACE,
} from "@/constants/access-context";
import { getAccessContext } from "@/lib/access-context";
import { isNonCoreAccessContext } from "@/lib/utils";

export const getLeadDetails = async (leadId: string) => {
  const { core: db } = getDb();

  const accessContext = await getAccessContext();
  const scopedContext = isNonCoreAccessContext(accessContext)
    ? accessContext
    : null;
  const scopedCategory = scopedContext
    ? ACCESS_CONTEXT_LEAD_CATEGORY[scopedContext]
    : null;
  const scopedNamespace = scopedContext
    ? ACCESS_CONTEXT_NAMESPACE[scopedContext]
    : null;

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      extensions: {
        ...(scopedNamespace ? { where: { namespace: scopedNamespace } } : {}),
        orderBy: [{ namespace: "asc" }, { updatedAt: "desc" }],
      },
      opportunities: {
        ...(scopedCategory ? { where: { targetService: scopedCategory } } : {}),
        orderBy: [{ createdAt: "desc" }],
      },
    },
  });

  if (!lead) {
    return null;
  }

  if (scopedCategory && lead.category !== scopedCategory) {
    return null;
  }

  const auditLog =
    accessContext === "core"
      ? await db.auditLog.findMany({
          where: { leadId },
          orderBy: { occurredAt: "desc" },
        })
      : [];

  return { lead, auditLog };
};

export type GetLeadDetailsResult = Awaited<ReturnType<typeof getLeadDetails>>;
export type LeadDetailsResult = NonNullable<GetLeadDetailsResult>;
