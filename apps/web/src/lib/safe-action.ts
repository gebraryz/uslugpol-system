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
