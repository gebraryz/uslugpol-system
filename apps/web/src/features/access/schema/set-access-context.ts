import { ACCESS_CONTEXTS } from "@/constants/access-context";
import z from "zod";

export const setAccessContextSchema = z.object({
  context: z.enum(ACCESS_CONTEXTS),
});
