import { LEAD_STATUS } from "@/constants/lead/lead-status";
import z from "zod";

export const updateLeadStatusSchema = z.object({
  leadId: z.uuid(),
  status: z.enum(LEAD_STATUS),
});
