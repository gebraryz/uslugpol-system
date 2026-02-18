import "server-only";

import { createCoreDb } from "@uslugpol/core";
import { createEventDb } from "@uslugpol/event-service";
import { createCarDb } from "@uslugpol/car-service";
import { env } from "./env";

interface DbContainer {
  core: ReturnType<typeof createCoreDb>["db"];
  event: ReturnType<typeof createEventDb>["db"];
  car: ReturnType<typeof createCarDb>["db"];
}

declare global {
  var __dbContainer: DbContainer | undefined;
}

export const getDb = (): DbContainer => {
  if (globalThis.__dbContainer) return globalThis.__dbContainer;

  const core = createCoreDb(env.DATABASE_URL_CORE).db;
  const event = createEventDb(env.DATABASE_URL_EVENT).db;
  const car = createCarDb(env.DATABASE_URL_CAR).db;

  globalThis.__dbContainer = { core, event, car };
  return globalThis.__dbContainer;
};
