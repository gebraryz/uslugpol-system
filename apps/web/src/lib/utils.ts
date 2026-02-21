import { AccessContext } from "@/constants/access-context";
import {
  CROSS_SELL_RULE_LABELS,
  CROSS_SELL_STATUS_LABELS,
  type CrossSellStatus,
} from "@/constants/cross-sell";
import { SERVICE_LABELS } from "@/constants/service-labels";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const isObjectRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const formatJson = (value: unknown) => JSON.stringify(value, null, 2);

export const formatId = (id: string, prefixLength = 8, suffixLength = 6) => {
  if (id.length <= prefixLength + suffixLength) {
    return id;
  }

  return `${id.slice(0, prefixLength)}…${id.slice(-suffixLength)}`;
};

export const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));

export const statusBadgeVariant = (status: CrossSellStatus) => {
  if (status === "ACCEPTED") return "default";
  if (status === "DECLINED") return "destructive";

  return "secondary";
};

export const isNonCoreAccessContext = (
  context: AccessContext,
): context is Exclude<AccessContext, "core"> => context !== "core";

export const toServiceLabel = (value: unknown): string | null =>
  typeof value === "string" && value in SERVICE_LABELS
    ? SERVICE_LABELS[value as keyof typeof SERVICE_LABELS]
    : null;

export const toServiceLabelOrUnknown = (value: unknown): string =>
  toServiceLabel(value) ?? "Nieznana usługa";

export const toCrossSellStatusLabel = (status: CrossSellStatus): string =>
  CROSS_SELL_STATUS_LABELS[status];

export const toCrossSellRuleLabel = (
  ruleKey: string | null | undefined,
): string => {
  if (!ruleKey) {
    return "Brak";
  }

  return ruleKey in CROSS_SELL_RULE_LABELS
    ? CROSS_SELL_RULE_LABELS[ruleKey as keyof typeof CROSS_SELL_RULE_LABELS]
    : "Reguła systemowa";
};
