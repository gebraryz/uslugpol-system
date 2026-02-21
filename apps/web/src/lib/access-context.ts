import "server-only";

import {
  ACCESS_CONTEXT_COOKIE_NAME,
  ACCESS_CONTEXT_DEFAULT_ROUTE,
  ACCESS_CONTEXTS,
  type AccessContext,
} from "@/constants/access-context";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const isAccessContext = (value: string | undefined): value is AccessContext =>
  typeof value === "string" &&
  (ACCESS_CONTEXTS as readonly string[]).includes(value);

export const getAccessContext = async (): Promise<AccessContext> => {
  const cookieStore = await cookies();
  const rawContext = cookieStore.get(ACCESS_CONTEXT_COOKIE_NAME)?.value;

  if (isAccessContext(rawContext)) {
    return rawContext;
  }

  return "core";
};

export const setAccessContextCookie = async (context: AccessContext) => {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_CONTEXT_COOKIE_NAME, context, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
  });
};

export const requireAccessContext = async (
  allowedContexts: AccessContext[],
): Promise<AccessContext> => {
  const accessContext = await getAccessContext();

  if (!allowedContexts.includes(accessContext)) {
    redirect(ACCESS_CONTEXT_DEFAULT_ROUTE[accessContext]);
  }

  return accessContext;
};
