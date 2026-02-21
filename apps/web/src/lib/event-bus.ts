import "server-only";

import { registerCarServiceHandlers } from "@uslugpol/car-service";
import { registerCoreHandlers } from "@uslugpol/core";
import { registerEventServiceHandlers } from "@uslugpol/event-service";
import type {
  AppEventMap,
  EventBus,
  EventEnvelope,
} from "@uslugpol/shared/event-bus";
import { getDb } from "./db";
import { env } from "./env";

type AppEventType = keyof AppEventMap & string;
type AppEnvelope = EventEnvelope<AppEventType, AppEventMap[AppEventType]>;
type AppHandler = (event: AppEnvelope) => Promise<void> | void;

class LocalInMemoryEventBus implements EventBus<AppEventMap> {
  private handlers = new Map<AppEventType, Set<AppHandler>>();

  reset() {
    this.handlers.clear();
  }

  subscribe<Key extends AppEventType>(
    type: Key,
    handler: (
      event: EventEnvelope<Key, AppEventMap[Key]>,
    ) => Promise<void> | void,
  ): () => void {
    const set = this.handlers.get(type) ?? new Set<AppHandler>();
    const wrapped = handler as AppHandler;

    set.add(wrapped);
    this.handlers.set(type, set);

    return () => {
      set.delete(wrapped);
    };
  }

  async publish<Key extends AppEventType>(
    event: EventEnvelope<Key, AppEventMap[Key]>,
  ): Promise<number> {
    const set = this.handlers.get(event.type);

    if (!set?.size) return 0;

    const handlers = [...set];
    const results = await Promise.allSettled(
      handlers.map((handler) => Promise.resolve(handler(event as AppEnvelope))),
    );

    const rejected = results.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );

    if (rejected) {
      throw new Error(`Event handler failed for ${event.type}`, {
        cause: rejected.reason,
      });
    }

    return handlers.length;
  }
}

declare global {
  var eventBusSingleton: LocalInMemoryEventBus | undefined;
  var eventBusHandlersBound: boolean | undefined;
}

const registerHandlers = (eventBus: LocalInMemoryEventBus) => {
  const db = getDb();

  registerCoreHandlers(eventBus, { db: db.core, eventBus });
  registerEventServiceHandlers(eventBus, { db: db.event });
  registerCarServiceHandlers(eventBus, { db: db.car });
};

export const getEventBus = () => {
  if (!globalThis.eventBusSingleton) {
    globalThis.eventBusSingleton = new LocalInMemoryEventBus();
  }

  if (env.NODE_ENV !== "production") {
    globalThis.eventBusSingleton.reset();
    globalThis.eventBusHandlersBound = false;
  }

  if (!globalThis.eventBusHandlersBound) {
    registerHandlers(globalThis.eventBusSingleton);
    globalThis.eventBusHandlersBound = true;
  }

  return globalThis.eventBusSingleton;
};
