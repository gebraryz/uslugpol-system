import { LEAD_CATEGORIES } from "@/constants/lead/lead-categories";
import { LEAD_CHANNELS } from "@/constants/lead/lead-channels";
import z from "zod";

export const createLeadSchema = z.object({
  channel: z.enum(LEAD_CHANNELS),
  category: z.enum(LEAD_CATEGORIES),
  description: z.string().max(1000),
  lat: z.number({ error: "Lokalizacja musi zostać wybrana" }),
  lng: z.number({ error: "Lokalizacja musi zostać wybrana" }),
});
