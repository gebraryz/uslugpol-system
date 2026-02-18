import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL_CORE: z.url(),
    DATABASE_URL_EVENT: z.url(),
    DATABASE_URL_CAR: z.url(),
  },
  experimental__runtimeEnv: process.env,
});
