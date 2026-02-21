"use server";

import { ACCESS_CONTEXT_DEFAULT_ROUTE } from "@/constants/access-context";
import { setAccessContextCookie } from "@/lib/access-context";
import { actionClient } from "@/lib/safe-action";
import { setAccessContextSchema } from "../schema/set-access-context";

export const setAccessContextAction = actionClient
  .inputSchema(setAccessContextSchema)
  .action(async ({ parsedInput }) => {
    const { context } = parsedInput;
    await setAccessContextCookie(context);

    return {
      context,
      redirectTo: ACCESS_CONTEXT_DEFAULT_ROUTE[context],
    };
  });
