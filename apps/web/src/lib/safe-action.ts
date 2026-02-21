import "server-only";

import type { AccessContext } from "@/constants/access-context";
import { getAccessContext } from "@/lib/access-context";
import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ActionError.prototype);
  }
}

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    if (error instanceof ActionError) {
      return error.message;
    }

    return "Wystąpił nieoczekiwany błąd. Spróbuj ponownie później";
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const accessContext = await getAccessContext();

  return next({ ctx: { accessContext } });
});

export const actionClientWithAccess = (allowedContexts: AccessContext[]) =>
  authActionClient.use(async ({ next, ctx }) => {
    if (!allowedContexts.includes(ctx.accessContext)) {
      throw new ActionError(
        "Nie masz odpowiednich uprawnień, aby wykonać tę operację",
        403,
      );
    }

    return next();
  });
