import {
  CrossSellTargetService as CrossSellTargetServiceEnum,
  type CrossSellTargetService,
} from "@uslugpol/event-service/enums";
import z from "zod";

const CROSS_SELL_TARGET_SERVICES = Object.values(
  CrossSellTargetServiceEnum,
) as [CrossSellTargetService, ...CrossSellTargetService[]];

export const reportOpportunitySchema = z.object({
  leadId: z.string().min(1, "Brak ID leada"),
  targetService: z.enum(CROSS_SELL_TARGET_SERVICES),
  description: z
    .string()
    .trim()
    .min(3, "Opis jest zbyt krótki")
    .max(500, "Opis jest zbyt długi"),
});
