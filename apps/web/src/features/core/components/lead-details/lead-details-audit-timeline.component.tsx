"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AUDIT_EVENT_GROUP_BY_TYPE,
  AUDIT_EVENT_GROUP_LABELS,
  AUDIT_EVENT_GROUP_ORDER,
  AUDIT_EVENT_TYPES,
  AUDIT_EVENT_UI_LABELS,
  type AuditEventGroup,
  type AuditEventType,
} from "@/constants/audit-events";
import {
  CROSS_SELL_STATUS_LABELS,
  CrossSellStatus,
} from "@/constants/cross-sell";
import { LEAD_CATEGORIES_LABELS } from "@/constants/lead/lead-categories";
import { LEAD_CHANNELS_LABELS } from "@/constants/lead/lead-channels";
import { LEAD_STATUS_LABELS } from "@/constants/lead/lead-status";
import {
  formatDate,
  isObjectRecord,
  toCrossSellStatusLabel,
  toServiceLabel,
  toServiceLabelOrUnknown,
} from "@/lib/utils";
import {
  IconCircleCheck,
  IconDots,
  IconPinned,
  IconPuzzle,
  IconRefresh,
  IconSpeakerphone,
  IconTargetArrow,
  type Icon,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type {
  CoreLeadDetailsAuditLog,
  CoreLeadDetailsAuditLogEntry,
} from "./lead-details.types";
import { isLeadStatus } from "./lead-details.utils";

interface AuditTimelineSummary {
  icon: Icon;
  title: string;
  subtitle: string;
}

const summarize = (
  event: CoreLeadDetailsAuditLogEntry,
): AuditTimelineSummary => {
  const payload = isObjectRecord(event.payload) ? event.payload : null;
  const group = toAuditEventGroup(event.eventType);

  if (group === "created") {
    const channel = payload?.channel;
    const channelLabel = toChannelLabel(channel);

    return {
      icon: IconCircleCheck,
      title: toAuditEventLabel(event.eventType),
      subtitle: channelLabel ? `Kanał: ${channelLabel}` : "Nowy lead w Centrum",
    };
  }

  if (group === "status") {
    const from = toStatusLabel(payload?.from);
    const to = toStatusLabel(payload?.to);

    return {
      icon: IconRefresh,
      title:
        from && to
          ? `${toAuditEventLabel(event.eventType)}: ${from} -> ${to}`
          : toAuditEventLabel(event.eventType),
      subtitle: "Zmiana etapu procesu",
    };
  }

  if (group === "cross_sell") {
    if (event.eventType === AUDIT_EVENT_TYPES.CROSS_SELL_DECISION) {
      const decision = payload?.decision;
      const decisionLabel = toCrossSellDecisionLabel(decision);

      return {
        icon: IconTargetArrow,
        title: toAuditEventLabel(event.eventType),
        subtitle: decisionLabel
          ? `Decyzja: ${decisionLabel}`
          : "Zmiana decyzji modułu",
      };
    }

    const target = payload?.targetService;
    const reason = payload?.reason;
    const targetLabel = toServiceTargetLabel(target);

    return {
      icon: IconTargetArrow,
      title: targetLabel
        ? `${toAuditEventLabel(event.eventType)}: ${targetLabel}`
        : toAuditEventLabel(event.eventType),
      subtitle: typeof reason === "string" ? reason : "Wynik reguł cross-sell",
    };
  }

  if (group === "assigned") {
    const service = payload?.assignedService;
    const serviceLabel = toServiceTargetLabel(service);

    return {
      icon: IconPinned,
      title: toAuditEventLabel(event.eventType),
      subtitle: serviceLabel
        ? `Przypisano do: ${serviceLabel}`
        : "Przypisanie do modułu",
    };
  }

  if (group === "enriched") {
    return {
      icon: IconPuzzle,
      title: toAuditEventLabel(event.eventType),
      subtitle: "Dodano dane z modułu usługowego",
    };
  }

  if (group === "opportunity") {
    return {
      icon: IconSpeakerphone,
      title: toAuditEventLabel(event.eventType),
      subtitle: "Informacja zwrotna z modułu",
    };
  }

  return {
    icon: IconDots,
    title: toAuditEventLabel(event.eventType),
    subtitle: "Zdarzenie techniczne",
  };
};

const toAuditEventLabel = (eventType: string): string =>
  eventType in AUDIT_EVENT_UI_LABELS
    ? AUDIT_EVENT_UI_LABELS[eventType as AuditEventType]
    : eventType;

const toAuditEventGroup = (eventType: string): AuditEventGroup =>
  eventType in AUDIT_EVENT_GROUP_BY_TYPE
    ? AUDIT_EVENT_GROUP_BY_TYPE[eventType as AuditEventType]
    : "other";

const toStatusLabel = (value: unknown) =>
  isLeadStatus(value) ? LEAD_STATUS_LABELS[value] : null;

const toChannelLabel = (value: unknown) =>
  typeof value === "string" && value in LEAD_CHANNELS_LABELS
    ? LEAD_CHANNELS_LABELS[value as keyof typeof LEAD_CHANNELS_LABELS]
    : null;

const toServiceTargetLabel = (value: unknown) =>
  toServiceLabel(value) ??
  (typeof value === "string" && value in LEAD_CATEGORIES_LABELS
    ? LEAD_CATEGORIES_LABELS[value as keyof typeof LEAD_CATEGORIES_LABELS]
    : null);

const isCrossSellStatus = (value: unknown): value is CrossSellStatus =>
  typeof value === "string" && value in CROSS_SELL_STATUS_LABELS;
const toCrossSellDecisionLabel = (value: unknown) =>
  isCrossSellStatus(value) ? toCrossSellStatusLabel(value) : null;

interface CoreLeadDetailsAuditTimelineProps {
  events: CoreLeadDetailsAuditLog;
}

export const CoreLeadDetailsAuditTimeline = ({
  events,
}: CoreLeadDetailsAuditTimelineProps) => {
  const [activeFilter, setActiveFilter] = useState<AuditEventGroup | "all">(
    "all",
  );

  const counts = useMemo(() => {
    const base: Record<AuditEventGroup, number> = {
      created: 0,
      assigned: 0,
      enriched: 0,
      cross_sell: 0,
      opportunity: 0,
      status: 0,
      other: 0,
    };

    events.forEach((event) => {
      base[toAuditEventGroup(event.eventType)] += 1;
    });

    return base;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") {
      return events;
    }

    return events.filter(
      (event) => toAuditEventGroup(event.eventType) === activeFilter,
    );
  }, [activeFilter, events]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
          >
            Wszystkie ({events.length})
          </Button>
          {AUDIT_EVENT_GROUP_ORDER.map((group) => (
            <Button
              key={group}
              type="button"
              size="sm"
              variant={activeFilter === group ? "default" : "outline"}
              disabled={counts[group] === 0}
              onClick={() => setActiveFilter(group)}
            >
              {AUDIT_EVENT_GROUP_LABELS[group]} ({counts[group]})
            </Button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Empty className="rounded-md p-5 md:p-6">
          <EmptyHeader>
            <EmptyTitle>Brak zdarzeń</EmptyTitle>
            <EmptyDescription>
              Brak zdarzeń dla wybranego filtra.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ol className="space-y-3">
          {filteredEvents.map((event) => {
            const summary = summarize(event);
            const SummaryIcon = summary.icon;

            return (
              <li key={event.id} className="rounded-lg border p-4">
                <div className="mb-1 flex items-center gap-2 text-sm">
                  <SummaryIcon className="text-muted-foreground size-4" />
                  <p className="font-medium">{summary.title}</p>
                  <Badge variant="outline" className="ml-auto">
                    {formatDate(event.occurredAt)}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm">
                  {summary.subtitle} • Źródło:{" "}
                  {toServiceLabelOrUnknown(event.actorService)}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
